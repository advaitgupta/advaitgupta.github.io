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

Hi! 👋 I am currently pursuing an M.S. in Machine Learning at the University of Maryland, College Park, and am part of Prof. Tianyi Zhou's research lab. My research broadly encompasses machine learning with specific interests in computer vision, natural language processing, multimodal techniques, and generative AI. I am particularly passionate about building intelligent agents that leverage reasoning capabilities to effectively perform vision-related tasks and decision-making processes. Previously, I earned my B.Tech degree in Computer Science from Rajiv Gandhi Institute of Petroleum Technology where I researched on applying computer vision techniques in healthcare, construction and urban analytics. 

I am actively seeking internship opportunities for Summer 2025 to further advance these research interests. I am open to collaborating—if my research interests and work resonate with you, feel free to reach out to discuss potential opportunities!

# 🔥 News
- *2025.03*: We release [CoSTA*: Cost-Sensitive Toolpath Agent for Multi-turn Image Editing](https://arxiv.org/abs/2503.10613) with the [Official Codebase](https://github.com/tianyi-lab/CoSTAR), [Live Demo](https://storage.googleapis.com/costa-frontend/index.html) and [Benchmark Dataset](https://huggingface.co/datasets/advaitgupta/CoSTAR). 
- *2024.08*: Joined University of Maryland for an MS in Machine Learning. 
- *2024.05*: Graduated with a Bachelor of Technology in Computer Science from RGIPT.
- *2023.10*: ["From Above and Beyond: Decoding Urban Aesthetics with the Visual Pollution Index"](https://link.springer.com/chapter/10.1007/978-3-031-56388-1_8) accepted for oral presentation at SNPD-2023. It is also among the top papers to be acepted to published in Springer's Studies in Comutational Intelligence.
- *2023.09*: ["From Sky to Strategy: Construction Activity Index and Stage Estimation From Drone-Captured Imagery"](https://ieeexplore.ieee.org/abstract/document/10459984) accepted for oral presentation at ICMLA 2023.


# 📝 Publications 

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Preprint</div><img src='images/costa.png' alt="sym" width="10%"></div></div>
<div class='paper-box-text' markdown="1">

[CoSTA*: Cost-Sensitive Toolpath Agent for Multi-turn Image Editing](https://arxiv.org/abs/2503.10613)

**Advait Gupta**, NandaKiran Velaga, Dang Nguyen, Tianyi Zhou

[**Project**](https://github.com/tianyi-lab/CoSTAR) <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>
CoSTA* is a hybrid agent for multi-turn image editing that combines LLM-based reasoning with A* search for cost-efficient tool selection, balancing cost and quality. Unlike text-to-image models like Stable Diffusion and DALLE-3, which struggle with complex edits and retaining input image details, and agents like GenArtist, CLOVA, and VisProg, which perform poorly on multimodal, multi-step tasks, CoSTA* constructs an optimal toolpath using LLM-guided hierarchical planning and A* search. It dynamically adapts by refining tool effectiveness through real-time feedback from a VLM, ensuring robust and efficient execution.

</div>
</div>

- [From Above and Beyond: Decoding Urban Aesthetics with the Visual Pollution Index](https://link.springer.com/chapter/10.1007/978-3-031-56388-1_8), **Advait Gupta**, Manan Padsala, Devesh Jani, Tanmay Bisen, Aastha Shayla, Gargi Srivastava, **SNPD 2023**

</div>
</div>

- [From Sky to Strategy: Construction Activity Index and Stage Estimation From Drone-Captured Imagery](https://ieeexplore.ieee.org/abstract/document/10459984), **Advait Gupta**, Manan Padsala, Aastha Shayla, Tanmay Bisen, Susham Biswas, Abhemanyu Sarin, **ICMLA 2023**

</div>
</div>

- [Detection of pneumonia from chest X-ray images using transfer learning on deep CNN](https://ieeexplore.ieee.org/abstract/document/10170454), **Advait Gupta**, Manan Padsala, Pallabi Saikia, **INCET 2023**

# 🚀 Personal Projects
 
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
- *2024.01 - 2024.03*, Machine Learning Intern, Techpeek, India.
- *2023.08 - 2023.05*, Summer Intern, Ernst & Young, India.
- *2023.01 - 2023.03*, Machine Learning Intern, Spritle Software, India.
- *2022.06 - 2022.11*, Machine Learning Intern, AIEnsured (testAIng.com), India.
