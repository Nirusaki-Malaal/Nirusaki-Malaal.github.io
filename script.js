        // ALL 9 PROJECTS FROM GITHUB - FULLY RESTORED
        const githubProjects = [
            {
                id: "video-encoder",
                name: "video-encoder",
                description: "Queue Based Encoder Saves Data in a Mongo DB database works even after restart can be run even from a linux live environment",
                language: "Python",
                stars: 3,
                updated: "2025-12-31",
                homepage: "",
                html_url: "https://github.com/Nirusaki-Malaal/video-encoder",
                color: "neon-pink",
                gradient: "linear-gradient(135deg, #ff006e 0%, #8338ec 100%)",
                details_url: "projects/video-encoder.html"
            },
            {
                id: "nith-results",
                name: "nith-results-website",
                details_url: "projects/nith-results.html",
                description: "NITH Results Portal - Student result checking system with modern UI deployed on Vercel",
                language: "JavaScript",
                stars: 0,
                forks: 0,
                updated: "2026-01-28",
                homepage: "https://result-nith-black.vercel.app/",
                html_url: "https://github.com/Nirusaki-Malaal/nith-results-website",
                color: "neon-cyan",
                gradient: "linear-gradient(135deg, #00f5ff 0%, #b026ff 100%)"
            },
            {
                id: "auto-rename",
                name: "Auto-Rename",
                details_url: "projects/auto-rename.html",
                description: "Automatically renames entertainment content with proper syntax and formatting",
                language: "Python",
                stars: 1,
                forks: 0,
                updated: "2025-10-22",
                homepage: null,
                html_url: "https://github.com/Nirusaki-Malaal/Auto-Rename",
                color: "neon-purple",
                gradient: "linear-gradient(135deg, #b026ff 0%, #ff006e 100%)"
            },
            {
                id: "gdrive-bot",
                name: "gdrive-uploader-bot",
                details_url: "projects/gdrive-bot.html",
                description: "Uploads Files From Telegram To Google Drive seamlessly with progress tracking",
                language: "Python",
                stars: 1,
                forks: 0,
                updated: "2025-10-22",
                homepage: null,
                html_url: "https://github.com/Nirusaki-Malaal/gdrive-uploader-bot",
                color: "neon-cyan",
                gradient: "linear-gradient(135deg, #00f5ff 0%, #3a86ff 100%)"
            },
            {
                id: "airing-anime",
                name: "auto-airing-animes",
                details_url: "projects/airing-anime.html",
                description: "Automated tracker for currently airing anime series with smart notifications",
                language: "Python",
                stars: 1,
                forks: 0,
                updated: "2026-01-04",
                homepage: null,
                html_url: "https://github.com/Nirusaki-Malaal/auto-airing-animes",
                color: "neon-pink",
                gradient: "linear-gradient(135deg, #ff006e 0%, #fb5607 100%)"
            },
            {
                id: "music-parser",
                name: "Music-Name-Parser",
                details_url: "projects/music-parser.html",
                description: "Parses and organizes music file metadata automatically with regex patterns",
                language: "Python",
                stars: 0,
                forks: 0,
                updated: "2026-01-16",
                homepage: null,
                html_url: "https://github.com/Nirusaki-Malaal/Music-Name-Parser",
                color: "neon-purple",
                gradient: "linear-gradient(135deg, #8338ec 0%, #00f5ff 100%)"
            },
            {
                id: "image-compressor",
                name: "image-compressor-website",
                details_url: "projects/image-compressor.html",
                description: "Web-based image compression tool with client-side processing capabilities",
                language: "CSS",
                stars: 0,
                forks: 0,
                updated: "2026-01-21",
                homepage: null,
                html_url: "https://github.com/Nirusaki-Malaal/image-compressor-website",
                color: "neon-cyan",
                gradient: "linear-gradient(135deg, #3a86ff 0%, #00f5ff 100%)"
            },
            {
                id: "dsa",
                name: "DSA",
                details_url: "projects/dsa.html",
                description: "Data Structures & Algorithms practice repository - C++ implementations for NITH",
                language: "C++",
                stars: 1,
                forks: 0,
                updated: "2026-01-09",
                homepage: null,
                html_url: "https://github.com/Nirusaki-Malaal/DSA",
                color: "neon-pink",
                gradient: "linear-gradient(135deg, #ff006e 0%, #3a86ff 100%)"
            },
            {
                id: "template-bot",
                name: "template-bot",
                details_url: "projects/template-bot.html",
                description: "Starter template for building Telegram bots with Python and Pyrogram framework",
                language: "Python",
                stars: 0,
                forks: 0,
                updated: "2026-01-01",
                homepage: null,
                html_url: "https://github.com/Nirusaki-Malaal/template-bot",
                color: "neon-purple",
                gradient: "linear-gradient(135deg, #b026ff 0%, #ff006e 100%)"
            }
        ];

        const langColors = {
            'Python': 'text-yellow-400 border-yellow-400',
            'JavaScript': 'text-yellow-300 border-yellow-300',
            'C++': 'text-blue-600 border-blue-600',
            'C': 'text-gray-400 border-gray-400',
            'HTML': 'text-orange-500 border-orange-500',
            'CSS': 'text-blue-500 border-blue-500',
            'Java': 'text-orange-400 border-orange-400'
        };

        const projectsGrid = document.getElementById('projects-grid');
        
        githubProjects.forEach((project, index) => {
            const card = document.createElement('article');
            card.className = 'project-card glass-card group cursor-pointer hover-target flex flex-col h-full';
            card.setAttribute('role', 'listitem');
            card.setAttribute('aria-label', `${project.name} - ${project.description}`);
            card.setAttribute('itemscope', '');
            card.setAttribute('itemtype', 'https://schema.org/SoftwareSourceCode');
            card.setAttribute('itemprop', 'itemListElement');
            
            const langClass = langColors[project.language] || 'text-gray-500 border-gray-500';
            
            card.innerHTML = `
                <meta itemprop="name" content="${project.name}">
                <meta itemprop="description" content="${project.description}">
                <meta itemprop="programmingLanguage" content="${project.language}">
                <meta itemprop="codeRepository" content="${project.html_url}">
                <meta itemprop="dateModified" content="${project.updated}">
                <meta itemprop="position" content="${index + 1}">
                ${project.stars > 0 ? `<div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating" class="hidden"><meta itemprop="ratingValue" content="5"><meta itemprop="reviewCount" content="${project.stars}"></div>` : ''}
                
                <div class="h-2 w-full" style="background: ${project.gradient};"></div>
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-display text-xl font-bold group-hover:text-${project.color} transition-colors line-clamp-1">${project.name}</h3>
                        ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener" class="text-xs text-neon-cyan border border-neon-cyan px-2 py-1 rounded hover:bg-neon-cyan hover:text-black transition-all relative z-20" onclick="event.stopPropagation();">LIVE ↗</a>` : ''}
                    </div>
                    <p class="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">${project.description}</p>
                    <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                        <div class="flex items-center gap-3">
                            <span class="text-xs px-2 py-1 border rounded ${langClass}">${project.language}</span>
                            ${project.stars > 0 ? `<span class="text-xs text-gray-400 flex items-center gap-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>${project.stars}</span>` : ''}
                        </div>
                        <time class="text-xs text-gray-500 font-mono" datetime="${project.updated}">${new Date(project.updated).toLocaleDateString()}</time>
                    </div>
                </div>
                <div class="px-6 pb-6 flex gap-3 relative z-20">
                    <a href="${project.details_url}" class="text-xs uppercase tracking-widest border border-neon-pink text-neon-pink px-3 py-2 hover:bg-neon-pink hover:text-black transition-all" onclick="event.stopPropagation();">Case Study</a>
                    <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" class="text-xs uppercase tracking-widest border border-neon-cyan text-neon-cyan px-3 py-2 hover:bg-neon-cyan hover:text-black transition-all" onclick="event.stopPropagation();">GitHub</a>
                </div>
            `;
            projectsGrid.appendChild(card);
        });

        // Three.js Background
        const canvas = document.getElementById('bg-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);
        for(let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 50;
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0x00f5ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        camera.position.z = 5;
        
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            
            const cursorDot = document.querySelector('.cursor-dot');
            const cursorOutline = document.querySelector('.cursor-outline');
            cursorDot.style.left = `${event.clientX}px`;
            cursorDot.style.top = `${event.clientY}px`;
            cursorOutline.animate({ left: `${event.clientX}px`, top: `${event.clientY}px` }, { duration: 500, fill: "forwards" });
        });
        
        document.querySelectorAll('.hover-target').forEach(el => {
            el.addEventListener('mouseenter', () => document.querySelector('.cursor-outline').classList.add('hover'));
            el.addEventListener('mouseleave', () => document.querySelector('.cursor-outline').classList.remove('hover'));
        });
        
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
        
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('section, article').forEach((section) => {
            gsap.from(section.children, {
                scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
                y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out'
            });
        });
        
        function toggleMenu() {
            const menu = document.getElementById('mobile-menu');
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
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
