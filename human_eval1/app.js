import { instructionsPdf, responsePdf } from './pdf.js?v=2';

const $ = selector => document.querySelector(selector);
const el = (tag, props = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'text') node.textContent = value;
    else if (key === 'class') node.className = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else if (key in node && !key.startsWith('aria')) node[key] = value;
    else node.setAttribute(key, value);
  }
  node.append(...children);
  return node;
};
const button = (text, action, className = '') => el('button', { text, onclick: action, class: className, type: 'button' });
const COLORS = { 'Web Agents': '#e2575c', 'Games': '#206feb', 'Egocentric Videos': '#4e9342', 'Robotics': '#b87b17', 'Spatial Planning': '#8653cc' };
let catalog, instructions, session, active = false, lastTick = performance.now(), storageOkay = true, exportFiles = null;
let key, currentViewerCleanup = [];
const alert = message => { $('#alert').textContent = message; $('#alert').hidden = !message; };
const currentSamples = () => catalog.samples.filter(sample => session.set_size === 200 || sample.in_100);
const sampleById = id => catalog.samples.find(s => s.id === id);
const blankResponse = () => ({ choice: null, comment: '', flagged: false, visits: 0, visible_ms: 0, zoom_events: 0, video_events: 0, choice_changes: 0, media_errors: [], first_viewed_at: null, updated_at: null });
const responseFor = id => session.responses[id] ||= blankResponse();
const previousRevision = digest => (catalog.metadata.selection_replacements || []).find(r => r.previous_catalog_sha256 === digest);

function cleanResponse(raw, optionCount, id) {
  const letters = Array.from({length: optionCount}, (_, i) => String.fromCharCode(65 + i));
  if (raw.choice !== null && !letters.includes(raw.choice)) throw new Error(`Invalid answer for ${id}.`);
  const response = blankResponse();
  Object.assign(response, {choice: raw.choice, comment: String(raw.comment || '').slice(0, 10000), flagged: !!raw.flagged, first_viewed_at: typeof raw.first_viewed_at === 'string' ? raw.first_viewed_at : null, updated_at: typeof raw.updated_at === 'string' ? raw.updated_at : null});
  for (const name of ['visits', 'visible_ms', 'zoom_events', 'video_events', 'choice_changes']) response[name] = Number.isFinite(raw[name]) ? Math.max(0, raw[name]) : 0;
  response.media_errors = Array.isArray(raw.media_errors) ? raw.media_errors.filter(e => typeof e?.message === 'string').slice(0, 50) : [];
  return response;
}

function migrateSession(stored, revision) {
  const migrated = structuredClone(stored);
  migrated.retired_responses ||= [];
  if (migrated.responses[revision.removed_id]) migrated.retired_responses.push({id: revision.removed_id, catalog_sha256: revision.previous_catalog_sha256, response: migrated.responses[revision.removed_id]});
  delete migrated.responses[revision.removed_id];
  migrated.responses[revision.added_id] = blankResponse();
  if (migrated.current_id === revision.removed_id) migrated.current_id = revision.added_id;
  migrated.catalog_sha256 = catalog.metadata.catalog_sha256;
  migrated.migrated_from_catalog = revision.previous_catalog_sha256;
  return migrated;
}

function save() {
  session.updated_at = new Date().toISOString();
  try {
    localStorage.setItem(key, JSON.stringify(session));
    storageOkay = true;
    $('#save-status').textContent = 'Saved on this device';
  } catch {
    storageOkay = false;
    $('#save-status').textContent = 'Not saved · download a backup';
    alert('Browser storage is unavailable or full. Your answers are currently in memory only. Download a JSON backup before leaving this page.');
  }
}

function tick() {
  const now = performance.now();
  if (active && !document.hidden && session?.current_id) responseFor(session.current_id).visible_ms += Math.max(0, Math.min(60000, now - lastTick));
  lastTick = now;
}

function summary(samples = currentSamples()) {
  return { selected: samples.length, answered: samples.filter(s => responseFor(s.id).choice).length, unanswered: samples.filter(s => !responseFor(s.id).choice).length, flagged: samples.filter(s => responseFor(s.id).flagged).length };
}

function payload() {
  tick();
  return {
    schema_version: 1, exported_at: new Date().toISOString(), study: catalog.metadata,
    session: { id: session.id, participant_code: session.participant_code, prior_exposure: session.prior_exposure, set_size: session.set_size, started_at: session.started_at, updated_at: session.updated_at, current_id: session.current_id, storage_available: storageOkay, instructions_version: instructions.version, migrated_from_catalog: session.migrated_from_catalog || null },
    retired_responses: structuredClone(session.retired_responses || []),
    summary: summary(), samples: currentSamples().map(sample => ({ ...sample, response: structuredClone(responseFor(sample.id)) })),
  };
}

