document.documentElement.classList.add('js');

var header=document.getElementById('header');
if(header){window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>20);});}

var navToggle=document.getElementById('navToggle'),navClose=document.getElementById('navClose'),mnav=document.getElementById('mnav');
if(navToggle&&mnav){navToggle.addEventListener('click',function(){mnav.classList.add('open');});}
if(navClose&&mnav){navClose.addEventListener('click',function(){mnav.classList.remove('open');});}
function closeMnav(){if(mnav)mnav.classList.remove('open');}

var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');obs.unobserve(e.target);}});},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});


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
    return {open:false,text:'Gesloten',detail:'vandaag open vanaf '+hhmm(today[0])};
  }
  var nxt=nextOpening(now.day);
  if(!nxt)return {open:false,text:'Gesloten',detail:''};
  var when=nxt.offset===1?'morgen':DAY_NAMES[nxt.day];
  return {open:false,text:'Gesloten',detail:when+' open vanaf '+hhmm(nxt.open)};
}

function paintStatus(){
  var st=openState();
  document.querySelectorAll('[data-status]').forEach(function(el){
    el.classList.remove('is-open','is-closed');
    el.classList.add(st.open?'is-open':'is-closed');
    el.innerHTML='<span class="dot"></span><b>'+st.text+'</b>'+(st.detail?' — '+st.detail:'');
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
   Afspraakformulier — vervang YOUR_ID door het Formspree-form-ID.
   ============================================================ */
var EP='https://formspree.io/f/YOUR_ID';
function sendForm(e){
  e.preventDefault();
  var btn=document.getElementById('submitBtn');
  btn.disabled=true;btn.textContent='Versturen…';
  fetch(EP,{method:'POST',headers:{Accept:'application/json'},body:new FormData(e.target)})
    .then(function(r){if(!r.ok)throw 0;document.getElementById('formBody').style.display='none';document.getElementById('ok').style.display='block';})
    .catch(function(){btn.disabled=false;btn.textContent='Verstuur aanvraag';alert('Er ging iets mis. Bel of app ons op 06 85422395.');});
}
