// ==========================================
// ULTRA ENHANCED PORTFOLIO - SCRIPT.JS
// ==========================================

// ==========================================
// 1. CURSOR TRAIL EFFECT
// ==========================================
class CursorTrail {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.createParticle(e.clientX, e.clientY);
        });
        this.animate();
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        document.body.appendChild(particle);

        this.particles.push({
            element: particle,
            life: 1
        });

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    animate() {
        this.particles = this.particles.filter(p => {
            p.life -= 0.02;
            if (p.life <= 0) {
                p.element.remove();
                return false;
            }
            p.element.style.opacity = p.life;
            return true;
        });
        requestAnimationFrame(() => this.animate());
    }
}
const cursorTrail = new CursorTrail();

// ==========================================
// 2. TYPING ANIMATION FOR HERO TITLE
// ==========================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

window.addEventListener('load', () => {
    const titleLines = document.querySelectorAll('.title-line');
    if (titleLines.length >= 2) {
        setTimeout(() => {
            typeWriter(titleLines[0], 'NIKHIL', 150);
        }, 500);
        setTimeout(() => {
            typeWriter(titleLines[1], 'GARAD', 150);
        }, 1500);
    }
});

// ==========================================
// 3. SCROLL PROGRESS BAR
// ==========================================
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
}
window.addEventListener('scroll', updateScrollProgress);

// ==========================================
// 4. CIRCULAR SKILLS ANIMATION
// ==========================================
function animateCircularProgress() {
    const circles = document.querySelectorAll('.progress-ring-circle');

    circles.forEach(circle => {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const percent = circle.getAttribute('data-progress');
        const offset = circumference - (percent / 100) * circumference;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        circle.style.strokeDashoffset = offset;
                    }, 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(circle);
    });
}
document.addEventListener('DOMContentLoaded', animateCircularProgress);

// ==========================================
// 5. CIRCULAR SCROLL PROGRESS BUTTON & ACTIVE NAV
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const progressPath = document.querySelector('.scroll-top-progress path');
    if (!progressPath) return;

    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = 'none';
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = 'stroke-dashoffset 10ms linear';

    const scrollUpdate = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop * 100) / docHeight;
        const drawLength = pathLength - (scrollPercentage * pathLength) / 100;

        progressPath.style.strokeDashoffset = Math.max(0, drawLength);

        const scrollBtn = document.querySelector('.scroll-top-progress');
        if (scrollTop > 50) {
            scrollBtn.classList.add('active-progress');
        } else {
            scrollBtn.classList.remove('active-progress');
        }

        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', scrollUpdate);
    const progressBtn = document.querySelector('.scroll-top-progress');
    if (progressBtn) {
        progressBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    scrollUpdate();
});

// ==========================================
// 6. 3D TILT EFFECT
// ==========================================
class VanillaTilt {
    constructor(element) {
        this.element = element;
        this.container = element.closest('.project-card') || element;
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.timeout = null;

        this.max = 10;
        this.perspective = 1000;
        this.scale = 1.05;
        this.speed = 400;

        this.init();
    }

    init() {
        this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    onMouseEnter() {
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.element.style.transition = `transform ${this.speed}ms cubic-bezier(.03,.98,.52,.99)`;

        if (!this.element.querySelector('.js-tilt-glare')) {
            const glare = document.createElement('div');
            glare.classList.add('js-tilt-glare');
            glare.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: inherit; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%); opacity: 0; pointer-events: none; z-index: 100;';
            this.element.appendChild(glare);
        }
    }

    onMouseMove(event) {
        this.element.style.transition = 'none';
        const rect = this.element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const xPercentage = x / this.width;
        const yPercentage = y / this.height;
        const rotateX = (this.max * -1) + (yPercentage * this.max * 2);
        const rotateY = this.max - (xPercentage * this.max * 2);

        this.element.style.transform = `perspective(${this.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.scale}, ${this.scale}, ${this.scale})`;

        const glare = this.element.querySelector('.js-tilt-glare');
        if (glare) {
            glare.style.opacity = '1';
            glare.style.transform = `translateX(${xPercentage * 10}px) translateY(${yPercentage * 10}px)`;
        }
    }

    onMouseLeave() {
        this.element.style.transition = `transform ${this.speed}ms cubic-bezier(.03,.98,.52,.99)`;
        this.element.style.transform = `perspective(${this.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        const glare = this.element.querySelector('.js-tilt-glare');
        if (glare) glare.style.opacity = '0';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const tiltElements = document.querySelectorAll('.cert-card, .project-card, .skill-category-circular');
    tiltElements.forEach(element => new VanillaTilt(element));
});

// ==========================================
// 7. SCROLL REVEAL ANIMATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.section-title, .about-content-grid, .project-card, .cert-card, .skill-category-circular, .contact-container, .hero-content');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        if (el.classList.contains('project-card') || el.classList.contains('cert-card')) {
            el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        }
        revealObserver.observe(el);
    });
});

// ==========================================
// 8. LEVEL UP SYSTEM (GAMIFICATION)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const xpBar = document.querySelector('.xp-bar-fill');
    const levelDisplay = document.getElementById('currentLevel');
    const levelToast = document.getElementById('levelUpToast');
    const levelMessage = document.getElementById('levelMessage');
    const sections = document.querySelectorAll('section');

    let highestLevelReached = 1;
    let toastTimeout;

    function showLevelToast(level, message) {
        if (!levelToast) return;
        levelToast.querySelector('h3').textContent = `LEVEL ${level} UNLOCKED!`;
        levelMessage.textContent = message;
        levelToast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            levelToast.classList.remove('show');
        }, 3000);
    }

    function updateGameStats() {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (xpBar) xpBar.style.width = `${scrollPercentage}%`;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
                const currentLevel = index + 1;
                if (currentLevel > highestLevelReached) {
                    highestLevelReached = currentLevel;
                    if (levelDisplay) levelDisplay.textContent = highestLevelReached;

                    let msg = "";
                    const id = section.id;
                    if (id === 'about') msg = "Bio Data Analysis Complete!";
                    else if (id === 'skills') msg = "New Abilities Acquired!";
                    else if (id === 'projects') msg = "Project Archives Accessed!";
                    else if (id === 'certifications') msg = "Credentials Verified!";
                    else if (id === 'contact') msg = "BOSS STAGE: SEND MESSAGE!";
                    else msg = "Exploring New Territory...";

                    showLevelToast(highestLevelReached, msg);
                }
            }
        });
    }
    window.addEventListener('scroll', updateGameStats);
});

// ==========================================
// 9. CUSTOM TECH CURSOR (CYBER-LIME)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if not a touch device
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-dot-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    // Fast follow for dot
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant update for small dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        // Slightly delayed update for outline uses requestAnimationFrame
    });

    // Smooth animation loop for outline
    function animateCursor() {
        // Linear interpolation for smooth lag
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Effects
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .cert-card, .skill-category-circular');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // Click Effects
    document.addEventListener('mousedown', () => {
        document.body.classList.add('clicking');
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        document.body.classList.remove('clicking');
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});