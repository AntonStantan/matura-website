// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Copy Code Button
document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', function() {
        const code = this.getAttribute('data-code') || this.closest('.code-block').querySelector('code').textContent;
        
        // Create a temporary textarea to copy the text
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            this.textContent = 'Failed';
        }
        
        document.body.removeChild(textarea);
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.about-card, .architecture-card, .doc-card, .demo-card, .demo-info');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Parallax Effect for Hero Background
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Dynamic Year in Footer
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.textContent = footerYear.textContent.replace('2025', currentYear);
}

// Add active state to navigation based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
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

// Lazy Loading for Images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add hover effect to cards
document.querySelectorAll('.about-card, .architecture-card, .doc-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Neural Network Calculator
// API URL - Using deployed Heroku backend
const API_URL = 'https://npc-calculator-api-16503410aa18.herokuapp.com/api';

document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const expressionInput = document.getElementById('expression-input');
    const resultDiv = document.getElementById('calculator-result');
    const errorDiv = document.getElementById('calculator-error');
    const loadingDiv = document.getElementById('calculator-loading');
    
    if (calculateBtn && expressionInput) {
        // Handle Enter key press
        expressionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateBtn.click();
            }
        });
        
        calculateBtn.addEventListener('click', async function() {
            const expression = expressionInput.value.trim();
            
            if (!expression) {
                showError('Please enter an expression');
                return;
            }
            
            // Hide previous results/errors
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            loadingDiv.style.display = 'flex';
            calculateBtn.disabled = true;
            
            try {
                const response = await fetch(`${API_URL}/calculate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ expression: expression })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showResult(data);
                } else {
                    showError(data.error || 'Failed to calculate');
                }
            } catch (error) {
                showError('Unable to connect to the server. API server is propably offline.');
                console.error('Error:', error);
            } finally {
                loadingDiv.style.display = 'none';
                calculateBtn.disabled = false;
            }
        });
    }
    
    function showResult(data) {
        document.getElementById('nn-result').textContent = data.result;
        document.getElementById('actual-result').textContent = data.actual !== null ? data.actual : 'N/A';
        document.getElementById('difference').textContent = data.difference !== null ? data.difference.toFixed(4) : 'N/A';
        resultDiv.style.display = 'block';
        errorDiv.style.display = 'none';
    }
    
    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        resultDiv.style.display = 'none';
    }
});

// Console Easter Egg
console.log('%c🧠 Neural Predictive Calculator', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cInterested in the code? Check out the repository:', 'font-size: 14px; color: #94a3b8;');
console.log('%chttps://github.com/AntonStantan/matura', 'font-size: 14px; color: #6366f1;');
