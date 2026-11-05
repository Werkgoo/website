'use strict';
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const form=document.getElementById('candidateForm');
const cv=document.getElementById('cv');
const fileError=document.getElementById('fileError');
const uploadTitle=document.getElementById('uploadTitle');
const removeFile=document.getElementById('removeFile');
const uploadArea=cv?cv.closest('.upload-field'):null;
const firstStep=document.getElementById('cvStep');
const secondStep=document.getElementById('detailsStep');
const nextStep=document.getElementById('nextStep');
let currentStep=1;
const multistep=!!(form&&firstStep&&secondStep&&nextStep);
function showStep(step,focus=false){
 if(!multistep)return;document.getElementById('progressTrack').setAttribute('aria-valuenow',String(step));currentStep=step;firstStep.hidden=step!==1;secondStep.hidden=step!==2;
 document.getElementById('stepLabel').textContent='Stap '+step+' van 2';document.getElementById('stepName').textContent=step===1?'Je cv':'Je gegevens';document.getElementById('stepProgress').style.transform=step===1?'scaleX(.5)':'scaleX(1)';
 const file=cv.files[0];const summary=document.getElementById('fileSummary');summary.hidden=!file;document.getElementById('fileSummaryName').textContent=file?file.name:'';
 if(focus){const target=step===1?cv:form.querySelector('input[name="naam"]');target.focus({preventScroll:true});}
}
function fileMessage(message){if(fileError){fileError.textContent=message;fileError.hidden=!message;}if(cv){if(message)cv.setAttribute('aria-invalid','true');else cv.removeAttribute('aria-invalid');}}
function validFile(showError=false){
 if(!cv)return true;const file=cv.files[0];let message='';
 if(!file)message='Voeg je cv toe om verder te gaan.';
 else if(!['pdf','doc','docx'].includes(file.name.split('.').pop().toLowerCase()))message='Kies een PDF- of Word-bestand.';
 else if(file.size===0)message='Dit bestand is leeg. Kies een ander cv.';
 else if(file.size>7*1024*1024)message='Je cv is groter dan 7 MB. Kies een kleiner bestand.';
 const ok=!message;cv.setCustomValidity(message);fileMessage(showError?message:'');
 if(uploadTitle)uploadTitle.textContent=ok?file.name:'Kies je cv';
 if(removeFile)removeFile.hidden=!file;
 const choice=document.getElementById('uploadChoice');if(choice)choice.textContent=ok?'Bestand wijzigen':'Kies bestand';
 if(uploadArea){uploadArea.classList.toggle('has-file',ok);const use=uploadArea.querySelector('.upload-symbol use');if(use)use.setAttribute('href','/assets/icons.svg#'+(ok?'check-circle':'upload'));}
 return ok;
}
if(multistep){form.classList.add('is-multistep');document.getElementById('formStepper').hidden=false;nextStep.hidden=false;document.getElementById('backStep').hidden=false;showStep(1);nextStep.addEventListener('click',()=>{if(validFile(true))showStep(2,true);else cv.focus();});document.getElementById('backStep').addEventListener('click',()=>showStep(1,true));form.addEventListener('invalid',event=>{if(event.target===cv)showStep(1);else if(!secondStep.contains(event.target))return;else showStep(2);},true);}
if(cv){cv.addEventListener('change',()=>validFile(true));if(removeFile)removeFile.addEventListener('click',()=>{cv.value='';validFile(false);cv.focus();});}
if(uploadArea){['dragenter','dragover'].forEach(name=>uploadArea.addEventListener(name,e=>{e.preventDefault();uploadArea.classList.add('is-dragging');}));uploadArea.addEventListener('dragleave',e=>{if(!uploadArea.contains(e.relatedTarget))uploadArea.classList.remove('is-dragging');});uploadArea.addEventListener('drop',e=>{e.preventDefault();uploadArea.classList.remove('is-dragging');const files=e.dataTransfer.files;if(files.length!==1){fileMessage('Kies één cv per aanmelding.');return;}cv.files=files;validFile(true);});}
const sectorSelect=document.getElementById('vakgebied');document.querySelectorAll('[data-sector]').forEach(link=>link.addEventListener('click',()=>{if(sectorSelect)sectorSelect.value=link.dataset.sector;document.querySelectorAll('[data-sector]').forEach(card=>card.classList.toggle('is-selected',card===link));const note=document.getElementById('sectorChoice');if(note){note.hidden=false;note.textContent='Jouw vakgebied, '+link.dataset.sector+'.';}}));
document.querySelectorAll('form[data-netlify]').forEach(targetForm=>{
 const button=targetForm.querySelector('button[type="submit"],button:not([type])');const original=button?button.innerHTML:'';
 const error=document.createElement('p');error.className='field-error';error.setAttribute('role','alert');error.hidden=true;error.tabIndex=-1;targetForm.append(error);
 targetForm.addEventListener('submit',async e=>{
  e.preventDefault();if(targetForm===form&&!validFile(true)){showStep(1);cv.reportValidity();return;}
  if(targetForm===form&&multistep&&currentStep===1){showStep(2,true);return;}
  if(!targetForm.reportValidity())return;error.hidden=true;if(button){button.disabled=true;button.classList.add('is-loading');button.textContent='Bezig met versturen…';}
  try{const response=await fetch('/',{method:'POST',body:new FormData(targetForm)});if(!response.ok)throw Error('Submission rejected');window.location.assign(targetForm.getAttribute('action')||'/bedankt');}
  catch{error.textContent='Versturen is niet gelukt. Je gegevens blijven staan. Probeer opnieuw of mail naar info@werkgo.nl.';error.hidden=false;error.focus();if(button){button.disabled=false;button.classList.remove('is-loading');button.innerHTML=original;}}
 });window.addEventListener('pageshow',()=>{if(button){button.disabled=false;button.classList.remove('is-loading');button.innerHTML=original;}});
});
const mobileCta=document.getElementById('mobileCta');
const formZone=document.getElementById('aanmelden');
const heroAction=document.querySelector('.hero-content .button');
if(mobileCta&&formZone&&heroAction&&'IntersectionObserver'in window){
 let formVisible=false,heroVisible=true;
 const updateMobileCta=()=>{mobileCta.hidden=formVisible||heroVisible;};
 new IntersectionObserver(entries=>{formVisible=entries[0].isIntersecting;updateMobileCta();},{rootMargin:'0px 0px 0px 0px'}).observe(formZone);
 new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;updateMobileCta();}).observe(heroAction);
 updateMobileCta();
}
if(new URLSearchParams(window.location.search).get('type')==='cv'&&document.body.classList.contains('utility-page')){const heading=document.querySelector('.utility-main h1');const description=document.querySelector('.utility-main p');if(heading)heading.textContent='Je cv is verstuurd.';if(description)description.textContent='We bekijken je cv. Als we passend werk met je kunnen bespreken, nemen we contact met je op.';}

// Reveal one short benefit statement; leave all essential content visible.
if('IntersectionObserver'in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const words=document.querySelectorAll('.reveal-word');if(words.length){document.body.classList.add('motion-ready');const reveal=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}});},{rootMargin:'0px 0px -20% 0px',threshold:1});words.forEach((word,index)=>{word.style.transitionDelay=(index%5)*60+'ms';reveal.observe(word);});}}
if(form){form.querySelectorAll('input[required]:not([type="file"]):not([type="checkbox"])').forEach((input,index)=>{const help=document.createElement('span');help.className='input-error';help.id='input-error-'+index;help.hidden=true;input.parentElement.append(help);input.setAttribute('aria-describedby',help.id);const check=()=>{const invalid=!!input.value&&!input.validity.valid;help.hidden=!invalid;help.textContent=invalid?(input.type==='email'?'Vul een geldig e-mailadres in.':'Controleer dit veld.'):'';if(invalid)input.setAttribute('aria-invalid','true');else input.removeAttribute('aria-invalid');};input.addEventListener('blur',check);input.addEventListener('input',()=>{if(!help.hidden)check();});});}
