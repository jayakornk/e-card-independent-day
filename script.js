/* global interact anime */

function animateAddScale(el, scale = 0.001) {
  const re = /(scale)\((.*)\)/g;
  if (!el.style.transform.match(re)) {
    el.style.transform += `scale(${scale})`;
  }
}

function animateRemoveScale(el) {
  const re = /(scale)\((.*)\)/g;
  el.style.transform = el.style.transform.replace(re, '');
}

document
  .querySelector('.drop-here-wrapper')
  .addEventListener('animationend', function(e) {
    e.target.classList.remove('dropped-false');
    e.target.classList.remove('dropped-true');
  });

document
  .querySelector('.interactive-container')
  .setAttribute('data-platform', navigator.userAgent);

interact('.drop-here-wrapper').dropzone({
  accept: '.dragNdrop',
  overlap: 0.65,
  ondragenter(event) {
    const { target } = event;
    const dropHere = document.querySelector('.drop-here');
    const text = target.querySelector('.drop-here-text');

    target.classList.add('activate');
    animateAddScale(text);

    if (/iPhone|iPad|iPod|Firefox/i.test(navigator.userAgent)) {
      dropHere.style.transform = 'scale(1.53)';
    }
  },
  ondragleave(event) {
    const dropHere = document.querySelector('.drop-here');
    const { target } = event;
    const text = target.querySelector('.drop-here-text');

    target.classList.remove('activate');
    animateRemoveScale(text);

    if (/iPhone|iPad|iPod|Firefox/i.test(navigator.userAgent)) {
      dropHere.style.transform = 'scale(1)';
    }
  },
  ondrop(event) {
    const dropHere = document.querySelector('.drop-here');
    const related = event.relatedTarget;
    const target = event.currentTarget;
    const text = target.querySelector('.drop-here-text');

    dropHere.style.transition = 'all 0s ease 0s'; // might have to move somewhere for true answer

    target.classList.add('activate');
    animateAddScale(related);
    animateAddScale(text);

    if (related.getAttribute('data-true')) {
      const trueElement = document.querySelector('[data-true] > img');
      trueElement.style.transform = 'rotate(0)';
      anime.remove(trueElement);

      trueElement.removeEventListener('mouseover', pauseAnime);
      trueElement.removeEventListener('mouseout', playAnime);
    }
    if (!/iPhone|iPad|iPod|Firefox/i.test(navigator.userAgent)) {
      if (!related.getAttribute('data-true')) {
        target.classList.add('dropped-false');
        text.innerHTML = 'Try Again!';
        setTimeout(function() {
          animateRemoveScale(related);
          animateRemoveScale(text);
        }, 300);
      } else {
        target.classList.add('dropped-true');
        related.classList.add('target-true');
        related.style.pointerEvents = 'none';
        document.querySelector('.firework').classList.add('firework-animate');
        document.querySelector('[id="answer-text"]').classList.add('show-text');
        document
          .querySelector('.btn-direction.next')
          .classList.remove('hide-next');
        document
          .querySelectorAll(
            '.interactive-container .dragNdrop:not([data-true])'
          )
          .forEach(function(element) {
            element.classList.add('hide-not-true');
          });
      }
    } else if (!related.getAttribute('data-true')) {
      text.innerHTML = 'Try Again!';
      anime({
        targets: dropHere,
        scale: ['1.53', '1', '1.3', '1'],
        duration: 600,
        easing: 'cubicBezier(0.25, 0.1, 0.25, 1)',
        complete() {
          dropHere.style.transition = '';
          animateRemoveScale(text);
        },
      });
    } else {
      anime({
        targets: dropHere,
        scale: ['1.53', '1', '1.53'],
        duration: 600,
        easing: 'cubicBezier(0.25, 0.1, 0.25, 1)',
        complete() {
          dropHere.style.transition = '';
          animateRemoveScale(dropHere);
        },
      });
      anime({
        targets: related.querySelector('img'),
        keyframes: [
          {
            scale: 1,
          },
          {
            scale: 0,
          },
          {
            scale: 1.6,
          },
          {
            scale: 1.3,
            delay: 200,
          },
        ],
        duration: 750,
        easing: 'cubicBezier(0.25, 0.1, 0.25, 1)',
      });
      related.classList.add('target-true');
      related.style.pointerEvents = 'none';
      document.querySelector('.firework').classList.add('firework-animate');
      document.querySelector('[id="answer-text"]').classList.add('show-text');
      document
        .querySelector('.btn-direction.next')
        .classList.remove('hide-next');
      document
        .querySelectorAll('.interactive-container .dragNdrop:not([data-true])')
        .forEach(function(element) {
          element.classList.add('hide-not-true');
        });
    }
  },
  ondropdeactivate(event) {
    const related = event.relatedTarget;
    const target = event.currentTarget;
    if (!related.getAttribute('data-true') && target) {
      target.classList.remove('activate');
    }
  },
});

function initScene(scene) {
  const currentSceneKey = `scene${scene}`;
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

  const headerHeight = document.querySelector('.main-header').offsetHeight;
  const containers = document.querySelectorAll('.container');

  containers.forEach(function(container) {
    container.style.minHeight = window.innerHeight - headerHeight + 'px';
  });
});

const next = document.querySelector('.btn-direction.next');
const back = document.querySelector('.btn-direction.back');

