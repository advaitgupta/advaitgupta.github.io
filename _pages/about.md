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

Hi! 👋 I am currently pursuing an M.S. in Machine Learning at the University of Maryland, College Park, and am part of [Prof. Tianyi Zhou](https://tianyizhou.github.io)'s research lab. I also collaborate with [Prof. Zhuang Liu](https://liuzhuang13.github.io) at Princeton University and [Prof. Ruohan Gao](https://ruohangao.github.io) at the University of Maryland. I have a diverse range of research experience spanning neurosymbolic reasoning for agentic planning, multimodal visual understanding, emergent architectural properties of LLMs, and classical CV and genAI systems. My recent research focusses on cost-sensitive, adaptive agents by combining LLM-driven hierarchical planning with classical A* search and enabling them to learn by mining reusable tool sequences via in-context reinforcement learning and inductive reasoning. My work also extends to embodied agents and their evaluation for agentic visual understanding. Previously, I earned my B.Tech degree in Computer Science from Rajiv Gandhi Institute of Petroleum Technology where I researched on applying computer vision in healthcare, construction and urban analytics.

I am applying to PhD programs for Fall 2026 admission and am always eager to connect with fellow researchers. If my work aligns with your interests, please feel free to reach out.

# 🔥 News
- *2025.06*: We release [FaSTA*: Fast-Slow Toolpath Agent with Subroutine Mining for Efficient Multi-turn Image Editing](https://arxiv.org/abs/2506.20911) with the [Official Codebase](https://github.com/tianyi-lab/FaSTAR). 
- *2025.03*: We release [CoSTA*: Cost-Sensitive Toolpath Agent for Multi-turn Image Editing](https://arxiv.org/abs/2503.10613) with the [Official Codebase](https://github.com/tianyi-lab/CoSTAR), [Live Demo](https://storage.googleapis.com/costa-frontend/index.html) and [Benchmark Dataset](https://huggingface.co/datasets/advaitgupta/CoSTAR). 
- *2024.08*: Joined University of Maryland for an MS in Machine Learning. 
- *2024.05*: Graduated with a Bachelor of Technology in Computer Science from RGIPT.

# 📝 Publications 

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Draft</div></div></div>
<div class='paper-box-text' markdown="1">

[\textsc{M$^3$-Edit}\xspace: An Agentic Framework for \textsc{M}ulti-modal, \textsc{M}ulti-reference, \textsc{M}ulti-task Editing](https://drive.google.com/file/d/1tkoE_fvs1OB2poH0k4CJn4fzAiAtB7NG/view?usp=sharing) 

**Advait Gupta**, Rishie Raj, Ruohan Gao

\textsc{M$^3$-Edit}\xspace is an agentic framework for multi-modal, multi-reference, multi-task editing that addresses the critical grounding failures of existing agents, which struggle to interpret complex, cross-modal instructions. To solve this, \textsc{M$^3$-Edit}\xspace employs a novel two-stage architecture that strictly decouples perception from action: an initial Analysis & Grounding stage constructs a verified, machine-readable map of all inputs called the Unified Editing Canvas (UEC), and a subsequent Manipulation & Execution stage operates on this fully-grounded canvas to generate and execute a precise, step-by-step editing plan. This design enables robust, compositional workflows and allows for granular, step-by-step quality control, a crucial advantage over monolithic models. The framework's effectiveness is validated on M³-BENCH, our new benchmark of 110 complex, multi-reference tasks designed to test the limits of agentic multimodal reasoning.

</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Draft</div></div></div>
<div class='paper-box-text' markdown="1">

[AgentVQA: A Unified Benchmark for Agentic Visual Understanding](https://drive.google.com/file/d/1gT1MkXptga2njI7mVKMo42Q51bjuNink/view?usp=sharing) 

**Advait Gupta**, Sachin Konan, Gabriel Sarch, Zhuang Liu

AgentVQA is a unified benchmark for agentic visual understanding that systematically evaluates the agentic capabilities of Vision-Language Models (VLMs). It addresses the need for a comprehensive evaluation framework by unifying 14 challenging datasets across five critical domains: Web Agents, Robotics, Egocentric Videos, Games, and Spatial Understanding. To ensure standardized and scalable analysis, AgentVQA reformulates diverse and dynamic tasks, such as web navigation and gameplay, into a unified multiple-choice question (MCQ) format. The benchmark is designed to be challenging, featuring "hard negatives" that are generated through a VLM-assisted pipeline and manually reviewed to ensure they are plausible yet incorrect, thereby testing for fine-grained understanding.

</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Preprint</div></div></div>
<div class='paper-box-text' markdown="1">

[FaSTA*: Fast-Slow Toolpath Agent with Subroutine Mining for Efficient Multi-turn Image Editing](https://arxiv.org/abs/2506.20911) [[**Project**](https://github.com/tianyi-lab/FaSTAR)<strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>]

**Advait Gupta**, Rishie Raj, Dang Nguyen, Tianyi Zhou

FaSTA* is a neurosymbolic online learning, tool-use agent with fast-slow planning for complex multi-turn image editing tasks. It decomposes a task into subtasks and calls a sequence of AI tools to address each subtask. By learning a library of frequently used subroutines (subsequences of tools), it can rely on fast planning for most subtasks, and occasionally, lazily activate slow planning (which requires A* search) for rare and challenging subtasks that the learned library of subroutines cannot handle.

</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Preprint</div></div></div>
<div class='paper-box-text' markdown="1">

[CoSTA*: Cost-Sensitive Toolpath Agent for Multi-turn Image Editing](https://arxiv.org/abs/2503.10613) [[**Project**](https://github.com/tianyi-lab/CoSTAR)<strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>]

**Advait Gupta**, NandaKiran Velaga, Dang Nguyen, Tianyi Zhou

CoSTA* is a hybrid agent for multi-turn image editing that combines LLM-based reasoning with A* search for cost-efficient tool selection, balancing cost and quality. Unlike text-to-image models like Stable Diffusion and DALLE-3, which struggle with complex edits and retaining input image details, and agents like GenArtist, CLOVA, and VisProg, which perform poorly on multimodal, multi-step tasks, CoSTA* constructs an optimal toolpath using LLM-guided hierarchical planning and A* search. It dynamically adapts by refining tool effectiveness through real-time feedback from a VLM, ensuring robust and efficient execution.

</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">SNPD 2023 (Oral)</div></div></div>
<div class='paper-box-text' markdown="1">

[From Above and Beyond: Decoding Urban Aesthetics with the Visual Pollution Index](https://link.springer.com/chapter/10.1007/978-3-031-56388-1_8) 

**Advait Gupta**, Manan Padsala, Devesh Jani, Tanmay Bisen, Aastha Shayla, Gargi Srivastava

From Above and Beyond is a framework for quantifying and visualizing urban aesthetics by creating a "Visual Pollution Index" (VPI). The system leverages drone-captured imagery and a fine-tuned YOLOv6 model to detect and categorize a wide spectrum of visual pollutants, from graffiti and potholes to cluttered sidewalks. Its core contribution is the VPI, a metric that holistically assesses an area's aesthetic quality by multiplicatively combining the diversity of pollutants present (Counting Categories Ratio) with their perceived intensity (Severity-Weighted Score). This index is then used to generate intuitive, geospatial heatmaps, providing a data-driven and actionable tool for urban planners to identify and address areas of visual degradation. It is among the top papers to be accepted for publishing in Springer's Studies in Computational Intelligence.

</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">ICMLA 2023 (Oral)</div></div></div>
<div class='paper-box-text' markdown="1">

[From Sky to Strategy: Construction Activity Index and Stage Estimation From Drone-Captured Imagery](https://ieeexplore.ieee.org/abstract/document/10459984) 

**Advait Gupta**, Manan Padsala, Aastha Shayla, Tanmay Bisen, Susham Biswas, Abhemanyu Sarin

From Sky to Strategy introduces a framework for quantifying and visualizing construction site activity using drone-captured imagery. The system leverages a fine-tuned YOLOv6 model to accurately detect and classify various construction materials from a unique, high-resolution aerial dataset. Its core contribution is the Composite Construction Activity Index (CAI), a metric that provides a holistic view of site activity by multiplicatively combining the diversity of materials present (Material Diversity Ratio) with their spatial coverage (Percentage of Image Covered). The framework also maps detected materials to specific construction phases to estimate a project's lifecycle stage, and culminates in the generation of geospatial heatmaps to provide an intuitive, data-driven tool for stakeholders in construction monitoring and urban planning.

</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">INCET 2023 (Oral)</div></div></div>
<div class='paper-box-text' markdown="1">

[Detection of pneumonia from chest X-ray images using transfer learning on deep CNN](https://ieeexplore.ieee.org/abstract/document/10170454) 

**Advait Gupta**, Manan Padsala, Pallabi Saikia

</div>
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
- *2023*: Qualified for the Grand Finale of Smart India Hackathon 2023 organized by Government of India. 
- *2022*: Among 40 students selected nationwide for the ACM Winter School on Optimization for ML and Operations Research.
- *2020*: Ranked among top 2% students in the Joint Entrance Examination - India.

# 📖 Educations
- *2024.08 - 2026.05 (Expected)*, MS in Machine Learning, University of Maryland- College Park. 
- *2020.12 - 2024.05*, Bachelor of Technology in Computer Science, Rajiv Gandhi Institute of Petroleum Technology. 

# 💻 Internships
- *2025.06 - 2024.08*, Machine Learning Intern, Delasoft Inc., New Castle, DE.
- *2024.01 - 2024.03*, Machine Learning Intern, Techpeek, India.
- *2023.05 - 2023.08*, Summer Intern, Ernst & Young, India.
- *2023.01 - 2023.03*, Machine Learning Intern, Spritle Software, India.
- *2022.06 - 2022.11*, Machine Learning Intern, AIEnsured (testAIng.com), India.
