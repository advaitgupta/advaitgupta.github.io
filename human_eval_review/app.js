import {el, button, configureMedia, cleanupViewers, createImageViewer, createVideo} from './media.js?v=1';
import {reviewPdf} from './pdf.js?v=1';

const $ = s => document.querySelector(s);
let catalog, key, scores, imported=null, current=null, size=200, filter='all', tab='review';
const COLORS={'Web Agents':'#e2575c','Games':'#206feb','Egocentric Videos':'#4e9342','Robotics':'#b87b17','Spatial Planning':'#8653cc'};
const response=id=>imported?.samples.find(s=>s.id===id)?.response || null;
const gold=id=>key.answers[id].answer;
const outcome=id=>!imported?'no-response':!response(id)?'outside':!response(id).choice?'unanswered':response(id).choice===gold(id)?'correct':'incorrect';
const selection=()=>catalog.samples.filter(s=>size===200||s.in_100);
const filtered=()=>selection().filter(s=>filter==='all'||outcome(s.id)===filter);
const warn=message=>{$('#alert').textContent=message;$('#alert').hidden=!message;};
const percent=(n,d)=>d?`${(100*n/d).toFixed(2)}%`:'—';
const sample=id=>catalog.samples.find(s=>s.id===id);
const mediaUrl=url=>url?new URL(url,new URL('../human_eval/',location.href)).href:null;

function stats(list){
  const values=list.map(s=>outcome(s.id));
  const count=k=>values.filter(v=>v===k).length;
  return {selected:list.length,submitted:list.filter(s=>response(s.id)).length,correct:count('correct'),incorrect:count('incorrect'),unanswered:count('unanswered'),outside:count('outside'),answered:count('correct')+count('incorrect')};
}

function navigate(id){current=id;renderReview();}
function download(blob,name){const a=el('a',{href:URL.createObjectURL(blob),download:name});a.click();setTimeout(()=>URL.revokeObjectURL(a.href),10000);}
function reviewPayload(){
  return {schema_version:1,kind:'agentvqa-response-review',reviewed_at:new Date().toISOString(),study:catalog.metadata,
    session:imported?.session||null,summary:stats(selection()),source_export:imported,
    samples:selection().map(s=>({...s,correct_answer:gold(s.id),correct_text:s.options[gold(s.id).charCodeAt(0)-65],response:response(s.id),review_status:outcome(s.id)}))};
}

async function importFile(file){
  if(!file)return;
  try{
    if(file.size>20000000)throw new Error('The response file is too large.');
    const data=JSON.parse(await file.text());
    if(data.schema_version!==1||data.study?.catalog_sha256!==catalog.metadata.catalog_sha256)throw new Error('This file is not from the displayed study revision. No answers were imported.');
    if(![100,200].includes(data.session?.set_size)||!Array.isArray(data.samples))throw new Error('Invalid human-evaluation export.');
    const expected=catalog.samples.filter(s=>data.session.set_size===200||s.in_100),seen=new Set();
    for(const row of data.samples){
      const original=expected.find(s=>s.id===row.id);
      if(!original||seen.has(row.id))throw new Error('Unknown or duplicate question ID.');
      seen.add(row.id);
      for(const k of ['question','options','episode_goal','action_history','source_options','images','video'])if(JSON.stringify(row[k])!==JSON.stringify(original[k]))throw new Error(`Question or media does not match the fixed catalog: ${row.id}.`);
      const choice=row.response?.choice;
      if(choice!==null&&(!/^[A-Z]$/.test(choice)||choice.charCodeAt(0)-65>=original.options.length))throw new Error(`Invalid choice: ${row.id}.`);
      if(!row.response)throw new Error(`Missing response record: ${row.id}.`);
    }
    if(seen.size!==expected.length)throw new Error('The export does not contain the complete selected set.');
    imported=data;size=data.session.set_size;filter='all';current=expected[0].id;tab='review';warn('');render();
  }catch(error){warn(`Could not import: ${error.message}`);}
  $('#import-file').value='';
}

function render(){
  $('#review-tab').setAttribute('aria-current',String(tab==='review'));$('#models-tab').setAttribute('aria-current',String(tab==='models'));
  if(tab==='models')renderModels();else renderReview();
}