function fileStem() { return `agentvqa-human1-${session.participant_code.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 45)}-${session.set_size}-${session.id.slice(0, 8)}`; }
function download(blob, name) {
  const url = URL.createObjectURL(blob), a = el('a', { href: url, download: name });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function downloadJson() {
  const data = payload(); save();
  download(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `${fileStem()}.json`);
}

function instructionsContent() {
  return el('div', { class: 'instructions' }, instructions.sections.map(section => el('section', {}, [el('h3', { text: section.title }), ...section.paragraphs.map(text => el('p', { text }))])));
}

function showStart() {
  tick(); active = false; cleanupViewers();
  const main = $('#app'); main.replaceChildren();
  const start = el('div', { class: 'start' });
  start.append(el('p', { class: 'eyebrow', text: 'Independent human assessment' }), el('h1', { text: 'How well can we understand an agent’s world?' }), el('p', { class: 'lead', text: 'Read a question, inspect its images or video, and choose the best answer. Your set is fixed, balanced across five domains, and ready to resume whenever you return.' }));
  const setup = el('div', { class: 'panel' });
  if (session?.started_at) setup.append(el('div', { class: 'resume-box', text: `Saved session: ${session.participant_code} · ${Object.values(session.responses).filter(r => r.choice).length} answers stored. Starting again here resumes the same session.` }));
  setup.append(el('h2', { text: 'Choose your question set' }));
  const sets = el('div', { class: 'set-choices' });
  for (const count of [100, 200]) sets.append(el('label', { class: 'set-choice' }, [el('input', { type: 'radio', name: 'set-size', value: count, checked: count === (session?.set_size || 200) }), el('strong', { text: String(count) }), el('span', { text: `questions · ${count / 5} per domain` }), el('span', { text: count === 100 ? 'The fixed core set' : 'The core set + 100 more' })]));
  setup.append(sets, el('p', { class: 'muted', text: 'The same questions appear every time. Switching to 200 keeps your existing 100-question answers.' }));
  const code = el('input', { type: 'text', id: 'participant-code', maxLength: 60, value: session?.participant_code || `P-${crypto.randomUUID().slice(0, 6)}`, autocomplete: 'off' });
  setup.append(el('label', { class: 'field' }, [el('span', { text: 'Participant code or alias' }), code, el('small', { text: 'Use a code, not your full name or sensitive personal information.' })]));
  const exposure = el('select', { id: 'prior-exposure' }, [el('option', { value: '', text: 'Choose one…' }), el('option', { value: 'no', text: 'No' }), el('option', { value: 'yes', text: 'Yes' }), el('option', { value: 'unsure', text: 'Not sure' })]);
  exposure.value = session?.prior_exposure || '';
  setup.append(el('label', { class: 'field' }, [el('span', { text: 'Have you seen or helped curate these questions before?' }), exposure]));
  const check = el('input', { type: 'checkbox', id: 'read-instructions' });
  setup.append(el('label', { class: 'checkline' }, [check, el('span', { text: 'I have read the instructions and will answer independently without AI, external sources, or an answer key.' })]));
  const startButton = button(session?.started_at ? 'Resume evaluation →' : 'Start evaluation →', () => {
    if (!code.value.trim()) { code.focus(); return; }
    if (!exposure.value) { exposure.focus(); return; }
    if (!check.checked) { check.focus(); return; }
    const size = Number($('input[name="set-size"]:checked').value);
    session ||= { id: crypto.randomUUID(), responses: {}, started_at: new Date().toISOString() };
    Object.assign(session, { participant_code: code.value.trim(), prior_exposure: exposure.value, set_size: size, catalog_sha256: catalog.metadata.catalog_sha256 });
    const samples = currentSamples();
    if (!samples.some(s => s.id === session.current_id)) session.current_id = samples.find(s => !responseFor(s.id).choice)?.id || samples[0].id;
    save(); active = true; visit(session.current_id); renderEvaluation(); window.scrollTo(0, 0);
  }, 'primary');
  setup.append(el('div', { class: 'actions' }, [startButton, button('Import JSON backup', () => $('#import-file').click())]));
  if (session) setup.append(el('div', { class: 'actions' }, [button('Download saved answers', downloadJson, 'quiet'), button('Start a new participant', () => {
    if (confirm('Start a separate participant session? Download your current JSON first. This clears the saved session in this browser, but not any files you have downloaded.')) { localStorage.removeItem(key); for (const revision of catalog.metadata.selection_replacements || []) localStorage.removeItem(`agentvqa-human1:${revision.previous_catalog_sha256}`); session = null; showStart(); }
  }, 'quiet')]));
  const guide = el('div', { class: 'panel soft instructions' }, [el('h2', { text: 'Before you begin' }), el('p', { text: 'Choose the single best option. Read the full question and any goal or action history. You may zoom images, inspect exact coordinate points, and replay videos.' }), el('ul', {}, [el('li', { text: 'Work independently. No AI tools, web searches, or answer keys.' }), el('li', { text: 'Answers are not graded on-screen. Take breaks and revisit any question.' }), el('li', { text: 'Add optional reasoning or flag unclear items. You may leave an item unanswered.' }), el('li', { text: 'Progress stays in this browser. Download a backup if you change devices.' }), el('li', { text: 'At the end, download PDF + JSON and email the JSON to the researcher. Nothing is submitted automatically.' })]), el('div', { class: 'actions' }, [button('Read full instructions', () => $('#help-dialog').showModal()), el('a', { class: 'button', href: 'instructions.pdf', download: '', text: 'Instructions PDF ↓' })]), el('p', { class: 'small-note', text: 'Participation is voluntary. Use an alias. Your responses and viewing-action counts are saved locally and included in your exports. Contact: advaitgupta@ymail.com.' })]);
  guide.insertBefore(el('p', {text: 'Scroll through the page to check every image and all context. Images start fully fitted; after zooming in, pan or scroll to inspect the rest. Some coordinate choices are hard negatives just outside the target—check the exact black-dot center carefully.'}), guide.querySelector('.actions'));
  start.append(el('div', { class: 'intro-grid' }, [setup, guide]), el('section', {class:'panel full-instructions'}, [el('h2',{text:'Full participant instructions'}), instructionsContent()]), el('footer', { class: 'footer', text: `AgentVQA human study · ${catalog.metadata.study_id} · 23 source datasets · No answer key or correctness feedback is provided in this interface.` }));
  main.append(start);
}

function visit(id) {
  tick(); session.current_id = id; lastTick = performance.now();
  const response = responseFor(id); response.visits += 1; response.first_viewed_at ||= new Date().toISOString(); save();
}
function navigate(id) { visit(id); renderEvaluation(); window.scrollTo({ top: 0, behavior: 'instant' }); }
function cleanupViewers() { currentViewerCleanup.forEach(f => f()); currentViewerCleanup = []; }

function renderEvaluation() {
  cleanupViewers();
  const main = $('#app'), samples = currentSamples(), sample = sampleById(session.current_id), index = samples.findIndex(s => s.id === sample.id);
  const stats = summary(); main.replaceChildren();
  const progress = el('div', { class: 'progress-info' }, [el('h1', { text: `${session.set_size}-question evaluation` }), el('p', { id: 'overall-progress', text: `${stats.answered} answered · ${stats.unanswered} remaining · Participant ${session.participant_code}` }), el('div', { class: 'progress-track' }, [el('span', { id: 'progress-fill', style: `width:${100 * stats.answered / stats.selected}%` })])]);
  main.append(el('div', { class: 'studybar' }, [progress, el('div', { class: 'actions' }, [button('Set / participant', showStart), button('Save JSON backup', downloadJson), button('End & export', showFinish, 'primary')])]));
  const domains = el('nav', { class: 'domains', 'aria-label': 'Domains' });
  for (const domain of catalog.metadata.domains) {
    const group = samples.filter(s => s.domain === domain.name);
    const b = button('', () => navigate(group.find(s => !responseFor(s.id).choice)?.id || group[0].id), 'domain-button');
    b.setAttribute('aria-current', String(domain.name === sample.domain));
    b.append(el('span', { class: 'domain-dot', style: `--domain-color:${COLORS[domain.name]}` }), el('span', { text: domain.name }), el('span', { class: 'count', 'data-domain': domain.name, text: `${summary(group).answered}/${group.length}` }));
    domains.append(b);
  }
  main.append(domains);
  const datasetSelect = el('select', { id: 'dataset-select', onchange: e => { const group = samples.filter(s => s.dataset === e.target.value); navigate(group.find(s => !responseFor(s.id).choice)?.id || group[0].id); } });
  for (const dataset of catalog.metadata.domains.find(d => d.name === sample.domain).datasets) datasetSelect.append(el('option', { value: dataset, text: dataset, selected: dataset === sample.dataset }));
  const numbers = el('nav', { class: 'question-index', 'aria-label': 'Questions in this dataset' });
  samples.filter(s => s.dataset === sample.dataset).forEach((s, i) => {
    const response = responseFor(s.id), b = button(String(i + 1), () => navigate(s.id), `index-button${response.choice ? ' answered' : ''}${response.flagged ? ' flagged' : ''}`);
    b.dataset.sample = s.id; b.setAttribute('aria-current', String(s.id === sample.id)); b.setAttribute('aria-label', `${sample.dataset} question ${i + 1}${response.choice ? ', answered' : ', unanswered'}`); numbers.append(b);
  });
  main.append(el('div', { class: 'datasetbar' }, [el('label', {}, [el('span', { text: 'Dataset' }), datasetSelect]), numbers]));
  const mediaColumn = el('section', { class: 'media-column', 'aria-label': 'Question media' });
  if (sample.images.length > 1) mediaColumn.append(el('p', { class: 'multi-image-note', text: `${sample.images.length} images, in original dataset order. Printed labels inside an image take precedence over viewer numbering.` }));
  sample.images.forEach((media, i) => mediaColumn.append(createImageViewer(sample, media, i)));
  if (sample.video) mediaColumn.append(createVideo(sample));
  const question = el('section', { class: 'question-column', 'aria-label': 'Question and response' }, [el('div', { class: 'sample-heading' }, [el('h2', { text: `Question ${index + 1} of ${samples.length}` }), el('span', { class: 'sample-id', text: `ID ${sample.id}` })])]);
  for (const [title, value] of [['Episode Goal', sample.episode_goal], ['Action History', sample.action_history]]) if (value) question.append(el('section', { class: 'context-block' }, [el('h3', { text: title }), el('div', { class: 'source-text', text: value })]));
  question.append(el('h3', { class: 'question-label', text: 'Question' }), el('div', { class: 'source-text question-text', text: sample.question }));
  question.append(el('p', { class: 'authoritative', text: 'Choose one option. This list takes precedence over older choices embedded in the question.' }));
  const options = el('fieldset', { class: 'options' }, [el('legend', { class: 'sr-only', text: 'Your answer' })]);
  sample.options.forEach((option, i) => {
    const letter = String.fromCharCode(65 + i), input = el('input', { type: 'radio', name: 'answer', value: letter, checked: responseFor(sample.id).choice === letter, onchange: () => {
      const response = responseFor(sample.id); if (response.choice !== letter) response.choice_changes += 1;
      response.choice = letter; response.updated_at = new Date().toISOString(); save(); refreshProgress();
    } });
    options.append(el('label', { class: 'option' }, [input, el('span', { class: 'letter', text: letter }), el('span', { class: 'option-text', text: option })]));
  });
  question.append(options, el('div', { class: 'response-footer' }, [el('span', { id: 'answer-status', text: responseFor(sample.id).choice ? `Selected ${responseFor(sample.id).choice}` : 'No answer selected' }), button('Clear answer', () => { responseFor(sample.id).choice = null; responseFor(sample.id).updated_at = new Date().toISOString(); document.querySelectorAll('input[name="answer"]').forEach(n => n.checked = false); save(); refreshProgress(); }, 'quiet')]));
  const comments = el('textarea', { id: 'comment', rows: 4, maxLength: 10000, value: responseFor(sample.id).comment, placeholder: 'Optional: explain your choice, uncertainty, or a problem with this question.', oninput: e => { responseFor(sample.id).comment = e.target.value; responseFor(sample.id).updated_at = new Date().toISOString(); save(); } });
  question.append(el('label', { class: 'field' }, [el('span', { text: 'Comment or reasoning (optional)' }), comments]));
  question.append(el('label', { class: 'checkline flagline' }, [el('input', { type: 'checkbox', checked: responseFor(sample.id).flagged, onchange: e => { responseFor(sample.id).flagged = e.target.checked; save(); refreshProgress(); } }), el('span', { text: 'Flag this question: ambiguous, missing information, or media issue' })]));
  const previous = button('← Previous', () => navigate(samples[index - 1].id)); previous.disabled = index === 0;
  const next = button(index === samples.length - 1 ? 'End & export' : 'Next question →', () => index === samples.length - 1 ? showFinish() : navigate(samples[index + 1].id), 'primary');
  question.append(el('div', { class: 'navigation' }, [previous, next]));
  main.append(el('div', { class: 'workspace' }, [mediaColumn, question]));
}

function refreshProgress() {
  const stats = summary(), sample = sampleById(session.current_id);
  $('#overall-progress').textContent = `${stats.answered} answered · ${stats.unanswered} remaining · Participant ${session.participant_code}`;
  $('#progress-fill').style.width = `${100 * stats.answered / stats.selected}%`;
  document.querySelectorAll('[data-domain]').forEach(n => { const list = currentSamples().filter(s => s.domain === n.dataset.domain); n.textContent = `${summary(list).answered}/${list.length}`; });
  document.querySelectorAll('[data-sample]').forEach(n => { const response = responseFor(n.dataset.sample); n.classList.toggle('answered', !!response.choice); n.classList.toggle('flagged', response.flagged); });
  $('#answer-status').textContent = responseFor(sample.id).choice ? `Selected ${responseFor(sample.id).choice}` : 'No answer selected';
}

function mediaError(id, message) {
  const response = responseFor(id);
  if (!response.media_errors.some(e => e.message === message)) response.media_errors.push({ at: new Date().toISOString(), message });
  save();
}

function createImageViewer(sample, media, imageIndex, expanded = false) {
  const card = el('div', { class: 'media-card' }), viewport = el('div', { class: 'image-viewport', tabIndex: 0, 'aria-label': `Image ${imageIndex + 1}: use zoom controls, then drag or scroll to pan` });
  const stage = el('div', { class: 'image-stage' }), image = el('img', { src: media.url, alt: `${sample.dataset}, image ${imageIndex + 1} for question ${sample.source_row_index}`, draggable: false });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'point-overlay'); svg.setAttribute('viewBox', `0 0 ${media.width} ${media.height}`);
  const points = sample.points.filter(point => point.image_index === imageIndex), markerSelect = el('select', { 'aria-label': 'Coordinate markers shown', style: 'width:auto;font-size:12px;padding:5px' });
  markerSelect.append(el('option', { value: 'all', text: 'All markers' }), el('option', { value: 'none', text: 'Hide markers' }));
  for (const letter of [...new Set(points.map(p => p.label))]) markerSelect.append(el('option', { value: letter, text: `Only ${letter}` }));
  let scale = 1, fitMode = true;
  const zoomLabel = el('span', { class: 'zoom-label' });
  function svgNode(tag, attrs) { const n = document.createElementNS(svg.namespaceURI, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); return n; }
  function drawMarkers() {
    svg.replaceChildren();
    if (markerSelect.value === 'none') return;
    const boxes = [], dots = [];
    const visiblePoints = points.filter(p => p.in_bounds && (markerSelect.value === 'all' || p.label === markerSelect.value));
    visiblePoints.forEach(point => {
      const x = point.x * scale, y = point.y * scale, sw = media.width * scale, sh = media.height * scale;
      let bx = x, by = y - 29;
      const placements = [[0,-29],[30,-29],[-30,-29],[0,29],[36,0],[-36,0],[56,-38],[-56,-38],[0,-57],[0,57]];
      for (const [dx,dy] of placements) {
        const cx = Math.max(15, Math.min(sw - 15, x + dx)), cy = Math.max(17, Math.min(sh - 17, y + dy));
        bx=cx; by=cy;
        if (!boxes.some(box => Math.abs(box[0]-cx)<30 && Math.abs(box[1]-cy)<32) && !visiblePoints.some(p => Math.abs(p.x*scale-cx)<17 && Math.abs(p.y*scale-cy)<20)) break;
      }
      boxes.push([bx,by]);
      const g = svgNode('g', { class:'marker', 'data-label':point.label, 'data-x':point.x, 'data-y':point.y });
      const title = svgNode('title', {}); title.textContent = `${point.label}: exact point [${point.x}, ${point.y}]`; g.append(title);
      g.append(svgNode('line',{x1:point.x,y1:point.y,x2:bx/scale,y2:by/scale,stroke:'#243c60','stroke-width':.9/scale}));
      const pin = svgNode('path',{d:'M -11 -3 A 11 11 0 1 1 11 -3 L 0 12 Z',fill:'#243c60',stroke:'white','stroke-width':1.2,transform:`translate(${bx/scale} ${by/scale}) scale(${1/scale})`});
      g.append(pin);
      const letter = svgNode('text',{x:bx/scale,y:(by+1)/scale,'text-anchor':'middle','font-size':12/scale,'font-family':'system-ui,sans-serif','font-weight':'700',fill:'#fff'}); letter.textContent = point.label; g.append(letter);
      const dot = svgNode('g', {class:'dot-layer','data-label':point.label});
      dot.append(svgNode('circle',{cx:point.x,cy:point.y,r:2.5/scale,fill:'#fff'}), svgNode('circle',{cx:point.x,cy:point.y,r:1.15/scale,fill:'#000',class:'exact-point','data-label':point.label,'data-x':point.x,'data-y':point.y}));
      dots.push(dot);
      svg.append(g);
    });
    svg.append(...dots);
  }
  function applyScale(next, count = true) {
    const old = scale, centerX = (viewport.scrollLeft + viewport.clientWidth/2)/old, centerY = (viewport.scrollTop + viewport.clientHeight/2)/old;
    scale = Math.max(.00001, Math.min(8, next));
    stage.style.width = `${media.width * scale}px`; stage.style.height = `${media.height * scale}px`;
    stage.style.visibility = 'visible';
    zoomLabel.textContent = `${Math.round(scale*100)}%`; drawMarkers();
    viewport.scrollLeft = centerX*scale - viewport.clientWidth/2; viewport.scrollTop = centerY*scale - viewport.clientHeight/2;
    if (count) { responseFor(sample.id).zoom_events += 1; save(); }
  }
  function fit(count = true) {
    if (!viewport.clientWidth) return;
    const heightLimit = parseFloat(getComputedStyle(viewport).maxHeight);
    const availableHeight = Number.isFinite(heightLimit) ? heightLimit : window.innerHeight * .7;
    fitMode = true;
    applyScale(Math.min(1, Math.max(1, viewport.clientWidth - 2) / media.width, Math.max(1, availableHeight - 2) / media.height), count);
    viewport.scrollLeft = 0; viewport.scrollTop = 0;
  }
  const toolbar = el('div',{class:'toolbar'},[button('−',()=>{fitMode=false;applyScale(scale/1.5);}),zoomLabel,button('+',()=>{fitMode=false;applyScale(scale*1.5);}),button('Fit',()=>fit()),button('100%',()=>{fitMode=false;applyScale(1);})]);
  toolbar.querySelectorAll('button')[0].setAttribute('aria-label','Zoom out'); toolbar.querySelectorAll('button')[1].setAttribute('aria-label','Zoom in');
  if (points.length) {
    markerSelect.addEventListener('change',()=>{
      drawMarkers();
      const point=points.find(p=>p.label===markerSelect.value&&p.in_bounds);
      if(point){viewport.scrollLeft=point.x*scale-viewport.clientWidth/2;viewport.scrollTop=point.y*scale-viewport.clientHeight/2;}
    });
    toolbar.append(markerSelect,button('Find points',()=>{
      const shown=points.filter(p=>p.in_bounds&&(markerSelect.value==='all'||markerSelect.value==='none'||p.label===markerSelect.value));
      if(!shown.length)return;
      if(markerSelect.value==='none')markerSelect.value='all';
      const xs=shown.map(p=>p.x),ys=shown.map(p=>p.y),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
      fitMode=false;applyScale(Math.min(2,viewport.clientWidth/(right-left+140),450/(bottom-top+140)));
      viewport.scrollLeft=((left+right)/2)*scale-viewport.clientWidth/2;
      viewport.scrollTop=((top+bottom)/2)*scale-viewport.clientHeight/2;
    }));
  }
  if (!expanded) toolbar.append(button('Expand ↗',()=> {
    $('#image-title').textContent = `${sample.dataset} · Image ${imageIndex+1}`;
    $('#image-dialog-content').replaceChildren(createImageViewer(sample,media,imageIndex,true));
    $('#image-dialog').showModal();
  }));
  stage.append(image,svg); viewport.append(stage);
  card.append(el('div',{class:'media-heading'},[el('span',{text:`Image ${imageIndex+1}`}),el('span',{class:'size',text:`${media.width} × ${media.height} pixels`})]),toolbar,viewport);
  card.append(el('p',{class:'media-hint',text: points.length ? 'The black dot’s center is the exact option coordinate. Letter bubbles may be offset. Zoom or hide markers to inspect a boundary.' : 'Use + / − to zoom; drag or scroll to pan. Original labels and grids are preserved.'}));
  const outside=points.filter(p=>!p.in_bounds); if(outside.length) card.append(el('p',{class:'media-hint',text:`Outside the image (not clamped): ${outside.map(p=>`${p.label} [${p.x}, ${p.y}]`).join('; ')}`}));
  image.addEventListener('load',()=>{if(fitMode)fit(false);});
  image.addEventListener('error',()=>{mediaError(sample.id,`Image ${imageIndex+1} failed to load`);card.append(el('div',{class:'media-error',text:'Image did not load. Reload the page or flag this item; do not answer based on missing media.'}));});
  const observer=new ResizeObserver(()=>{if(fitMode && viewport.clientWidth)fit(false);}); observer.observe(viewport); currentViewerCleanup.push(()=>observer.disconnect());
  const resize=()=>{if(fitMode)fit(false);};window.addEventListener('resize',resize);currentViewerCleanup.push(()=>window.removeEventListener('resize',resize));
  let drag=null;
  viewport.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging');});
  viewport.addEventListener('pointermove',e=>{if(drag){viewport.scrollLeft=drag.left+drag.x-e.clientX;viewport.scrollTop=drag.top+drag.y-e.clientY;}});
  const endDrag=()=>{drag=null;viewport.classList.remove('dragging');};viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);
  requestAnimationFrame(()=>fit(false)); return card;
}

