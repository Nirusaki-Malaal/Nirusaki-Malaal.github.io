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

function renderProjectCards(repos) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Clear skeleton cards
    grid.innerHTML = '';

    // Update repo count in hero
    const repoCount = document.getElementById('repo-count');
    if (repoCount) repoCount.textContent = repos.length;

    repos.forEach((repo, index) => {
        const lang = repo.language || 'Unknown';
        const colors = langColors[lang] || defaultLang;
        const neonColor = neonColors[index % neonColors.length];

        const card = document.createElement('article');
        card.className = 'project-card glass-card group cursor-pointer hover-target flex flex-col h-full';
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', `${repo.name} - ${repo.description || 'No description'}`);

        card.innerHTML = `
            <div class="h-2 w-full" style="background: ${colors.gradient};"></div>
            <div class="p-6 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="font-display text-xl font-bold group-hover:text-${neonColor} transition-colors line-clamp-1">${repo.name}</h3>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="text-xs text-neon-cyan border border-neon-cyan px-2 py-1 rounded hover:bg-neon-cyan hover:text-black transition-all relative z-20" onclick="event.stopPropagation();">LIVE ↗</a>` : ''}
                </div>
                <p class="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">${repo.description || 'No description available.'}</p>
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <div class="flex items-center gap-3">
                        <span class="text-xs px-2 py-1 border rounded ${colors.text} ${colors.border}">${lang}</span>
                        ${repo.stargazers_count > 0 ? `<span class="text-xs text-gray-400 flex items-center gap-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>${repo.stargazers_count}</span>` : ''}
                        ${repo.forks_count > 0 ? `<span class="text-xs text-gray-400 flex items-center gap-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>${repo.forks_count}</span>` : ''}
                    </div>
                    <time class="text-xs text-gray-500 font-mono" datetime="${repo.updated_at}">${new Date(repo.updated_at).toLocaleDateString()}</time>
                </div>
            </div>
            <div class="px-6 pb-6 relative z-20">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="text-xs uppercase tracking-widest border border-neon-cyan text-neon-cyan px-3 py-2 hover:bg-neon-cyan hover:text-black transition-all" onclick="event.stopPropagation();">View on GitHub</a>
            </div>
        `;

        // Click card to go to GitHub
        card.addEventListener('click', () => window.open(repo.html_url, '_blank'));

        grid.appendChild(card);
    });
}

// Load projects on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    if (grid) {
        fetchGitHubRepos()
            .then(repos => renderProjectCards(repos))
            .catch(err => {
                console.error('Failed to fetch repos:', err);
                grid.innerHTML = `
                    <div class="col-span-full glass-card p-8 text-center">
                        <p class="text-gray-400 mb-4">Failed to load projects from GitHub.</p>
                        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener" class="text-neon-cyan hover:underline">View on GitHub →</a>
                    </div>
                `;
            });
    }
});

// ===== CUSTOM CURSOR =====
let mouseX = 0, mouseY = 0;
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hasCustomCursor = cursorDot && cursorOutline;

if (hasCustomCursor) {
    document.body.classList.add('has-custom-cursor');
}

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!hasCustomCursor) return;
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
    if (cursorOutline.animate) {
        cursorOutline.animate({ left: `${event.clientX}px`, top: `${event.clientY}px` }, { duration: 500, fill: "forwards" });
    } else {
        cursorOutline.style.left = `${event.clientX}px`;
        cursorOutline.style.top = `${event.clientY}px`;
    }
});

if (hasCustomCursor) {
    document.querySelectorAll('.hover-target, a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
}

// ===== THREE.JS BACKGROUND =====
const canvas = document.getElementById('bg-canvas');
if (canvas && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 50;
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0x00f5ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 5;

    let rafId;
    function animate() {
        rafId = requestAnimationFrame(animate);
        particlesMesh.rotation.x += 0.0005 + mouseY * 0.0005;
        particlesMesh.rotation.y += 0.0005 + mouseX * 0.0005;
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
    gsap.utils.toArray('section, article').forEach((section) => {
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
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active', 'text-neon-cyan');
        }
    });
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
        const response = await fetch('/search.json');
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
            <div class="font-bold text-white group-hover:text-neon-cyan transition-colors text-sm">${item.title}</div>
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
