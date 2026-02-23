const container = document.querySelector(".container");
const exercisePage = document.querySelector(".exercise-page");
const playBtn = document.querySelector(".play-btn");
const homePage = document.querySelector(".home-page");

const workoutPage = document.querySelector(".workout-page");
const repsSection = document.getElementById("repsDisplay");
const workoutTitle = document.getElementById("workoutTitle");

const lapContainer = document.getElementById("lapContainer");

let setHistory = [];
let lapTimes = [];
let lastLapTime = 0;

let currentMode = null;
let timerInterval;
let seconds = 0;
let repsInterval = null;
let repsRunning = false;

/* ================= PLAY BUTTON SYSTEM ================= */

playBtn.addEventListener("click", () => {
  gsap.to(homePage, {
    opacity: 0,
    duration: 0.6,
    onComplete: () => {
      homePage.style.pointerEvents = "none";
    },
  });

  gsap.to(exercisePage, {
    opacity: 1,
    duration: 0.8,
    delay: 0.3,
    onStart: () => {
      exercisePage.style.pointerEvents = "auto";
    },
  });
});

/* ================= BUBBLE SYSTEM ================= */
function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  const size = gsap.utils.random(50, 130);
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";
  bubble.style.left = gsap.utils.random(0, window.innerWidth - size) + "px";

  container.appendChild(bubble);
  animateBubble(bubble);
}

