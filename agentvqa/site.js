(() => {
  "use strict";
  const data = window.AGENTVQA_DATA;
  if (!data) return;
  const $ = id => document.getElementById(id);
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const icon = family => {
    const img = element("img", "model-icon");
    img.src = `assets/models/${family}.svg`;
    img.alt = "";
    img.width = 20;
    img.height = 20;
    return img;
  };
  const letter = index => String.fromCharCode(65 + index);
  const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

  if ($("example-browser")) {
    let domainIndex = 0;
    const positions = data.domains.map(() => 0);
    let showAnswer = true;
    const panel = $("example-browser");
    const tabs = $("domain-controls");
    const samples = () => data.examples.filter(e => e.domain === data.domains[domainIndex].name);
    const current = () => samples()[positions[domainIndex]];

    function renderOptions() {
      const sample = current();
      const options = $("sample-options");
      options.replaceChildren();
      sample.options.forEach((text, index) => {
        const isGold = index === sample.answer && showAnswer;
        const row = element("div", `option${isGold ? " correct" : ""}`);
        row.dataset.option = letter(index);
        row.append(element("span", "option-letter", letter(index)));
        const body = element("div", "option-body");
        const clean = text.replace(new RegExp(`^\\s*${letter(index)}[.)]\\s+`), "");
        body.append(element("span", "option-text", clean));
        if (isGold) body.append(element("span", "gold-label", "✓ Correct answer"));
        row.append(body);
        const predictions = element("div", "option-predictions");
        sample.predictions.filter(p => p.answer === index).forEach(prediction => {
          const title = `${data.models[prediction.family]} selected ${letter(index)}`;
          const badge = element("span", "model-badge");
          badge.dataset.model = prediction.family;
          badge.tabIndex = 0;
          badge.setAttribute("role", "img");
          badge.setAttribute("aria-label", title);
          badge.title = title;
          badge.append(icon(prediction.family), element("span", "model-tooltip", title));
          predictions.append(badge);
        });
        row.append(predictions);
        options.append(row);
      });
      $("reveal-answer").textContent = showAnswer ? "Hide answer" : "Show answer";
      $("reveal-answer").setAttribute("aria-pressed", String(showAnswer));
      const wrong = sample.predictions.filter(p => p.answer !== sample.answer).length;
      $("answer-feedback").textContent = showAnswer ? `${wrong} of 4 shown models missed this question.` : "The annotation is hidden. Which option would you choose?";
    }

    function imageLink(sample, index) {
      const link = element("a", "sample-image-link");
      link.href = sample.images[index];
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", `Open ${sample.subset} image ${index + 1} at full resolution`);
      const img = element("img");
      img.src = sample.images[index];
      img.alt = `${sample.subset}: ${sample.title}. Image ${index + 1} of ${sample.images.length}.`;
      [img.width, img.height] = sample.sizes[index];
      link.append(img);
      return link;
    }

    function renderMedia(sample) {
      const media = $("sample-media");
      media.querySelectorAll("video").forEach(video => video.pause());
      media.replaceChildren();
      media.className = "sample-media";
      if (sample.video) {
        const video = element("video");
        video.controls = true;
        video.playsInline = true;
        video.preload = "none";
        video.poster = sample.poster;
        video.src = sample.video;
        video.setAttribute("aria-label", `${sample.subset} example video`);
        video.addEventListener("error", () => {
          const message = element("p", "small-note", "Playback unavailable in this browser. ");
          const link = element("a", "", "Open the original video ↗");
          link.href = sample.video;
          link.target = "_blank";
          link.rel = "noopener";
          message.append(link);
          if (!media.querySelector("p")) media.append(message);
        });
        media.append(video);
        $("media-caption").textContent = `Full video · ${time(sample.duration)} · Play to explore the scene`;
        return;
      }
      if (sample.images.length <= 4) {
        if (sample.images.length > 1) media.classList.add("multiple");
        sample.images.forEach((_, index) => {
          const figure = element("figure");
          figure.append(imageLink(sample, index));
          if (sample.images.length > 1) figure.append(element("figcaption", "image-label", `Image ${index + 1}`));
          media.append(figure);
        });
      } else {
        let imageIndex = 0;
        const stage = element("div", "gallery-stage");
        const controls = element("div", "gallery-controls");
        const previous = element("button", "icon-button", "←");
        previous.type = "button";
        previous.setAttribute("aria-label", "Previous image in this sample");
        const count = element("span");
        count.setAttribute("aria-live", "polite");
        const next = element("button", "icon-button", "→");
        next.type = "button";
        next.setAttribute("aria-label", "Next image in this sample");
        controls.append(previous, count, next);
        const thumbnails = element("div", "gallery-thumbnails");
        thumbnails.setAttribute("role", "group");
        thumbnails.setAttribute("aria-label", "Images in this sample");
        const update = () => {
          stage.replaceChildren(imageLink(sample, imageIndex));
          count.textContent = `Image ${imageIndex + 1} of ${sample.images.length}`;
          [...thumbnails.children].forEach((b, i) => b.setAttribute("aria-pressed", String(i === imageIndex)));
        };
        sample.images.forEach((path, index) => {
          const button = element("button");
          button.type = "button";
          button.setAttribute("aria-label", `Show image ${index + 1}`);
          const img = element("img");
          img.src = path;
          img.alt = "";
          img.loading = "lazy";
          button.append(img, element("span", "", String(index + 1)));
          button.addEventListener("click", () => { imageIndex = index; update(); });
          thumbnails.append(button);
        });
        previous.addEventListener("click", () => { imageIndex = (imageIndex - 1 + sample.images.length) % sample.images.length; update(); });
        next.addEventListener("click", () => { imageIndex = (imageIndex + 1) % sample.images.length; update(); });
        media.append(stage, controls, thumbnails);
        update();
      }
      const size = sample.sizes[0];
      const coords = sample.options.some(o => /\[\s*\d+(?:\.\d+)?\s*,/.test(o));
      $("media-caption").textContent = coords
        ? `Original image: ${size[0]} × ${size[1]} px. Choice coordinates use (x, y) in original-image pixels.`
        : `${sample.images.length === 1 ? "Original dataset image" : `${sample.images.length} images in their original order`} · Select an image to enlarge`;
    }

    function render() {
      const domain = data.domains[domainIndex];
      const sample = current();
      panel.style.setProperty("--domain-color", domain.color);
      panel.style.setProperty("--domain-ink", domain.ink);
      panel.style.setProperty("--domain-tint", domain.tint);
      panel.setAttribute("aria-labelledby", `domain-${domainIndex}`);
      [...tabs.children].forEach((tab, index) => {
        tab.setAttribute("aria-selected", String(index === domainIndex));
        tab.tabIndex = index === domainIndex ? 0 : -1;
      });
      $("sample-subset").textContent = sample.subset;
      $("sample-index").textContent = sample.video ? "Video" : sample.images.length > 1 ? "Image sequence" : "Image";
      $("sample-position").textContent = `${positions[domainIndex] + 1} / ${samples().length}`;
      $("sample-kind").textContent = sample.title;
      $("sample-context").replaceChildren();
      for (const [label, value] of [["Episode Goal", sample.displayGoal ?? sample.goal], ["Action History", sample.history]]) {
        if (!value) continue;
        const block = element("div", "sample-context");
        block.append(element("strong", "", label), element("p", "", typeof value === "string" ? value : JSON.stringify(value)));
        $("sample-context").append(block);
      }
      $("question-context").replaceChildren();
      const question = sample.displayQuestion ?? sample.question;
      if (sample.subset === "Atari" && question.includes("QUESTION:")) {
        const split = question.indexOf("QUESTION:");
        const details = element("details", "game-context");
        details.append(element("summary", "", "Game description, visuals, and rules"), element("p", "", question.slice(0, split).trim()));
        $("question-context").append(details);
        $("sample-question").textContent = question.slice(split).trim();
      } else {
        $("sample-question").textContent = question;
      }
      $("sample-source").href = sample.source;
      showAnswer = true;
      renderMedia(sample);
      renderOptions();
    }

    data.domains.forEach((domain, index) => {
      const button = element("button");
      button.type = "button";
      button.id = `domain-${index}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "example-browser");
      button.style.setProperty("--domain-color", domain.color);
      button.style.setProperty("--domain-ink", domain.ink);
      button.style.setProperty("--domain-tint", domain.tint);
      const dot = element("span", "domain-dot");
      dot.setAttribute("aria-hidden", "true");
      button.append(dot, document.createTextNode(domain.name));
      button.addEventListener("click", () => { domainIndex = index; render(); });
      button.addEventListener("keydown", event => {
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % data.domains.length;
        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + data.domains.length) % data.domains.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = data.domains.length - 1;
        else return;
        event.preventDefault();
        domainIndex = nextIndex;
        render();
        tabs.children[nextIndex].focus();
      });
      tabs.append(button);
    });
    Object.entries(data.models).forEach(([family, model]) => {
      const item = element("span", "legend-model");
      item.append(icon(family), document.createTextNode(model));
      $("model-legend").append(item);
    });
    const move = delta => {
      positions[domainIndex] = (positions[domainIndex] + delta + samples().length) % samples().length;
      render();
    };
    $("previous-sample").addEventListener("click", () => move(-1));
    $("next-sample").addEventListener("click", () => move(1));
    $("reveal-answer").addEventListener("click", () => { showAnswer = !showAnswer; renderOptions(); });
    render();
  }

  if ($("results-body")) {
    let column = "5";
    let descending = true;
    const maxima = Array.from({length: 6}, (_, i) => Math.max(...data.results.map(r => r.scores[i])));
    function renderResults() {
      const query = $("model-search").value.trim().toLowerCase();
      const rows = data.results.filter(r => r.model.toLowerCase().includes(query)).slice();
      rows.sort((a, b) => {
        const comparison = column === "model" ? a.model.localeCompare(b.model) : a.scores[Number(column)] - b.scores[Number(column)];
        return (descending ? -1 : 1) * comparison || a.model.localeCompare(b.model);
      });
      $("results-body").replaceChildren();
      rows.forEach(result => {
        const row = element("tr");
        row.append(element("td", "", result.model));
        result.scores.forEach((score, index) => row.append(element("td", score === maxima[index] ? "best" : "", score.toFixed(1))));
        $("results-body").append(row);
      });
      if (!rows.length) {
        const row = element("tr");
        const cell = element("td", "", "No models match your search.");
        cell.colSpan = 7;
        row.append(cell);
        $("results-body").append(row);
      }
      document.querySelectorAll("th[data-column]").forEach(th => {
        const active = th.dataset.column === column;
        th.setAttribute("aria-sort", active ? descending ? "descending" : "ascending" : "none");
        th.querySelector(".sort-mark").textContent = active ? descending ? "▼" : "▲" : "";
      });
    }
    $("model-search").addEventListener("input", renderResults);
    document.querySelectorAll("th[data-column] button").forEach(button => button.addEventListener("click", () => {
      const next = button.parentElement.dataset.column;
      descending = next === column ? !descending : next !== "model";
      column = next;
      renderResults();
    }));
    renderResults();
  }

  document.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($(button.dataset.copy).textContent);
      button.textContent = "Copied ✓";
    } catch {
      const range = document.createRange();
      range.selectNodeContents($(button.dataset.copy));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "Selected — press Ctrl/Cmd+C";
    }
    setTimeout(() => { button.textContent = "Copy BibTeX"; }, 3000);
  }));
})();
