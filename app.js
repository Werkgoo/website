'use strict';
const year=document.getElementById('year');
if(year)year.textContent=new Date().getFullYear();
const menuBtn=document.getElementById('menuBtn');
const navLinks=document.getElementById('navLinks');
function closeMenu(){if(!menuBtn||!navLinks)return;navLinks.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Open menu');}
if(menuBtn&&navLinks){menuBtn.addEventListener('click',()=>{const open=menuBtn.getAttribute('aria-expanded')!=='true';menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Sluit menu':'Open menu');navLinks.classList.toggle('open',open);});navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navLinks.classList.contains('open')){closeMenu();menuBtn.focus();}});}
const sectorSelect=document.getElementById('vakgebied');
document.querySelectorAll('[data-sector]').forEach(a=>a.addEventListener('click',()=>{if(sectorSelect)sectorSelect.value=a.dataset.sector;}));
const cv=document.getElementById('cv');
const fileError=document.getElementById('fileError');
const uploadTitle=document.getElementById('uploadTitle');
const removeFile=document.getElementById('removeFile');
function validFile(){if(!cv)return true;const file=cv.files[0];const ok=!file||(['pdf','doc','docx'].includes(file.name.split('.').pop().toLowerCase())&&file.size>0&&file.size<=7*1024*1024);cv.setCustomValidity(ok?'':'Gebruik een PDF of Word-bestand van maximaal 7 MB.');if(fileError)fileError.hidden=ok;if(uploadTitle)uploadTitle.textContent=file&&ok?file.name:'Voeg je cv toe, optioneel';if(removeFile)removeFile.hidden=!file;return ok;}
if(cv){cv.addEventListener('change',validFile);if(removeFile)removeFile.addEventListener('click',()=>{cv.value='';validFile();cv.focus();});}
// Show success only after the hosting provider accepts the submission.
document.querySelectorAll('form[data-netlify]').forEach(form=>{
 const button=form.querySelector('button[type="submit"],button:not([type])');
 const original=button?button.innerHTML:'';
 const error=document.createElement('p');error.className='field-error';error.setAttribute('role','alert');error.hidden=true;form.append(error);
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(form.id==='candidateForm'&&!validFile()){cv.reportValidity();return;}if(!form.reportValidity())return;
  error.hidden=true;if(button){button.disabled=true;button.textContent='Bezig met versturen…';}
  try{
   const data=new FormData(form);if(form.id==='candidateForm'&&cv&&!cv.files.length)data.delete('cv');
   const response=await fetch('/',{method:'POST',body:data});
   if(!response.ok)throw new Error('Submission rejected');
   window.location.assign(form.getAttribute('action')||'/bedankt');
  }catch{
   error.textContent='Versturen is niet gelukt. Je gegevens staan nog in het formulier. Probeer het opnieuw of mail naar info@werkgo.nl.';error.hidden=false;
   if(button){button.disabled=false;button.innerHTML=original;}
  }
 });
 window.addEventListener('pageshow',()=>{if(button){button.disabled=false;button.innerHTML=original;}});
});
const mobileCta=document.getElementById('mobileCta');
const formZone=document.getElementById('aanmelden');
if(mobileCta&&formZone&&'IntersectionObserver'in window){new IntersectionObserver(entries=>{mobileCta.hidden=entries[0].isIntersecting;},{rootMargin:'-80px 0px -10% 0px'}).observe(formZone);}
