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
        document.querySelectorAll('.interactive-container svg:not([data-true])').forEach(function(element) {
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

function dragMoveListener (event) {
  var target = event.target,
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.transition = '0s';

  target.style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px)';
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

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

next.addEventListener('click', function(e) {
  let nextScene = parseInt(this.dataset.currentScene) + 1;
  initScene(nextScene);
  this.dataset.currentScene = nextScene;
  back.dataset.currentScene = nextScene;
});

back.addEventListener('click', function(e) {
  let nextScene = parseInt(this.dataset.currentScene) - 1;
  initScene(nextScene);
  this.dataset.currentScene = nextScene;
  next.dataset.currentScene = nextScene;
});

function loopSVG(currentScene) {
  const arr = [
    {x: '-150', y: '-120'},
    {x: '150', y: '-120'},
    {x: '-150', y: '120'},
    {x: '150', y: '120'},
  ];
  Object.keys(currentScene).forEach((key, index) => {
    if ( key !== 'q' && key !== 'a') {
      const container = document.querySelector('.interactive-container');
      const dropzone = document.querySelector('.drop-here');

      let el = currentScene[key];
      el = parser.parseFromString(el, "image/svg+xml").documentElement;
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

      container.appendChild(el);

      interact(el)
        .draggable({
          inertia: true,
          snap: {
            targets: [
              {
                x: container.offsetLeft + dropzone.offsetLeft,
                y: container.offsetTop + dropzone.offsetTop,
                range: 100,
              },
              {
                x: arr[index].x,
                y: arr[index].y,
                range: Infinity,
              },
            ],
            relativePoints: [
              { x: 0.5, y: 0.5 },
            ],
            endOnly: true,
          },
          onmove: dragMoveListener,
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

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;
