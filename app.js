document.documentElement.classList.add('js');
var header=document.getElementById('header');
if(header){window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>20);});}

var navToggle=document.getElementById('navToggle'),navClose=document.getElementById('navClose'),mnav=document.getElementById('mnav');
if(navToggle&&mnav){navToggle.addEventListener('click',function(){mnav.classList.add('open');});}
if(navClose&&mnav){navClose.addEventListener('click',function(){mnav.classList.remove('open');});}
function closeMnav(){if(mnav)mnav.classList.remove('open');}

var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');obs.unobserve(e.target);}});},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});

document.querySelectorAll('.service-card').forEach(function(card){
  card.addEventListener('mousemove',function(e){var r=card.getBoundingClientRect();card.style.setProperty('--mx',(e.clientX-r.left)+'px');});
});

function toggleFaq(btn){var item=btn.closest('.faq-item');var open=item.classList.contains('open');document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');});if(!open)item.classList.add('open');}

/* scroll progress bar */
var pbar=document.createElement('div');pbar.className='pbar';pbar.innerHTML='<i></i>';document.body.appendChild(pbar);
var pfill=pbar.firstChild;
window.addEventListener('scroll',function(){
  var h=document.documentElement.scrollHeight-window.innerHeight;
  pfill.style.width=(h>0?(window.scrollY/h*100):0)+'%';
},{passive:true});

/* count-up stats */
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function countUp(el){
  var node=el.firstChild;
  if(!node||node.nodeType!==3)return;
  var target=parseInt(node.nodeValue,10);
  if(isNaN(target))return;
  var start=null,dur=1300;
  function step(t){
    if(!start)start=t;
    var p=Math.min((t-start)/dur,1);
    node.nodeValue=Math.round(target*(1-Math.pow(1-p,3)));
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
if(!reduce&&'IntersectionObserver' in window){
  var statObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){countUp(e.target);statObs.unobserve(e.target);}});
  },{threshold:0.6});
  document.querySelectorAll('.stat-num').forEach(function(el){statObs.observe(el);});
}

/* subtle tilt on the browser mock */
var mock=document.querySelector('.mock-stage .browser');
if(mock&&!reduce&&window.matchMedia('(pointer: fine)').matches){
  var stage=mock.parentElement;
  stage.addEventListener('mousemove',function(e){
    var r=stage.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    mock.style.transform='perspective(1100px) rotateY('+(x*5)+'deg) rotateX('+(-y*4)+'deg)';
  });
  stage.addEventListener('mouseleave',function(){mock.style.transform='';});
}

var EP='https://formspree.io/f/YOUR_ID';
function sendForm(e){
  e.preventDefault();
  var btn=document.getElementById('submitBtn');
  btn.disabled=true;btn.textContent='Versturen…';
  fetch(EP,{method:'POST',headers:{Accept:'application/json'},body:new FormData(e.target)})
    .then(function(r){if(!r.ok)throw 0;document.getElementById('formBody').style.display='none';document.getElementById('ok').style.display='block';})
    .catch(function(){btn.disabled=false;btn.textContent='Verstuur aanvraag';alert('Er ging iets mis. Mail ons op info@nutel.nl');});
}
