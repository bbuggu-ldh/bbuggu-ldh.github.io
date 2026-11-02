const stage = document.querySelector('.stage');
const cases = [...stage.querySelectorAll('.case')];
const count = cases.length;
let selected = Math.max(0, cases.findIndex(item => item.getAttribute('aria-current') === 'true'));
let suppressClick = false;

function select(index, updateUrl = true) {
  selected = (index % count + count) % count;
  cases.forEach((item, i) => {
    let distance = (i - selected + count) % count;
    if (distance > count / 2) distance -= count;
    const active = distance === 0;
    item.style.setProperty('--offset', distance);
    item.style.setProperty('--scale', active ? 1 : .86);
    item.style.setProperty('--yaw', `${distance < 0 ? 16 : distance > 0 ? -16 : -3}deg`);
    item.style.setProperty('--roll', `${distance < 0 ? -10 : distance > 0 ? 9 : 0}deg`);
    item.style.setProperty('--visible', Math.abs(distance) <= 1 ? 1 : 0);
    item.style.setProperty('--brightness', active ? 1 : .77);
    item.style.setProperty('--depth', 5 - Math.abs(distance));
    item.dataset.away = String(Math.abs(distance) > 1);
    item.tabIndex = active ? 0 : -1;
    if (active) item.setAttribute('aria-current', 'true');
    else item.removeAttribute('aria-current');
    if (Math.abs(distance) <= 1) item.querySelector('img').loading = 'eager';
  });
  const item = cases[selected];
  document.querySelector('#current-number').textContent = String(selected + 1).padStart(2, '0');
  document.querySelector('#project-title').textContent = item.dataset.title;
  document.querySelector('#summary').textContent = item.dataset.summary;
  document.querySelector('#discipline').textContent = item.dataset.discipline;
  document.querySelector('#kind').textContent = item.dataset.kind;
  const open = document.querySelector('#open-project');
  const available = item.dataset.detailPublic !== 'false';
  if (!open.dataset.originalLabel) open.dataset.originalLabel = open.innerHTML;
  open.innerHTML = available ? open.dataset.originalLabel : '비공개';
  open.setAttribute('aria-disabled', String(!available));
  if (available) open.href = item.getAttribute('href');
  else open.removeAttribute('href');
  document.querySelectorAll('[data-select]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.select) === selected)));
  if (updateUrl) history.replaceState(null, '', `#${item.dataset.slug}`);
}

cases.forEach((item, i) => item.addEventListener('click', event => {
  if (suppressClick) { event.preventDefault(); return; }
  if (i !== selected) { event.preventDefault(); select(i); }
  if (item.dataset.detailPublic === 'false') event.preventDefault();
}));
document.querySelector('#previous').addEventListener('click', () => select(selected - 1));
document.querySelector('#next').addEventListener('click', () => select(selected + 1));
document.querySelector('main').addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const focusWasCase = cases.includes(document.activeElement);
    select(selected + (event.key === 'ArrowRight' ? 1 : -1));
    if (focusWasCase) cases[selected].focus({ preventScroll: true });
  }
});

let gesture = null;
stage.addEventListener('dragstart', event => event.preventDefault());
stage.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  suppressClick = false;
  gesture = { x: event.clientX, y: event.clientY, id: event.pointerId };
});
stage.addEventListener('pointermove', event => {
  if (!gesture || event.pointerId !== gesture.id) return;
  const dx = event.clientX - gesture.x;
  if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(event.clientY - gesture.y)) {
    stage.classList.add('dragging');
    stage.setPointerCapture(event.pointerId);
  }
});
stage.addEventListener('pointerup', event => {
  if (!gesture || event.pointerId !== gesture.id) return;
  const dx = event.clientX - gesture.x;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(event.clientY - gesture.y)) {
    suppressClick = true;
    select(selected + (dx < 0 ? 1 : -1));
    setTimeout(() => { suppressClick = false; }, 0);
  }
  gesture = null;
  stage.classList.remove('dragging');
});
stage.addEventListener('pointercancel', () => { gesture = null; stage.classList.remove('dragging'); });

document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.open).showModal()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});
document.querySelectorAll('[data-select]').forEach(button => button.addEventListener('click', () => {
  select(Number(button.dataset.select));
  button.closest('dialog').close();
  stage.focus({ preventScroll: true });
}));
function readHash() {
  const index = cases.findIndex(item => `#${item.dataset.slug}` === location.hash);
  if (index >= 0) select(index, false);
}
select(selected, false);
readHash();
window.addEventListener('hashchange', readHash);