function renderReview(){
  cleanupViewers();
  const main=$('#app');main.replaceChildren();
  main.append(el('section',{class:'review-intro'},[el('h1',{text:'Human response review'}),el('p',{text:'Inspect the released correct answer alongside the participant’s choice, using the same questions, media, and exact coordinate markers.'})]));
  const importBox=el('div',{class:'import-box'},[el('div',{},[el('p',{text:imported?`Loaded: ${imported.session.participant_code} · ${imported.session.set_size} selected questions`:'Open the downloaded human-evaluation JSON to see the participant’s selections.'}),el('small',{text:'The file stays in this browser’s memory. It is not uploaded, and the original responses are never changed.'})]),button(imported?'Load another JSON':'Open response JSON',()=>$('#import-file').click(),'primary')]);
  main.append(importBox);
  const controls=el('div',{class:'review-tools'});
  const chooseSize=el('select',{id:'review-size',onchange:e=>{size=Number(e.target.value);current=null;renderReview();}},[100,200].map(n=>el('option',{value:n,text:`Fixed ${n}-question set`,selected:n===size})));
  const chooseFilter=el('select',{id:'review-filter',disabled:!imported,onchange:e=>{filter=e.target.value;current=null;renderReview();}},[['all','All questions'],['incorrect','Incorrect answers'],['correct','Correct answers'],['unanswered','Unanswered'],['outside','Not in submitted set']].map(([value,text])=>el('option',{value,text,selected:value===filter})));
  controls.append(el('label',{},[el('span',{text:'Question set'}),chooseSize]),el('label',{},[el('span',{text:'Show'}),chooseFilter]));
  const json=button('Download review JSON',()=>download(new Blob([JSON.stringify(reviewPayload(),null,2)],{type:'application/json'}),'agentvqa-reviewed-responses.json'));
  const pdf=button('Download review PDF',async()=>{pdf.disabled=true;pdf.textContent='Building PDF…';try{const blob=await reviewPdf(reviewPayload(),(n,total)=>pdf.textContent=`PDF ${n}/${total}`);download(blob,'agentvqa-reviewed-responses.pdf');}catch(e){warn(`PDF failed: ${e.message}. The JSON export remains available.`);}finally{pdf.disabled=false;pdf.textContent='Download review PDF';}});
  controls.append(json,pdf);main.append(controls);
  if(imported){
    const st=stats(selection());
    const values=[[st.correct,'correct'],[st.incorrect,'incorrect'],[st.unanswered,'unanswered'],[percent(st.correct,st.answered),'correct / answered'],[percent(st.correct,st.submitted),'correct / submitted']];
    if(st.outside)values.push([st.outside,'not in this export']);
    const cards=values.map(([n,label])=>el('div',{class:'review-stat'},[el('strong',{text:String(n)}),el('span',{text:label})]));
    main.append(el('div',{class:'review-summary'},cards));
  }
  else main.append(el('p',{class:'review-warning',text:'This is a post-evaluation answer-key view. Do not use it before completing an independent human evaluation.'}));
  const list=filtered();
  if(!list.length){main.append(el('div',{class:'no-results',text:'No questions match this filter. Choose another filter or question set.'}));return;}
  if(!list.some(s=>s.id===current))current=list[0].id;
  const s=sample(current),index=list.findIndex(x=>x.id===current);
  const domains=el('nav',{class:'domains','aria-label':'Domains'});
  for(const domain of catalog.metadata.domains){const group=list.filter(x=>x.domain===domain.name),b=button('',()=>navigate(group[0].id),'domain-button');b.disabled=!group.length;b.setAttribute('aria-current',String(s.domain===domain.name));b.append(el('span',{class:'domain-dot',style:`--domain-color:${COLORS[domain.name]}`}),el('span',{text:domain.name}),el('span',{class:'count',text:String(group.length)}));domains.append(b);}
  main.append(domains);
  const datasets=catalog.metadata.domains.find(d=>d.name===s.domain).datasets;
  const select=el('select',{id:'dataset-select',onchange:e=>navigate(list.find(x=>x.dataset===e.target.value).id)},datasets.map(name=>el('option',{value:name,text:name,selected:name===s.dataset,disabled:!list.some(x=>x.dataset===name)})));
  const numbers=el('nav',{class:'question-index','aria-label':'Questions in this dataset'});
  list.filter(x=>x.dataset===s.dataset).forEach(x=>{const n=selection().filter(y=>y.dataset===s.dataset).findIndex(y=>y.id===x.id)+1,b=button(String(n),()=>navigate(x.id),`index-button ${outcome(x.id)}`);b.dataset.sample=x.id;b.setAttribute('aria-current',String(x.id===current));b.setAttribute('aria-label',`${x.id}: ${outcome(x.id)}`);numbers.append(b);});
  main.append(el('div',{class:'datasetbar'},[el('label',{},[el('span',{text:'Dataset'}),select]),numbers]));
  const media=el('section',{class:'media-column','aria-label':'Question media'});
  if(s.images.length>1)media.append(el('p',{class:'multi-image-note',text:`${s.images.length} images in source order. Scroll to inspect all images.`}));
  s.images.forEach((m,i)=>media.append(createImageViewer(s,{...m,url:mediaUrl(m.url),preview_url:mediaUrl(m.preview_url)},i)));
  if(s.video)media.append(createVideo({...s,video:{...s.video,url:mediaUrl(s.video.url),playback_url:mediaUrl(s.video.playback_url)}}));
  const question=el('section',{class:'question-column','aria-label':'Question and answers'},[el('div',{class:'sample-heading'},[el('h2',{text:s.dataset}),el('span',{class:'sample-id',text:`ID ${s.id} · ${selection().findIndex(x=>x.id===s.id)+1}/${size}`})])]);
  for(const [label,value] of [['Episode Goal',s.episode_goal],['Action History',s.action_history]])if(value)question.append(el('section',{class:'context-block'},[el('h3',{text:label}),el('div',{class:'source-text',text:value})]));
  question.append(el('h3',{class:'question-label',text:'Question'}),el('div',{class:'source-text question-text',text:s.question}));
  const r=response(s.id),status=outcome(s.id),choice=r?.choice;
  question.append(el('div',{class:'answer-comparison'},[el('div',{},[el('small',{text:'Correct answer · dataset key'}),el('strong',{text:gold(s.id)})]),el('div',{},[el('small',{text:'Participant selected'}),el('strong',{text:choice||(status==='outside'?'Not submitted':imported?'Unanswered':'Load JSON')})])]));
  const options=el('div',{class:'options'});
  s.options.forEach((text,i)=>{const letter=String.fromCharCode(65+i),isGold=letter===gold(s.id),isChosen=letter===choice;const tags=el('div',{class:'option-tags'});if(isGold)tags.append(el('span',{class:'badge correct',text:'Correct answer'}));if(isChosen)tags.append(el('span',{class:`badge ${isGold?'correct':'incorrect'}`,text:'Participant selected'}));options.append(el('div',{class:`option review-option${isGold?' gold':''}${isChosen&&!isGold?' chosen-wrong':''}`,'data-letter':letter},[el('span',{class:'letter',text:letter}),el('div',{},[el('span',{class:'option-text',text}),tags])]));});
  question.append(options);
  if(r){question.append(el('h3',{class:'section-label',style:'margin-top:22px',text:'Participant comment / reasoning'}),el('div',{class:'review-comment',text:r.comment||'No comment recorded.'}));if(r.flagged)question.append(el('p',{class:'review-warning',text:'The participant flagged this question.'}));if(r.media_errors?.length)question.append(el('p',{class:'review-warning',text:`Media errors recorded during evaluation: ${r.media_errors.map(e=>e.message).join('; ')}`}));}
  const prev=button('← Previous',()=>navigate(list[index-1].id));prev.disabled=index===0;
  const next=button('Next →',()=>navigate(list[index+1].id),'primary');next.disabled=index===list.length-1;
  question.append(el('div',{class:'navigation'},[prev,next]));main.append(el('div',{class:'workspace'},[media,question]));
}

