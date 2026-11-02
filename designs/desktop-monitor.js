const frame=document.querySelector('.screen iframe');
const screen=document.querySelector('.screen');
function resizeScreen(){frame.style.transform=`scale(${screen.clientWidth/1440})`;frame.classList.add('is-ready');}
new ResizeObserver(resizeScreen).observe(screen);resizeScreen();
// Project pages open as normal full-size documents, not inside the monitor.
frame.addEventListener('load',()=>{
 const doc=frame.contentDocument;
 if(!doc)return;
 for(const a of doc.querySelectorAll('a[href]')){
   if(a.classList.contains('identity')){a.href='graphics-archive-screen.html?monitor=1';continue;}
   if(!a.getAttribute('href').startsWith('#'))a.target='_top';
 }
 const selected=new URLSearchParams(location.search).get('project') || location.hash.slice(1);
 if(selected && [...doc.querySelectorAll('.case')].some(item=>item.dataset.slug===selected))frame.contentWindow.location.hash=selected;
});
