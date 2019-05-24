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

interact('.drop-here')
  .dropzone({
    accept: '.dragNdrop',
    overlap: 0.75,
    ondragenter: function (event) {
      event.target.classList.add('activate');
    },
    ondragleave: function (event) {
      event.target.classList.remove('activate');
    },
    // ondrop: function (event) {
      //   event.target.classList.add('activated');
      // },
    ondropdeactivate: function (event) {
      event.target.classList.remove('activate');
      event.target.classList.remove('activated')
    },
    // checker: function (dragEvent,         // related dragmove or dragend
    //   event,             // Touch, Pointer or Mouse Event
    //   dropped,           // bool default checker result
    //   dropzone,          // dropzone Interactable
    //   dropElement,       // dropzone elemnt
    //   draggable,         // draggable Interactable
    //   draggableElement) {// draggable element
    //   // only allow drops into empty dropzone elements
    //   console.log(dropped && !dropElement.hasChildNodes());
    //   console.log(draggableElement);
    //   if (draggableElement.getAttribute('data-true') !== 'true') {
    //     return false;
    //   }
    //   return true;
    //   // return dropped && !dropElement.hasChildNodes();
    // },
  })

Object.keys(scenes.scene0).forEach((key, index) => {
  let el = scenes.scene0[key];
  el = parser.parseFromString(el, "image/svg+xml").documentElement;
  console.dir(el);
  el.classList.add('dragNdrop');
  console.log('translate(calc(-50%' + arr[index].x + 'px), calc(-50%' + arr[index].y + 'px))');
  el.style.webkitTransform = 'translate(calc(-50% + ' + arr[index].x + 'px), calc(-50% + ' + arr[index].y + 'px))';
  el.style.transform = 'translate(calc(-50% + ' + arr[index].x + 'px), calc(-50% + ' + arr[index].y + 'px))';
  el.setAttribute('data-x', arr[index].x);
  el.setAttribute('data-y', arr[index].y);
  el.setAttribute('data-ori-x', arr[index].x);
  el.setAttribute('data-ori-y', arr[index].y);
  if (key === 't') {
    el.setAttribute('data-true', 'true');
  }
  document.querySelector('.container').appendChild(el);

  const here = document.querySelector('.drop-here');

  interact(el)
    .draggable({
      inertia: true,
      snap: {
        targets: [
          {
            x: here.offsetLeft,
            y: here.offsetTop,
            range: 100,
          },
          {
            x: arr[index].x,
            y: arr[index].y,
            range: Infinity,
          },
        ],
        relativePoints: [
          { x: 0.5, y: 0.5 },   // to the center
        ],
        endOnly: true,
      },
      onmove: dragMoveListener,
      onend: function(event) {
        if (event.target.getAttribute('data-true') !== 'true') {
          const oriX = event.target.getAttribute('data-ori-x');
          const oriY = event.target.getAttribute('data-ori-y');
          event.target.style.webkitTransform = 'translate(calc(-50% + ' + oriX + 'px), calc(-50% + ' + oriY + 'px))';
          event.target.style.transform = 'translate(calc(-50% + ' + oriX + 'px), calc(-50% + ' + oriY + 'px))';
          event.target.setAttribute('data-x', oriX);
          event.target.setAttribute('data-y', oriY);
          event.target.classList.add('wrong');

          setTimeout(function() {
            event.target.classList.remove('wrong');
          }, 510);
        }
      }
    });
});

function dragMoveListener (event) {
  var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px)';
  // 'translate(calc(-50% + ' + arr[index].x + 'px), calc(-50% + ' + arr[index].y + 'px))';
  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;
