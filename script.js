/* ============================================
   SHADI MAANI — Portfolio Script
   Production-ready, zero-dependency JS
   ============================================ */

(function () {
    'use strict';

    // --- Translation Dictionary ---
    var translations = {
        en: {
            // Nav
            "nav-skills": "Skills",
            "nav-projects": "Projects",
            "nav-about": "About",
            "nav-contact": "Contact",

            // Hero
            "hero-title-1": "Shadi Maani.",
            "hero-title-2": "Software Engineer · DevOps · AI Systems.",
            "hero-desc": "Flutter/Dart developer and Backend Engineer who independently designed and shipped Thimma — a production-ready, AI-powered debt management platform — from zero to production. I cover the full development lifecycle: Arabic-first UI design (RTL), GCP cloud infrastructure, secure CI/CD pipelines, and Vertex AI integration for Arabic dialect processing.",
            "hero-status": "● Available for complex builds",
            "chip-1": "AI-Integrated Applications",
            "chip-2": "Firebase",
            "chip-3": "Arabic-First UX",

            // Skills
            "skills-label": "Technical Arsenal",
            "skills-title": "Tools and technologies I work with daily",
            "skill-python": "Flask · FastAPI · Cloud Functions · REST APIs · Automation",
            "skill-flutter": "Material 3 · RTL · Advanced Animation · CustomPainter · Riverpod",
            "skill-docker": "Multi-stage builds · Distroless · Compose · Container Scanning",
            "skill-gcp": "Cloud Run · API Gateway · Artifact Registry · Workload Identity",
            "skill-firebase": "Auth · Firestore · Google Sign-In · Smart Sync · Email Verification",
            "skill-ai": "Function Calling · Chain-of-Thought · Speech-to-Text V2 · Chirp 3",
            "skill-cicd": "GitHub Actions · Multi-job Pipelines · Auto Deploy · Artifact Registry",
            "skill-sec-name": "Security",
            "skill-security": "Gitleaks · Bandit (SAST) · Safety (SCA) · Trivy · OWASP",
            "skill-test-name": "Testing",
            "skill-testing": "Pytest · Flutter Test · Widget/Integration Tests · Mockito · MockClient",
            "skill-linux": "Fedora · Ubuntu · System Tuning · Administration · KDE Plasma",
            "skill-bash": "Automation Scripts · System Profiling · Quota Management · Cron",
            "skill-net-name": "Networking",
            "skill-networking": "TCP/IP · CCNA-level · Router Automation · Python Network Tools",

            // Projects
            "project-focus": "Focus Project",
            "thimma-title": "Thimma: AI-Powered Debt Platform",
            "thimma-desc": "A comprehensive project aimed at solving the debt documentation problem in informal economies. The main challenge was converting unstructured Levantine audio inputs into accurate financial records with near-zero error rates.",
            "thimma-flutter-title": "<i class='devicon-flutter-plain' style='color:#02569B'></i> Flutter Frontend",
            "thimma-flutter-desc": "Full cross-platform app with Clean Architecture. Dynamic theme system (glassmorphism), complete Firebase Auth flows, smart Firestore sync, voice input with AI confirmation overlay, and Arabic PDF statement generator.",
            "thimma-backend-title": "<i class='devicon-python-plain' style='color:#3776AB'></i> Backend & AI",
            "thimma-backend-desc": "Vertex AI (Gemini 2.5 Flash) with Function Calling (Mode.ANY) and directional logic table. ~95%+ accuracy on Syrian dialect debt-direction classification. STT V2 Chirp 3 processing for dialects.",
            "thimma-devops-title": "<i class='devicon-docker-plain' style='color:#2496ED'></i> DevOps & Security",
            "thimma-devops-desc": "Multi-stage CI/CD pipeline: Gitleaks → Bandit → Safety → Pytest → Docker → Trivy → Cloud Run. Workload Identity Federation and automated quota management.",
            "arch-label": "Architecture",
            "state-label": "State Mgmt",
            "sec-label": "Security",
            "test-label": "Testing",
            "acc-label": "Accuracy",
            "repo-link": "View Repo & Docs →",

            // Other Projects
            "cloud-title": "Cloud Infrastructure Engineering",
            "cloud-desc": "Diagnosed and resolved high-billing incidents via resource reallocation and automated quota policy enforcement. Optimized server RAM through startup process profiling.",
            "net-auto-title": "Network Automation",
            "net-auto-desc": "Python tools for authenticating with routers and monitoring connected devices in real-time with automated logging.",
            "linux-cust-title": "Linux Customization",
            "linux-cust-desc": "Building KDE Plasma 6 widgets to interact with system-level APIs in Fedora with configuration layer integration.",

            // Services
            "services-tag": "Engineering Engagements",
            "services-title": "Available for complex projects & system building.",
            "srv-1-title": "AI Integration & Pipelines",
            "srv-1-desc": "Building deterministic workflows using LLMs (Gemini/Vertex AI), and designing Logic Tables to prevent hallucinations for precise data extraction.",
            "srv-2-title": "Cloud Architecture & DevOps",
            "srv-2-desc": "Setting up Docker containers, secure CI/CD pipelines via GitHub Actions, and managing GCP infrastructure with strict billing DDoS protection.",
            "srv-3-title": "Full-Stack Flutter Apps",
            "srv-3-desc": "Building mobile apps with Clean Architecture, custom UIs, smart data sync with Firebase, and custom Python backend integration.",

            // About
            "about-tag": "Approach",
            "about-title": "Expertise is built through breaking and fixing.",
            "about-p1": "I don't believe in certificates as proof of competence — real skill is what you can build or fix under pressure in resource-constrained environments.",
            "about-p2": "My study of English Literature at Damascus University gives me a different angle on analyzing language structure. I apply this to build Logic Tables for AI, forcing it to act as a deterministic engine rather than just a chatbot.",
            "about-p3": "I am in a state of continuous learning; most of what I've built comes from cycles of trying, failing, and analyzing.",

            // Education
            "edu-title": "Education & Certifications",
            "edu-ibm-badge": "In Progress",
            "edu-ibm-meta": "IBM / Coursera",
            "edu-ibm-desc": "Applying Docker, microservices architecture, and Pytest in active production projects.",
            "edu-ongoing": "Ongoing",
            "edu-self-title": "Independent Technical Study",
            "edu-self-desc": "CompTIA (A+, Network+, Security+, Linux+) · CCNA · OSCP-aligned labs",
            "edu-ba-title": "B.A. English Literature",
            "edu-ba-uni": "Damascus University",
            "edu-ba-desc": "English B2 — technical documentation and professional communication.",

            // Contact
            "contact-title": "Let's build.",
            "contact-desc": "For inquiries regarding system design, app development, or operational pipelines.",

            // Footer
            "footer-copy": "© 2026 SHADI MAANI. DESIGNED FOR PERFORMANCE.",
            "footer-email": "Email",
            "btn-lang": "عربي"
        },
        ar: {
            // Nav
            "nav-skills": "المهارات",
            "nav-projects": "المشاريع",
            "nav-about": "حول",
            "nav-contact": "تواصل",

            // Hero
            "hero-title-1": "شادي معاني.",
            "hero-title-2": "مهندس برمجيات · DevOps · أنظمة ذكاء اصطناعي.",
            "hero-desc": "مطوّر Flutter/Dart و Backend Engineer صمّم وبنى Thimma — منصة إدارة ديون مدفوعة بالذكاء الاصطناعي — من الصفر حتى النشر الإنتاجي. أغطي كامل دورة التطوير: تصميم واجهات عربية أولاً (RTL)، بنية تحتية سحابية على GCP، أنابيب CI/CD آمنة، واستخدام Vertex AI لمعالجة اللهجات العربية.",
            "hero-status": "● متاح للمشاريع الهندسية المعقدة",
            "chip-1": "تطبيقات مدمجة بالذكاء الاصطناعي",
            "chip-2": "Firebase",
            "chip-3": "تجربة مستخدم عربية أولاً",

            // Skills
            "skills-label": "الترسانة التقنية",
            "skills-title": "أدوات وتقنيات أعمل بها يومياً",
            "skill-python": "Flask · FastAPI · Cloud Functions · REST APIs · أتمتة",
            "skill-flutter": "Material 3 · RTL · أنيميشن متقدم · CustomPainter · Riverpod",
            "skill-docker": "Multi-stage builds · Distroless · Compose · Container Scanning",
            "skill-gcp": "Cloud Run · API Gateway · Artifact Registry · Workload Identity",
            "skill-firebase": "Auth · Firestore · Google Sign-In · Smart Sync · Email Verification",
            "skill-ai": "Function Calling · Chain-of-Thought · Speech-to-Text V2 · Chirp 3",
            "skill-cicd": "GitHub Actions · Multi-job Pipelines · Auto Deploy · Artifact Registry",
            "skill-sec-name": "الأمان",
            "skill-security": "Gitleaks · Bandit (SAST) · Safety (SCA) · Trivy · OWASP",
            "skill-test-name": "الاختبارات",
            "skill-testing": "Pytest · Flutter Test · Widget/Integration Tests · Mockito · MockClient",
            "skill-linux": "Fedora · Ubuntu · System Tuning · إدارة النظام · KDE Plasma",
            "skill-bash": "سكربتات أتمتة · تحليل النظام · إدارة الكوتا · Cron",
            "skill-net-name": "الشبكات",
            "skill-networking": "TCP/IP · CCNA-level · أتمتة الراوترات · أدوات Python للشبكات",

            // Projects
            "project-focus": "المشروع الرئيسي",
            "thimma-title": "Thimma: منصة ديون مدفوعة بالذكاء الاصطناعي",
            "thimma-desc": "مشروع متكامل يهدف لحل مشكلة توثيق الديون في الاقتصادات غير الرسمية. التحدي الأساسي كان تحويل المدخلات الصوتية الشامية غير المهيكلة إلى سجلات مالية دقيقة بنسبة خطأ تقارب الصفر.",
            "thimma-flutter-title": "<i class='devicon-flutter-plain' style='color:#02569B'></i> Flutter Frontend",
            "thimma-flutter-desc": "تطبيق cross-platform كامل مع Clean Architecture. نظام ثيمات ديناميكي (glassmorphism)، تدفقات Firebase Auth كاملة، مزامنة ذكية مع Firestore، إدخال صوتي مع تأكيد AI، ومولّد كشوفات PDF بالعربية.",
            "thimma-backend-title": "<i class='devicon-python-plain' style='color:#3776AB'></i> Backend & AI",
            "thimma-backend-desc": "Vertex AI (Gemini 2.5 Flash) مع Function Calling (Mode.ANY) وجدول منطق اتجاهي. دقة ~95%+ في تصنيف اتجاه الدين بالعامية السورية. معالجة STT V2 Chirp 3 للهجات.",
            "thimma-devops-title": "<i class='devicon-docker-plain' style='color:#2496ED'></i> DevOps & Security",
            "thimma-devops-desc": "أنبوب CI/CD متعدد المراحل: Gitleaks → Bandit → Safety → Pytest → Docker → Trivy → Cloud Run. حماية Workload Identity Federation وإدارة كوتا آلية.",
            "arch-label": "المعمارية",
            "state-label": "إدارة الحالة",
            "sec-label": "الأمان",
            "test-label": "الاختبارات",
            "acc-label": "الدقة",
            "repo-link": "استعراض الكود والتوثيق ←",

            // Other Projects
            "cloud-title": "هندسة البنية التحتية السحابية",
            "cloud-desc": "تشخيص وحل مشاكل الفواتير العالية عبر إعادة تخصيص الموارد وأتمتة سياسات الكوتا. تحسين استهلاك RAM للخوادم عبر تحليل عمليات الإقلاع.",
            "net-auto-title": "أتمتة الشبكات",
            "net-auto-desc": "أدوات Python للمصادقة مع أجهزة التوجيه ومراقبة الأجهزة المتصلة لحظياً مع تسجيل تلقائي.",
            "linux-cust-title": "تخصيص لينكس",
            "linux-cust-desc": "بناء ويدجيت لـ KDE Plasma 6 للتعامل مع APIs النظام في Fedora مع تكامل طبقات الضبط.",

            // Services
            "services-tag": "التعاقد الهندسي",
            "services-title": "متاح للمشاريع المعقدة وبناء الأنظمة.",
            "srv-1-title": "دمج الذكاء الاصطناعي (AI Integration)",
            "srv-1-desc": "بناء مسارات عمل حتمية باستخدام نماذج LLM (Gemini/Vertex AI)، وتصميم جداول منطق (Logic Tables) تمنع الهلوسة لاستخراج بيانات دقيقة.",
            "srv-2-title": "هندسة السحابة و DevOps",
            "srv-2-desc": "إعداد حاويات Docker، مسارات CI/CD آمنة عبر GitHub Actions، وإدارة البنية التحتية على GCP مع حماية صارمة ضد هجمات الفواتير (Billing DDoS).",
            "srv-3-title": "تطبيقات Flutter المتكاملة",
            "srv-3-desc": "بناء تطبيقات موبايل بمعمارية نظيفة (Clean Architecture)، واجهات مستخدم مخصصة، ومزامنة بيانات ذكية مع Firebase وبناء Backend مخصص (Python).",

            // About
            "about-tag": "المنهجية",
            "about-title": "الخبرة تُبنى بالهدم والإصلاح.",
            "about-p1": "لا أؤمن بالشهادات كدليل كفاءة؛ المهارة الحقيقية هي ما تستطيع بناءه أو إصلاحه تحت الضغط وفي بيئات محدودة الموارد.",
            "about-p2": "دراستي للأدب الإنجليزي في جامعة دمشق تمنحني زاوية مختلفة في تحليل \"بنية اللغة\"، وهو ما أطبقه في بناء جداول المنطق (Logic Tables) للذكاء الاصطناعي لجعله محركاً حتمياً (Deterministic) بدلاً من كونه مجرد شات بوت.",
            "about-p3": "أنا في حالة تعلم مستمر، معظم ما بنيته جاء من دورات المحاولة، الفشل، والتحليل.",

            // Education
            "edu-title": "التعليم والشهادات",
            "edu-ibm-badge": "قيد الإنجاز",
            "edu-ibm-meta": "IBM / Coursera",
            "edu-ibm-desc": "تطبيق Docker والخدمات المصغرة والاختبار الآلي في مشاريع إنتاجية فعلية.",
            "edu-ongoing": "مستمر",
            "edu-self-title": "دراسة تقنية مستقلة",
            "edu-self-desc": "CompTIA (A+, Network+, Security+, Linux+) · CCNA · مختبرات OSCP",
            "edu-ba-title": "بكالوريوس أدب إنجليزي",
            "edu-ba-uni": "جامعة دمشق",
            "edu-ba-desc": "مستوى B2 إنجليزي — توثيق تقني وتواصل مهني.",

            // Contact
            "contact-title": "دعنا نبني.",
            "contact-desc": "للتواصل بخصوص تصميم الأنظمة، بناء التطبيقات، أو مسارات العمل (Pipelines).",

            // Footer
            "footer-copy": "© 2026 SHADI MAANI. DESIGNED FOR PERFORMANCE.",
            "footer-email": "مراسلة",
            "btn-lang": "English"
        }
    };

    // --- Set Language ---
    function setLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update toggle button
        var toggleBtn = document.getElementById('lang-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = translations[lang]['btn-lang'];
        }

        // Update page title & meta
        document.title = lang === 'ar'
            ? 'شادي معاني | Software Engineer'
            : 'Shadi Maani | Software Engineer';

        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = lang === 'ar'
                ? 'شادي معاني — مهندس برمجيات من سوريا. أبني أنظمة ذكاء اصطناعي حتمية وبنية تحتية سحابية.'
                : 'Shadi Maani — Software Engineer from Syria. Building deterministic AI systems and cloud infrastructure.';
        }

        try { localStorage.setItem('preferred-language', lang); } catch (e) { /* ignore */ }
    }

    // --- Scroll Reveal ---
    function initScrollReveal() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });
    }

    // --- Cursor Glow ---
    function initCursorGlow() {
        var glow = document.getElementById('cursor-glow');
        if (!glow || 'ontouchstart' in window) {
            if (glow) glow.style.display = 'none';
            return;
        }
        document.addEventListener('mousemove', function (e) {
            requestAnimationFrame(function () {
                glow.style.transform = 'translate(' + (e.clientX - 150) + 'px, ' + (e.clientY - 150) + 'px)';
            });
        });
    }

    // --- Mobile Menu ---
    function initMobileMenu() {
        var btn = document.getElementById('mobile-menu-btn');
        var nav = document.getElementById('mobile-nav');
        if (!btn || !nav) return;

        btn.addEventListener('click', function () {
            nav.classList.toggle('active');
            btn.setAttribute('aria-expanded', nav.classList.contains('active'));
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && !btn.contains(e.target)) {
                nav.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Smooth Scroll ---
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // --- Header scroll effect ---
    function initHeaderScroll() {
        var header = document.querySelector('.site-header');
        if (!header) return;
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.boxShadow = '0 1px 3px rgba(30, 58, 138, 0.1)';
            }
        }, { passive: true });
    }

    // --- Staggered reveal for skill cards ---
    function initStaggeredSkills() {
        var cards = document.querySelectorAll('.skill-card');
        cards.forEach(function (card, i) {
            card.style.transitionDelay = (i * 50) + 'ms';
        });
    }

    // --- Init ---
    document.addEventListener('DOMContentLoaded', function () {
        // Detect language from browser
        var savedLang = null;
        try { savedLang = localStorage.getItem('preferred-language'); } catch (e) { /* ignore */ }

        var browserLang = navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en';
        var initialLang = savedLang || browserLang;

        setLanguage(initialLang);

        // Build email links via JS to prevent Cloudflare email-decode injection
        var u = 'contact'; var d = 'shadimaani.me';
        var email = u + '@' + d;
        var mailto = 'mai' + 'lto:' + email;
        var contactLink = document.getElementById('contact-email-link');
        if (contactLink) { contactLink.href = mailto; contactLink.textContent = email; }
        var footerLink = document.getElementById('footer-email-link');
        if (footerLink) { footerLink.href = mailto; }

        // Language toggle
        var toggleBtn = document.getElementById('lang-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                var currentLang = document.documentElement.lang;
                setLanguage(currentLang === 'ar' ? 'en' : 'ar');
            });
        }

        // Init features
        initStaggeredSkills();
        initScrollReveal();
        initCursorGlow();
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
    });

})();