function createVideo(sample) {
  const playback=sample.video.playback_url||sample.video.url;
  const card=el('div',{class:'media-card'}), video=el('video',{class:'video-frame',controls:true,preload:'metadata',playsInline:true,src:playback});
  const speed=el('select',{'aria-label':'Playback speed'},[.25,.5,1,1.5,2].map(n=>el('option',{value:n,text:`${n}×`,selected:n===1})));
  speed.addEventListener('change',()=>video.playbackRate=Number(speed.value));
  for(const type of ['play','seeked','ratechange']) video.addEventListener(type,()=>{responseFor(sample.id).video_events+=1;save();});
  video.addEventListener('error',()=>{mediaError(sample.id,`Video failed to load (code ${video.error?.code||'unknown'})`);fallback.textContent='Video could not play here. Try Reload video or Open original video. If it still fails, flag the item and leave it unanswered.';});
  const fallback=el('p',{class:'video-fallback',text:sample.video.playback_url?'Complete video, with all source frames preserved in a browser-compatible lossless copy. Pause, seek, replay, or use full screen.':'Complete video. Pause and seek to inspect events; use full screen for a larger view. Videos load from Hugging Face on demand.'});
  card.append(el('div',{class:'media-heading',text:'Complete video'}),video,el('div',{class:'video-actions'},[button('−0.1s',()=>{video.pause();video.currentTime=Math.max(0,video.currentTime-.1);}),button('+0.1s',()=>{video.pause();video.currentTime=Math.min(video.duration||0,video.currentTime+.1);}),speed,button('Reload video',()=>video.load()),el('a',{class:'button',href:playback,target:'_blank',rel:'noopener noreferrer',text:'Open video ↗'})]),fallback);
  currentViewerCleanup.push(()=>{video.pause();video.removeAttribute('src');video.load();});return card;
}

