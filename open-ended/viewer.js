import {el,button,$} from './ui.js';
let disposers=[];
export function cleanup(){disposers.forEach(f=>f());disposers=[];}
const svgNode=(tag,attrs={})=>{const node=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));return node;};
export function imageViewer(sample,media,index,overlays,expanded=false){
  const card=el('div',{class:'media-card'}),viewport=el('div',{class:'image-viewport',tabIndex:0,'aria-label':`Image ${index+1}: zoom and pan`}),stage=el('div',{class:'image-stage'});
  const image=el('img',{src:media.url,alt:`${sample.dataset}, image ${index+1}`,draggable:false}),svg=svgNode('svg',{class:'point-overlay',viewBox:`0 0 ${media.width} ${media.height}`});
  const points=overlays.points.filter(p=>p.image_index===index),regions=overlays.regions.filter(p=>p.image_index===index);
  let scale=1,fitMode=true,show=true;
  const label=el('span',{class:'zoom-label'});
  function draw(){
    svg.replaceChildren();if(!show)return;
    for(const region of regions){const [x,y,w,h]=region.box;svg.append(svgNode('rect',{x,y,width:w,height:h,class:'viewer-region'}));const t=svgNode('text',{x:(x+4/scale),y:(y+14/scale),'font-size':11/scale,fill:'#125ac7','font-weight':700,stroke:'#fff','stroke-width':3/scale,'paint-order':'stroke'});t.textContent=region.label;svg.append(t);}
    for(const p of points.filter(p=>p.in_bounds)){
      const sx=media.width*scale,sy=media.height*scale,bx=Math.max(16,Math.min(sx-16,p.x*scale)),by=Math.max(18,Math.min(sy-18,p.y*scale-31));
      svg.append(svgNode('line',{x1:p.x,y1:p.y,x2:bx/scale,y2:by/scale,stroke:'#206feb','stroke-width':1/scale}));
      svg.append(svgNode('path',{d:'M -11 -3 A 11 11 0 1 1 11 -3 L 0 12 Z',fill:'#206feb',stroke:'white','stroke-width':1.2,transform:`translate(${bx/scale} ${by/scale}) scale(${1/scale})`}));
      const t=svgNode('text',{x:bx/scale,y:(by+1)/scale,'text-anchor':'middle','font-size':12/scale,'font-family':'system-ui','font-weight':700,fill:'white'});t.textContent=p.label;svg.append(t);
      svg.append(svgNode('circle',{cx:p.x,cy:p.y,r:2.5/scale,fill:'white'}),svgNode('circle',{cx:p.x,cy:p.y,r:1.1/scale,fill:'black',class:'exact-point','data-x':p.x,'data-y':p.y}));
    }
  }
  function setScale(next){const previous=scale,cx=(viewport.scrollLeft+viewport.clientWidth/2)/previous,cy=(viewport.scrollTop+viewport.clientHeight/2)/previous;scale=Math.max(.00001,Math.min(12,next));stage.style.width=`${media.width*scale}px`;stage.style.height=`${media.height*scale}px`;stage.style.visibility='visible';label.textContent=`${Math.round(scale*100)}%`;draw();viewport.scrollLeft=cx*scale-viewport.clientWidth/2;viewport.scrollTop=cy*scale-viewport.clientHeight/2;}
  function fit(){if(!viewport.clientWidth)return;fitMode=true;setScale(Math.min(1,(viewport.clientWidth-2)/media.width,(parseFloat(getComputedStyle(viewport).maxHeight)-2)/media.height));viewport.scrollLeft=0;viewport.scrollTop=0;}
  const zoomOut=button('−',()=>{fitMode=false;setScale(scale/1.5)}),zoomIn=button('+',()=>{fitMode=false;setScale(scale*1.5)});zoomOut.setAttribute('aria-label','Zoom out');zoomIn.setAttribute('aria-label','Zoom in');
  const toolbar=el('div',{class:'toolbar'},[zoomOut,label,zoomIn,button('Fit',fit),button('100%',()=>{fitMode=false;setScale(1)})]);
  if(points.length||regions.length){
    const toggle=button('Hide markers',()=>{show=!show;toggle.textContent=show?'Hide markers':'Show markers';draw()});toolbar.append(toggle);
    const focus=points.find(p=>p.in_bounds);
    if(focus)toolbar.append(button('Find point',()=>{fitMode=false;show=true;toggle.textContent='Hide markers';setScale(Math.max(scale,1.5));viewport.scrollLeft=focus.x*scale-viewport.clientWidth/2;viewport.scrollTop=focus.y*scale-viewport.clientHeight/2;}));
  }
  if(!expanded)toolbar.append(button('Expand ↗',()=>{$('#image-title').textContent=`${sample.dataset} · Image ${index+1}`;$('#image-content').replaceChildren(imageViewer(sample,media,index,overlays,true));$('#image-dialog').showModal();}));
  stage.append(image,svg);viewport.append(stage);
  card.append(el('div',{class:'media-heading'},[el('span',{text:`Image ${index+1}`}),el('span',{class:'size',text:`${media.width} × ${media.height}`} )]),toolbar,viewport,el('p',{class:'media-hint',text:points.length?'The tiny black-dot center is the predicted coordinate. The blue bubble is offset. Zoom in or hide markers to inspect the target boundary.':regions.length?'Outlined regions identify predicted cells or printed labels. They are not exact pixel predictions.':'Full image shown initially. Zoom in, then drag or scroll to inspect details.'}));
  image.addEventListener('load',()=>{if(fitMode)fit()});image.addEventListener('error',()=>card.append(el('p',{class:'media-error',text:'Image failed to load. Reload or mark this response not gradable; do not guess from missing media.'})));
  const observer=new ResizeObserver(()=>{if(fitMode)fit()});observer.observe(viewport);disposers.push(()=>observer.disconnect());
  const onresize=()=>{if(fitMode)fit()};window.addEventListener('resize',onresize);disposers.push(()=>window.removeEventListener('resize',onresize));
  let drag=null;viewport.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(e.pointerId)});viewport.addEventListener('pointermove',e=>{if(drag){viewport.scrollLeft=drag.left+drag.x-e.clientX;viewport.scrollTop=drag.top+drag.y-e.clientY}});viewport.addEventListener('pointerup',()=>drag=null);viewport.addEventListener('pointercancel',()=>drag=null);
  requestAnimationFrame(fit);return card;
}
export function videoViewer(sample){
  const media=sample.video,url=media.playback_url||media.url,card=el('div',{class:'media-card'}),video=el('video',{class:'video-frame',src:url,controls:true,playsInline:true,preload:'metadata'});
  const speed=el('select',{'aria-label':'Playback speed'},[.25,.5,1,1.5,2].map(n=>el('option',{value:n,text:n+'×',selected:n===1})));speed.onchange=()=>video.playbackRate=Number(speed.value);
  card.append(el('div',{class:'media-heading',text:'Complete source video'}),video,el('div',{class:'video-actions'},[button('−0.1s',()=>{video.pause();video.currentTime=Math.max(0,video.currentTime-.1)}),button('+0.1s',()=>{video.pause();video.currentTime=Math.min(video.duration||0,video.currentTime+.1)}),speed,el('a',{href:url,target:'_blank',rel:'noopener noreferrer',class:'button',text:'Open video ↗'})]),el('p',{class:'media-hint',text:media.playback_note||'Pause, seek, change speed or use full screen. The saved prompt details below report the model’s frame-sampling protocol.'}));
  video.addEventListener('error',()=>card.append(el('p',{class:'media-error',text:'Video could not play. Try opening it separately; flag missing media instead of guessing.'})));
  disposers.push(()=>{video.pause();video.removeAttribute('src');video.load()});return card;
}
