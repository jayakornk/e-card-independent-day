/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */
let startPos = null;
var parser = new DOMParser();

function animateAddScale(el, scale = 0) {
  const re = /(scale)\((.*)\)/g;
  if (!el.style.transform.match(re)) {
    el.style.transform += 'scale(' + scale + ')';
  }
}

function animateRemoveScale(el) {
  const re = /(scale)\((.*)\)/g;
  el.style.transform = el.style.transform.replace(re, '');
  // alert(el.style.transform);
}

interact('.drop-here')
  .dropzone({
    accept: '.dragNdrop',
    overlap: 0.65,
    ondragenter: function (event) {
      const target = event.target;
      const text = target.querySelector('.drop-here-text');

      target.classList.add('activate');
      animateAddScale(text);
    },
    ondragleave: function (event) {
      const target = event.target;
      const text = target.querySelector('.drop-here-text');
      
      target.classList.remove('activate');
      animateRemoveScale(text);
    },
    ondrop: function (event) {
      const related = event.relatedTarget;
      const target = event.currentTarget;
      const text = target.querySelector('.drop-here-text');

      animateAddScale(related);
      animateAddScale(text);
      if (!related.getAttribute('data-true')) {
        related.classList.add('animate-drop');
        target.classList.add('dropped-false');
        text.innerHTML = 'Try Again!';
        setTimeout(function() {
          animateRemoveScale(related);
          animateRemoveScale(text);
        }, 300);
        setTimeout(function() {
          related.classList.remove('animate-drop');
          target.classList.remove('dropped-false');
          target.classList.remove('dropped-true');
        }, 1050);
      } else {
        // related.removeEventListener('mouseover');
        // related.removeEventListener('mouseleave');
        target.classList.add('dropped-true');
        animateRemoveScale(related);
        animateAddScale(related, 1.3);
        related.classList.add('target-true');
        related.style.pointerEvents = 'none';
        document.querySelector('.firework').classList.add('firework-animate');
        document.querySelector('[id="answer-text"]').classList.add('show-text');
        document.querySelector('.btn-direction.next').classList.remove('hide-next');
        document.querySelectorAll('.interactive-container .dragNdrop:not([data-true])').forEach(function(element) {
          element.classList.add('hide-not-true');
        });
      }
      
      
    },
    ondropdeactivate: function (event) {
      const related = event.relatedTarget;
      const target = event.currentTarget;

      if (!related.getAttribute('data-true') && target) {
        target.classList.remove('activate');
      }
    },
  });

function initScene(scene) {
  const currentSceneKey = 'scene' + scene;
  const currentScene = scenes[currentSceneKey];

  loopSVG(currentScene);

  const q = document.querySelector('[id="question-text"]');
  const a = document.querySelector('[id="answer-text"]');

  q.innerHTML = currentScene.q;
  a.innerHTML = currentScene.a;
}

// Init
document.addEventListener('DOMContentLoaded', function() {
  initScene(0);
});

const next = document.querySelector('.btn-direction.next');
const back = document.querySelector('.btn-direction.back');

function changeScene(element) {
  document.querySelector('.inner-container').classList.add('changing-scene');
  setTimeout(function() {
    document.querySelector('.inner-container').classList.remove('changing-scene');
  }, 1500);
  const multiplier = element.classList.contains('back') ? -1 : 1;
  const nextScene = parseInt(element.dataset.currentScene) + (1 * multiplier) ;
  resetScene();
  initScene(nextScene);
  document.querySelectorAll('.btn-direction').forEach(function(element){
     element.dataset.currentScene = nextScene; 
  })
}

function resetScene() {
  document.querySelectorAll('.dragNdrop').forEach(function(child) {
    const parent = child.parentNode;
    parent.removeChild(child);
  });
  document.querySelector('.firework').classList.remove('firework-animate');
  const dropHere = document.querySelector('.drop-here');
  dropHere.className = '';
  dropHere.classList.add('drop-here');
  const dropHereText = document.querySelector('.drop-here-text');
  dropHereText.style.transform = 'translateY(-50%)';
  dropHereText.innerHTML = 'Drop Here!';
  document.querySelector('.btn-direction.next').classList.add('hide-next');
  document.querySelector('#answer-text').classList.remove('show-text');
}

next.addEventListener('click', function(e) {
  changeScene(this);
});

back.addEventListener('click', function(e) {
  changeScene(this);
});

