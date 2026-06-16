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

var EP='https://formspree.io/f/YOUR_ID';
function sendForm(e){
  e.preventDefault();
  var btn=document.getElementById('submitBtn');
  btn.disabled=true;btn.textContent='Versturen…';
  fetch(EP,{method:'POST',headers:{Accept:'application/json'},body:new FormData(e.target)})
    .then(function(r){if(!r.ok)throw 0;document.getElementById('formBody').style.display='none';document.getElementById('ok').style.display='block';})
    .catch(function(){btn.disabled=false;btn.textContent='Verstuur aanvraag';alert('Er ging iets mis. Mail ons op info@nutel.nl');});
}
