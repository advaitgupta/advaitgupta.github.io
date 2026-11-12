let fontPromise;

async function documentWriter(title) {
  if (!globalThis.PDFLib || !globalThis.fontkit) throw new Error('The local PDF libraries did not load. Reload this page and try again.');
  const { PDFDocument, rgb } = globalThis.PDFLib;
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(globalThis.fontkit);
  fontPromise ||= fetch(new URL('../human_eval/vendor/DejaVuSans.ttf', import.meta.url)).then(r => {
    if (!r.ok) throw new Error('The PDF font could not be loaded.');
    return r.arrayBuffer();
  });
  const font = await pdf.embedFont(await fontPromise, { subset: true });
  pdf.setTitle(title);
  pdf.setAuthor('AgentVQA');
  let page, y;
  const margin = 45, width = 595.28, height = 841.89, contentWidth = width - margin * 2;
  function newPage() {
    page = pdf.addPage([width, height]);
    y = height - 48;
  }
  function ensure(space) { if (!page || y - space < 48) newPage(); }
  function clean(value) { return String(value ?? '').replace(/\t/g, '    ').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ''); }
  function lines(value, size, limit = contentWidth) {
    const out = [];
    for (const paragraph of clean(value).split('\n')) {
      if (!paragraph) { out.push(''); continue; }
      let line = '';
      for (const word of paragraph.split(/\s+/)) {
        const candidate = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) <= limit) { line = candidate; continue; }
        if (line) { out.push(line); line = ''; }
        for (const character of word) {
          if (font.widthOfTextAtSize(line + character, size) > limit && line) { out.push(line); line = ''; }
          line += character;
        }
      }
      if (line) out.push(line);
    }
    return out;
  }
  function text(value, size = 10, color = rgb(.12, .17, .24), after = 8) {
    const wrapped = lines(value, size);
    const needed = wrapped.length * size * 1.45 + after;
    if (needed < height - 100) ensure(needed);
    for (const line of wrapped) {
      ensure(size * 1.45);
      if (line) page.drawText(line, { x: margin, y, font, size, color });
      y -= size * 1.45;
    }
    y -= after;
  }
  function heading(value, size = 15) { ensure(60); text(value, size, rgb(.10, .29, .55), 10); }
  async function image(url, caption) {
    text(caption, 8, rgb(.35, .4, .47), 3);
    try {
      const response = await fetch(new URL(url, import.meta.url));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = await response.arrayBuffer();
      const picture = await pdf.embedJpg(bytes);
      const scale = Math.min(1, contentWidth / picture.width, 230 / picture.height);
      const w = picture.width * scale, h = picture.height * scale;
      ensure(h + 18);
      page.drawImage(picture, { x: margin, y: y - h, width: w, height: h });
      y -= h + 15;
    } catch (e) { text(`Image preview unavailable: ${e.message}. The original media reference is retained below.`, 9); }
  }
  async function finish() {
    pdf.getPages().forEach((p, i, all) => p.drawText(`${i + 1} / ${all.length}`, { x: width - 82, y: 22, size: 8, font, color: rgb(.4, .45, .5) }));
    return new Blob([await pdf.save()], { type: 'application/pdf' });
  }
  return { text, heading, image, newPage, finish };
}

export async function reviewPdf(payload, progress=()=>{}) {
  const p = await documentWriter('AgentVQA · Human response review');
  p.heading('AgentVQA',25);
  p.heading('Human response review',17);
  p.text('Post-evaluation report. Correct answers are the released dataset key, not new adjudications. Participant responses have not been changed.');
  p.text(`Participant: ${payload.session?.participant_code||'No response file loaded'}\nDisplayed questions: ${payload.samples.length}\nSubmitted: ${payload.summary.submitted}\nAnswered: ${payload.summary.answered}\nCorrect: ${payload.summary.correct}\nIncorrect: ${payload.summary.incorrect}\nUnanswered: ${payload.summary.unanswered}`);
  p.text(`Catalog: ${payload.study.catalog_sha256}\nDataset revision: ${payload.study.dataset_revision}`,8);
  for (const [i,s] of payload.samples.entries()) {
    progress(i+1,payload.samples.length);
    p.newPage();
    p.heading(`${i+1}. ${s.dataset} · ${s.domain}`,15);
    p.text(`ID: ${s.id}\nZero-based source row: ${s.source_row_index}\nStatus: ${s.review_status}`,9);
    if(s.episode_goal){p.heading('Episode Goal',12);p.text(s.episode_goal);}
    if(s.action_history){p.heading('Action History',12);p.text(s.action_history);}
    p.heading('Question',12);p.text(s.question);
    p.heading('Options',12);
    s.options.forEach((option,j)=>{const letter=String.fromCharCode(65+j);p.text(`${letter}. ${option}${letter===s.correct_answer?' [CORRECT ANSWER]':''}${letter===s.response?.choice?' [PARTICIPANT SELECTED]':''}`,10);});
    p.heading('Answer comparison',12);
    p.text(`Correct: ${s.correct_answer} — ${s.correct_text}\nParticipant: ${s.response?.choice|| (s.response?'Unanswered':'Not in submitted export')}\nComment / reasoning: ${s.response?.comment||'(none)'}`);
    if(s.response?.media_errors?.length)p.text(`Recorded media errors: ${s.response.media_errors.map(e=>e.message).join('; ')}`);
    if(s.response?.flagged)p.text('Participant flagged this question.');
    if(s.points.length)p.text(`Exact option coordinates [x, y] in source pixels: ${s.points.map(pt=>`${pt.label} [${pt.x}, ${pt.y}]`).join('; ')}. See the interactive review for overlays.`,9);
    for(const [j,m] of s.images.entries()){
      await p.image(new URL(m.preview_url,new URL('../human_eval/',import.meta.url)).href,`Image ${j+1}: ${m.width} × ${m.height}`);
      p.text(`Original: ${new URL(m.url,new URL('../human_eval/',import.meta.url)).href}\nSHA-256: ${m.sha256}`,8);
    }
    if(s.video)p.text(`Video: ${s.video.url}\nSHA-256: ${s.video.sha256}`,8);
  }
  return p.finish();
}