function changeScene(element) {
  console.log(element.dataset.currentScene);
  if (element.dataset.currentScene !== '4') {
    const innerContainer = document.querySelector('.container:not(.final-scene) .inner-container');
    innerContainer.classList.add('changing-scene');
    setTimeout(function() {
      innerContainer.classList.remove('changing-scene');
    }, 750);
    const multiplier = element.classList.contains('back') ? -1 : 1;
    const nextScene = parseInt(element.dataset.currentScene) + 1 * multiplier;
    resetScene();
    setTimeout(function() {
      initScene(nextScene);
    }, 750);
    document.querySelectorAll('.btn-direction').forEach(function(element) {
      element.dataset.currentScene = nextScene;
    });
  } else {
    document.querySelector('.final-scene').classList.add('current');
  }
}

function resetScene() {
  document.querySelectorAll('.dragNdrop').forEach(function(child) {
    const parent = child.parentNode;
    parent.removeChild(child);
  });
  document.querySelector('.firework').classList.remove('firework-animate');
  const dropHere = document.querySelector('.drop-here-wrapper');
  dropHere.className = '';
  dropHere.classList.add('drop-here-wrapper');
  const dropHereText = document.querySelector('.drop-here-text');
  dropHereText.style.transform = 'translateY(-50%)';
  dropHereText.innerHTML = 'Drop Here!';
  document.querySelector('.btn-direction.next').classList.add('hide-next');
  document.querySelector('#answer-text').classList.remove('show-text');
}

next.addEventListener('click', function() {
  changeScene(this);
});

back.addEventListener('click', function() {
  changeScene(this);
});

document.querySelector('.btn-play-again').addEventListener('click', function() {
  document.querySelector('.final-scene').classList.remove('current');
  changeScene(this);
});

function playAnime(animation) {
  animation.play();
}

function pauseAnime(animation) {
  animation.pause();
}

function loopSVG(currentScene) {
  let arr = [
    { x: '-150', y: '-120' },
    { x: '150', y: '-120' },
    { x: '-150', y: '120' },
    { x: '150', y: '120' },
  ];
  if (window.innerWidth <= 767) {
    arr = [
      { x: '-100', y: '-100' },
      { x: '100', y: '-100' },
      { x: '-100', y: '100' },
      { x: '100', y: '100' },
    ];
  }
  Object.keys(currentScene).forEach((key, index) => {
    if (key !== 'q' && key !== 'a') {
      const container = document.querySelector('.interactive-container');

      let el = currentScene[key];
      el = document.createElement('img');
      el.setAttribute('src', currentScene[key]);
      const div = document.createElement('div');
      div.appendChild(el);
      el = div;
      el.classList.add('dragNdrop');

      el.style.transform = `translate(calc(-50% + ${arr[index].x}px), calc(-50% + ${arr[index].y}px))`;
      el.setAttribute('data-x', arr[index].x);
      el.setAttribute('data-y', arr[index].y);
      el.setAttribute('data-ori-x', arr[index].x);
      el.setAttribute('data-ori-y', arr[index].y);
      if (key === 't') {
        el.setAttribute('data-true', 'true');
      }

      el.addEventListener('mouseover', function() {
        const scale = 1.2;
        animateAddScale(el, scale);
      });
      el.addEventListener('mouseleave', function() {
        animateRemoveScale(el);
      });

      container.appendChild(el);

      const dragNdrop = document.querySelectorAll('.dragNdrop > img');

      dragNdrop.forEach(function(ele) {
        const animation = anime({
          targets: ele,
          rotate: [0, -15, 0],
          duration: 1000,
          delay: Math.random() * (750 - 250) + 250,
          easing: 'cubicBezier(0.25, 0.1, 0.25, 1)',
          loop: true,
        });

        ele.parentElement.addEventListener('mouseover', pauseAnime(animation));
        ele.parentElement.addEventListener('mouseout', playAnime(animation));
      });

      interact(el).draggable({
        inertia: true,
        autoScroll: true,
        onmove(event) {
          const { target } = event;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.transition = 'all 0s ease 0s';

          target.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
        onend(event) {
          event.target.style.transition = event.target.style.transition.replace(
            /(all 0s ease 0s)/,
            ''
          );

          setTimeout(function() {
            const oriX = event.target.getAttribute('data-ori-x');
            const oriY = event.target.getAttribute('data-ori-y');
            event.target.style.transform = `translate(calc(-50% + ${oriX}px), calc(-50% + ${oriY}px))`;
            event.target.setAttribute('data-x', oriX);
            event.target.setAttribute('data-y', oriY);
          }, 320);
        },
      });
    }
  });
}

function reCalImagePosition(arr) {
  const dragNdrops = document.querySelectorAll('.dragNdrop');
  dragNdrops.forEach(function(el, index) {
    el.style.transform = `translate(calc(-50% + ${arr[index].x}px), calc(-50% + ${arr[index].y}px))`;
    el.setAttribute('data-x', arr[index].x);
    el.setAttribute('data-y', arr[index].y);
    el.setAttribute('data-ori-x', arr[index].x);
    el.setAttribute('data-ori-y', arr[index].y);
  });
}

window.addEventListener('resize', function() {
  let arr = [
    { x: '-150', y: '-120' },
    { x: '150', y: '-120' },
    { x: '-150', y: '120' },
    { x: '150', y: '120' },
  ];
  if (window.innerWidth <= 767) {
    arr = [
      { x: '-100', y: '-100' },
      { x: '100', y: '-100' },
      { x: '-100', y: '100' },
      { x: '100', y: '100' },
    ];
  }
  reCalImagePosition(arr);
});
