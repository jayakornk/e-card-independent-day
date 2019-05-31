/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */
let startPos = null;
var parser = new DOMParser();

const arr = [
  {x: '-150', y: '-150'},
  {x: '150', y: '-150'},
  {x: '-150', y: '150'},
  {x: '150', y: '150'},
];

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
    overlap: 0.9,
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

      target.classList.add('dropped');
      
      if (!related.getAttribute('data-true')) {
        text.innerHTML = 'Try Again!';
        setTimeout(function() {
          animateRemoveScale(related);
          animateRemoveScale(text);
        }, 300);
      }
      
      related.classList.add('animate-drop');
      
      setTimeout(function() {
        related.classList.remove('animate-drop');
        target.classList.remove('dropped');
      }, 1050);
    },
    ondropdeactivate: function (event) {
      event.target.classList.remove('activate');
    },
  })

Object.keys(scenes.scene0).forEach((key, index) => {
  const container = document.querySelector('.container');
  const dropzone = document.querySelector('.drop-here');

  let el = scenes.scene0[key];
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

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;
