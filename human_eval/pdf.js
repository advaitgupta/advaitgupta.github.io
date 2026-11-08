let fontPromise;

async function documentWriter(title) {
  if (!globalThis.PDFLib || !globalThis.fontkit) throw new Error('The local PDF libraries did not load. Reload this page and try again.');
  const { PDFDocument, rgb } = globalThis.PDFLib;
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(globalThis.fontkit);
  fontPromise ||= fetch(new URL('vendor/DejaVuSans.ttf', import.meta.url)).then(r => {
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

export async function instructionsPdf(instructions, metadata) {
  const p = await documentWriter(instructions.title);
  p.heading('AgentVQA', 24);
  p.heading('Human evaluation · Participant instructions', 17);
  p.text(`Protocol: ${instructions.version}\nStudy address: https://advaitgupta.github.io/human_eval/\nContact: advaitgupta@ymail.com`, 10);
  for (const section of instructions.sections) {
    p.heading(section.title, 13);
    section.paragraphs.forEach(paragraph => p.text(paragraph));
  }
  p.heading('Fixed allocation', 13);
  for (const domain of metadata.domains) {
    const n = domain.datasets.length;
    p.text(`${domain.name}: 100-question set = 20 questions (${20 / n} per dataset); 200-question set = 40 questions (${40 / n} per dataset).\nDatasets: ${domain.datasets.join(', ')}.`, 9);
  }
  p.text(`Dataset revision: ${metadata.dataset_revision}\nEvaluator revision: ${metadata.evaluation_revision}\nThe complete dataset release, source fields, and media identities are recorded in response JSON files.`, 8);
  return p.finish();
}

export async function responsePdf(payload, progress = () => {}) {
  const p = await documentWriter(`AgentVQA human responses · ${payload.session.participant_code}`);
  p.heading('AgentVQA', 25);
  p.heading('Human evaluation · Response report', 17);
  p.text(`Participant code: ${payload.session.participant_code}\nSession ID: ${payload.session.id}\nSelected set: ${payload.session.set_size} questions\nAnswered: ${payload.summary.answered}\nUnanswered: ${payload.summary.unanswered}\nFlagged: ${payload.summary.flagged}\nPrevious exposure: ${payload.session.prior_exposure}\nExported: ${payload.exported_at}`);
  p.text('This report records participant responses, not correct answers. Original images are represented by previews and media references; complete videos are referenced, not embedded. Exact source fields and interaction records are preserved in the accompanying JSON.');
  p.heading('Protocol and provenance', 13);
  p.text(`Study: ${payload.study.study_id}\nCatalog SHA-256: ${payload.study.catalog_sha256}\nDataset: ${payload.study.dataset_repository}\nDataset revision: ${payload.study.dataset_revision}\nEvaluator revision: ${payload.study.evaluation_revision}\n${payload.study.human_media_protocol}`, 9);
  for (let i = 0; i < payload.samples.length; i++) {
    const sample = payload.samples[i], response = sample.response;
    progress(i + 1, payload.samples.length);
    p.newPage();
    p.heading(`${i + 1}. ${sample.dataset} · ${sample.domain}`, 15);
    p.text(`Sample ID: ${sample.id}\nSource split: ${sample.split}; zero-based row index: ${sample.source_row_index}\nIn nested 100-question set: ${sample.in_100 ? 'yes' : 'no'}`, 8);
    if (sample.episode_goal) { p.heading('Episode Goal', 12); p.text(sample.episode_goal); }
    if (sample.action_history) { p.heading('Action History', 12); p.text(sample.action_history); }
    p.heading('Question', 12); p.text(sample.question);
    p.heading('Options (authoritative)', 12);
    sample.options.forEach((option, j) => p.text(`${String.fromCharCode(65 + j)}. ${option}`, 10, undefined, 5));
    p.heading('Participant response', 12);
    const chosen = response.choice;
    p.text(chosen ? `Chosen option: ${chosen}\nChosen text: ${sample.options[chosen.charCodeAt(0) - 65]}` : 'Unanswered');
    p.text(`Flagged for review: ${response.flagged ? 'yes' : 'no'}\nComment / reasoning: ${response.comment || '(none)'}\nVisible time: ${(response.visible_ms / 1000).toFixed(1)} seconds; visits: ${response.visits}\nViewing actions: zoom ${response.zoom_events}, video ${response.video_events}; media errors recorded: ${response.media_errors.length}`, 9);
    if (sample.coordinate_warnings.length) p.text(`Coordinate warnings: ${sample.coordinate_warnings.join('; ')}`, 9);
    if (sample.points.length) p.text(`Candidate points in source-image pixels [x, y]: ${sample.points.map(point => `${point.label} [${point.x}, ${point.y}]${point.in_bounds ? '' : ' (outside image)'}`).join('; ')}. Exact point overlays are available in the study interface; these previews preserve the unmodified source images.`, 9);
    for (const [j, media] of sample.images.entries()) {
      await p.image(media.preview_url, `Image ${j + 1} · ${media.width} × ${media.height} source pixels`);
      p.text(`Original image: ${new URL(media.url, 'https://advaitgupta.github.io/human_eval/').href}\nSHA-256: ${media.sha256}`, 8);
    }
    if (sample.video) p.text(`Complete video: ${sample.video.url}\nSource URI: ${sample.video.source_uri}\nSHA-256: ${sample.video.sha256}`, 8);
    if (sample.video?.playback_url) p.text(`Browser-compatible playback: ${new URL(sample.video.playback_url, 'https://advaitgupta.github.io/human_eval/').href}\nPlayback SHA-256: ${sample.video.playback_sha256}\n${sample.video.playback_conversion}`, 8);
  }
  return p.finish();
}
