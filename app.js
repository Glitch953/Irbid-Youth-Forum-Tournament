// ===== DOM ELEMENTS =====
const html = document.documentElement;
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const langToggle = document.getElementById('langToggle');
const langText = document.getElementById('langText');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const scrollTopBtn = document.getElementById('scrollTop');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

// ===== STATE =====
let currentLang = 'ar';
let currentTheme = localStorage.getItem('theme') || 'dark';
let currentLightboxIndex = 0;
let albumItems = [];

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    initScrollReveal();
    initNavScroll();
    initSmoothScroll();
    collectAlbumItems();
});

// ===== THEME TOGGLE =====
function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
}

themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// ===== LANGUAGE TOGGLE =====
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';

    // Update direction
    if (currentLang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        langText.textContent = 'EN';
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        langText.textContent = 'ع';
    }

    // Update all translatable elements
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
            el.textContent = text;
        }
    });

    // Update document title
    if (currentLang === 'ar') {
        document.title = 'بطولة ملتقى شباب إربد الرمضانية';
    } else {
        document.title = 'Irbid Youth Forum Ramadan Tournament';
    }
});

// ===== MOBILE MENU =====
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('open')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = 'fas fa-bars';
    });
});

// ===== NAVBAR SCROLL =====
function initNavScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll top button
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Update active nav link
        updateActiveNavLink();
    });
}

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== ACTIVE NAV LINK =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.getAttribute('data-aos-delay')) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ===== LIGHTBOX =====
function collectAlbumItems() {
    albumItems = Array.from(document.querySelectorAll('.album-item'));
}

function openLightbox(element) {
    const img = element.querySelector('img');
    const caption = element.querySelector('.album-overlay span');

    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';

    currentLightboxIndex = albumItems.indexOf(element);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;

    if (currentLightboxIndex < 0) {
        currentLightboxIndex = albumItems.length - 1;
    } else if (currentLightboxIndex >= albumItems.length) {
        currentLightboxIndex = 0;
    }

    const item = albumItems[currentLightboxIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('.album-overlay span');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
}

// Close lightbox on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
    }
});

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        navigateLightbox(html.dir === 'rtl' ? 1 : -1);
    } else if (e.key === 'ArrowRight') {
        navigateLightbox(html.dir === 'rtl' ? -1 : 1);
    }
});

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    if (hero) {
        const scroll = window.scrollY;
        if (scroll < window.innerHeight) {
            hero.style.transform = `translateY(${scroll * 0.3}px)`;
            hero.style.opacity = 1 - (scroll / window.innerHeight) * 0.6;
        }
    }
});

// ===== MATCH TABS =====
function initMatchTabs() {
    const tabs = document.querySelectorAll('.match-tab');
    const dayMap = {
        '1': 'matchDay1',
        '2': 'matchDay2',
        '3': 'matchDay3',
        'knockout': 'matchDayKnockout'
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Hide all match days
            document.querySelectorAll('.match-day').forEach(day => {
                day.classList.remove('active');
            });

            // Show selected day
            const dayKey = tab.getAttribute('data-day');
            const dayEl = document.getElementById(dayMap[dayKey]);
            if (dayEl) {
                dayEl.classList.add('active');
            }
        });
    });
}

// Initialize match tabs after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initMatchTabs();
});

