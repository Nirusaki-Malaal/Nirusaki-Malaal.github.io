const isBlogPage = document.body.classList.contains('blog-page-bg');

// ===== GITHUB API: AUTO-FETCH REPOS =====
const GITHUB_USERNAME = 'Nirusaki-Malaal';
const CACHE_KEY = 'nirusaki_repos';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const langColors = {
    'Python': { text: 'text-yellow-400', border: 'border-yellow-400', gradient: 'linear-gradient(135deg, #facc15 0%, #f97316 100%)' },
    'JavaScript': { text: 'text-yellow-300', border: 'border-yellow-300', gradient: 'linear-gradient(135deg, #fde047 0%, #f59e0b 100%)' },
    'TypeScript': { text: 'text-blue-500', border: 'border-blue-500', gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' },
    'C++': { text: 'text-blue-600', border: 'border-blue-600', gradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' },
    'C': { text: 'text-gray-400', border: 'border-gray-400', gradient: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' },
    'HTML': { text: 'text-orange-500', border: 'border-orange-500', gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' },
    'CSS': { text: 'text-blue-500', border: 'border-blue-500', gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' },
    'Java': { text: 'text-orange-400', border: 'border-orange-400', gradient: 'linear-gradient(135deg, #fb923c 0%, #ef4444 100%)' },
    'Shell': { text: 'text-green-400', border: 'border-green-400', gradient: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)' },
    'Jupyter Notebook': { text: 'text-orange-400', border: 'border-orange-400', gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)' }
};

const defaultLang = { text: 'text-gray-500', border: 'border-gray-500', gradient: 'linear-gradient(135deg, #00f5ff 0%, #b026ff 100%)' };

const neonColors = ['neon-cyan', 'neon-pink', 'neon-purple'];

async function fetchGitHubRepos() {
    // Check cache first
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL && Array.isArray(data)) {
                return data;
            }
        }
    } catch (e) { /* cache miss */ }

    // Fetch from GitHub API
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=owner`);
    if (!response.ok) throw new Error(`GitHub API: ${response.status}`);
    const repos = await response.json();

    // Filter out the .github.io repo itself and forks
    const filtered = repos.filter(r => !r.fork && !r.name.endsWith('.github.io'));

    // Cache the result
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: filtered, timestamp: Date.now() }));
    } catch (e) { /* storage full */ }

    return filtered;
}

const targetRepos = [
    "video-encoder",
    "auto-airing-animes",
    "learning-ml",
    "Learning-DL",
    "gdrive-uploader-bot",
    "shingaku",
    "AetherScan",
    "JefferyEpsteinRag",
    "image-compressor-website",
    "nith-results-website"
];

const projectDetails = {
    "video-encoder": {
        name: "Video Encoder Bot",
        lang: "Python",
        jpLang: "動画エンコーダボット",
        github_url: "https://github.com/Nirusaki-Malaal/video-encoder",
        homepage: "",
        description: "A persistent, queue-based Telegram video encoder bot powered by FFmpeg commands and database queue recovery.",
        bullets: [
            "<strong>Persistent Encoding Queue</strong>: Maintains an active queue in a MongoDB database, allowing encoding processes to automatically resume and continue working even after a server crash or reboot.",
            "<strong>Admin Terminal Integration</strong>: Features remote execution commands directly through Telegram, including active bash shell access and Python <code>eval</code> utilities.",
            "<strong>Dockerized Deployments</strong>: Packaged for Docker environments with full settings configuration handled via <code>config.env</code>."
        ]
    },
    "auto-airing-animes": {
        name: "Auto Airing Animes",
        lang: "Python",
        jpLang: "アニメ自動配信ボット",
        github_url: "https://github.com/Nirusaki-Malaal/auto-airing-animes",
        homepage: "",
        description: "An automated RSS-triggered anime downloader and encoder bot that uploads content directly to Telegram channels.",
        bullets: [
            "<strong>Automated RSS Ingestion</strong>: Periodically parses anime release feeds, allowing users to search (<code>/find</code>), view feeds (<code>/rss</code>), and fetch torrents by feed index (<code>/tor &lt;number&gt;</code>).",
            "<strong>Automated Encoding & Upload</strong>: Integrates media pipelines to convert and upload episodes directly to a main channel (Seireitei) and sub-channels (Rukongai).",
            "<strong>Filesystem Self-Healing</strong>: Includes automated commands (<code>/renew</code>) to clear temporary cache directories and <code>/clear</code> to purge active queues."
        ]
    },
    "learning-ml": {
        name: "Learning ML from Scratch",
        lang: "Python",
        jpLang: "機械学習ゼロから",
        github_url: "https://github.com/Nirusaki-Malaal/learning-ml",
        homepage: "",
        description: "A mathematics-first Machine Learning library building standard models completely from scratch using NumPy.",
        bullets: [
            "<strong>Math-First Implementations</strong>: Implements regression (Linear, Locally Weighted LWLR), classification (Logistic, Softmax), and clustering from scratch without scikit-learn.",
            "<strong>Real-World Inner Projects</strong>: Integrates models into functional testbeds, such as a Weather Predictor (2013-2024 local data), SMS Spam Filter (with custom TF-IDF), and a handwritten Digit Reader web app.",
            "<strong>Vectorized Computations</strong>: Heavy focus on mathematical vectorization to achieve high execution speed using NumPy arrays."
        ]
    },
    "learning-dl": {
        name: "Learning DL from Scratch",
        lang: "Python",
        jpLang: "ディープラーニングゼロから",
        github_url: "https://github.com/Nirusaki-Malaal/Learning-DL",
        homepage: "",
        description: "Custom neural network layers and training models built from scratch without PyTorch or TensorFlow.",
        bullets: [
            "<strong>Custom Network Architecture</strong>: Implements feedforward networks, custom activation functions (sigmoid, softmax), backpropagation, and loss functions from scratch.",
            "<strong>Weights Serialization</strong>: Saves trained model parameters (weights/biases) to local <code>model.npz</code> files for instant reload and inference.",
            "<strong>Logistic Regression Foundations</strong>: Features foundational classification architectures built entirely on NumPy vector mathematics."
        ]
    },
    "gdrive-uploader-bot": {
        name: "GDrive Uploader Bot",
        lang: "Python",
        jpLang: "グーグルドライブアップローダー",
        github_url: "https://github.com/Nirusaki-Malaal/gdrive-uploader-bot",
        homepage: "",
        description: "A queue-driven Telegram bot that uploads media streams to personal or Team Google Drives with HTML landing pages.",
        bullets: [
            "<strong>Multi-User OAuth Storage</strong>: Manages individual Google Drive OAuth tokens and Team Drive settings, storing credentials securely inside MongoDB.",
            "<strong>Queue-Based Uploading</strong>: Leverages Pyrogram to handle concurrent uploads of large Telegram documents and videos with active progress visual status bars.",
            "<strong>Automated HTML Generation</strong>: Features a <code>/html2</code> flow that parses a Google Drive folder and generates a clean, styled HTML season/episode landing page."
        ]
    },
    "shingaku": {
        name: "Shingaku",
        lang: "Python",
        jpLang: "学習プラットフォーム",
        github_url: "https://github.com/Nirusaki-Malaal/shingaku",
        homepage: "",
        description: "An AI-driven academic learning management platform featuring automated PDF parsing, web examination, and blockchain validation.",
        bullets: [
            "<strong>PDF to CBT Generator</strong>: Parses study PDFs, extracting text and images to auto-generate interactive Computer-Based Tests (CBTs) and flashcards using Google Gemini API.",
            "<strong>Web3 Blockchain Integrity</strong>: Generates cryptographic hashes of exam questions and student responses, storing them on-chain using Web3 to guarantee exam integrity and block tampering.",
            "<strong>Secure User Architecture</strong>: Features password hashing, SMTP-driven OTP verification for registration/deletion, and dynamic pixel-art avatar generation."
        ]
    },
    "aetherscan": {
        name: "AetherScan Diagnostics",
        lang: "JavaScript",
        jpLang: "ネットワークスキャナ",
        github_url: "https://github.com/Nirusaki-Malaal/AetherScan",
        homepage: "",
        description: "A Firefox tactical diagnostics extension connecting browser popup controls to local Nmap scan scripts.",
        bullets: [
            "<strong>Native Messaging Bridge</strong>: Uses browser Native Messaging APIs to trigger a background Python daemon (<code>host.py</code>) which interfaces with the system's local Nmap binary.",
            "<strong>HUD Sonar Interface</strong>: Renders an animated radar-sonar scanning wave overlay, diagnostic log feeds, and active ports tables dynamically.",
            "<strong>Report Database</strong>: Compiles raw scan telemetry reports into copyable JSON format and maintains local diagnostic logs with cache reloading."
        ]
    },
    "jefferyepsteinrag": {
        name: "Epstein Federal RAG",
        lang: "Python",
        jpLang: "法的大規模言語モデル",
        github_url: "https://github.com/Nirusaki-Malaal/JefferyEpsteinRag",
        homepage: "",
        description: "A legal records search engine featuring a Windows 7 Aero Glass UI that crawls federal Epstein files and online databases.",
        bullets: [
            "<strong>Federal Bot Gate Bypass</strong>: Reverse-engineered the U.S. government media server's Queue-It and bot blocks. Bypassed selenium checks entirely by injecting the cookie header <code>'justiceGovAgeVerified': 'true'</code>.",
            "<strong>Draggable Aero Glass Desktop</strong>: Recreated the classic Windows 7 UI, featuring glassmorphism, draggable windows, desktop shortcuts, taskbar Start orb, and functional sidebar gadgets.",
            "<strong>Multi-Provider LLM RAG</strong>: Searches court PDFs (scanned FBI records, flight logs, witness reports) and live web links simultaneously. Users configure Gemini, Groq, or local Ollama directly in the Start Menu control panel."
        ]
    },
    "image-compressor-website": {
        name: "Image Compressor",
        lang: "Python",
        jpLang: "画像圧縮ウェブサイト",
        github_url: "https://github.com/Nirusaki-Malaal/image-compressor-website",
        homepage: "",
        description: "A local, lightweight image compressor that optimizes JPEG, PNG, and WebP assets without external API limits.",
        bullets: [
            "<strong>Local Optimization Engine</strong>: Compresses and resizes images on the local host, bypassing the need for cloud uploads or third-party image compression APIs.",
            "<strong>Multi-Format Processing</strong>: Handles common image formats including JPEG, PNG, and WebP, optimizing sizes with minimal visual quality degradation.",
            "<strong>Simple Frontend & API</strong>: A clean drag-and-drop web UI connected to a fast Flask API for instant file conversion and download."
        ]
    },
    "nith-results-website": {
        name: "NITH Academic Portal",
        lang: "Python",
        jpLang: "学術ポータル",
        github_url: "https://github.com/Nirusaki-Malaal/nith-results-website",
        homepage: "https://result-nith-black.vercel.app/",
        description: "A fast, modern portal simplifying Roll Number results lookup for NIT Hamirpur students.",
        bullets: [
            "<strong>Instant Results Lookup</strong>: Bypasses slow legacy university portals, fetching semester-wise grades, SGPAs, and CGPAs instantly.",
            "<strong>Vercel Optimized Deployment</strong>: Deployed as serverless functions on Vercel for fast loading times and global availability.",
            "<strong>Clean Responsive Layout</strong>: Tailored UI/UX featuring visual breakdowns of academic metrics across desktop and mobile screens."
        ]
    }
};

function renderProjectCards(repos) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Clear skeleton cards
    grid.innerHTML = '';

    // Update repo count in hero
    const repoCount = document.getElementById('repo-count');
    if (repoCount) repoCount.textContent = '10';

    // Map fetched repo stats to target repos in the correct order
    const renderedRepos = targetRepos.map(targetName => {
        const key = targetName.toLowerCase();
        const repoData = repos ? repos.find(r => r.name.toLowerCase() === key) : null;
        return {
            key: key,
            repoData: repoData
        };
    });

    renderedRepos.forEach((item, index) => {
        const details = projectDetails[item.key];
        if (!details) return;

        const lang = item.repoData ? (item.repoData.language || details.lang) : details.lang;
        const jpLang = details.jpLang;
        const neonColor = neonColors[index % neonColors.length];
        const themeClass = neonColor.replace('neon-', '') + '-neon';

        const card = document.createElement('article');
        card.className = `anime-card shrink-0 snap-start flex flex-col justify-between p-6 h-[420px] w-[340px] md:w-[400px] cursor-pointer group hover-target ${themeClass}`;
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', `${details.name} - ${details.description}`);

        card.innerHTML = `
            <!-- Anime/Cyberpunk Visual Overlays -->
            <div class="anime-card-grid"></div>
            <div class="anime-card-hologram"></div>
            <div class="anime-card-corner-top"></div>
            <div class="anime-card-corner-bottom"></div>
            <div class="anime-card-scanline-bar"></div>

            <!-- Card HUD Header -->
            <div class="flex justify-between items-center text-[10px] text-gray-500 font-mono tracking-widest relative z-10">
                <span>SYSTEM CARD // 0${(index + 1).toString().slice(-2)}</span>
                <span class="text-neon-cyan flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>ACTIVE</span>
            </div>

            <!-- Main Content Container -->
            <div class="flex-1 flex flex-col justify-center my-4 relative z-10">
                <!-- Project Name -->
                <div class="mb-2">
                    <h3 class="font-display text-2xl font-bold text-white group-hover:text-white transition-colors line-clamp-1">${details.name}</h3>
                    <!-- Language tag (English / Japanese) -->
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] tracking-wider text-neon-cyan font-mono">${lang}</span>
                        <span class="text-[9px] text-gray-500 font-jp tracking-wider">${jpLang}</span>
                    </div>
                </div>

                <!-- Description -->
                <p class="text-gray-400 text-sm line-clamp-3 mb-4">${details.description}</p>
            </div>

            <!-- Card Footer details -->
            <div class="relative z-10 pt-4 border-t border-white/5 mt-auto">
                <div class="flex justify-between items-center text-xs text-gray-500 font-mono">
                    <div class="flex items-center gap-3">
                        ${item.repoData && item.repoData.stargazers_count > 0 ? `<span class="flex items-center gap-1"><svg class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>${item.repoData.stargazers_count}</span>` : ''}
                        ${item.repoData && item.repoData.forks_count > 0 ? `<span class="flex items-center gap-1"><svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7a3 3 0 100-6 3 3 0 000 6zM8 7v7a4 4 0 00.275 1.48L5.414 18M17 17v-4a4 4 0 00-.275-1.48L19.586 14M16 7a3 3 0 100-6 3 3 0 000 6z"/></svg>${item.repoData.forks_count}</span>` : ''}
                    </div>
                    <span>${item.repoData ? new Date(item.repoData.updated_at).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}) : 'Active'}</span>
                </div>
            </div>
        `;

        // Card mouse follow glow effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Open modal on click
        card.addEventListener('click', () => {
            openModal(item.key, item.repoData);
        });

        grid.appendChild(card);
    });
}

function openModal(projectKey, repoData) {
    const modal = document.getElementById('project-modal');
    const body = document.getElementById('project-modal-body');
    const details = projectDetails[projectKey];
    if (!modal || !body || !details) return;

    const starsHtml = repoData && repoData.stargazers_count > 0 ? `<span class="flex items-center gap-1"><svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>${repoData.stargazers_count} Stars</span>` : '';
    const forksHtml = repoData && repoData.forks_count > 0 ? `<span class="flex items-center gap-1"><svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7a3 3 0 100-6 3 3 0 000 6zM8 7v7a4 4 0 00.275 1.48L5.414 18M17 17v-4a4 4 0 00-.275-1.48L19.586 14M16 7a3 3 0 100-6 3 3 0 000 6z"/></svg>${repoData.forks_count} Forks</span>` : '';
    const dateHtml = repoData ? `<time class="text-xs text-gray-500 font-mono">Updated: ${new Date(repoData.updated_at).toLocaleDateString()}</time>` : '';

    const githubUrl = details.github_url || (repoData ? repoData.html_url : '');
    const homepage = details.homepage || (repoData ? repoData.homepage : '');

    body.innerHTML = `
        <div>
            <div class="text-[10px] text-neon-cyan font-mono tracking-[0.3em] uppercase mb-1">PROJECT CORE MATRIX</div>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-2">${details.name}</h2>
            <div class="font-jp text-xs text-gray-500 tracking-widest uppercase mb-4">${details.jpLang}</div>
            <div class="flex flex-wrap gap-4 items-center text-xs text-gray-400 font-mono">
                ${starsHtml}
                ${forksHtml}
                ${dateHtml}
            </div>
        </div>

        <div class="h-px bg-gradient-to-r from-neon-cyan to-transparent"></div>

        <div class="space-y-4">
            <h4 class="font-display text-sm font-bold tracking-wider text-neon-pink">TECHNICAL BLUEPRINT</h4>
            <p class="text-gray-300 text-sm leading-relaxed">${details.description}</p>
        </div>

        <div class="space-y-4">
            <h4 class="font-display text-sm font-bold tracking-wider text-neon-pink">UNDER THE HOOD</h4>
            <ul class="space-y-3 text-gray-300 text-sm">
                ${details.bullets.map(bullet => `
                    <li class="flex gap-2.5 items-start">
                        <span class="text-neon-cyan select-none mt-0.5">⚡</span>
                        <span>${bullet}</span>
                    </li>
                `).join('')}
            </ul>
        </div>

        <div class="flex flex-wrap gap-4 pt-6 border-t border-white/5">
            <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="neon-btn px-6 py-3 border border-neon-cyan text-neon-cyan font-bold tracking-widest text-xs hover:bg-neon-cyan hover:text-black transition-all">VIEW REPOSITORY ↗</a>
            ${homepage ? `<a href="${homepage}" target="_blank" rel="noopener" class="neon-btn px-6 py-3 border border-neon-pink text-neon-pink font-bold tracking-widest text-xs hover:bg-neon-pink hover:text-black transition-all">LAUNCH APP ↗</a>` : ''}
            <button onclick="closeModal()" class="px-6 py-3 border border-white/10 text-gray-400 font-bold tracking-widest text-xs hover:text-white hover:border-white transition-all ml-auto">CLOSE</button>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
    if (window.gsap) {
        gsap.to(modal, { opacity: 1, duration: 0.3 });
        gsap.from('#project-modal-content', { scale: 0.9, opacity: 0, y: 20, duration: 0.3, ease: 'power2.out' });
    } else {
        modal.style.opacity = '1';
    }
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    if (window.gsap) {
        gsap.to(modal, { opacity: 0, duration: 0.2, onComplete: () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }});
    } else {
        modal.style.opacity = '0';
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

// Load projects on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    if (grid) {
        fetchGitHubRepos()
            .then(repos => {
                renderProjectCards(repos);

                // Initialize carousel scroll buttons
                const prevBtn = document.getElementById('carousel-prev');
                const nextBtn = document.getElementById('carousel-next');
                if (prevBtn && nextBtn) {
                    prevBtn.addEventListener('click', () => {
                        grid.scrollBy({ left: -400, behavior: 'smooth' });
                    });
                    nextBtn.addEventListener('click', () => {
                        grid.scrollBy({ left: 400, behavior: 'smooth' });
                    });
                }
            })
            .catch(err => {
                console.error('Failed to fetch repos, using local fallback:', err);
                renderProjectCards(null);

                const prevBtn = document.getElementById('carousel-prev');
                const nextBtn = document.getElementById('carousel-next');
                if (prevBtn && nextBtn) {
                    prevBtn.addEventListener('click', () => {
                        grid.scrollBy({ left: -400, behavior: 'smooth' });
                    });
                    nextBtn.addEventListener('click', () => {
                        grid.scrollBy({ left: 400, behavior: 'smooth' });
                    });
                }
            });

        // Initialize modal close listeners
        const modalClose = document.getElementById('project-modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        const projectModal = document.getElementById('project-modal');
        if (projectModal) {
            projectModal.addEventListener('click', (e) => {
                if (e.target === projectModal) closeModal();
            });
        }

        // Close project modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const projModal = document.getElementById('project-modal');
                if (projModal && !projModal.classList.contains('hidden')) {
                    closeModal();
                }
            }
        });
    }
});

// ===== CUSTOM CURSOR =====
let mouseX = 0, mouseY = 0;
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hasCustomCursor = cursorDot && cursorOutline;

if (hasCustomCursor && !isBlogPage) {
    document.body.classList.add('has-custom-cursor');
}

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!hasCustomCursor || isBlogPage) return;
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
    if (cursorOutline.animate) {
        cursorOutline.animate({ left: `${event.clientX}px`, top: `${event.clientY}px` }, { duration: 500, fill: "forwards" });
    } else {
        cursorOutline.style.left = `${event.clientX}px`;
        cursorOutline.style.top = `${event.clientY}px`;
    }
});

if (hasCustomCursor && !isBlogPage) {
    document.querySelectorAll('.hover-target, a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
}

// ===== THREE.JS BACKGROUND =====
const canvas = document.getElementById('bg-canvas');
if (canvas && window.THREE && !isBlogPage) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 250;
    
    const positions = new Float32Array(particlesCount * 3);
    const baseX = new Float32Array(particlesCount);
    const baseZ = new Float32Array(particlesCount);
    const speeds = new Float32Array(particlesCount);
    const phases = new Float32Array(particlesCount);
    
    // Initialize particles scattered in 3D box
    for (let i = 0; i < particlesCount; i++) {
        baseX[i] = (Math.random() - 0.5) * 35;
        baseZ[i] = (Math.random() - 0.5) * 20;
        
        positions[i * 3] = baseX[i];
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
        positions[i * 3 + 2] = baseZ[i];
        
        speeds[i] = 0.01 + Math.random() * 0.02; // upward drift speed
        phases[i] = Math.random() * Math.PI * 2; // phase for swing oscillation
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Monochrome white particles for minimalist aesthetic
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.045,
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 10;

    let rafId;
    let clock = new THREE.Clock();
    
    function animate() {
        rafId = requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        const posAttr = particlesGeometry.attributes.position.array;
        
        // Project mouse coordinates to 3D space targets (camera at z=10)
        const mouse3D = new THREE.Vector3(mouseX * 12, mouseY * 8, 0);
        
        for (let i = 0; i < particlesCount; i++) {
            const idx = i * 3;
            
            // 1. Slow upward drift
            posAttr[idx + 1] += speeds[i];
            
            // 2. Horizontal sine wave drift
            const swingX = Math.sin(elapsedTime * 0.4 + phases[i]) * 0.4;
            const swingZ = Math.cos(elapsedTime * 0.4 + phases[i]) * 0.4;
            const targetX = baseX[i] + swingX;
            const targetZ = baseZ[i] + swingZ;
            
            // 3. Mouse repulsion physics (push away in XY plane)
            const dx = posAttr[idx] - mouse3D.x;
            const dy = posAttr[idx + 1] - mouse3D.y;
            const dz = posAttr[idx + 2] - mouse3D.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < 4.5) {
                const force = (4.5 - dist) / 4.5;
                posAttr[idx] += (dx / dist) * force * 0.45;
                posAttr[idx + 1] += (dy / dist) * force * 0.45;
            }
            
            // 4. Elastic return towards their base flow lanes
            posAttr[idx] += (targetX - posAttr[idx]) * 0.035;
            posAttr[idx + 2] += (targetZ - posAttr[idx + 2]) * 0.035;
            
            // 5. Boundary reset: wrap from top to bottom
            if (posAttr[idx + 1] > 11) {
                posAttr[idx + 1] = -11;
                baseX[i] = (Math.random() - 0.5) * 35;
                baseZ[i] = (Math.random() - 0.5) * 20;
                posAttr[idx] = baseX[i];
                posAttr[idx + 2] = baseZ[i];
            }
        }
        
        particlesGeometry.attributes.position.needsUpdate = true;
        
        // Subtle overall camera drift based on mouse coordinates (parallax)
        camera.position.x = mouseX * 0.5;
        camera.position.y = mouseY * 0.5;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(rafId);
        else animate();
    });
}

// ===== GSAP SCROLL ANIMATIONS =====
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('section, article:not(.blog-post-card):not(.project-card):not(.post-content)').forEach((section) => {
        gsap.from(section.children, {
            scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
            y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out'
        });
    });
}

// ===== MOBILE MENU =====
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        document.body.style.overflow = 'hidden';
    } else {
        menu.classList.remove('flex');
        menu.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// ===== SIDEBAR =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar || !overlay) return;

    const isOpen = !sidebar.classList.contains('-translate-x-full');

    if (isOpen) {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    } else {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Sidebar toggle button
document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    const sidebarClose = document.getElementById('sidebar-close');
    if (sidebarClose) {
        sidebarClose.addEventListener('click', toggleSidebar);
    }

    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when clicking sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
                toggleSidebar();
            }
        });
    });

    // Highlight active sidebar link
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const hasHomeSections = document.getElementById('about') !== null;

    const normalizePath = (path) => {
        let p = path.split('#')[0].split('?')[0];
        if (p.endsWith('index.html')) {
            p = p.substring(0, p.length - 10);
        }
        if (!p.endsWith('/')) {
            p += '/';
        }
        return p;
    };

    const normalizedCurrentPath = normalizePath(window.location.pathname);

    function updateActiveSidebarLink() {
        let activeHash = '';

        if (hasHomeSections) {
            // Homepage scroll-based detection
            const scrollPos = window.scrollY + 200; // Offset for threshold
            
            // Check if user is near the bottom of the page
            const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

            if (isAtBottom) {
                activeHash = '#projects';
            } else {
                const sections = [
                    { hash: '', element: document.querySelector('header') },
                    { hash: '#about', element: document.getElementById('about') },
                    { hash: '#arsenal', element: document.getElementById('arsenal') },
                    { hash: '#hall-of-fame', element: document.getElementById('hall-of-fame') },
                    { hash: '#freelance', element: document.getElementById('freelance') },
                    { hash: '#projects', element: document.getElementById('projects') }
                ];

                sections.forEach(sec => {
                    if (sec.element && scrollPos >= sec.element.offsetTop) {
                        activeHash = sec.hash;
                    }
                });
            }

            sidebarLinks.forEach(link => {
                const normalizedLinkPath = normalizePath(link.pathname);
                // On homepage, paths must match normalized homepage path, and hash must match activeHash
                const isPathMatch = normalizedLinkPath === normalizedCurrentPath;
                if (isPathMatch && link.hash === activeHash) {
                    link.classList.add('active', 'text-white');
                    link.classList.remove('text-gray-300');
                } else {
                    link.classList.remove('active', 'text-white');
                    link.classList.add('text-gray-300');
                }
            });
        } else {
            // Non-homepage: highlight Blogs link if we are on any blog-related path
            const isBlogsPage = normalizedCurrentPath.startsWith('/blogs/');
            sidebarLinks.forEach(link => {
                const normalizedLinkPath = normalizePath(link.pathname);
                const isBlogsLink = normalizedLinkPath === '/blogs/';
                if (isBlogsPage && isBlogsLink) {
                    link.classList.add('active', 'text-white');
                    link.classList.remove('text-gray-300');
                } else {
                    link.classList.remove('active', 'text-white');
                    link.classList.add('text-gray-300');
                }
            });
        }
    }

    if (hasHomeSections) {
        window.addEventListener('scroll', updateActiveSidebarLink, { passive: true });
    }
    updateActiveSidebarLink();
});

// ===== SEARCH =====
function toggleSearch() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    if (!modal) return;

    const isHidden = modal.classList.contains('hidden');

    if (isHidden) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
        // Load search data
        loadSearchData();
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
        if (input) input.value = '';
        const results = document.getElementById('search-results');
        if (results) results.innerHTML = '<div class="text-gray-500 text-sm px-4">Type to search...</div>';
    }
}

let searchData = null;

async function loadSearchData() {
    if (searchData) return;
    try {
        const baseUrl = window.siteBaseUrl || '';
        const response = await fetch(`${baseUrl}/search.json`);
        searchData = await response.json();
    } catch (e) {
        searchData = [];
    }
}

function performSearch(query) {
    const results = document.getElementById('search-results');
    if (!results || !searchData) return;

    if (!query || query.length < 2) {
        results.innerHTML = '<div class="text-gray-500 text-sm px-4">Type to search...</div>';
        return;
    }

    const q = query.toLowerCase();
    const matches = searchData.filter(item =>
        item.title.toLowerCase().includes(q) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );

    if (matches.length === 0) {
        results.innerHTML = '<div class="text-gray-500 text-sm px-4">No results found.</div>';
        return;
    }

    results.innerHTML = matches.map(item => `
        <a href="${item.url}" class="block p-3 hover:bg-white/5 rounded transition-all border-b border-white/5 last:border-none group">
            <div class="font-bold text-white group-hover:text-white transition-colors text-sm">${item.title}</div>
            <div class="text-gray-500 text-xs mt-1">${item.date}${item.tags && item.tags.length ? ' • ' + item.tags.join(', ') : ''}</div>
        </a>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    // Search toggle buttons
    ['search-toggle', 'search-toggle-mobile'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', toggleSearch);
    });

    // Search close button
    const searchClose = document.getElementById('search-close');
    if (searchClose) searchClose.addEventListener('click', toggleSearch);

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    }

    // Close search on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('search-modal');
            if (modal && !modal.classList.contains('hidden')) {
                toggleSearch();
            }
            const sidebar = document.getElementById('sidebar');
            if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
                toggleSidebar();
            }
        }
    });

    // Ctrl+K to open search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleSearch();
        }
    });

    // Close search modal when clicking outside
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) toggleSearch();
        });
    }
});

