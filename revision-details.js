// Native disclosures work without JavaScript; this adds bulk controls and deep links.
const implementationDetails = [...document.querySelectorAll('.implementation-detail')];
const detailControls = document.querySelector('.detail-controls');
if (implementationDetails.length && detailControls) {
  detailControls.hidden = false;
  const expand = detailControls.querySelector('[data-details-expand]');
  const collapse = detailControls.querySelector('[data-details-collapse]');
  const updateControls = () => {
    expand.disabled = implementationDetails.every(detail => detail.open);
    collapse.disabled = implementationDetails.every(detail => !detail.open);
  };
  expand.addEventListener('click', () => {
    implementationDetails.forEach(detail => { detail.open = true; });
    updateControls();
  });
  collapse.addEventListener('click', () => {
    implementationDetails.forEach(detail => { detail.open = false; });
    updateControls();
  });
  implementationDetails.forEach(detail => detail.addEventListener('toggle', updateControls));
  function revealDetailHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    const detail = target?.closest('.implementation-detail');
    if (!detail) return;
    detail.open = true;
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start' });
      (target === detail ? detail.querySelector('summary') : target).focus({ preventScroll: true });
    });
  }
  addEventListener('hashchange', revealDetailHash);
  // Clicking the same fragment again should reopen a disclosure that was closed manually.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && link.hash === location.hash) revealDetailHash();
  });
  revealDetailHash();
  updateControls();
}
