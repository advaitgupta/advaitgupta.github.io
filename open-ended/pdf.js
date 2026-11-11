let fontPromise;
export async function makePdf(payload,instructions,progress=()=>{}){
  const {PDFDocument,rgb}=globalThis.PDFLib;if(!PDFDocument||!globalThis.fontkit)throw Error('PDF libraries did not load');
  const pdf=await PDFDocument.create();pdf.registerFontkit(globalThis.fontkit);fontPromise||=fetch('../human_eval/vendor/DejaVuSans.ttf').then(r=>r.arrayBuffer());const font=await pdf.embedFont(await fontPromise,{subset:true});let page,y;const width=595.28,height=841.89,margin=42,limit=width-2*margin;
  const newPage=()=>{page=pdf.addPage([width,height]);y=height-48};
  function text(value,size=9){if(!page)newPage();for(const paragraph of String(value??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').split('\n')){let line='';const lines=[];for(const word of paragraph.split(/\s+/)){const candidate=line?line+' '+word:word;if(font.widthOfTextAtSize(candidate,size)<=limit){line=candidate;continue}if(line){lines.push(line);line=''}for(const char of word){if(font.widthOfTextAtSize(line+char,size)>limit&&line){lines.push(line);line=''}line+=char}}lines.push(line);for(const line of lines){if(y<50)newPage();if(line)page.drawText(line,{x:margin,y,font,size,color:rgb(.1,.15,.23)});y-=size*1.45}}y-=6}
  function heading(value,size=14){if(!page||y<110)newPage();text(value,size)}
  heading('AgentVQA · Open-ended review',22);
  if(!payload){text('Review instructions · https://advaitgupta.github.io/open-ended/');for(const [title,body] of instructions){heading(title,12);text(body,10)}}
  else{
    text(`Reviewer: ${payload.session.reviewer}\nSession: ${payload.session.id}\nExported: ${payload.exported_at}\nCatalog: ${payload.catalog_sha256}\nReviewed: ${payload.summary.reviewed} / ${payload.summary.available} available answers.`);
    text('This report contains human judgments, not automatic correctness labels. Model answers and questions are unchanged. The accompanying JSON preserves full prompts, coordinate metadata and source identities.');
    for(let i=0;i<payload.samples.length;i++){
      const sample=payload.samples[i];progress(i+1,payload.samples.length);newPage();heading(`${i+1}. ${sample.dataset} · ${sample.id}`);text(`Domain: ${sample.domain}\nOriginal source ID: ${sample.source_id}`);
      if(sample.episode_goal)text('Episode Goal: '+sample.episode_goal);if(sample.action_history)text('Action History: '+sample.action_history);heading('Question',11);text(sample.question);
      for(const [j,media]of sample.images.entries()){text(`Image ${j+1}: ${new URL(media.url,location.href).href}\nSHA-256: ${media.sha256}`,7);if(j===0){try{const bytes=await fetch(media.preview_url).then(r=>{if(!r.ok)throw Error('Image unavailable');return r.arrayBuffer()});const im=await pdf.embedJpg(bytes),scale=Math.min(limit/im.width,180/im.height);if(y-im.height*scale<55)newPage();page.drawImage(im,{x:margin,y:y-im.height*scale,width:im.width*scale,height:im.height*scale});y-=im.height*scale+13}catch(e){text('Preview unavailable: '+e.message,8)}}}
      if(sample.video)text('Complete video: '+sample.video.url,8);
      for(const model of payload.metadata.models.filter(m=>payload.session.models.includes(m.id))){const r=sample.responses[model.id],g=sample.reviews[model.id];heading(model.label,11);text('Answer: '+(r.answer||'(No visible answer)'));text(`Judgment: ${g.grade||'UNREVIEWED'}; flagged: ${g.flagged?'yes':'no'}\nComment: ${g.comment||'(none)'}\nSource status: ${r.status}; format valid: ${r.format_valid}; format issue: ${r.format_issue||'(none)'}`,9);if(r.overlays.points.length)text('Point(s), in original pixels: '+r.overlays.points.map(p=>`[${p.x}, ${p.y}]${p.in_bounds?'':' (outside requested bounds)'}`).join('; '),8);if(r.overlays.regions.length)text('Predicted regions: '+r.overlays.regions.map(p=>p.label).join('; '),8);}
      heading('Original MCQ reference only',10);text(sample.reference.warning,8);text(sample.reference.question,8);sample.reference.options.forEach((o,j)=>text(String.fromCharCode(65+j)+'. '+o,8));text('Recorded MCQ answer: '+sample.reference.answer,8);
    }
  }
  pdf.getPages().forEach((p,i,all)=>p.drawText(`${i+1}/${all.length}`,{x:width-75,y:22,size:8,font}));return new Blob([await pdf.save()],{type:'application/pdf'});
}