// ===== BLOG SEARCH FILTER =====
document.addEventListener('DOMContentLoaded', () => {
    const blogSearch = document.getElementById('blog-search');
    if (blogSearch) {
        blogSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.blog-post-card').forEach(card => {
                const title = card.getAttribute('data-title') || '';
                const tags = card.getAttribute('data-tags') || '';
                const visible = title.includes(query) || tags.includes(query);
                card.style.display = visible ? '' : 'none';
            });
        });
    }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== SMART NAVBAR: AUTO-HIDE ON SCROLL =====
let lastScrollTop = 0;
const navBarElement = document.querySelector('nav');
if (navBarElement) {
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide/Show navbar on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide navbar
            navBarElement.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up or at top - show navbar
            navBarElement.style.transform = 'translateY(0)';
        }

        // Add solid background and border when scrolled down, keep transparent/blending at top
        if (isBlogPage) {
            navBarElement.classList.remove('mix-blend-difference');
            navBarElement.classList.add('border-b', 'border-white/5', 'backdrop-blur-md');
            if (scrollTop > 20) {
                navBarElement.classList.add('bg-[#1d1e20]/95');
                navBarElement.classList.remove('bg-[#1d1e20]/90');
            } else {
                navBarElement.classList.add('bg-[#1d1e20]/90');
                navBarElement.classList.remove('bg-[#1d1e20]/95');
            }
        } else {
            if (scrollTop > 20) {
                navBarElement.classList.add('bg-deep-black/90', 'backdrop-blur-md', 'border-b', 'border-white/10');
                navBarElement.classList.remove('mix-blend-difference');
            } else {
                navBarElement.classList.remove('bg-deep-black/90', 'backdrop-blur-md', 'border-b', 'border-white/10');
                navBarElement.classList.add('mix-blend-difference');
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
}

// ===== DYNAMIC TABLE OF CONTENTS (TOC) GENERATION & SCROLL TRACKING =====
document.addEventListener('DOMContentLoaded', () => {
    const tocContainer = document.getElementById('sidebar-toc');
    const tocOuter = document.getElementById('sidebar-toc-container');
    const proseContent = document.querySelector('.prose-content');
    if (!tocContainer || !tocOuter || !proseContent) return;

    const headings = proseContent.querySelectorAll('h2');
    if (headings.length === 0) return;

    // Show the Table of Contents container in the sidebar
    tocOuter.classList.remove('hidden');

    // Generate TOC links dynamically
    headings.forEach((heading, idx) => {
        if (!heading.id) {
            heading.id = heading.textContent.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
        }

        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.replace(/\s*\/\/$/, '');
        link.className = 'toc-link block text-gray-400 hover:text-white transition-colors py-1.5 border-l-2 border-transparent pl-3 text-sm tracking-wider uppercase font-semibold';
        
        // Close sidebar on link click (especially useful on mobile)
        link.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
                toggleSidebar();
            }
        });

        tocContainer.appendChild(link);
    });

    const tocLinks = tocContainer.querySelectorAll('.toc-link');

    // Highlight active link as user scrolls
    function highlightActiveTOC() {
        let activeIdx = -1;
        const scrollPos = window.scrollY + 160; // Offset for navbar and spacing

        headings.forEach((heading, idx) => {
            if (scrollPos >= heading.offsetTop) {
                activeIdx = idx;
            }
        });

        tocLinks.forEach((link, idx) => {
            if (idx === activeIdx) {
                link.classList.add('text-white', 'border-white', 'active');
                link.classList.remove('text-gray-400', 'border-transparent');
            } else {
                link.classList.remove('text-white', 'border-white', 'active');
                link.classList.add('text-gray-400', 'border-transparent');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveTOC, { passive: true });
    highlightActiveTOC(); // run once on load
});

// ===== COPY CODE BUTTON =====
document.addEventListener('DOMContentLoaded', () => {
    const codeBlocks = document.querySelectorAll('.prose-content pre');
    codeBlocks.forEach((codeBlock) => {
        // Create copy button
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.type = 'button';
        button.innerText = 'copy';
        
        // Append button to pre
        codeBlock.appendChild(button);
        
        // Add click listener
        button.addEventListener('click', () => {
            const code = codeBlock.querySelector('code');
            if (!code) return;
            
            let text = code.innerText;
            
            navigator.clipboard.writeText(text).then(() => {
                button.innerText = 'copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.innerText = 'copy';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });
});

// ===== MOBILE SWIPE GESTURES =====
document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Thresholds
        const swipeThresholdX = 70;
        const swipeThresholdY = 55;
        
        const sidebar = document.getElementById('sidebar');
        const sidebarOpen = sidebar && !sidebar.classList.contains('-translate-x-full');

        // 1. Sidebar edge-swipe gestures
        if (sidebarOpen) {
            // Swipe left anywhere when sidebar is open -> close it
            if (diffX < -swipeThresholdX && Math.abs(diffY) < swipeThresholdY) {
                if (typeof toggleSidebar === 'function') {
                    toggleSidebar();
                }
                return;
            }
        } else {
            // Swipe right from left edge (within 80px) -> open sidebar
            if (touchStartX < 80 && diffX > swipeThresholdX && Math.abs(diffY) < swipeThresholdY) {
                if (typeof toggleSidebar === 'function') {
                    toggleSidebar();
                }
                return;
            }
        }

        // 2. Post Navigation gestures (only if sidebar is closed and we are on a post page)
        if (!sidebarOpen && document.querySelector('.prose-content')) {
            // Ensure the swipe is horizontal and swipe start is not near the left edge (to not conflict with sidebar gesture)
            if (Math.abs(diffY) < swipeThresholdY && touchStartX >= 80) {
                if (diffX < -100) {
                    // Swipe left -> Next Post
                    const nextLink = document.getElementById('next-post-link');
                    if (nextLink) {
                        nextLink.click();
                    }
                } else if (diffX > 100) {
                    // Swipe right -> Previous Post
                    const prevLink = document.getElementById('prev-post-link');
                    if (prevLink) {
                        prevLink.click();
                    }
                }
            }
        }
    }
});