function showFinish() {
  tick();active=false;save();exportFiles=null;const stats=summary(), area=$('#finish-content');area.replaceChildren();
  area.append(el('p',{text:'You can finish now or return to the study. Unanswered items are preserved; they are not silently removed.'}),el('div',{class:'statline'},[el('div',{},[el('strong',{text:String(stats.answered)}),el('span',{text:'answered'})]),el('div',{},[el('strong',{text:String(stats.unanswered)}),el('span',{text:'unanswered'})]),el('div',{},[el('strong',{text:String(stats.flagged)}),el('span',{text:'flagged'})])]));
  const table=el('table',{class:'finish-summary'});table.append(el('thead',{},[el('tr',{},[el('th',{text:'Domain'}),el('th',{text:'Answered / selected'})])]));const body=el('tbody');
  for(const domain of catalog.metadata.domains){const group=currentSamples().filter(s=>s.domain===domain.name);body.append(el('tr',{},[el('td',{text:domain.name}),el('td',{text:`${summary(group).answered} / ${group.length}`})]));}table.append(body);area.append(table);
  const status=el('p',{class:'export-status',role:'status',text:'Generate your PDF and JSON, then attach the JSON to an email. No responses are sent automatically.'});
  const jsonButton=button('Download JSON',()=>exportFiles?download(exportFiles.json,`${exportFiles.stem}.json`):downloadJson()),pdfButton=button('Download PDF',()=>exportFiles&&download(exportFiles.pdf,`${exportFiles.stem}.pdf`));pdfButton.disabled=true;
  const generate=button('Generate PDF + JSON',async()=>{
    generate.disabled=true;jsonButton.disabled=true;pdfButton.disabled=true;
    try{
      tick();const data=payload();save();const stem=fileStem(),json=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
      status.textContent='Building your PDF. All selected questions and comments will be included…';
      const pdf=await responsePdf(data,(n,total)=>status.textContent=`Preparing PDF: question ${n} of ${total}…`);
      exportFiles={pdf,json,stem};download(pdf,`${stem}.pdf`);setTimeout(()=>download(json,`${stem}.json`),500);
      status.textContent='PDF and JSON are ready. If your browser blocked either download, use the separate buttons below. Your study has not been emailed yet.';pdfButton.disabled=false;
    }catch(error){status.textContent=`PDF generation failed: ${error.message}. Your answers are safe; download the JSON and try again.`;}
    finally{generate.disabled=false;jsonButton.disabled=false;}
  },'primary');
  const email=el('a',{class:'button',text:'Open email →',href:`mailto:advaitgupta@ymail.com?subject=${encodeURIComponent(`AgentVQA human evaluation — ${session.participant_code}`)}&body=${encodeURIComponent(`Hello,\n\nPlease find my AgentVQA human-evaluation JSON attached.\nParticipant code: ${session.participant_code}\nSession: ${session.id}\nSet: ${session.set_size} questions\n\n[Attach the downloaded ${fileStem()}.json file before sending.]`)}`});
  const share=button('Share JSON file',async()=>{
    try{const data=payload(),file=new File([JSON.stringify(data,null,2)],`${fileStem()}.json`,{type:'application/json'});if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'AgentVQA responses',text:'Please send this JSON to advaitgupta@ymail.com.'});}else status.textContent='File sharing is unavailable in this browser. Download the JSON, open email, and attach it manually.';}catch(error){if(error.name!=='AbortError')status.textContent=`Sharing failed: ${error.message}. Download and attach the JSON manually.`;}
  });
  area.append(generate,status,el('div',{class:'export-grid'},[jsonButton,pdfButton,email,share]),el('p',{class:'small-note',text:'Recipient: advaitgupta@ymail.com. An email link cannot attach files automatically. Check that the JSON is attached before sending. Nothing is uploaded to a study server.'}),button('Return to evaluation',()=>$('#finish-dialog').close(),'quiet'));
  $('#finish-dialog').showModal();
}

