// A quiet minute-resolution clock set to Korean time.
const clock = document.querySelector('[data-kst-clock]');
if (clock) {
  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  let timer;
  function updateClock() {
    clearTimeout(timer);
    const now = new Date();
    const time = format.format(now);
    clock.textContent = time;
    clock.dateTime = now.toISOString();
    clock.setAttribute('aria-label', `현재 시각 ${time}`);
    if (!document.hidden) timer = setTimeout(updateClock, 60000 - now.getTime() % 60000);
  }
  document.addEventListener('visibilitychange', updateClock);
  updateClock();
}
