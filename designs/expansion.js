const panels=[...document.querySelectorAll('.panel')];
const links=[...document.querySelectorAll('.heading nav a')];
function show(){const id=panels.some(p=>'#'+p.id===location.hash)?location.hash.slice(1):'art';panels.forEach(p=>p.hidden=p.id!==id);links.forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
document.body.classList.add('enhanced');
links.concat([...document.querySelectorAll('.career-link')]).forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();history.pushState(null,'',a.hash);show();window.scrollTo(0,0);}));
addEventListener('popstate',show);addEventListener('hashchange',show);show();
