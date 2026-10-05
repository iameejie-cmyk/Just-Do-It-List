import confetti from 'canvas-confetti';

export function triggerTaskCelebration() {
  confetti({
    particleCount: 45,
    spread: 55,
    origin: { y: 0.7 },
    colors: ['#455240', '#60725a', '#8b9b84', '#e2e6d8', '#222722'],
  });
}

export function triggerGrandCelebration() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#455240', '#95a78d', '#d9ded2', '#222722', '#c2cbbe'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#455240', '#95a78d', '#d9ded2', '#222722', '#c2cbbe'],
    });
  }, 250);
}
