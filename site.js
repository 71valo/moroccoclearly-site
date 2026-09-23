'use strict';
const menu=document.querySelector('.menu');
menu?.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));document.querySelector('nav').classList.toggle('open',!expanded);});
function quoteTotal(price,basis,travelers,extras){return Math.round((price*(basis==='person'?travelers:1)+extras)*100)/100;}
const form=document.querySelector('#quote-form');
form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const n=Number(document.querySelector('#travelers').value),currency=document.querySelector('#currency').value;const vals=['A','B'].map(q=>quoteTotal(Number(document.querySelector('#price-'+q).value),document.querySelector('#basis-'+q).value,n,Number(document.querySelector('#extras-'+q).value)));if(!vals.every(Number.isFinite))return;const fmt=v=>new Intl.NumberFormat('en',{style:'currency',currency}).format(v);const result=document.querySelector('#quote-result');result.replaceChildren();const heading=document.createElement('strong');const difference=Math.round(Math.abs(vals[0]-vals[1])*100)/100;heading.textContent=difference===0?'Both group totals are equal.':`Quote ${vals[0]<vals[1]?'A':'B'} is ${fmt(difference)} lower.`;result.append(heading);vals.forEach((v,i)=>{const p=document.createElement('p');p.textContent=`Quote ${i===0?'A':'B'}: ${fmt(v)} total · ${fmt(v/n)} per traveler`;result.append(p);});const note=document.createElement('p');note.textContent='Compare quality and written terms too. A lower total does not establish a fair market price.';result.append(note);result.hidden=false;});
form?.addEventListener('input',()=>{document.querySelector('#quote-result').hidden=true;});
document.querySelector('#copy-request')?.addEventListener('click',async()=>{const text=document.querySelector('#request-template').textContent;try{await navigator.clipboard.writeText(text);document.querySelector('#copy-status').textContent='Copied. Replace the brackets with your trip details.';}catch{document.querySelector('#copy-status').textContent='Copy is unavailable in this browser. Select and copy the message beside this button.';}});
const checks=[...document.querySelectorAll('.trip-check')];function updateProgress(){if(!checks.length)return;const count=checks.filter(c=>c.checked).length;document.querySelector('#progress').value=count;document.querySelector('#progress-text').textContent=`${count} of ${checks.length} ready`;}
checks.forEach(c=>c.addEventListener('change',updateProgress));
document.querySelector('#reset-list')?.addEventListener('click',()=>{checks.forEach(c=>c.checked=false);updateProgress();});
document.querySelector('#print-list')?.addEventListener('click',()=>window.print());
updateProgress();

const tourForm=document.querySelector('#tour-form');
tourForm?.addEventListener('input',()=>{document.querySelector('#tour-result').hidden=true;});
tourForm?.addEventListener('submit',event=>{
 event.preventDefault();if(!tourForm.reportValidity())return;
 const get=id=>document.getElementById(id).value.trim();
 const people=Number(get('tour-travelers')),currency=get('tour-currency');
 const money=v=>new Intl.NumberFormat('en',{style:'currency',currency}).format(v);
 const offers=['A','B'].map(q=>({q,name:get('tour-name-'+q)||'Offer '+q,total:quoteTotal(Number(get('tour-price-'+q)),get('tour-basis-'+q),people,Number(get('tour-extras-'+q))),included:get('tour-included-'+q),pace:get('tour-pace-'+q),cancel:get('tour-cancel-'+q)}));
 if(!offers.every(o=>Number.isFinite(o.total)))return;
 const result=document.querySelector('#tour-result');result.replaceChildren();
 const add=(tag,text,parent=result)=>{const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;};
 add('h2','Your comparison');
 const priorities=get('tour-priorities');if(priorities)add('p','Your priorities: '+priorities);
 const grid=document.createElement('div');grid.className='tour-columns';result.append(grid);
 for(const o of offers){const panel=document.createElement('article');panel.className='card';grid.append(panel);add('h3',o.name,panel);add('strong',money(o.total)+' for your group',panel);add('p',money(o.total/people)+' per traveler · known extras included',panel);for(const [k,title] of [['included','Inclusions'],['pace','Pace & duration'],['cancel','Cancellation & payment']]){add('h4',title,panel);add('p',o[k]||'Not supplied — confirm with the operator.',panel);}}
 const difference=Math.round(Math.abs(offers[0].total-offers[1].total)*100)/100;
 add('h3',difference===0?'The entered totals are equal.':`${offers[0].total<offers[1].total?offers[0].name:offers[1].name} is ${money(difference)} lower.`);
 add('p','These totals include only the costs entered. They do not establish value, quality or a fair market price. Check whether the offers include equivalent services.');
 add('h3','Questions to resolve before booking');
 const list=document.createElement('ul');result.append(list);
 for(const o of offers){const missing=[['included','what meals, transport and accommodation are included'],['pace','the daily itinerary, travel time and activity pace'],['cancel','the payment and cancellation terms']].filter(([k])=>!o[k]);for(const [,label] of missing)add('li',o.name+': confirm '+label+'.',list);}
 if(!list.children.length)add('li','You filled in all term fields. Confirm their accuracy and compare them with your priorities; this tool has not verified or interpreted them.',list);
 add('h3','A message you can adapt');
 add('blockquote','Before I decide, could you confirm the total for our group, all inclusions and extra charges, the daily itinerary, accommodation arrangements, and cancellation terms? '+(priorities?'Our priorities are: '+priorities+'. ':'')+'Please highlight anything that may not fit these needs.');
 const print=add('button','Print or save comparison');print.type='button';print.className='button';print.addEventListener('click',()=>window.print());
 result.hidden=false;result.scrollIntoView({behavior:'smooth',block:'start'});
});
