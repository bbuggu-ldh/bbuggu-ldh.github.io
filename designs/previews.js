const choices = [...document.querySelectorAll('.choices a')];
const proposals = [...document.querySelectorAll('.proposal')];
const compare = document.getElementById('compare');
let all = location.hash === '#all';
let selected = proposals.some(p => '#'+p.id === location.hash) ? location.hash.slice(1) : 'blueprint';
compare.hidden = false;
function show() {
  proposals.forEach(p => { p.hidden = !all && p.id !== selected; });
  choices.forEach(a => {
    const active = !all && a.hash === '#'+selected;
    a.classList.toggle('selected',active);
    if(active) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current');
  });
  compare.setAttribute('aria-pressed',String(all));
  compare.textContent = all ? '하나씩 보기' : '5개 이어 보기';
  document.body.classList.toggle('compare-all',all);
}
choices.forEach(a => a.addEventListener('click',e => {
  if(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); selected=a.hash.slice(1); all=false;
  history.pushState(null,'',a.hash);show();window.scrollTo({top:0,behavior:'instant'});
}));
compare.addEventListener('click',()=>{
  all=!all;history.pushState(null,'',all?'#all':'#'+selected);show();window.scrollTo({top:0,behavior:'instant'});
});
addEventListener('popstate',()=>{
  all=location.hash==='#all';
  if(proposals.some(p=>'#'+p.id===location.hash)) selected=location.hash.slice(1);
  show();
});
show();