let scoreScope='fixed200',scoreCommon=false;
function renderModels(){
  cleanupViewers();const main=$('#app');main.replaceChildren();
  main.append(el('h1',{text:'Models on the human-evaluation questions'}),el('p',{class:'score-note score-description',text:'Saved predictions from evals1, matched to the fixed human-evaluation questions and answer choices. No new inference calls were made.'}));
  const scope=el('select',{id:'score-scope',onchange:e=>{scoreScope=e.target.value;renderModels();}},[['fixed200','Fixed 200 questions'],['fixed100','Nested 100 questions']].map(([value,text])=>el('option',{value,text,selected:scoreScope===value})));
  const mode=el('select',{id:'score-mode',onchange:e=>{scoreCommon=e.target.value==='common';renderModels();}},[['available','Each model’s matching saved predictions'],['common','Same matched questions for all 22 models']].map(([value,text])=>el('option',{value,text,selected:(value==='common')===scoreCommon})));
  main.append(el('div',{class:'model-controls'},[el('label',{},[el('span',{text:'Question set'}),scope]),el('label',{},[el('span',{text:'Comparison basis'}),mode])]));
  const all=scores.scopes[scoreScope],overallKey=scoreCommon?'common_all_models':'overall',domainKey=scoreCommon?'common_domains':'domains';
  const rows=[...all].sort((a,b)=>(b[overallKey].accuracy??-1)-(a[overallKey].accuracy??-1));
  const groups=['Overall',...scores.domains];
  const value=(r,g)=>g==='Overall'?r[overallKey]:r[domainKey][g];
  const max={};for(const g of groups)max[g]=Math.max(...rows.map(r=>value(r,g).accuracy??-1));
  main.append(el('p',{class:'review-warning',text:scoreCommon?scores.common_policy:'Coverage differs because some historical predictions are missing, invalid, or belong to an older question. These percentages are not complete 200-question results. Green cells show the highest available percentage, not necessarily a like-for-like winner.'}));
  const table=el('table',{class:'score-table'}),head=el('thead',{},[el('tr',{},[el('th',{text:'Model'}),...groups.map(g=>el('th',{text:g}))])]),body=el('tbody');
  for(const row of rows)body.append(el('tr',{},[el('td',{text:row.model}),...groups.map(g=>{const v=value(row,g);return el('td',{class:v.accuracy!==null&&v.accuracy===max[g]?'best':''},[el('span',{text:v.accuracy===null?'—':`${v.accuracy.toFixed(2)}%`}),el('small',{text:`${v.correct}/${v.valid} valid · ${v.selected} selected`})]);})]));
  table.append(head,body);main.append(el('div',{class:'table-scroll'},[table]),el('p',{class:'score-note',text:'Each cell shows correct / valid predictions. Unevaluated questions are not counted as wrong or silently counted as completed.'}));
  if(scoreCommon){const list=el('div',{class:'review-winners'});for(const g of groups){const best=rows.filter(r=>value(r,g).accuracy!==null&&value(r,g).accuracy===max[g]);list.append(el('p',{},[el('strong',{text:`${g}: `}),el('span',{text:best.length?`${best.map(r=>r.model).join(' / ')} — ${max[g].toFixed(2)}% (${value(best[0],g).correct}/${value(best[0],g).valid})`:'No common evaluated questions'})]));}main.append(list);}
  main.append(el('p',{class:'score-note',text:scores.provenance}),button('Download model scores JSON',()=>download(new Blob([JSON.stringify(scores,null,2)],{type:'application/json'}),'agentvqa-human-set-model-scores.json')));
}

