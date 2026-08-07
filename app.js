document.documentElement.classList.add('js');

var header=document.getElementById('header');
if(header){window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>20);});}

var navToggle=document.getElementById('navToggle'),navClose=document.getElementById('navClose'),mnav=document.getElementById('mnav');
if(navToggle&&mnav){navToggle.addEventListener('click',function(){mnav.classList.add('open');});}
if(navClose&&mnav){navClose.addEventListener('click',function(){mnav.classList.remove('open');});}
function closeMnav(){if(mnav)mnav.classList.remove('open');}

/* Onthullen tijdens het scrollen. Met een vangnet: wat al bijna in beeld
   staat komt direct, alles is uiterlijk na 8 seconden zichtbaar, en bij
   afdrukken klapt alles open. Inhoud blijft dus nooit onzichtbaar hangen. */
(function(){
  var els=[].slice.call(document.querySelectorAll('.reveal'));
  if(!els.length)return;
  function toon(el){el.classList.add('on');}
  if(!('IntersectionObserver' in window)){els.forEach(toon);return;}
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){toon(e.target);obs.unobserve(e.target);}});
  },{threshold:0.12});
  els.forEach(function(el){
    if(el.getBoundingClientRect().top<window.innerHeight*1.25){toon(el);return;}
    obs.observe(el);
  });
  setTimeout(function(){els.forEach(toon);},8000);
  window.addEventListener('beforeprint',function(){els.forEach(toon);});
})();


/* scroll progress bar */
var pbar=document.createElement('div');pbar.className='pbar';pbar.innerHTML='<i></i>';document.body.appendChild(pbar);
var pfill=pbar.firstChild;
window.addEventListener('scroll',function(){
  var h=document.documentElement.scrollHeight-window.innerHeight;
  pfill.style.width=(h>0?(window.scrollY/h*100):0)+'%';
},{passive:true});

/* ============================================================
   Openingstijden — live status en markering van vandaag.
   Index 0 = zondag, null = gesloten. Uren als [open, dicht].
   ============================================================ */
var OPENING=[null,[11,21],[11,21],[11,21],[11,22],[10,22],[10,22]];
var DAY_NAMES=['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];

/* Klok van de zaak, niet van de bezoeker — anders klopt de status in het buitenland niet. */
function shopNow(){
  try{
    var parts={};
    new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Amsterdam',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false})
      .formatToParts(new Date()).forEach(function(p){parts[p.type]=p.value;});
    var map={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
    var d=map[parts.weekday], h=parseInt(parts.hour,10)%24, m=parseInt(parts.minute,10);
    if(d===undefined||isNaN(h)||isNaN(m))throw 0;
    return {day:d,minutes:h*60+m};
  }catch(e){
    var n=new Date();
    return {day:n.getDay(),minutes:n.getHours()*60+n.getMinutes()};
  }
}

function hhmm(h){return (h<10?'0':'')+h+':00';}

function nextOpening(fromDay){
  for(var i=1;i<=7;i++){
    var d=(fromDay+i)%7;
    if(OPENING[d])return {day:d,open:OPENING[d][0],offset:i};
  }
  return null;
}

function openState(){
  var now=shopNow(), today=OPENING[now.day];
  if(today&&now.minutes>=today[0]*60&&now.minutes<today[1]*60){
    return {open:true,text:'Nu open',detail:'tot '+hhmm(today[1])};
  }
  if(today&&now.minutes<today[0]*60){
    return {open:false,text:'Gesloten',detail:'opent '+hhmm(today[0])};
  }
  var nxt=nextOpening(now.day);
  if(!nxt)return {open:false,text:'Gesloten',detail:''};
  var when=nxt.offset===1?'morgen':DAY_NAMES[nxt.day];
  return {open:false,text:'Gesloten',detail:when+' vanaf '+hhmm(nxt.open)};
}

function paintStatus(){
  var st=openState();
  document.querySelectorAll('[data-status]').forEach(function(el){
    el.classList.remove('is-open','is-closed');
    el.classList.add(st.open?'is-open':'is-closed');
    el.innerHTML='<span class="dot"></span><b>'+st.text+'</b>'+(st.detail?' · '+st.detail:'');
  });
}

function paintToday(){
  var d=shopNow().day;
  document.querySelectorAll('[data-day]').forEach(function(el){
    el.classList.toggle('is-today',parseInt(el.getAttribute('data-day'),10)===d);
  });
}

paintStatus();paintToday();
setInterval(function(){paintStatus();paintToday();},60000);

/* ============================================================
   WhatsApp — nummer en bericht staan hier op één plek.
   Het nummer is internationaal zonder + en zonder de 0 van 06:
   06 85422395 wordt 31685422395.
   ============================================================ */
var WA_NUMBER='31685422395';
var WA_TEXT='Hoi! Ik wil graag een afspraak maken bij Barber Achie.';
function waLink(){return 'https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(WA_TEXT);}

/* De links in de HTML werken ook zonder JS; hier komt het bericht erbij. */
document.querySelectorAll('a[data-wa]').forEach(function(a){
  a.href=waLink();
  a.target='_blank';
  a.rel='noopener noreferrer';
});

/* Zwevende knop: verschijnt zodra de bezoeker voorbij de hero is. */
(function(){
  var a=document.createElement('a');
  a.className='wa-float';
  a.href=waLink();
  a.target='_blank';
  a.rel='noopener noreferrer';
  a.setAttribute('aria-label','Stuur ons een WhatsApp-bericht');
  a.setAttribute('data-label','App ons');
  a.innerHTML='<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14 0-.31-.01-.47-.01-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z"/></svg>';
  document.body.appendChild(a);
  function toggle(){a.classList.toggle('show',window.scrollY>420);}
  window.addEventListener('scroll',toggle,{passive:true});
  toggle();
})();

/* ============================================================
   Afspraakformulier.
   Het endpoint staat in het action-attribuut van het formulier in de HTML,
   zodat het ook zonder JavaScript werkt. Vervang daar YOUR_ID door het
   Formspree-form-ID.
   ============================================================ */
function sendForm(e){
  var form=e.target;
  var ep=form.getAttribute('action');
  if(!ep||ep.indexOf('YOUR_ID')!==-1){
    e.preventDefault();
    alert('Het formulier is nog niet gekoppeld. Bel of app ons op 06 85422395.');
    return;
  }
  e.preventDefault();
  var btn=document.getElementById('submitBtn');
  btn.disabled=true;btn.textContent='Versturen…';
  fetch(ep,{method:'POST',headers:{Accept:'application/json'},body:new FormData(form)})
    .then(function(r){if(!r.ok)throw 0;document.getElementById('formBody').style.display='none';document.getElementById('ok').style.display='block';})
    .catch(function(){btn.disabled=false;btn.textContent='Verstuur aanvraag';alert('Er ging iets mis. Bel of app ons op 06 85422395.');});
}

/* ============================================================
   Navigatie volgt de sectie waar de bezoeker is (het is één pagina).
   ============================================================ */
(function(){
  var links=[].slice.call(document.querySelectorAll('nav a[href^="#"]'));
  if(!links.length||!('IntersectionObserver' in window))return;
  var doelen=links.map(function(a){return document.querySelector(a.getAttribute('href'));}).filter(Boolean);
  var spy=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting)return;
      links.forEach(function(a){
        a.classList.toggle('active',a.getAttribute('href')==='#'+en.target.id);
      });
    });
  },{rootMargin:'-45% 0px -50% 0px'});
  doelen.forEach(function(d){spy.observe(d);});
})();
