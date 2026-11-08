# AgentVQA human evaluation

Participant interface: https://advaitgupta.github.io/human_eval/

The interface offers a fixed 200-question set and a nested 100-question set. Every domain contributes 40 or 20 questions. Web Agents and Games contribute 10 or 5 questions per source dataset; the other three domains contribute 8 or 4. Selection uses a fixed SHA-256 ordering of source row indices, independent of answers and model results. The pinned dataset revision, evaluator revision, selection seed, row indices, media identities, and catalog digest are recorded in `catalog.json` and every response export.

Questions, goals, action histories, and selectable options follow the released dataset and evaluator. The participant UI has no answer key, model predictions, or correctness feedback. Questions retain their original wording. Null option padding and matching label prefixes are handled by the evaluator's option-formatting rules. Dataset IDs identify the subset and zero-based row in the pinned `train` split, not an original upstream ID that is absent from the release.

Participants can inspect full-resolution images, use neutral exact-point overlays, replay complete videos, navigate between datasets, flag questions, and add optional comments. Grounding points use source-image pixel `[x, y]` coordinates. Symbolic grids and existing image annotations are not reinterpreted. Human zoom and video seeking are explicit viewing aids; this protocol does not claim to reproduce every model provider's image resizing, coordinate normalization, frame sampling, or image packing.

Progress is stored in browser local storage. End-of-session PDF and JSON downloads include all selected items, unanswered items, participant responses, comments, and provenance. JSON also records viewing-action counts and approximate visible time. JSON import restores a compatible study session. No answers are uploaded automatically. The email link opens a draft addressed to `advaitgupta@ymail.com`; the participant must attach the JSON and send it. File sharing is offered when supported by the browser. There is no email credential, analytics SDK, or submission backend in this static site.

`instructions.json` supplies the interface instructions and the separately downloadable `instructions.pdf`. `pdf.js` generates response reports locally in the browser. Vendored PDF-LIB 1.17.1, @pdf-lib/fontkit 1.1.1, and DejaVu Sans avoid runtime script/font CDN dependencies; license notices are in `vendor/`. Images retain the dataset bytes; small JPEG previews are used only in PDF exports. Video URLs point to immutable Hugging Face media revisions and are loaded on demand. MarioQA's MPEG-4 Part 2 files require browser-compatible playback copies: the site uses lossless VP9 with every decoded YUV420 frame hash checked against the original. Original video references and both source and playback hashes remain in exports. No frames are dropped or resized.

Source dataset: https://huggingface.co/datasets/AgentVQA/AgentVQA

Evaluation code: https://github.com/zlab-princeton/AgentVQA