async function boot(){
  [catalog,key,scores]=await Promise.all(['../human_eval/catalog.json','answers.json','model_scores.json'].map(async url=>{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${url}: HTTP ${r.status}`);return r.json();}));
  if(catalog.metadata.catalog_sha256!==key.catalog_sha256||scores.catalog_sha256!==key.catalog_sha256)throw new Error('The question catalog and answer key do not match.');
  if(catalog.samples.length!==200||catalog.samples.filter(s=>s.in_100).length!==100)throw new Error('Invalid fixed question set.');
  configureMedia(gold,id=>response(id)?.choice||null);
  $('#import-file').addEventListener('change',e=>importFile(e.target.files[0]));
  $('#review-tab').addEventListener('click',()=>{tab='review';render();});$('#models-tab').addEventListener('click',()=>{tab='models';render();});
  $('#close-image').addEventListener('click',()=>$('#image-dialog').close());$('#image-dialog').addEventListener('close',()=>$('#image-dialog-content').replaceChildren());
  globalThis.AgentVQAReview={catalog,key,scores,importFile,navigate,payload:reviewPayload,stats:()=>stats(selection()),reviewPdf:()=>reviewPdf(reviewPayload())};
  render();
}
boot().catch(error=>{warn(`The review could not load: ${error.message}`);$('#app').replaceChildren();console.error(error);});
