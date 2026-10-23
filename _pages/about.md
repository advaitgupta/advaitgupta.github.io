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

**AgentVQA** is a unified offline benchmark for evaluating agentic visual understanding in Vision-Language Models (VLMs) without costly interactive evaluations. It consists of **1,000 challenging, human-verified questions from 23 datasets** across five domains: Web Agents, Robotics, Egocentric Videos, Games, and Spatial Planning. Evaluating 22 VLMs, we find that the best model achieves just **58.5% accuracy**, revealing substantial gaps in agentic visual understanding. We further show that offline model rankings correlate strongly with online agent evaluations, supporting AgentVQA as a scalable evaluation framework.

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

**M<sup>3</sup>-EDIT** is an agentic framework for multimodal, multi-reference, and multi-task editing that separates perception from execution. It first constructs a verified Unified Editing Canvas (UEC) to ground inputs and instructions, then generates and executes a step-by-step editing plan with granular quality control. This approach enables reliable, compositional editing and is evaluated on **M³-BENCH**, a new benchmark of 110 challenging multi-reference tasks.

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

FaSTA* is a neurosymbolic online learning, tool-use agent with fast-slow planning for complex multi-turn image editing tasks. It decomposes a task into subtasks and calls a sequence of AI tools to address each subtask. By learning a library of frequently used subroutines (subsequences of tools), it can rely on fast planning for most subtasks, and occasionally, lazily activate slow planning (which requires A* search) for rare and challenging subtasks that the learned library of subroutines cannot handle.

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

CoSTA* is a hybrid agent for multi-turn image editing that combines LLM-based reasoning with A* search for cost-efficient tool selection, balancing cost and quality. Unlike text-to-image models like Stable Diffusion and DALLE-3, which struggle with complex edits and retaining input image details, and agents like GenArtist, CLOVA, and VisProg, which perform poorly on multimodal, multi-step tasks, CoSTA* constructs an optimal toolpath using LLM-guided hierarchical planning and A* search. It dynamically adapts by refining tool effectiveness through real-time feedback from a VLM, ensuring robust and efficient execution.

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

From Above and Beyond is a framework for quantifying and visualizing urban aesthetics by creating a "Visual Pollution Index" (VPI). The system leverages drone-captured imagery and a fine-tuned YOLOv6 model to detect and categorize a wide spectrum of visual pollutants, from graffiti and potholes to cluttered sidewalks. Its core contribution is the VPI, a metric that holistically assesses an area's aesthetic quality by multiplicatively combining the diversity of pollutants present (Counting Categories Ratio) with their perceived intensity (Severity-Weighted Score). This index is then used to generate intuitive, geospatial heatmaps, providing a data-driven and actionable tool for urban planners to identify and address areas of visual degradation. It is among the top papers to be accepted for publishing in Springer's Studies in Computational Intelligence.

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

From Sky to Strategy introduces a framework for quantifying and visualizing construction site activity using drone-captured imagery. The system leverages a fine-tuned YOLOv6 model to accurately detect and classify various construction materials from a unique, high-resolution aerial dataset. Its core contribution is the Composite Construction Activity Index (CAI), a metric that provides a holistic view of site activity by multiplicatively combining the diversity of materials present (Material Diversity Ratio) with their spatial coverage (Percentage of Image Covered). The framework also maps detected materials to specific construction phases to estimate a project's lifecycle stage, and culminates in the generation of geospatial heatmaps to provide an intuitive, data-driven tool for stakeholders in construction monitoring and urban planning.

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

This work studies automated pneumonia detection in chest X-rays using transfer learning with a pre-trained MobileNet convolutional neural network. Additional layers adapt the model to the diagnosis task, and the method is compared with a CNN trained from scratch and traditional machine-learning approaches. [Read the published abstract](https://ieeexplore.ieee.org/document/10170454/).

</div>
  </div>
</article>

</div>

# 🚀 Personal Projects
- [AI Co-Pilot for Proactive Financial Regulatory Intelligence & Strategy](https://github.com/advaitgupta/Axiom-Prime) 📅 Present
  - Building AI co-pilot providing automated **regulatory monitoring** (SEC, FINRA filings), legislative forecasting (XGBoost), and internal policy gap analysis; its multi-agent system (LangGraph, TinyLlama) reasons over a hybrid RAG knowledge core (pgvector, Neo4j) populated by a real-time Kafka/PySpark pipeline with OCR/Table extraction.
  - Deploying it via a full MLOps pipeline (Jenkins, K8s, MLflow) to deliver risk-optimized strategic recommendations through a conversational UI chatbot (FastAPI, React) and ensure data privacy with Federated Learning (Flower).
 
- [Emotion-Based Poem Generation with GPT-2](https://github.com/advaitgupta/Emotion-Based-Poem-Generation) 📅 2023.07
  - The Emotion-Based Poem Generation project fine-tunes GPT-2 to create poems that reflect user-specified emotions. Using a curated dataset labeled with emotions from the NRC Emotion Lexicon, the model generates text that aligns with both style and sentiment. By leveraging emotion prompts, it ensures the output resonates with the intended tone while allowing users to customize poem length.

- [Billboard Advertisement Recommendation System](https://github.com/advaitgupta/Billboard-Advertisement-Recommendation-System) 📅 2023.06
  - The Billboard Advertisement Recommendation System is a dynamic platform that selects ads based on real-time traffic and pedestrian demographics. Using computer vision, machine learning, and content-based filtering, it analyzes the audience to display relevant ads.

# 🎖 Honors and Awards
- *2026*: Received the Dean’s Distinguished Fellowship Award at the University of California, Riverside.
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
