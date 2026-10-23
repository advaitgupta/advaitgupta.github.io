---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

Hi! 👋 I'm a first-year Ph.D. student in Computer Science at the University of California, Riverside, advised by [Prof. Amit K. Roy-Chowdhury](https://vcg.ece.ucr.edu/amit). Previously, I pursued an M.S. in Machine Learning at the University of Maryland, College Park, where I worked with [Prof. Tianyi Zhou](https://tianyizhou.github.io). I also collaborate with Prof. [Prof. Zhuang Liu](https://liuzhuang13.github.io) at Princeton University and [Prof. Ruohan Gao](https://ruohangao.github.io) at the University of Maryland. I received my B.Tech in Computer Science from Rajiv Gandhi Institute of Petroleum Technology.

My research focuses on visual agents, multimodal reasoning, and efficient decision-making, with the broader goal of building intelligent systems that can perceive, reason, plan, and act efficiently in complex environments. My work spans neurosymbolic planning and learning for tool-using agents, agentic visual understanding and evaluation, and generative AI for efficient image editing and video generation. I also work on reinforcement learning for communication-efficient cooperative perception and collaborative decision-making, with broader interests in how agents learn from and interact with their environments. Across these directions, I am particularly interested in making agents more adaptive, reliable, and computationally efficient.

I am always eager to connect with fellow researchers. If my work aligns with your interests, please feel free to reach out.

