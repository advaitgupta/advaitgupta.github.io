const $ = selector => document.querySelector(selector);
export const el = (tag, props = {}, children = []) => {
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
export const button = (text, action, className = '') => el('button', { text, onclick: action, class: className, type: 'button' });
let currentViewerCleanup = [], reviewAnswer = () => null, reviewChoice = () => null;
export function configureMedia(answer, choice) { reviewAnswer = answer; reviewChoice = choice; }
export function cleanupViewers() { currentViewerCleanup.forEach(f => f()); currentViewerCleanup = []; }
const responseFor = () => ({zoom_events:0, video_events:0});
const save = () => {};
const mediaError = () => {};
export function createImageViewer(sample, media, imageIndex, expanded = false) {
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
      const pin = svgNode('path',{d:'M -11 -3 A 11 11 0 1 1 11 -3 L 0 12 Z',fill:point.label===reviewAnswer(sample.id)?'#23834d':point.label===reviewChoice(sample.id)?'#c74040':'#243c60',stroke:'white','stroke-width':1.2,transform:`translate(${bx/scale} ${by/scale}) scale(${1/scale})`});
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
export function createVideo(sample) {
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