function animateBubble(bubble) {
  const floatTween = gsap.to(bubble, {
    y: -window.innerHeight - 200,
    duration: gsap.utils.random(10, 16),
    ease: "none",
  });

  gsap.to(bubble, {
    x: "random(-80,80)",
    duration: gsap.utils.random(3, 6),
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.ticker.add(checkPosition);

  function checkPosition() {
    const rect = bubble.getBoundingClientRect();

    const popMinX = window.innerWidth * 0.2;
    const popMaxX = window.innerWidth * 0.45;
    const popMinY = window.innerHeight * 0.25;
    const popMaxY = window.innerHeight * 0.5;

    if (
      rect.left > popMinX &&
      rect.left < popMaxX &&
      rect.top > popMinY &&
      rect.top < popMaxY
    ) {
      gsap.ticker.remove(checkPosition);
      floatTween.kill();
      prePop(bubble);
    }
  }
}

function prePop(bubble) {
  gsap.to(bubble, {
    scaleX: 1.25,
    scaleY: 0.75,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: "power1.inOut",
    onComplete: () => popBubble(bubble),
  });
}

function popBubble(bubble) {
  const rect = bubble.getBoundingClientRect();
  const burst = document.createElement("div");
  burst.classList.add("burst");
  burst.style.left = rect.left + rect.width / 2 + "px";
  burst.style.top = rect.top + rect.height / 2 + "px";
  document.body.appendChild(burst);

  for (let i = 0; i < 6; i++) {
    const spark = document.createElement("div");
    spark.classList.add("spark");
    burst.appendChild(spark);

    gsap.to(spark, {
      x: gsap.utils.random(-40, 40),
      y: gsap.utils.random(-40, 40),
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }

  bubble.remove();

  gsap.delayedCall(0.6, () => {
    burst.remove();
    if (!calmMode) createBubble();
  });
}

/* spawn bubbles */
setInterval(() => {
  if (!calmMode) createBubble();
}, 900);

/* ================= CALM MODE ================= */

const canvas = document.getElementById("calmCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let calmMode = false;
let animationFrame;
let time = 0;

container.addEventListener("click", (e) => {
  // If user clicked on any interactive UI element, DO NOTHING
  if (
    // e.target.closest(".play-btn") ||
    // e.target.closest(".exercise-card") ||
    // e.target.closest(".exercise-page") ||
    // e.target.closest(".workout-page")
    e.target.closest("button") ||
    e.target.closest(".exercise-card")
  ) {
    return;
  }

  // Only trigger when clicking empty background
  if (!calmMode) {
    enterCalmMode();
  } else {
    exitCalmMode();
  }

  calmMode = !calmMode;
});

function fadeOutBubbles() {
  const bubbles = document.querySelectorAll(".bubble");

  gsap.to(bubbles, {
    opacity: 0,
    scale: 0.6,
    duration: 0.8,
    stagger: 0.05,
    onComplete: () => {
      bubbles.forEach((b) => b.remove());
    },
  });
}

function drawCalmWaves() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#14162E");
  gradient.addColorStop(1, "#0F1026");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const baseHeight = canvas.height * 0.65;

  for (let i = 0; i < 5; i++) {
    ctx.beginPath();

    const amplitude = 8 + i * 4;
    const frequency = 0.0015 + i * 0.0005;

    /* Slightly faster wave motion */
    const speed = 0.0006 + i * 0.00025;

    for (let x = 0; x <= canvas.width; x++) {
      /* Increased horizontal drift */
      const waveX = x + time * 0.6;

      const y =
        baseHeight + Math.sin(waveX * frequency + time * speed) * amplitude;

      ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    ctx.fillStyle = `rgba(170,150,255,${0.05 + i * 0.04})`;
    ctx.fill();
  }

  /* Faster global time progression */
  time += 1.2;

  animationFrame = requestAnimationFrame(drawCalmWaves);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function enterCalmMode() {
  time = 0; // reset wave time

  fadeOutBubbles();

  gsap.to("body", {background: "#0F1026", duration: 1});
  gsap.to(canvas, {opacity: 1, duration: 1});

  drawCalmWaves();
}

function exitCalmMode() {
  cancelAnimationFrame(animationFrame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gsap.to(canvas, {opacity: 0, duration: 1});
  gsap.to("body", {background: "#1F2240", duration: 1});

  for (let i = 0; i < 4; i++) {
    setTimeout(() => createBubble(), i * 300);
  }
}

/* ================= ICON ANIMATION MODE ================= */
document.querySelectorAll(".exercise-card").forEach((card) => {
  const icon = card.querySelector(".gif-icon");

  if (!icon) return;

  card.addEventListener("mouseenter", () => {
    // restart GIF cleanly
    icon.src = "";
    icon.src = icon.dataset.animated;
  });

  card.addEventListener("mouseleave", () => {
    icon.src = icon.dataset.static;
  });
});

/* ================= WORKOUT MODE ================= */
// document.querySelectorAll(".exercise-card").forEach((card) => {
//   card.addEventListener("click", () => {
//     const name = card.dataset.name;

//     workoutTitle.textContent = name;

//     gsap.to(".exercise-page", {
//       opacity: 0,
//       duration: 0.4,
//       onComplete: () => {
//         document.querySelector(".exercise-page").style.pointerEvents =
//           "none";
//       },
//     });

//     gsap.to(workoutPage, {
//       opacity: 1,
//       duration: 0.6,
//       delay: 0.3,
//       onStart: () => {
//         workoutPage.style.pointerEvents = "auto";
//       },
//     });
//   });
// });

/* ---------------------------
         ANIMATED COUNTER EFFECT
      ---------------------------- */

function animateNumber(value) {
  display.style.transform = "scale(1.2)";
  display.style.opacity = "0.6";

  setTimeout(() => {
    display.innerText = value;
    display.style.transform = "scale(1)";
    display.style.opacity = "1";
  }, 150);
}

/* =====================================================
         WORKOUT SYSTEM (TIME + REPS)
      ===================================================== */

const timerSection = document.getElementById("timerSection");
const timeDisplay = timerSection;
const repNumber = document.getElementById("repCount");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const cancelBtn = document.getElementById("cancelBtn");

/* =============================
         GLOBAL STATE
      ============================= */

/* ---- TIME MODE STATE ---- */
let stopwatchInterval = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

/* ---- REPS MODE STATE ---- */
let repCount = 0;

/* =====================================================
         TIME FUNCTIONS
      ===================================================== */

function formatTime(ms) {
  const hrs = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);

  return (
    String(hrs).padStart(2, "0") +
    ":" +
    String(mins).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0") +
    "." +
    String(milliseconds).padStart(2, "0")
  );
}

function updateStopwatch() {
  const now = Date.now();
  elapsedTime = now - startTime;
  console.log("Updating:", elapsedTime); // DEBUG
  timeDisplay.textContent = formatTime(elapsedTime);
}

function startStopwatch() {
  if (isRunning) return;

  isRunning = true;
  startTime = Date.now() - elapsedTime;

  if (elapsedTime === 0) {
    lapTimes = [];
    lastLapTime = 0;
    lapContainer.innerHTML = "";
  }

  isRunning = true;
  startTime = Date.now() - elapsedTime;

  stopwatchInterval = setInterval(updateStopwatch, 10);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  isRunning = false;
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  isRunning = false;
  elapsedTime = 0;
  lastLapTime = 0;
  lapTimes = [];

  timeDisplay.textContent = "00:00:00.00";
  lapContainer.innerHTML = "";
}

/* =====================================================
         REPS FUNCTIONS
      ===================================================== */
function startRepsAuto() {
  if (repsRunning) return;

  repsRunning = true;

  repsInterval = setInterval(() => {
    repCount++;
    repNumber.textContent = repCount;
  }, 2500);
}

function stopRepsAuto() {
  clearInterval(repsInterval);
  repsInterval = null;
  repsRunning = false;
}

function resetReps() {
  stopRepsAuto();
  repCount = 0;
  repNumber.textContent = "0";
  setHistory = [];
  lapContainer.innerHTML = "";
}

/* =====================================================
         EXERCISE CLICK HANDLING
      ===================================================== */

document.querySelectorAll(".exercise-card").forEach((card) => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;
    const name = card.dataset.name;

    workoutTitle.textContent = name;
    currentMode = type;

    if (type === "timer") {
      timerSection.style.display = "block";
      repsSection.style.display = "none";
    }

    if (type === "reps") {
      timerSection.style.display = "none";
      repsSection.style.display = "block";
    }

    gsap.to(exercisePage, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        exercisePage.style.pointerEvents = "none";
      },
    });

    gsap.to(workoutPage, {
      opacity: 1,
      duration: 0.6,
      delay: 0.3,
      onStart: () => {
        workoutPage.style.pointerEvents = "auto";
      },
    });
  });
});

/* =====================================================
         BUTTON EVENTS
      ===================================================== */
startBtn.addEventListener("click", () => {
  if (currentMode === "timer") {
    startStopwatch();
  }

  if (currentMode === "reps") {
    startRepsAuto();
  }
});

stopBtn.addEventListener("click", () => {
  if (currentMode === "timer") {
    if (isRunning) {
      stopStopwatch();
      addLap();
    }
  }

  if (currentMode === "reps") {
    if (repsRunning) {
      stopRepsAuto();
      logSet(); // 🔥 auto log reps
    }
  }
});

resetBtn.addEventListener("click", () => {
  if (currentMode === "timer") {
    resetStopwatch();
  }

  if (currentMode === "reps") {
    resetReps();
  }
});

cancelBtn.addEventListener("click", () => {
  resetStopwatch();
  resetReps();

  gsap.to(workoutPage, {opacity: 0, duration: 0.4});

  gsap.to(exercisePage, {
    opacity: 1,
    duration: 0.6,
    delay: 0.3,
    onStart: () => {
      workoutPage.style.pointerEvents = "none";
      exercisePage.style.pointerEvents = "auto";
    },
  });
});

/* =====================================================
         LAPS FUNCTIONS
      ===================================================== */
function addLap() {
  if (elapsedTime === 0) return;

  const currentLapTime = elapsedTime;
  const lapInterval = currentLapTime - lastLapTime;

  lastLapTime = currentLapTime;
  lapTimes.push(currentLapTime);

  const lapItem = document.createElement("div");
  lapItem.className = "lap-item";

  lapItem.innerHTML = `
    <span>Session ${lapTimes.length}</span>
    <span>${formatTime(lapInterval)}</span>
  `;

  lapContainer.prepend(lapItem);
}

/* =====================================================
         REPS LAPS FUNCTIONS
      ===================================================== */

function logSet() {
  if (repCount === 0) return;

  setHistory.push(repCount);

  const setItem = document.createElement("div");
  setItem.className = "lap-item";

  setItem.innerHTML = `
    <span>Set ${setHistory.length}</span>
    <span>${repCount} reps</span>
  `;

  lapContainer.prepend(setItem);

  // reset rep counter for next set
  repCount = 0;
  repNumber.textContent = "0";
}
