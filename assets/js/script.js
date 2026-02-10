document.addEventListener('DOMContentLoaded', function () {
  var splide = new Splide('.splide-nav', {
    type: 'loop',
    padding: '20%',
    perPage: 2,
    gap: '1rem',
    arrows: false,
    pagination: false,
    breakpoints: {
      1024: {
        perPage: 2,
      },
      768: {
        perPage: 1,
        gap: '1rem',
      },
    },
  });
  splide.mount();

  new Splide('.foudation-slider', { perPage: 1, arrows: false }).mount();
  new Splide('.forum-slide', {
    type: 'loop',
    focus: 'center',
    perPage: 2,
    gap: '10px',
    padding: '17%',
    arrows: true,
    pagination: false,
  }).mount();

  document.querySelectorAll('[data-tabs]').forEach(tabs => {
    const buttons = tabs.querySelectorAll('.tabs__btn');
    const panels = tabs.querySelectorAll('.tabs__panel');
    const indicator = tabs.querySelector('.tabs__indicator');

    function activateTab(btn) {
      buttons.forEach(b => b.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      tabs
        .querySelector(`[data-panel="${btn.dataset.tab}"]`)
        .classList.add('is-active');

      const paddingInline = 25 * 2;

      indicator.style.width = btn.offsetWidth + paddingInline + 'px';
      indicator.style.left = btn.offsetLeft - 25 + 'px';
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn));
    });

    // init
    activateTab(tabs.querySelector('.tabs__btn.is-active'));
  });

  //game
  

  // end


  


  document.querySelectorAll('.tabs__title.is-toggle').forEach(title => {
    title.addEventListener('click', () => {
      const panel = title.closest('.tabs__panel');

      document.querySelectorAll('.tabs__panel.is-open')
        .forEach(p => p !== panel && p.classList.remove('is-open'));

      panel.classList.toggle('is-open');
    });
  });

  //scroll
  document.querySelectorAll('.splide__slide').forEach(slide => {
  slide.addEventListener('click', () => {
    const target = slide.dataset.target;
    if (!target) return;

    const el = document.querySelector(target);
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});


});

console.log("Slot ready");

/* ======================
  CONFIG
====================== */
const symbolSets = [
  [
    "assets/images/icon-slot-1.jpg",
    "assets/images/icon-slot-2.jpg",
    "assets/images/icon-slot-3.jpg"
  ],
  [
    "assets/images/icon-slot-2.jpg",
    "assets/images/icon-slot-3.jpg",
    "assets/images/icon-slot-1.jpg"
  ],
  [
    "assets/images/icon-slot-3.jpg",
    "assets/images/icon-slot-1.jpg",
    "assets/images/icon-slot-2.jpg"
  ]
];

/* ======================
  DOM
====================== */
const reels = document.querySelectorAll(".symbols");
const spinBtn = document.getElementById("spinBtn");
const stopBtn = document.getElementById("stopBtn");

const emailModal = document.getElementById("emailModal");
const emailInput = document.getElementById("emailInput");
const submitEmailBtn = document.getElementById("submitEmail");

const resultModal = document.getElementById("resultModal");
const resultText = document.getElementById("resultText");

/* ======================
  STATE
====================== */
let spinning = false;
let intervals = [];
let spinCount = 0;
let emailSubmitted = false;

/* ======================
  INIT REELS
====================== */
reels.forEach((reel, i) => {
  const imgs = symbolSets[i];

  for (let round = 0; round < 5; round++) {
    imgs.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      reel.appendChild(img);
    });
  }
});

/* ======================
  EVENTS
====================== */
spinBtn.addEventListener("click", () => {
  if (!emailSubmitted) {
    emailModal.style.display = "flex";
    return;
  }

  if (spinCount >= 3) return;

  startSpin();
});

stopBtn.addEventListener("click", stopSpin);

submitEmailBtn.addEventListener("click", () => {
  if (!emailInput.value.trim()) return;

  emailSubmitted = true;
  emailModal.style.display = "none";
  startSpin();
});

/* ======================
  FUNCTIONS
====================== */
function startSpin() {
  if (spinning) return;

  spinning = true;
  spinBtn.disabled = true;
  stopBtn.disabled = false;

  reels.forEach((reel, index) => {
    let pos = 0;
    const speed = 6 + index * 2;

    if (intervals[index]) clearInterval(intervals[index]);

    intervals[index] = setInterval(() => {
      pos -= speed;

      if (Math.abs(pos) >= reel.scrollHeight / 2) {
        pos = 0;
      }

      reel.style.transform = `translateY(${pos}px)`;
    }, 16);
  });
}

function stopSpin() {
  if (!spinning) return;

  stopBtn.disabled = true;

  reels.forEach((reel, index) => {
    setTimeout(() => {
      clearInterval(intervals[index]);
      intervals[index] = null;
      snapToSlot(reel);
    }, index * 300);
  });

  setTimeout(() => {
    spinning = false;
    spinBtn.disabled = false;

    spinCount++;

    if (spinCount === 3) {
      setTimeout(showResult, 500);
    }
  }, reels.length * 300 + 300);
}

/* ======================
  SNAP ตรงช่อง
====================== */
function snapToSlot(reel) {
  const img = reel.querySelector("img");
  if (!img) return;

  const h = img.offsetHeight;
  const matrix = new DOMMatrixReadOnly(
    getComputedStyle(reel).transform
  );
  const y = matrix.m42;

  const snapY = Math.round(y / h) * h;

  reel.style.transition = "transform 0.25s ease-out";
  reel.style.transform = `translateY(${snapY}px)`;

  setTimeout(() => {
    reel.style.transition = "";
  }, 300);
}

/* ======================
  RESULT (ครบ 3 ครั้ง)
====================== */
function showResult() {
  const win = Math.random() > 0.5;

  resultText.textContent = win
    ? "🎉 ยินดีด้วย! คุณได้รับรางวัล 🎉"
    : "😢 เสียใจด้วย ลองใหม่ครั้งหน้า";

  resultModal.style.display = "flex";
}



