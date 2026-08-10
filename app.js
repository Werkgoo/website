document.documentElement.classList.add('js');
var header=document.getElementById('header');
if(header){window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>20);});}

var navToggle=document.getElementById('navToggle'),navClose=document.getElementById('navClose'),mnav=document.getElementById('mnav');
if(navToggle&&mnav){navToggle.addEventListener('click',function(){mnav.classList.add('open');});}
if(navClose&&mnav){navClose.addEventListener('click',function(){mnav.classList.remove('open');});}
function closeMnav(){if(mnav)mnav.classList.remove('open');}

var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');obs.unobserve(e.target);}});},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});

function toggleFaq(btn){var item=btn.closest('.faq-item');var open=item.classList.contains('open');document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');});if(!open)item.classList.add('open');}

/* scroll progress bar */
var pbar=document.createElement('div');pbar.className='pbar';pbar.innerHTML='<i></i>';document.body.appendChild(pbar);
var pfill=pbar.firstChild;
window.addEventListener('scroll',function(){
  var h=document.documentElement.scrollHeight-window.innerHeight;
  pfill.style.width=(h>0?(window.scrollY/h*100):0)+'%';
},{passive:true});

var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* subtle tilt op de hero-stage */
var stageEl=document.querySelector('.mock-stage .stage');
if(stageEl&&!reduce&&window.matchMedia('(pointer: fine)').matches){
  var wrap=stageEl.parentElement;
  wrap.addEventListener('mousemove',function(e){
    var r=wrap.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    stageEl.style.transform='perspective(1100px) rotateY('+(x*4)+'deg) rotateX('+(-y*3)+'deg)';
  });
  wrap.addEventListener('mouseleave',function(){stageEl.style.transform='';});
}

/* occasion-filter */
function filterOcc(btn,tag){
  document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  var shown=0;
  document.querySelectorAll('#occGrid .occ-card').forEach(function(card){
    var tags=card.getAttribute('data-tags')||'';
    var match=(tag==='alles'||tags.split(' ').indexOf(tag)>-1);
    card.style.display=match?'':'none';
    if(match)shown++;
  });
  var empty=document.getElementById('occEmpty');
  if(empty)empty.style.display=shown?'none':'block';
}

/* contactformulier
   LET OP: vervang YOUR_ID door het Formspree-form-ID van info@autobedrijfdeheems.nl
   (formspree.io -> New form). Zonder geldig ID komt de aanvraag niet aan en
   krijgt de bezoeker het telefoonnummer te zien. */
var EP='https://formspree.io/f/YOUR_ID';
function sendForm(e){
  e.preventDefault();
  var btn=document.getElementById('submitBtn');
  btn.disabled=true;btn.textContent='Versturen…';
  fetch(EP,{method:'POST',headers:{Accept:'application/json'},body:new FormData(e.target)})
    .then(function(r){if(!r.ok)throw 0;document.getElementById('formBody').style.display='none';document.getElementById('ok').style.display='block';})
    .catch(function(){
      btn.disabled=false;btn.textContent='Verstuur aanvraag';
      var note=document.getElementById('formFail');
      if(!note){
        note=document.createElement('p');
        note.id='formFail';
        note.className='form-note';
        note.innerHTML='Verzenden lukte niet. Bel ons op <a href="tel:+31367505404">036 750 5404</a> of mail naar <a href="mailto:info@autobedrijfdeheems.nl">info@autobedrijfdeheems.nl</a>.';
        e.target.appendChild(note);
      }
    });
}
