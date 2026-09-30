export interface SampleProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  jobDescription: string;
  resumeText: string;
  badge: string;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'frontend-sr',
    name: 'Alex Rivera',
    email: 'alex.rivera.dev@gmail.com',
    role: 'Senior Frontend Engineer',
    badge: 'Senior Tech',
    jobDescription: `We are looking for a Senior Frontend Engineer with 5+ years of experience in React, TypeScript, Next.js, and modern UI architecture.
Key Requirements:
- Deep expertise in React 18/19, TypeScript, state management, and web performance optimization.
- Experience with CI/CD pipelines, automated testing (Jest, Playwright), and microfrontends.
- Track record of mentoring junior engineers and collaborating with product & design teams.
- Understanding of core web vitals, accessibility (a11y), and scalable design systems.`,
    resumeText: `ALEX RIVERA
San Francisco, CA | alex.rivera.dev@gmail.com | linkedin.com/in/alexrivera-tech | github.com/arivera-code

PROFESSIONAL SUMMARY
Senior Frontend Engineer with 6+ years of experience building high-performance, enterprise-scale web applications. Proven track record in architecting modern React/TypeScript microfrontends, optimizing Core Web Vitals to achieve 98+ PageSpeed scores, and mentoring teams of 8+ engineers.

CORE COMPETENCIES
- Languages & Frameworks: TypeScript, JavaScript (ESNext), React, Next.js, HTML5, CSS3, Tailwind CSS
- State & Architecture: Redux Toolkit, Zustand, React Query (TanStack), Microfrontends, REST, GraphQL
- Testing & Tooling: Jest, React Testing Library, Playwright, Vite, Webpack, Docker, GitHub Actions, CI/CD
- Cloud & Performance: AWS (S3/CloudFront), Vercel, Core Web Vitals, Lighthouse Optimization, Accessibility (WCAG 2.1 AA)

PROFESSIONAL EXPERIENCE
Senior Frontend Engineer | TechScale Solutions (2022 - Present)
- Spearheaded the architectural migration of a legacy monolithic portal to a modular React 18 / TypeScript SPA, decreasing build times by 45% and reducing bundle size by 38%.
- Optimized critical rendering path and image delivery pipelines, improving First Contentful Paint (FCP) from 2.8s to 0.9s across 1.2M monthly active users.
- Designed and maintained a unified corporate design system used by 5 product squads, reducing feature cycle development time by 30%.
- Mentored 4 junior and mid-level engineers through code reviews, design pairing sessions, and technical workshops.

Frontend Software Engineer | DataStream Analytics (2019 - 2022)
- Built interactive analytics dashboards visualizing real-time financial telemetry using React, TypeScript, and D3.js for enterprise trading clients.
- Automated end-to-end integration tests using Playwright and GitHub Actions, boosting test coverage from 42% to 89% and slashing regression incidents by 60%.
- Engineered responsive client-side caching strategies with TanStack Query, cutting redundant API network calls by 52%.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2015 - 2019)
- Dean's Honors List, Magna Cum Laude`,
  },
  {
    id: 'product-mgr',
    name: 'Priya Sharma',
    email: 'priya.sharma.pm@outlook.com',
    role: 'Lead Product Manager',
    badge: 'Product & Growth',
    jobDescription: `Seeking an experienced Lead Product Manager to drive customer acquisition and monetization strategies for our SaaS enterprise platform.
Key Requirements:
- 5+ years product management experience managing B2B/SaaS software products from 0 to 1 and scale.
- Strong analytical chops, SQL proficiency, A/B testing methodologies, and user interview capabilities.
- Proven leadership in cross-functional alignment between engineering, UX design, marketing, and sales leadership.`,
    resumeText: `PRIYA SHARMA
New York, NY | priya.sharma.pm@outlook.com | linkedin.com/in/priyasharmapm

SUMMARY
Data-driven Lead Product Manager with 7+ years of experience leading cross-functional teams to launch high-growth SaaS products. Drove $14M in ARR growth, improved onboarding retention by 32%, and delivered enterprise workflow automation solutions across global markets.

SKILLS & SPECIALTIES
- Strategy & Roadmapping: Product Discovery, 0-to-1 Product Launches, OKRs, Go-To-Market (GTM)
- Analytics & Optimization: Amplitude, Mixpanel, SQL, A/B Testing, Cohort Analysis, FullStory
- Methodologies: Agile/Scrum, User Journey Mapping, Jobs-to-be-Done (JTBD), Design Sprints
- Tools: Jira, Linear, Figma, Notion, Salesforce, HubSpot

EXPERIENCE
Lead Product Manager | CloudSync Enterprise (2021 - Present)
- Led a 14-person cross-functional team (6 engineers, 2 designers, 1 data scientist, 5 GTM specialists) to build and launch an AI-powered automated workflow orchestration engine.
- Generated $6.2M in Net New ARR within the first 9 months of launch, beating internal executive forecast by 140%.
- Overhauled onboarding funnel flow through iterative user interviews and A/B test experimentation, lifting day-30 user retention from 41% to 64%.
- Conducted 75+ qualitative customer discovery interviews with Fortune 500 VP-level buyers.

Senior Product Manager | Veloce Commerce (2018 - 2021)
- Owned checkout and payment conversion funnel handling $450M in annual gross transaction volume.
- Reduced multi-currency cart abandonment by 18.5% by introducing one-click localized payment flows.
- Spearheaded product partnership integrations with Stripe, PayPal, and Klarna.

EDUCATION
MBA, Product & Technology Strategy | NYU Stern School of Business (2016 - 2018)
B.A. in Economics | University of Michigan (2012 - 2016)`,
  },
  {
    id: 'data-scientist',
    name: 'Marcus Chen',
    email: 'marcus.chen.ai@gmail.com',
    role: 'Machine Learning Engineer',
    badge: 'AI / ML',
    jobDescription: `Looking for an ML Engineer with deep experience in Python, PyTorch, LLMs, NLP, and model deployment pipelines.
Key Requirements:
- Strong foundations in linear algebra, statistics, and machine learning theory.
- Experience productionizing ML models with Docker, FastAPI, Triton, and Kubernetes.
- Experience fine-tuning open-source LLMs and building RAG retrieval architectures.`,
    resumeText: `MARCUS CHEN
Seattle, WA | marcus.chen.ai@gmail.com | github.com/marcuschen-ml | scholar.google.com/mchen

SUMMARY
Machine Learning Engineer specializing in Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and production model serving. Reduced model inference latency by 65% and scaled vector embeddings pipelines to 50M+ documents.

TECHNICAL SKILLS
- Frameworks & Languages: Python, PyTorch, Hugging Face, LangChain, LlamaIndex, C++, SQL
- MLOps & Infrastructure: Docker, Kubernetes, Ray, Triton Inference Server, MLflow, AWS SageMaker
- Data & Vector Stores: PostgreSQL (pgvector), Pinecone, Milvus, Redis, Apache Spark
- Core Competencies: LLM Fine-Tuning (LoRA/QLoRA), RAG Systems, Quantization, Transformer Architectures

EXPERIENCE
Senior ML Engineer | Cognition Labs (2022 - Present)
- Architected enterprise RAG retrieval pipeline with hybrid vector and keyword reranking, increasing factual response accuracy from 76% to 94.2%.
- Optimized LLM inference serving using vLLM and TensorRT-LLM on NVIDIA A100 clusters, cutting token generation latency by 58% and slashing monthly cloud spend by $42,000.
- Implemented automated evaluation harness measuring hallucination rates, ROUGE/BLEU scores, and semantic cosine similarity.

Data Scientist & ML Engineer | Apex AI Systems (2020 - 2022)
- Trained BERT and RoBERTa document classification models achieving 96.4% F1-score across 12 legal document categories.
- Built end-to-end data ingestion ETL pipelines processing 10TB+ unstructured legal records using Apache Spark and Ray.

EDUCATION
M.S. in Computer Science (Artificial Intelligence) | Stanford University (2018 - 2020)
B.S. in Applied Mathematics | University of Washington (2014 - 2018)`,
  },
];
