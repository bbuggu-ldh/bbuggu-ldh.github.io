/* Small progressive enhancements. All articles and images work without JavaScript. */
const filterGroup = document.querySelector('.filters');
if (filterGroup) {
  filterGroup.hidden = false;
  const cards = [...document.querySelectorAll('.project-card')];
  const grid = document.querySelector('.project-grid');
  const status = document.querySelector('#filter-status');
  filterGroup.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const filter = button.dataset.filter;
    filterGroup.querySelectorAll('button').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    let count = 0;
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; if (!card.hidden) count++; });
    grid.classList.toggle('filtered', filter !== 'all');
    status.textContent = `${button.textContent.trim()} 분류: ${count}개 작업`;
  });
}

const lightbox = document.querySelector('.lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  const fullImage = lightbox.querySelector('img');
  const title = lightbox.querySelector('#lightbox-title');
  const close = lightbox.querySelector('.lightbox-close');
  const size = lightbox.querySelector('.lightbox-size');
  size.addEventListener('click', () => {
    const original = lightbox.classList.toggle('is-original');
    size.setAttribute('aria-pressed', String(original));
    size.textContent = original ? '화면에 맞추기' : (trigger?.dataset.zoomSizeLabel || '원본 크기');
  });
  let trigger;
  document.querySelectorAll('[data-zoom]').forEach(link => link.addEventListener('click', event => {
    // Preserve new-tab and download gestures.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    lightbox.classList.remove('is-original');
    size.setAttribute('aria-pressed', 'false');
    size.textContent = link.dataset.zoomSizeLabel || '원본 크기';
    const alt = link.querySelector('img').alt;
    fullImage.src = link.href;
    fullImage.alt = alt;
    fullImage.style.transform = link.dataset.imageRotation === '180' ? 'rotate(180deg)' : '';
    title.textContent = alt;
    lightbox.showModal();
    document.body.classList.add('modal-open');
    lightbox.querySelector('.lightbox-scroll').scrollTo(0,0);
    close.focus();
  }));
  close.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    fullImage.removeAttribute('src');
    trigger?.focus({ preventScroll: true });
  });
}

if (navigator.clipboard && window.isSecureContext) {
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.closest('.code-block').querySelector('code').textContent);
        button.textContent = '복사됨';
      } catch { button.textContent = '직접 선택해 주세요'; }
      setTimeout(() => { button.textContent = '복사'; }, 2200);
    });
  });
}

const toc = document.querySelector('.toc');
if (toc && matchMedia('(max-width: 760px)').matches) toc.open = false;
const progress = document.querySelector('.reading-progress');
const headings = [...document.querySelectorAll('.article-body h2[id]')];
if (progress) {
  let queued = false;
  function updateReading() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
    let current = headings[0];
    for (const heading of headings) if (heading.getBoundingClientRect().top <= 160) current = heading;
    document.querySelectorAll('.toc a').forEach(link => {
      const active = link.hash === `#${current?.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
    queued = false;
  }
  addEventListener('scroll', () => { if (!queued) { requestAnimationFrame(updateReading); queued = true; } }, { passive: true });
  addEventListener('resize', updateReading);
  updateReading();
}