async function importResponses(file) {
  if(!file)return;
  try{
    if(file.size>15000000)throw new Error('The file is too large for a response backup.');
    const data=JSON.parse(await file.text());
    const revision=previousRevision(data.study?.catalog_sha256);
    if(data.schema_version!==1||(data.study?.catalog_sha256!==catalog.metadata.catalog_sha256&&!revision))throw new Error('This backup belongs to a different study version.');
    if(![100,200].includes(data.session?.set_size)||!Array.isArray(data.samples))throw new Error('Invalid response file.');
    const expected=catalog.samples.filter(s=>data.session.set_size===200||s.in_100),ids=new Set();
    const responses={},retired=[];
    for(const item of data.retired_responses||[]){
      const change=previousRevision(item.catalog_sha256);
      if(!change||item.id!==change.removed_id)throw new Error('Unknown retired sample in backup.');
      retired.push({id:item.id,catalog_sha256:item.catalog_sha256,response:cleanResponse(item.response||{},change.removed_option_count,item.id)});
    }
    for(const item of data.samples){
      const replaced=revision&&item.id===revision.removed_id;
      const known=expected.find(s=>s.id===(replaced?revision.added_id:item.id));
      if(!known||ids.has(known.id)||(revision&&item.id===revision.added_id))throw new Error('Unknown or duplicate sample ID in backup.');ids.add(known.id);
      const response=cleanResponse(item.response||{},replaced?revision.removed_option_count:known.options.length,item.id);
      if(replaced){retired.push({id:item.id,catalog_sha256:revision.previous_catalog_sha256,response});responses[known.id]=blankResponse();}
      else responses[known.id]=response;
    }
    if(ids.size!==expected.length)throw new Error('The backup does not contain every selected question.');
    if(session&&!confirm('Replace the saved session in this browser with this backup? Download your current answers first.'))return;
    const currentId=revision&&data.session.current_id===revision.removed_id?revision.added_id:data.session.current_id;
    session={id:String(data.session.id||crypto.randomUUID()),participant_code:String(data.session.participant_code||'Participant').slice(0,60),prior_exposure:['yes','no','unsure'].includes(data.session.prior_exposure)?data.session.prior_exposure:'unsure',set_size:data.session.set_size,started_at:data.session.started_at||new Date().toISOString(),responses,current_id:expected.some(s=>s.id===currentId)?currentId:expected[0].id,catalog_sha256:catalog.metadata.catalog_sha256,retired_responses:retired,migrated_from_catalog:revision?.previous_catalog_sha256||data.session.migrated_from_catalog||null};
    save();alert(revision?'Backup imported. The Five Guys item was replaced; its old response is archived in JSON. Other answers are preserved. Please answer the replacement question.':'Backup imported. Review the participant settings and resume.');showStart();
  }catch(error){alert(`Could not import backup: ${error.message}`);}
  $('#import-file').value='';
}