function loopSVG(currentScene) {
  let arr = [
    {x: '-150', y: '-120'},
    {x: '150', y: '-120'},
    {x: '-150', y: '120'},
    {x: '150', y: '120'},
  ];
  if (window.innerWidth <= 767) {
    arr = [
      {x: '-100', y: '-100'},
      {x: '100', y: '-100'},
      {x: '-100', y: '100'},
      {x: '100', y: '100'},
    ];
  }
  Object.keys(currentScene).forEach((key, index) => {
    if ( key !== 'q' && key !== 'a') {
      const container = document.querySelector('.interactive-container');
      const dropzone = document.querySelector('.drop-here');

      let el = currentScene[key];
      el = document.createElement('img');
      el.setAttribute('src', currentScene[key]);
      const div = document.createElement('div');
      div.appendChild(el);
      el = div;
      // el = parser.parseFromString(el, "image/svg+xml").documentElement;
      el.classList.add('dragNdrop');

      el.style.transform = 'translate(calc(-50% + ' + arr[index].x + 'px), calc(-50% + ' + arr[index].y + 'px))';
      el.setAttribute('data-x', arr[index].x);
      el.setAttribute('data-y', arr[index].y);
      el.setAttribute('data-ori-x', arr[index].x);
      el.setAttribute('data-ori-y', arr[index].y);
      if (key === 't') {
        el.setAttribute('data-true', 'true');
      }

      el.addEventListener('mouseover', function(event) {
        let scale = 1.2;
        animateAddScale(el, 1.2);
      });
      el.addEventListener('mouseleave', function(event) {
        animateRemoveScale(el);
      });
      // el.addEventListener('touchstart', function(event) {
      //   event.target.style.transition = '0s';
      // });
      // el.addEventListener('touchend', function(event) {
      //   event.target.style.transition = event.target.style.transition.replace(/(0s)/, '');
      // });

      container.appendChild(el);
      const innerCont = document.querySelector('.interactive-container');

      interact(el)
        .draggable({
          inertia: true,
          autoScroll: true,
          onmove: function(event) {
            var target = event.target,
              x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
              y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transition = 'all 0s ease 0s';
            
            // target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            target.style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px)';
            console.log(target.style.transform);
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          },
          onend: function(event) {
            event.target.style.transition = event.target.style.transition.replace(/(all 0s ease 0s)/, '');
    
            setTimeout(function() {
              if (!event.relatedTarget || (event.relatedTarget && !event.relatedTarget.classList.contains('drop-here')) && event.target.getAttribute('data-true') === 'true') {
                const oriX = event.target.getAttribute('data-ori-x');
                const oriY = event.target.getAttribute('data-ori-y');
                event.target.style.transform = 'translate(calc(-50% + ' + oriX + 'px), calc(-50% + ' + oriY + 'px))';
                event.target.setAttribute('data-x', oriX);
                event.target.setAttribute('data-y', oriY);
              }
    
              if (event.target.getAttribute('data-true') !== 'true') {
                const oriX = event.target.getAttribute('data-ori-x');
                const oriY = event.target.getAttribute('data-ori-y');
                event.target.style.transform = 'translate(calc(-50% + ' + oriX + 'px), calc(-50% + ' + oriY + 'px))';
                event.target.setAttribute('data-x', oriX);
                event.target.setAttribute('data-y', oriY);
              }
            }, 320);
          }
        });
    }
  }); 
}

function reCalImagePosition(arr) {
  const dragNdrops = document.querySelectorAll('.dragNdrop');
  dragNdrops.forEach(function(el, index) {
    el.style.transform = 'translate(calc(-50% + ' + arr[index].x + 'px), calc(-50% + ' + arr[index].y + 'px))';
    el.setAttribute('data-x', arr[index].x);
    el.setAttribute('data-y', arr[index].y);
    el.setAttribute('data-ori-x', arr[index].x);
    el.setAttribute('data-ori-y', arr[index].y);
  });
}

window.addEventListener('resize', function() {
  let arr = [
    {x: '-150', y: '-120'},
    {x: '150', y: '-120'},
    {x: '-150', y: '120'},
    {x: '150', y: '120'},
  ];
  if (window.innerWidth <= 767 ) {
    arr = [
      {x: '-100', y: '-100'},
      {x: '100', y: '-100'},
      {x: '-100', y: '100'},
      {x: '100', y: '100'},
    ];
  }
  reCalImagePosition(arr);
});

// this is used later in the resizing and gesture demos
// window.dragMoveListener = dragMoveListener;
