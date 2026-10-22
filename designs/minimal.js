const panels=[...document.querySelectorAll('.proposal')];
const links=[...document.querySelectorAll('.picker nav a')];
const compare=document.querySelector('#compare');
let selected='film';
function render(){
  const hash=location.hash.slice(1),all=hash==='all';
  if(panels.some(p=>p.id===hash))selected=hash;
  panels.forEach(p=>{p.hidden=!all&&p.id!==selected;if(p.hidden)p.querySelectorAll('video').forEach(v=>v.pause());});
  links.forEach(a=>{if(!all&&a.hash==='#'+selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  compare.textContent=all?'하나씩 보기':'4개 이어 보기';
  compare.setAttribute('aria-pressed',String(all));
}
links.forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();history.pushState(null,'',a.hash);render();scrollTo(0,0);}));
compare.addEventListener('click',()=>{history.pushState(null,'',location.hash==='#all'?'#'+selected:'#all');render();scrollTo(0,0);});
addEventListener('popstate',render);
addEventListener('hashchange',render);
compare.hidden=false;render();