async function boot(){
  [catalog,instructions]=await Promise.all(['catalog.json','instructions.json'].map(path=>fetch(path,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Cannot load ${path}: ${r.status}`);return r.json();})));
  if(catalog.samples.length!==200||catalog.samples.filter(s=>s.in_100).length!==100)throw new Error('The fixed catalog is incomplete.');
  key=`agentvqa-human1:${catalog.metadata.catalog_sha256}`;
  try{
    const raw=localStorage.getItem(key);
    if(raw){const stored=JSON.parse(raw);if(stored.catalog_sha256===catalog.metadata.catalog_sha256&&[100,200].includes(stored.set_size)&&stored.responses)session=stored;}
    if(!session)for(const revision of catalog.metadata.selection_replacements||[]){
      const previous=localStorage.getItem(`agentvqa-human1:${revision.previous_catalog_sha256}`);
      if(!previous)continue;
      const stored=JSON.parse(previous);
      if(stored.catalog_sha256!==revision.previous_catalog_sha256||![100,200].includes(stored.set_size)||!stored.responses)continue;
      session=migrateSession(stored,revision);save();
      if(storageOkay)alert('Your saved session was updated. The Five Guys item was replaced; its old response is archived in JSON. Other answers are preserved. Please answer the replacement question.');
      break;
    }
  }
  catch{storageOkay=false;alert('Saved browser data could not be read. Import a JSON backup if you have one.');}
  $('#save-status').textContent=session?'Saved session found':'Progress stays on this device';
  $('#help-content').append(instructionsContent());
  $('#help-button').addEventListener('click',()=>$('#help-dialog').showModal());
  document.querySelectorAll('[data-close]').forEach(n=>n.addEventListener('click',()=>document.getElementById(n.dataset.close).close()));
  $('#image-dialog').addEventListener('close',()=>$('#image-dialog-content').replaceChildren());
  $('#finish-dialog').addEventListener('close',()=>{active=!!session;lastTick=performance.now();});
  $('#import-file').addEventListener('change',e=>importResponses(e.target.files[0]));
  document.addEventListener('visibilitychange',()=>{tick();if(session&&active)save();});
  window.addEventListener('pagehide',()=>{tick();if(session)save();});
  window.addEventListener('storage',event=>{if(event.key===key&&active)alert('This study was updated in another tab. Avoid using two tabs for the same session; export a backup here before reloading.');});
  setInterval(()=>{if(active){tick();save();}},15000);
  globalThis.AgentVQAHuman={catalog,instructions,exportPayload:()=>session?payload():null,instructionsPdf:()=>instructionsPdf(instructions,catalog.metadata)};
  showStart();
}

boot().catch(error=>{$('#app').replaceChildren(el('div',{class:'alert',text:`The study could not start: ${error.message}. Please reload; no responses have been submitted.`}));$('#save-status').textContent='Loading failed';console.error(error);});