# 🔥 News
- *2026.10*:  We release [AgentVQA: A Unified Benchmark for Agentic Visual Understanding](https://arxiv.org/abs/2610.31494) with the [Official Website](https://zlab-princeton.github.io/AgentVQA/).
- *2026.09*: Joined University of California, Riverside as a Ph.D. Candidate in Computer Science.
- *2026.08*: 🎉🎉 One first-author paper ([CoSTA*](https://arxiv.org/abs/2503.10613)) has been accepted by EMNLP 2026 (Findings).
- *2026.05*: Graduated with a Master of Science in Machine Learning from UMD.
- *2026.01*: 🎉🎉 One first-author paper ([FaSTA*](https://arxiv.org/abs/2506.20911)) has been accepted by ICLR 2026. 
- *2025.06*: We release [FaSTA*: Fast-Slow Toolpath Agent with Subroutine Mining for Efficient Multi-turn Image Editing](https://arxiv.org/abs/2506.20911) with the [Official Codebase](https://github.com/tianyi-lab/FaSTAR). 
- *2025.03*: We release [CoSTA*: Cost-Sensitive Toolpath Agent for Multi-turn Image Editing](https://arxiv.org/abs/2503.10613) with the [Official Codebase](https://github.com/tianyi-lab/CoSTAR), [Live Demo](https://storage.googleapis.com/costa-frontend/index.html) and [Benchmark Dataset](https://huggingface.co/datasets/advaitgupta/CoSTAR). 
- *2024.08*: Joined University of Maryland for an MS in Machine Learning. 
- *2024.05*: Graduated with a Bachelor of Technology in Computer Science from RGIPT.

# 📝 Publications

<div class="publications">

<article class="publication" aria-labelledby="title-agentvqa">
  <div class="publication-venue">Preprint</div>
  <div class="publication-body">
    <h3 class="publication-title" id="title-agentvqa"><a href="https://arxiv.org/abs/2610.31494">AgentVQA: A Unified Benchmark for Agentic Visual Understanding</a></h3>
    <p class="publication-authors"><strong>Advait Gupta</strong>, Sachin Konan, Tom Yin, Gabriel Sarch, Zhuang Liu</p>
    <div class="publication-links">
      <button type="button" class="publication-button publication-toggle" aria-expanded="true" aria-controls="abstract-agentvqa" hidden>Abstract</button>
      <a class="publication-button" href="https://arxiv.org/pdf/2610.31494">PDF</a>
      <a class="publication-button" href="https://github.com/zlab-princeton/AgentVQA">Code</a>
    </div>
    <div class="publication-abstract" id="abstract-agentvqa" markdown="1">

Vision-language models (VLMs) can perform a broad range of tasks across diverse settings, yet their performance in agentic contexts remains poorly understood. Although online evaluations in simulators and real-world environments are essential for measuring interactive agent performance, they are costly and challenging to scale. Complementary offline VQA benchmarks can enable faster and more reliable comparisons across agentic domains, yet existing benchmarks remain limited and fragmented. To address this gap, we introduce AgentVQA, an offline benchmark for evaluating VLMs on realistic agentic scenarios across five agent domains: Web Agents, Robotics, Egocentric Videos, Games, and Spatial Planning. We build AgentVQA by manually selecting 1000 challenging, real-world agent examples from 23 source datasets and adapting them for reliable offline evaluation. The resulting benchmark preserves realistic scenarios from interactive environments across diverse domains, and its model rankings track those from corresponding online evaluations. Across the 22 evaluated models, the best achieves only 58.5% accuracy. Our cross-domain analysis shows that errors are driven primarily by failures to ground and maintain accurate representations of the current and evolving visual state, including localizing relevant UI elements, interpreting motion, tracking state changes over time, and inferring 3D spatial relationships, rather than by task misinterpretation or downstream logical reasoning.

</div>
  </div>
</article>

<article class="publication" aria-labelledby="title-m3-edit">
  <div class="publication-venue">Preprint</div>
  <div class="publication-body">
    <h3 class="publication-title" id="title-m3-edit"><a href="https://drive.google.com/file/d/1tkoE_fvs1OB2poH0k4CJn4fzAiAtB7NG/view?usp=sharing">M<sup>3</sup>-EDIT: An Agentic Framework for Multi-modal, Multi-reference, Multi-task Editing</a></h3>
    <p class="publication-authors"><strong>Advait Gupta</strong>, Rishie Raj</p>
    <div class="publication-links">
      <button type="button" class="publication-button publication-toggle" aria-expanded="true" aria-controls="abstract-m3-edit" hidden>Abstract</button>
      <a class="publication-button" href="https://drive.google.com/file/d/1tkoE_fvs1OB2poH0k4CJn4fzAiAtB7NG/view?usp=sharing">PDF</a>
    </div>
    <div class="publication-abstract" id="abstract-m3-edit" markdown="1">

Agentic frameworks show promise for automated editing but remain largely confined to unimodal workflows. Existing approaches struggle with complex, multi-reference instructions that span modalities, often resulting in grounding errors. To address this gap, we introduce M<sup>3</sup>-EDIT, an agentic framework for multi-modal, multi-reference, multi-task editing. M<sup>3</sup>-EDIT offers two key advantages: First, it can edit any target modality using reference inputs from any other modality, enabling rich cross-media editing. Second, it employs a two-stage architecture that decouples perception from action: an Analysis & Grounding stage first constructs a verified, machine-readable Unified Editing Canvas (UEC) over all inputs, and a separate Execution stage then operates on this canvas to carry out the requested edits. This design allows M<sup>3</sup>-Edit to reliably handle challenging tasks, such as targeted dialog replacement and visually-guided audio editing. We further introduce M<sup>3</sup>-BENCH, a benchmark comprising 110 complex editing tasks, where quantitative evaluations and human studies consistently validate the effectiveness of our framework.

</div>
  </div>
</article>

<article class="publication" aria-labelledby="title-fastar">
  <div class="publication-venue">ICLR 2026</div>
  <div class="publication-body">
    <h3 class="publication-title" id="title-fastar"><a href="https://arxiv.org/abs/2506.20911">FaSTA*: Fast-Slow Toolpath Agent with Subroutine Mining for Efficient Multi-turn Image Editing</a></h3>
    <p class="publication-authors"><strong>Advait Gupta</strong>, Rishie Raj, Dang Nguyen, Tianyi Zhou</p>
    <div class="publication-links">
      <button type="button" class="publication-button publication-toggle" aria-expanded="true" aria-controls="abstract-fastar" hidden>Abstract</button>
      <a class="publication-button" href="https://arxiv.org/pdf/2506.20911">PDF</a>
      <a class="publication-button" href="https://github.com/tianyi-lab/FaSTAR">Code</a>
    </div>
    <div class="publication-abstract" id="abstract-fastar" markdown="1">

We develop a cost-efficient neurosymbolic agent to address challenging multi-turn image editing tasks such as “Detect the bench in the image while recoloring it to pink. Also, remove the cat for a clearer view and recolor the wall to yellow.” It combines the fast, high-level subtask planning by large language models (LLMs) with the slow, accurate, tool-use, and local A<sup>*</sup> search per subtask to find a cost-efficient toolpath—a sequence of calls to AI tools. To save the cost of A<sup>*</sup> on similar subtasks, we perform inductive reasoning on previously successful toolpaths via LLMs to continuously extract/refine frequently used subroutines and reuse them as new tools for future tasks in an adaptive fast-slow planning, where the higher-level subroutines are explored first, and only when they fail, the low-level A<sup>*</sup> search is activated. The reusable symbolic subroutines considerably save exploration cost on the same types of subtasks applied to similar images, yielding a human-like fast-slow toolpath agent “FaSTA<sup>*</sup>”: fast subtask planning followed by rule-based subroutine selection per subtask is attempted by LLMs at first, which is expected to cover most tasks, while slow A<sup>*</sup> search is only triggered for novel and challenging subtasks. By comparing with recent image editing approaches, we demonstrate FaSTA<sup>*</sup> is significantly more computationally efficient while remaining competitive with the state-of-the-art baseline in terms of success rate. Our code and data can be accessed [here](https://github.com/tianyi-lab/FaSTAR).

</div>
  </div>
</article>

<article class="publication" aria-labelledby="title-costar">
  <div class="publication-venue">EMNLP 2026</div>
  <div class="publication-body">
    <h3 class="publication-title" id="title-costar"><a href="https://arxiv.org/abs/2503.10613">CoSTA*: Cost-Sensitive Toolpath Agent for Multi-turn Image Editing</a></h3>
    <p class="publication-authors"><strong>Advait Gupta</strong>, NandaKiran Velaga, Dang Nguyen, Tianyi Zhou</p>
    <div class="publication-links">
      <button type="button" class="publication-button publication-toggle" aria-expanded="true" aria-controls="abstract-costar" hidden>Abstract</button>
      <a class="publication-button" href="https://arxiv.org/pdf/2503.10613">PDF</a>
      <a class="publication-button" href="https://github.com/tianyi-lab/CoSTAR">Code</a>
    </div>
    <div class="publication-abstract" id="abstract-costar" markdown="1">

Text-to-image models like stable diffusion and DALLE-3 still struggle with multi-turn image editing. We decompose such a task as an agentic workflow (path) of tool use that addresses a sequence of subtasks by AI tools of varying costs. Conventional search algorithms require expensive exploration to find tool paths. While large language models (LLMs) possess prior knowledge of subtask planning, they may lack accurate estimations of capabilities and costs of tools to determine which to apply in each subtask. Can we combine the strengths of both LLMs and graph search to find cost-efficient tool paths? We propose a three-stage approach "CoSTA*" that leverages LLMs to create a subtask tree, which helps prune a graph of AI tools for the given task, and then conducts A* search on the small subgraph to find a tool path. To better balance the total cost and quality, CoSTA* combines both metrics of each tool on every subtask to guide the A* search. Each subtask's output is then evaluated by a vision-language model (VLM), where a failure will trigger an update of the tool's cost and quality on the subtask. Hence, the A* search can recover from failures quickly to explore other paths. Moreover, CoSTA* can automatically switch between modalities across subtasks for a better cost-quality trade-off. We build a novel benchmark of challenging multi-turn image editing, on which CoSTA* outperforms state-of-the-art image-editing models or agents in terms of both cost and quality, and performs versatile trade-offs upon user preference.

</div>
  </div>
</article>

<article class="publication" aria-labelledby="title-visual-pollution">
  <div class="publication-venue">SNPD 2023<br><span class="publication-venue-note">(Oral)</span></div>
  <div class="publication-body">
    <h3 class="publication-title" id="title-visual-pollution"><a href="https://link.springer.com/chapter/10.1007/978-3-031-56388-1_8">From Above and Beyond: Decoding Urban Aesthetics with the Visual Pollution Index</a></h3>
    <p class="publication-authors"><strong>Advait Gupta</strong>, Manan Padsala, Devesh Jani, Tanmay Bisen, Aastha Shayla, Gargi Srivastava</p>
    <div class="publication-links">
      <button type="button" class="publication-button publication-toggle" aria-expanded="true" aria-controls="abstract-visual-pollution" hidden>Abstract</button>
      <a class="publication-button" href="https://link.springer.com/content/pdf/10.1007/978-3-031-56388-1_8.pdf">PDF</a>
    </div>
    <div class="publication-abstract" id="abstract-visual-pollution" markdown="1">

Urban landscapes, emblematic of modernization and growth, are increasingly faced with the intricate challenge of visual pollution. This nuanced form of pollution, often overshadowed environmental discussions, profoundly influences the aesthetic harmony and mental well-being of urban inhabitants. In this research, we present an innovative methodology to detect visual pollution using drone-captured imagery. Our distinctive dataset captures a spectrum of visual pollutants, from graffiti, faded signage, and potholes to more complex issues like cluttered sidewalks and unkempt facades. Leveraging this dataset, we fine-tuned pre-trained object detection models, specifically YOLOv6, achieving remarkable accuracy in detecting these visual pollutants from images. Central to our study is the introduction of the Visual Pollution Index (VPI), a metric formulated through the multiplicative integration of the Counting Categories Ratio (CCR) and the Severity-Weighted Score (SWS). To provide a spatial representation of visual pollution levels, we further introduce heatmap visualizations. These heatmaps, overlaid on urban maps, offer a vivid depiction of pollution hotspots, enabling city planners and stakeholders to pinpoint areas of concern. Grounded in real-world perceptions, our approach offers a comprehensive lens to assess, visualize, and address visual pollution in urban environments.

</div>
  </div>
</article>

<article class="publication" aria-labelledby="title-construction-activity">
  <div class="publication-venue">ICMLA 2023<br><span class="publication-venue-note">(Oral)</span></div>
  <div class="publication-body">
    <h3 class="publication-title" id="title-construction-activity"><a href="https://ieeexplore.ieee.org/abstract/document/10459984">From Sky to Strategy: Construction Activity Index and Stage Estimation From Drone-Captured Imagery</a></h3>
    <p class="publication-authors"><strong>Advait Gupta</strong>, Manan Padsala, Aastha Shayla, Tanmay Bisen, Susham Biswas, Abhemanyu Sarin</p>
    <div class="publication-links">
      <button type="button" class="publication-button publication-toggle" aria-expanded="true" aria-controls="abstract-construction-activity" hidden>Abstract</button>
      <a class="publication-button" href="https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&amp;arnumber=10459984">PDF</a>
    </div>
    <div class="publication-abstract" id="abstract-construction-activity" markdown="1">

In the rapidly evolving construction industry, timely and accurate monitoring of construction activities is paramount. This paper introduces a novel approach to quantifying construction activity using high-resolution drone imagery and advanced object detection models. We present a unique, high-quality dataset of construction site images captured from drones, which is distinct from the commonly used open-source or lower-quality datasets. Leveraging this dataset, we fine-tuned pre-trained object detection models to achieve remarkable accuracy in detecting construction materials from images. Building on this, we introduce the Composite Construction Activity Index (CAI), a metric formulated by combining the Material Diversity Ratio (MDR) and the Percentage of Image Covered by Construction Materials (PIC). This metric offers a comprehensive view of construction activity, capturing both its diversity and intensity. Additionally, we propose a methodology to map construction stages based on the detected materials, categorizing them into distinct phases of construction, providing insights into the project's lifecycle. The paper culminates in the visualization of CAI values through heatmaps, offering a spatial representation of construction activity across cities or countries. Our findings and methodologies pave the way for more informed decision-making by stakeholders, from urban planners to construction managers, emphasizing the potential of drone technology and machine learning in revolutionizing construction monitoring.

</div>
  </div>
</article>

<article class="publication" aria-labelledby="title-pneumonia">
  <div class="publication-venue">INCET 2023</div>
  <div class="publication-body">
    <h3 class="publication-title" id="title-pneumonia"><a href="https://ieeexplore.ieee.org/abstract/document/10170454">Detection of pneumonia from chest X-ray images using transfer learning on deep CNN</a></h3>
    <p class="publication-authors"><strong>Advait Gupta</strong>, Manan Padsala, Pallabi Saikia</p>
    <div class="publication-links">
      <button type="button" class="publication-button publication-toggle" aria-expanded="true" aria-controls="abstract-pneumonia" hidden>Abstract</button>
      <a class="publication-button" href="https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&amp;arnumber=10170454">PDF</a>
    </div>
    <div class="publication-abstract" id="abstract-pneumonia" markdown="1">

Pneumonia is a serious lung infection that can be life-threatening if not diagnosed and treated on time. Accurately diagnosing pneumonia from X-ray images is essential for timely treatment and improved patient outcomes. In this research paper, we propose an approach for diagnosing pneumonia using X-ray images by leveraging the power of convolutional neural networks (CNNs) and transfer learning. The proposed approach utilizes a pre-trained MobileNet model, which is a popular CNN architecture, and adds additional layers on top to fine-tune the model for the specific task of diagnosing pneumonia. This approach was more effective than training a CNN model from scratch or using traditional machine-learning methods. Our proposed approach demonstrated superior performance when compared to previously utilized models and techniques as evidenced by the results obtained. The use of CNNs and transfer learning in medical imaging is a growing area of research, and our proposed approach is a significant advancement in the field of pneumonia diagnosis. The proposed approach has the potential to improve the accuracy and efficiency of pneumonia diagnosis and ultimately save lives.

</div>
  </div>
</article>

</div>

# 🎖 Honors and Awards
- *2026*: Recognized as a Top Reviewer by NeurIPS 2026.
- *2026*: Received the Dean’s Distinguished Fellowship Award at the University of California, Riverside.
- *2026*: Received a travel grant to attend ICLR 2026 in Rio de Janeiro.
- *2023*: Qualified for the Grand Finale of Smart India Hackathon 2023 organized by Government of India. 
- *2022*: Selected as a mentee for Amazon ML Summer School.
- *2022*: Among 40 students selected nationwide for the ACM Winter School on Optimization for ML and Operations Research.
- *2020*: Qualified for the ICPC Amritapuri Regional.
- *2020*: Ranked among top 2% students in the Joint Entrance Examination - India.

# 📖 Educations
- *2026.09 - 2030.05 (Expected)*, PhD in Computer Science, University of California, Riverside.
- *2024.08 - 2026.05*, MS in Machine Learning, University of Maryland- College Park.
- *2020.12 - 2024.05*, Bachelor of Technology in Computer Science, Rajiv Gandhi Institute of Petroleum Technology. 

# 💻 Internships
- *2025.06 - 2024.08*, Machine Learning Intern, Delasoft Inc., New Castle, DE.
- *2024.01 - 2024.03*, Machine Learning Intern, Techpeek, India.
- *2023.05 - 2023.08*, Summer Intern, Ernst & Young, India.
- *2023.01 - 2023.03*, Machine Learning Intern, Spritle Software, India.
- *2022.06 - 2022.11*, Machine Learning Intern, AIEnsured (testAIng.com), India.

# 🐱 Services
- Reviewer: ICLR 2026, NeurIPS 2026, TMLR, ACL ARR Jan 2026, ICMLA 2023, 2024
- Program Committee: ICMLA 2023, 2024

# 🚀 Personal Projects
- [AI Co-Pilot for Proactive Financial Regulatory Intelligence & Strategy](https://github.com/advaitgupta/Axiom-Prime) 📅 Present
  - Building AI co-pilot providing automated **regulatory monitoring** (SEC, FINRA filings), legislative forecasting (XGBoost), and internal policy gap analysis; its multi-agent system (LangGraph, TinyLlama) reasons over a hybrid RAG knowledge core (pgvector, Neo4j) populated by a real-time Kafka/PySpark pipeline with OCR/Table extraction.
  - Deploying it via a full MLOps pipeline (Jenkins, K8s, MLflow) to deliver risk-optimized strategic recommendations through a conversational UI chatbot (FastAPI, React) and ensure data privacy with Federated Learning (Flower).

- [Emotion-Based Poem Generation with GPT-2](https://github.com/advaitgupta/Emotion-Based-Poem-Generation) 📅 2023.07
  - The Emotion-Based Poem Generation project fine-tunes GPT-2 to create poems that reflect user-specified emotions. Using a curated dataset labeled with emotions from the NRC Emotion Lexicon, the model generates text that aligns with both style and sentiment. By leveraging emotion prompts, it ensures the output resonates with the intended tone while allowing users to customize poem length.

- [Billboard Advertisement Recommendation System](https://github.com/advaitgupta/Billboard-Advertisement-Recommendation-System) 📅 2023.06
  - The Billboard Advertisement Recommendation System is a dynamic platform that selects ads based on real-time traffic and pedestrian demographics. Using computer vision, machine learning, and content-based filtering, it analyzes the audience to display relevant ads.
