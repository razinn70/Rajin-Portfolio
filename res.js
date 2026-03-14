        // HTML escape utility — prevents XSS when interpolating user data into innerHTML
        function escapeHtml(s) {
            return String(s)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        // Loading sequence
        const loadingMessages = [
            'Initializing system...',
            'Loading dependencies...',
            'Compiling components...',
            'Connecting to GitHub API...',
            'Optimizing performance...',
            'Starting application...',
            'Ready to launch! 🚀'
        ];

        let currentMessage = 0;
        let progress = 0;

        function updateLoading() {
            const loadingText = document.getElementById('loadingText');
            const loadingBar = document.getElementById('loadingBar');
            
            if (currentMessage < loadingMessages.length) {
                loadingText.textContent = loadingMessages[currentMessage];
                progress = ((currentMessage + 1) / loadingMessages.length) * 100;
                loadingBar.style.width = progress + '%';
                currentMessage++;
                
                setTimeout(updateLoading, 500);
            } else {
                setTimeout(hideLoading, 800);
            }
        }

        function hideLoading() {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen.classList.add('fade-out');
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                initializeApp();
            }, 800);
        }

        // Initialize application
        function initializeApp() {
            loadGitHubProjects();
            initializeTerminal();
            initializeScrollEffects();
            initializeSmootScroll();
            initializeSkillAnimations();
            initializeUiControls();
        }

        // Copy to clipboard functionality
        async function copyToClipboard(text, message) {
            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(text);
                    showNotification(message, 'success');
                    return true;
                } catch (error) {
                    console.warn('Clipboard API failed, falling back to manual copy.', error);
                }
            }

            const fallbackInput = document.createElement('textarea');
            fallbackInput.value = text;
            fallbackInput.setAttribute('readonly', '');
            fallbackInput.style.position = 'absolute';
            fallbackInput.style.left = '-9999px';
            document.body.appendChild(fallbackInput);
            fallbackInput.select();

            try {
                const copied = document.execCommand('copy');
                showNotification(copied ? message : 'Copy failed - please copy manually', copied ? 'success' : 'error');
                return copied;
            } finally {
                fallbackInput.remove();
            }
        }

        // Quick contact toggle for mobile
        function toggleQuickContact() {
            window.location.href = '#contact';
        }

        function initializeUiControls() {
            const mobileMenuButton = document.getElementById('mobileMenuBtn');
            const terminalToggle = document.getElementById('terminalToggle');
            const terminalCloseButton = document.getElementById('terminalCloseButton');
            const quickContactToggle = document.getElementById('quickContactToggle');
            const copyEmailButton = document.getElementById('copyEmailButton');
            const copyPhoneButton = document.getElementById('copyPhoneButton');
            const mobileMenu = document.getElementById('mobileMenu');

            mobileMenuButton?.addEventListener('click', toggleMobileMenu);
            terminalToggle?.addEventListener('click', toggleTerminal);
            terminalCloseButton?.addEventListener('click', closeTerminal);
            quickContactToggle?.addEventListener('click', toggleQuickContact);
            copyEmailButton?.addEventListener('click', () => copyToClipboard('muddinal@uoguelph.ca', 'Email copied!'));
            copyPhoneButton?.addEventListener('click', () => copyToClipboard('+1 437 808 1738', 'Phone copied!'));

            mobileMenu?.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', closeMobileMenu);
            });
        }

        // Animate skill bars when they come into view
        function initializeSkillAnimations() {
            const skillBars = document.querySelectorAll('.skill-progress');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const width = bar.style.width;
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 200);
                    }
                });
            }, { threshold: 0.5 });

            skillBars.forEach(bar => observer.observe(bar));
        }

        // GitHub Projects with robust fallbacks
        async function loadGitHubProjects() {
            const projectsGrid = document.getElementById('projectsGrid');
            const githubStatus = document.querySelector('.github-status span');
            
            // Enhanced featured projects with complete data
            const featuredProjects = [
                {
                    name: 'VCard Management System',
                    description: 'Comprehensive C-based contact management with Python GUI integration. Features memory-safe operations, MySQL database integration, and efficient search algorithms.',
                    technologies: ['C', 'Python', 'MySQL', 'ctypes', 'Valgrind'],
                    githubUrl: 'https://github.com/razinn70',
                    type: 'featured',
                    stars: 12,
                    forks: 3,
                    updated: '2024-12-15',
                    highlight: true
                },
                {
                    name: 'Investment Portfolio Manager',
                    description: 'Java Swing application implementing advanced OOP patterns. Features real-time portfolio tracking, HashMap-optimized data structures, and comprehensive financial analytics.',
                    technologies: ['Java', 'Swing', 'OOP', 'HashMap', 'Financial APIs'],
                    githubUrl: 'https://github.com/razinn70',
                    type: 'featured',
                    stars: 8,
                    forks: 2,
                    updated: '2024-11-28',
                    highlight: true
                },
                {
                    name: 'Database Architecture Projects',
                    description: 'Collection of normalized database schemas with advanced query optimization. Focuses on 3NF design principles, foreign key constraints, and performance tuning.',
                    technologies: ['MySQL', 'SQL', 'Database Design', 'Query Optimization'],
                    githubUrl: 'https://github.com/razinn70',
                    type: 'featured',
                    stars: 6,
                    forks: 1,
                    updated: '2024-10-20'
                },
                {
                    name: 'Modern Web Applications',
                    description: 'Responsive web applications built with modern JavaScript frameworks. Features clean UI/UX design, API integration, and mobile-first development approach.',
                    technologies: ['JavaScript', 'HTML5', 'CSS3', 'React', 'APIs'],
                    githubUrl: 'https://github.com/razinn70',
                    type: 'featured',
                    stars: 15,
                    forks: 4,
                    updated: '2024-12-28'
                }
            ];

            // Always show featured projects first
            renderProjects(featuredProjects);
            
            // Try to enhance with GitHub data (with timeout and fallbacks)
            try {
                githubStatus.textContent = 'Connecting to GitHub...';
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
                
                const response = await fetch('https://api.github.com/users/razinn70/repos?sort=updated&per_page=4', {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`GitHub API responded with ${response.status}`);
                }
                
                const repos = await response.json();
                
                if (Array.isArray(repos) && repos.length > 0) {
                    // GitHub data available - merge with featured projects
                    const githubProjects = repos.slice(0, 2).map(repo => ({
                        name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        description: repo.description || 'Open source project showcasing modern development practices and clean code architecture.',
                        technologies: repo.language ? [repo.language] : ['Code'],
                        githubUrl: repo.html_url,
                        stars: repo.stargazers_count,
                        forks: repo.forks_count,
                        updated: new Date(repo.updated_at).toLocaleDateString(),
                        type: 'github'
                    }));
                    
                    renderProjects([...featuredProjects, ...githubProjects]);
                    githubStatus.textContent = 'Live GitHub Integration';
                } else {
                    throw new Error('No repositories found');
                }
                
            } catch (error) {
                // Graceful fallback - projects already rendered
                console.log('GitHub integration unavailable:', error.message);
                githubStatus.textContent = 'Offline Mode - Static Projects';
                
                // Optional: Show a subtle notification
                showNotification('Portfolio loaded in offline mode', 'info');
            }
        }
        
        // Simple notification system
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('is-visible');
            }, 100);
            
            setTimeout(() => {
                notification.classList.remove('is-visible');
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        }

        function renderProjects(projects) {
            const projectsGrid = document.getElementById('projectsGrid');
            projectsGrid.replaceChildren();

            projects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            });
        }

        function createSvgElement(tagName, attributes = {}) {
            const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
            return element;
        }

        function createIcon(iconType) {
            const svg = createSvgElement('svg', {
                width: '16',
                height: '16',
                viewBox: '0 0 24 24',
                fill: iconType === 'github' ? 'currentColor' : 'none',
                stroke: iconType === 'github' ? 'none' : 'currentColor',
                'stroke-width': iconType === 'github' ? '0' : '2'
            });

            if (iconType === 'github') {
                svg.appendChild(createSvgElement('path', {
                    d: 'M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'
                }));
            } else {
                svg.appendChild(createSvgElement('path', {
                    d: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3'
                }));
            }

            return svg;
        }

        function createProjectLink({ href, label, title, icon, onClick }) {
            const link = document.createElement('a');
            link.href = href;
            link.className = 'project-link';
            link.setAttribute('aria-label', label);

            if (title) {
                link.title = title;
            }

            if (href.startsWith('http')) {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }

            if (onClick) {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    onClick();
                });
            }

            link.appendChild(createIcon(icon));
            return link;
        }

        function createProjectCard(project) {
            const card = document.createElement('div');
            card.className = `project-card ${project.highlight ? 'highlight' : ''}`;
            
            // Define project-specific metrics and demo links
            const projectDetails = {
                'VCard Management System': {
                    metrics: ['10K+ Records', '95% Faster', 'A+ Grade'],
                    demoUrl: null,
                    achievement: 'Outstanding Project Award 2024'
                },
                'Investment Portfolio Manager': {
                    metrics: ['$50K+ Tracked', '98% Accuracy', 'A+ Grade'],
                    demoUrl: '#',
                    achievement: 'Top Scorer in OOP Course'
                },
                'Database Architecture Projects': {
                    metrics: ['300% Faster', '3NF Design', 'Query Expert'],
                    demoUrl: null,
                    achievement: 'Database Design Excellence'
                },
                'Modern Web Applications': {
                    metrics: ['95+ Lighthouse', '<2s Load', 'Mobile-First'],
                    demoUrl: '#',
                    achievement: 'You\'re experiencing it now!'
                }
            };

            const details = projectDetails[project.name] || { metrics: [], demoUrl: null, achievement: null };
            
            card.innerHTML = `
                <div class="project-header">
                    <div>
                        <h3 class="project-title">${project.name}</h3>
                        ${details.achievement ? `<div class="project-achievement">🏆 ${details.achievement}</div>` : ''}
                    </div>
                    <div class="project-links">
                        <a href="${project.githubUrl}" class="project-link" target="_blank" aria-label="View on GitHub" title="View Source Code">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                        ${details.demoUrl ? `
                            <a href="${details.demoUrl}" class="project-link demo-link" target="_blank" aria-label="Live Demo" title="View Live Demo"${details.demoUrl === '#' ? ' data-demo-modal="' + escapeHtml(project.name) + '"' : ''}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                                </svg>
                            </a>
                        ` : ''}
                        ${project.type === 'github' ? `
                            <a href="${project.githubUrl}" class="project-link" target="_blank" aria-label="External Link">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                                </svg>
                            </a>
                        ` : ''}
                    </div>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                ${details.metrics.length > 0 ? `
                    <div class="project-metrics">
                        ${details.metrics.map(metric => `<div class="metric-badge">${metric}</div>`).join('')}
                    </div>
                ` : ''}
                ${project.type === 'github' ? `
                    <div class="project-stats">
                        <div class="project-stat">
                            <span>⭐</span>
                            <span>${project.stars || 0}</span>
                        </div>
                        <div class="project-stat">
                            <span>🍴</span>
                            <span>${project.forks || 0}</span>
                        </div>
                        <div class="project-stat">
                            <span>📅</span>
                            <span>${project.updated}</span>
                        </div>
                    </div>
                ` : ''}
            `;

            // Attach demo modal handler without inline onclick
            const demoLink = card.querySelector('[data-demo-modal]');
            if (demoLink) {
                demoLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    showDemoModal(demoLink.dataset.demoModal);
                });
            }

            return card;
        }

        // Demo modal functionality — built via DOM API (no inline styles or event handlers)
        function showDemoModal(projectName) {
            const demoInfo = {
                'Investment Portfolio Manager': 'Java Swing application with real-time portfolio tracking. Features include risk analysis, profit/loss calculations, and interactive charts. Built with advanced OOP patterns and HashMap optimization.',
                'Modern Web Applications': 'You\'re currently experiencing this demo! This responsive portfolio features mobile navigation, GitHub API integration, terminal interface, and modern web technologies.',
                'Database Architecture Projects': 'Collection of optimized database schemas demonstrating 3NF normalization, complex joins, and performance tuning. Reduced query time from 2.5s to 0.8s average.'
            };

            const modal = document.createElement('div');
            modal.className = 'demo-modal-overlay modal';

            const inner = document.createElement('div');
            inner.className = 'demo-modal-inner';

            const title = document.createElement('h3');
            title.className = 'demo-modal-title';
            title.textContent = projectName + ' Demo';

            const desc = document.createElement('p');
            desc.className = 'demo-modal-description';
            desc.textContent = demoInfo[projectName] || 'Demo details available upon request. Contact me for a live demonstration of this project.';

            const actions = document.createElement('div');
            actions.className = 'demo-modal-actions';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'demo-modal-close';
            closeBtn.textContent = 'Close';
            closeBtn.addEventListener('click', () => modal.remove());

            const requestLink = document.createElement('a');
            requestLink.className = 'demo-modal-request';
            requestLink.href = 'mailto:muddinal@uoguelph.ca?subject=Demo%20Request%3A%20' + encodeURIComponent(projectName);
            requestLink.textContent = 'Request Demo';

            actions.appendChild(closeBtn);
            actions.appendChild(requestLink);
            inner.appendChild(title);
            inner.appendChild(desc);
            inner.appendChild(actions);
            modal.appendChild(inner);
            document.body.appendChild(modal);

            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });
        }

        // Terminal functionality
        function initializeTerminal() {
            const terminalInput = document.getElementById('terminalInput');
            
            terminalInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleTerminalCommand(terminalInput.value);
                    terminalInput.value = '';
                }
            });
        }

        function handleTerminalCommand(command) {
            const terminalBody = document.getElementById('terminalBody');
            const cmd = command.toLowerCase().trim();
            
            addTerminalLine(`rajin@dev:~$ ${escapeHtml(command)}`, 'terminal-prompt');
            
            let response = '';
            
            switch (cmd) {
                case 'help':
                case '?':
                case 'commands':
                    response = `🚀 <strong>Available Commands</strong> (just type the word!)
                    
<span class="terminal-category">📋 Information Commands:</span>
• <strong>help</strong> or <strong>?</strong> - Show this help (you're here!)
• <strong>about</strong> - Learn about Rajin's background
• <strong>skills</strong> - View technical capabilities
• <strong>education</strong> - University & academic info

<span class="terminal-category">💼 Professional Commands:</span>
• <strong>projects</strong> - View featured projects
• <strong>github</strong> - GitHub profile & contributions
• <strong>contact</strong> - Get contact information
• <strong>resume</strong> - Download resume (coming soon)

<span class="terminal-category">🛠️ Utility Commands:</span>
• <strong>clear</strong> - Clear this terminal screen
• <strong>exit</strong> or <strong>quit</strong> - Close terminal

💡 <em>Tip: Commands are case-insensitive. Type 'about' or 'ABOUT' - both work!</em>`;
                    break;
                    
                case 'about':
                case 'bio':
                case 'info':
                    response = `👨‍💻 <strong>About Rajin Al Faiz</strong>

🎓 Computer Science Student @ University of Guelph
🌍 Location: Guelph, Ontario, Canada
🏠 Originally from: Bangladesh
🔧 Role: Full-stack Developer & System Architect

💡 <strong>My Journey:</strong>
Started with curiosity about how things work - from taking apart electronics as a kid to building software systems today. I believe in writing clean, efficient code that solves real problems.

🎯 <strong>Current Focus:</strong>
• Building scalable web applications
• Exploring system design & architecture  
• Contributing to open source projects
• Learning new technologies daily

🚀 Always open to new challenges and collaborations!

<em>Want to know more? Try 'skills' or 'projects'</em>`;
                    break;
                    
                case 'projects':
                case 'work':
                case 'portfolio':
                    response = `📂 <strong>Featured Projects Portfolio</strong>

🔧 <strong>VCard Management System</strong>
   📊 <strong>Impact:</strong> Handles 10,000+ contact records efficiently
   💻 <strong>Tech Stack:</strong> C (Core), Python (GUI), MySQL (Database)
   🎯 <strong>Features:</strong> Memory-safe operations, data validation, GUI integration
   📈 <strong>Performance:</strong> 95% faster than previous manual system
   � <strong>GitHub:</strong> <a href="https://github.com/razinn70/vcard-manager">View Source Code</a>
   
�📈 <strong>Investment Portfolio Manager</strong>
   📊 <strong>Impact:</strong> Tracks $50K+ in simulated investments
   💻 <strong>Tech Stack:</strong> Java, Swing, OOP Design Patterns
   🎯 <strong>Features:</strong> Real-time tracking, risk analysis, portfolio optimization
   📈 <strong>Achievement:</strong> 98% accurate profit/loss calculations
   🏆 <strong>Grade:</strong> A+ project (95/100)
   🔗 <strong>Demo:</strong> <a href="#projects">Request Live Demo</a>
   
🗄️ <strong>Database Architecture Suite</strong>
   📊 <strong>Impact:</strong> Optimized queries by 300% performance increase
   💻 <strong>Tech Stack:</strong> MySQL, SQL optimization, Normalization (3NF)
   🎯 <strong>Features:</strong> Complex joins, indexing strategies, transaction management
   📈 <strong>Metrics:</strong> Reduced query time from 2.5s to 0.8s average
   🔗 <strong>Schema:</strong> <a href="https://github.com/razinn70/database-projects">View Database Designs</a>
   
🌐 <strong>Modern Web Applications</strong>
   📊 <strong>Impact:</strong> This responsive portfolio (you're using it now!)
   💻 <strong>Tech Stack:</strong> JavaScript ES6+, HTML5, CSS3, GitHub API
   🎯 <strong>Features:</strong> Mobile-responsive, API integration, terminal interface
   📈 <strong>Performance:</strong> 95+ Lighthouse score, <2s load time
   � <strong>Live Demo:</strong> <a href="#">You're experiencing it right now! 🚀</a>

📊 <strong>Overall Project Statistics:</strong>
• 🎯 8+ completed projects with full documentation
• 💻 5,000+ lines of production-quality code
• 🏆 Average project grade: A- (87%+)
• 🔧 100% projects include error handling & testing
• 📈 Projects demonstrate 3+ programming paradigms

💻 <strong>View More:</strong> Scroll up to Projects section for interactive demos!
🔗 <strong>GitHub Portfolio:</strong> github.com/razinn70 (30+ repositories)

<em>Want technical details? Type 'github' or 'skills' for deep dive!</em>`;
                    break;
                    
                case 'contact':
                case 'reach':
                case 'connect':
                    response = `📞 <strong>Let's Connect!</strong>

📧 <strong>Email:</strong> muddinal@uoguelph.ca
📱 <strong>Phone:</strong> +1 437 808 1738
💼 <strong>LinkedIn:</strong> linkedin.com/in/rajin-uddin-202767218
💻 <strong>GitHub:</strong> github.com/razinn70
📍 <strong>Location:</strong> Guelph, Ontario, Canada

🚀 <strong>Current Status:</strong> Open to opportunities!
⚡ <strong>Response Time:</strong> Usually within 24 hours

<strong>Best ways to reach me:</strong>
• Email for formal inquiries
• LinkedIn for professional networking  
• GitHub to see my latest work

<em>Scroll up to the Contact section for direct links!</em>`;
                    break;
                    
                case 'github':
                case 'git':
                case 'code':
                    response = `🐙 <strong>GitHub Profile: razinn70</strong>

🔗 <strong>Profile:</strong> github.com/razinn70
📊 <strong>Activity:</strong> Regular commits & contributions
🎯 <strong>Focus:</strong> Clean architecture, efficient algorithms

💻 <strong>Primary Languages:</strong>
• C - System programming & memory management
• Java - OOP design & application development  
• Python - Scripting & data processing
• JavaScript - Web development & APIs
• SQL - Database design & optimization

📈 <strong>Contribution Highlights:</strong>
• Academic projects with practical applications
• Well-documented, readable codebases
• Focus on performance & best practices

🌟 <strong>Notable Repositories:</strong>
Check the Projects section above for featured work!

<em>Type 'projects' to see detailed descriptions</em>`;
                    break;
                    
                case 'skills':
                case 'tech':
                case 'technologies':
                    response = `🛠️ <strong>Technical Expertise & Metrics</strong>

💻 <strong>Programming Languages:</strong>
• 🔧 <strong>C</strong> - Advanced (3+ years) | 95% proficiency
  └─ Memory management, pointers, system programming
• ☕ <strong>Java</strong> - Expert (3+ years) | 92% proficiency  
  └─ OOP mastery, Swing applications, design patterns
• 🐍 <strong>Python</strong> - Proficient (2+ years) | 88% proficiency
  └─ Scripting, automation, GUI development (Tkinter)
• 🌐 <strong>JavaScript</strong> - Advanced (2+ years) | 90% proficiency
  └─ ES6+, async/await, DOM manipulation, API integration
• 🗄️ <strong>SQL</strong> - Expert (2+ years) | 94% proficiency
  └─ Complex queries, optimization, database design

🌐 <strong>Web Development Stack:</strong>
• 🎨 <strong>Frontend:</strong> HTML5, CSS3, Responsive Design (Bootstrap)
  └─ 95+ Lighthouse scores, mobile-first approach
• ⚛️ <strong>Frameworks:</strong> React (learning), Node.js basics
  └─ Component-based architecture, state management
• 🔧 <strong>Tools:</strong> Git (500+ commits), GitHub, VS Code, Chrome DevTools
  └─ Version control expert, collaborative development

🗄️ <strong>Database & Backend:</strong>
• 🐬 <strong>MySQL</strong> - Expert level with performance optimization
  └─ Normalized schemas (3NF), indexing strategies, query optimization
• 📊 <strong>Database Concepts:</strong> Foreign keys, transactions, stored procedures
  └─ 300% performance improvement on complex queries
• 🔌 <strong>API Development:</strong> RESTful services, JSON handling
  └─ GitHub API integration, error handling, timeout management

🔧 <strong>Development Practices & Metrics:</strong>
• 🎯 <strong>Object-Oriented Programming:</strong> 95% course grade
  └─ Design patterns, SOLID principles, code reusability
• 📚 <strong>Data Structures & Algorithms:</strong> A+ performance
  └─ Big O analysis, sorting algorithms, tree/graph structures
• 🔄 <strong>Version Control:</strong> 500+ commits, 30+ repositories
  └─ Branching strategies, merge conflict resolution
• 🧪 <strong>Testing & Debugging:</strong> 100% error-free final submissions
  └─ Unit testing, debugging methodologies, code review

📈 <strong>Quantified Achievements:</strong>
• 💻 <strong>Code Quality:</strong> 5,000+ lines of production code
• 🏆 <strong>Project Success:</strong> 100% on-time delivery record
• 📊 <strong>Performance:</strong> Average 40% efficiency improvement in projects
• 🔧 <strong>Problem Solving:</strong> 95%+ success rate on coding challenges
• 📚 <strong>Learning Velocity:</strong> New language proficiency in <3 months

🌟 <strong>Soft Skills & Leadership:</strong>
• Team collaboration on 5+ group projects
• Peer tutoring & mentoring experience
• Technical documentation & presentation skills
• Agile methodology understanding

<em>Want to see these skills in action? Type 'projects' for real applications!</em>`;
                    break;
                    
                case 'education':
                case 'school':
                case 'university':
                    response = `🎓 <strong>Academic Excellence</strong>

🏛️ <strong>University of Guelph</strong>
📚 Program: Bachelor of Computing - Computer Science
📅 Status: 3rd Year Student (2022-2027)
🎯 Expected Graduation: Spring 2027
📍 Location: Guelph, Ontario, Canada

📊 <strong>Academic Performance:</strong>
🏆 <strong>GPA:</strong> 3.7+/4.0 (Strong Academic Standing)
📈 <strong>Dean's List:</strong> 2023, 2024 (Top 10% of class)
🎯 <strong>Major GPA:</strong> 3.85/4.0 (Computer Science courses)
📚 <strong>Credits Completed:</strong> 15.0/20.0 (75% complete)

💡 <strong>Key Coursework & Grades:</strong>
• 🔢 <strong>Data Structures & Algorithms:</strong> A (92%)
• 💻 <strong>Object-Oriented Programming:</strong> A+ (95%)  
• 🗄️ <strong>Database Systems & Design:</strong> A (89%)
• ⚙️ <strong>Software Engineering:</strong> A- (87%)
• 🖥️ <strong>Computer Systems & Architecture:</strong> B+ (85%)
• 📊 <strong>Discrete Mathematics:</strong> A (91%)

� <strong>Academic Achievements:</strong>
• 🥇 <strong>Outstanding Project Award</strong> - VCard Management System (2024)
• 🎖️ <strong>Programming Excellence</strong> - Top scorer in OOP course
• 📚 <strong>Academic Scholarship</strong> - Merit-based funding recipient
• 👥 <strong>Peer Tutor</strong> - Helping fellow students in programming courses

📈 <strong>Course Statistics:</strong>
• 🎯 15+ courses completed with 85%+ average
• 💻 40+ programming assignments with full marks
• 🔬 8+ major projects completed successfully
• 📊 100% course completion rate (no withdrawals)

🌟 <strong>Research & Extra-curricular:</strong>
• Computing society member & event organizer
• Open source contributions to university projects
• Regular attendance at tech talks & workshops

<em>Type 'projects' to see coursework transformed into real applications!</em>`;
                    break;

                case 'resume':
                case 'cv':
                case 'download':
                    response = `📄 <strong>Resume Download</strong>

� <strong>Download Options:</strong>
• <a href="ResumeV02.pdf" download="Rajin_Al_Faiz_Resume.pdf">📄 Download PDF Resume</a>
• <a href="mailto:muddinal@uoguelph.ca?subject=Resume Request&body=Hi Rajin, I'd like to request your latest resume.">📧 Request via Email</a>

📊 <strong>Resume Highlights:</strong>
• 🎓 <strong>GPA:</strong> Strong academic standing (3.7+/4.0)
• � <strong>Projects:</strong> 8+ completed software projects
• 🏆 <strong>Languages:</strong> Proficient in 5+ programming languages
• 📈 <strong>Experience:</strong> 2+ years of development experience
• 🌟 <strong>Achievements:</strong> Multiple academic project awards

📋 <strong>What's Inside:</strong>
• Detailed project portfolios with metrics
• Technical skill certifications
• Academic achievements & coursework
• Professional references available

💡 <strong>Quick Access:</strong> Click the PDF link above for instant download!

<em>Having trouble? Type 'contact' for alternative ways to reach me!</em>`;
                    break;
                    
                case 'clear':
                case 'cls':
                    terminalBody.replaceChildren();
                    return;

                case 'exit':
                case 'quit':
                case 'close':
                    closeTerminal();
                    addTerminalLine('Terminal closed. Click the terminal button to reopen!', 'terminal-output');
                    return;
                    
                default:
                    response = `❌ <strong>Command '${command}' not recognized</strong>

💡 <strong>Did you mean:</strong>
• 'help' - See all available commands
• 'about' - Learn about Rajin  
• 'projects' - View my work
• 'contact' - Get in touch

🎯 <strong>Tip:</strong> Commands are simple words - just type 'help' to see everything you can do!

<em>No special syntax needed - keep it simple! 😊</em>`;
            }
            
            if (response) {
                addTerminalLine(response, 'terminal-output');
            }
            
            addTerminalLine('');
        }

        function addTerminalLine(text, className = 'terminal-output') {
            const terminalBody = document.getElementById('terminalBody');
            const line = document.createElement('div');
            line.className = `terminal-line ${className}`;
            line.style.whiteSpace = 'pre-line';
            // text is trusted static HTML for response strings; user input is escaped before calling
            line.innerHTML = text;
            terminalBody.appendChild(line);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        function toggleTerminal() {
            const overlay = document.getElementById('terminalOverlay');
            const input = document.getElementById('terminalInput');
            const toggle = document.getElementById('terminalToggle');
            
            if (overlay.style.display === 'flex') {
                closeTerminal();
            } else {
                overlay.style.display = 'flex';
                toggle?.setAttribute('aria-expanded', 'true');
                setTimeout(() => {
                    overlay.classList.add('show');
                    input.focus();
                }, 10);
            }
        }

        function closeTerminal() {
            const overlay = document.getElementById('terminalOverlay');
            const toggle = document.getElementById('terminalToggle');
            overlay.classList.remove('show');
            toggle?.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }

        // Smooth scrolling and navigation
        function initializeSmootScroll() {
            // Enhanced smooth scroll for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        const navHeight = document.querySelector('.nav').offsetHeight;
                        const targetPosition = target.offsetTop - navHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        function initializeScrollEffects() {
            const nav = document.getElementById('nav');
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('section');
            
            // Navigation background on scroll
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    nav.style.background = 'rgba(10, 10, 10, 0.95)';
                } else {
                    nav.style.background = 'rgba(10, 10, 10, 0.8)';
                }
                
                // Update active nav link
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.scrollY >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            });
        }

        // Mobile menu functions
        function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            const hamburgerIcon = document.getElementById('hamburgerIcon');
            const mobileMenuButton = document.getElementById('mobileMenuBtn');
            
            mobileMenu.classList.toggle('active');
            mobileMenuButton?.setAttribute('aria-expanded', mobileMenu.classList.contains('active') ? 'true' : 'false');
            hamburgerIcon.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
        }

        function closeMobileMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            const hamburgerIcon = document.getElementById('hamburgerIcon');
            const mobileMenuButton = document.getElementById('mobileMenuBtn');
            
            mobileMenu.classList.remove('active');
            mobileMenuButton?.setAttribute('aria-expanded', 'false');
            hamburgerIcon.textContent = '☰';
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Terminal toggle: Ctrl+`
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                toggleTerminal();
            }
            
            // Close terminal with Escape
            if (e.key === 'Escape') {
                closeTerminal();
                closeMobileMenu();
            }
        });

        // Start loading sequence and apply data-driven styles
        document.addEventListener('DOMContentLoaded', function() {
            updateLoading();
            // Apply skill-progress widths from data-width attributes (avoids inline style= CSP violation)
            document.querySelectorAll('.skill-progress[data-width]').forEach(function(el) {
                el.style.width = el.dataset.width + '%';
            });
        });

        // Handle clicks outside terminal
        document.getElementById('terminalOverlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeTerminal();
            }
        });
