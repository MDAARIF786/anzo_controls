
/**
 * ANZO CONTROLS - ENHANCED JAVASCRIPT
 * Modern, Interactive Features for Professional Website
 * =====================================================
 */

'use strict';

// Global variables
let currentTestimonialSlide = 0;
let testimonialSlideInterval;
let isScrolling = false;

/**
 * DOM Content Loaded Event Listener
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLoader();
    initializeNavigation();
    initializeThemeToggle();
    initializeScrollAnimations();
    initializeTestimonialsCarousel();
    initializeProductFilters();
    initializeContactForm();
    initializeCounters();
    initializeSmoothScrolling();
    initializeHeaderScroll();

    console.log('🚀 Anzo Controls website initialized successfully!');
});

/**
 * Loading Screen Management
 */
function initializeLoader() {
    const loader = document.getElementById('loader');

    // Hide loader after page load
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');

            // Remove loader from DOM after animation
            setTimeout(function() {
                if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }, 1000);
    });
}

/**
 * Navigation Menu Management
 */
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMobileMenu();
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });

    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

function toggleMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

function updateActiveNavLink() {
    if (isScrolling) return;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-scroll]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-scroll') === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/**
 * Theme Toggle Functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    if (!themeToggle || !themeIcon) return;

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('anzo-theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('anzo-theme', newTheme);
        updateThemeIcon(newTheme);

        // Add animation class
        themeToggle.style.transform = 'translateY(-50%) scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/**
 * Scroll Animations
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right');

    if (!animatedElements.length) return;

    // Create intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Testimonials Carousel
 */
function initializeTestimonialsCarousel() {
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');

    if (!track || !dots.length) return;

    const totalSlides = dots.length;

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToTestimonialSlide(index);
        });
    });

    // Arrow navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goToTestimonialSlide(currentTestimonialSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goToTestimonialSlide(currentTestimonialSlide + 1);
        });
    }

    // Auto-play carousel
    startTestimonialAutoplay();

    // Pause on hover
    const carousel = document.getElementById('testimonialsCarousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopTestimonialAutoplay);
        carousel.addEventListener('mouseleave', startTestimonialAutoplay);
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleTestimonialSwipe();
    });

    function handleTestimonialSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                goToTestimonialSlide(currentTestimonialSlide + 1);
            } else {
                // Swipe right - previous slide
                goToTestimonialSlide(currentTestimonialSlide - 1);
            }
        }
    }
}

function goToTestimonialSlide(slideIndex) {
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.testimonial-dot');

    if (!track || !dots.length) return;

    const totalSlides = dots.length;

    // Handle wrap around
    if (slideIndex >= totalSlides) slideIndex = 0;
    if (slideIndex < 0) slideIndex = totalSlides - 1;

    currentTestimonialSlide = slideIndex;

    // Update track position
    const translateX = -slideIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;

    // Update active dot
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
}

function startTestimonialAutoplay() {
    stopTestimonialAutoplay();
    testimonialSlideInterval = setInterval(function() {
        goToTestimonialSlide(currentTestimonialSlide + 1);
    }, 5000);
}

function stopTestimonialAutoplay() {
    if (testimonialSlideInterval) {
        clearInterval(testimonialSlideInterval);
    }
}

/**
 * Product Filters
 */
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (!filterButtons.length || !productCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter products
            filterProducts(filter);
        });
    });
}

function filterProducts(filter) {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            // Add entrance animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

/**
 * Contact Form Management
 */
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const formFields = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        company: document.getElementById('company'),
        department: document.getElementById('department'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message'),
        privacyConsent: document.getElementById('privacyConsent')
    };

    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    // Real-time validation
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName, field));
            field.addEventListener('input', () => clearFieldError(fieldName, field));
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
}

function validateField(fieldName, field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}Error`);
    let isValid = true;
    let errorMessage = '';

    // Validation rules
    switch (fieldName) {
        case 'fullName':
            if (!value) {
                errorMessage = 'Please enter your full name';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Please enter your email address';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'phone':
            if (value && value.length > 0) {
                const phoneRegex = /^[\+]?[1-9]?[0-9]{7,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
            }
            break;

        case 'department':
            if (!value) {
                errorMessage = 'Please select a department';
                isValid = false;
            }
            break;

        case 'subject':
            if (!value) {
                errorMessage = 'Please enter a subject';
                isValid = false;
            }
            break;

        case 'message':
            if (!value) {
                errorMessage = 'Please enter your message';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;

        case 'privacyConsent':
            if (!field.checked) {
                errorMessage = 'Please accept the privacy policy';
                isValid = false;
            }
            break;
    }

    // Update field appearance and error message
    if (errorElement) {
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('success');
            errorElement.classList.remove('show');
        } else {
            field.classList.remove('success');
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    }

    return isValid;
}

function clearFieldError(fieldName, field) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement && errorElement.classList.contains('show')) {
        field.classList.remove('error');
        errorElement.classList.remove('show');
    }
}

function validateForm() {
    const formFields = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        department: document.getElementById('department'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message'),
        privacyConsent: document.getElementById('privacyConsent')
    };

    let isFormValid = true;

    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        if (field) {
            const isFieldValid = validateField(fieldName, field);
            if (!isFieldValid) {
                isFormValid = false;
            }
        }
    });

    return isFormValid;
}

function handleFormSubmission() {
    if (!validateForm()) {
        // Scroll to first error
        const firstError = document.querySelector('.form-control.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const originalButtonText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        formSuccess.classList.add('show');

        // Reset form
        document.getElementById('contactForm').reset();

        // Remove validation classes
        document.querySelectorAll('.form-control').forEach(field => {
            field.classList.remove('error', 'success');
        });

        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;

        // Hide success message after 5 seconds
        setTimeout(() => {
            formSuccess.classList.remove('show');
        }, 5000);

        // Scroll to top of form
        document.getElementById('contact').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });

    }, 2000);
}

/**
 * Counter Animation
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');

    if (!counters.length) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    counter.classList.add('animated');

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
    }, 16);
}

/**
 * Smooth Scrolling
 */
function initializeSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                isScrolling = true;

                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Reset scrolling flag after animation
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        });
    });
}

/**
 * Header Scroll Effect
 */
function initializeHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add scrolled class for styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 500) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
}

/**
 * Utility Functions
 */

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Enhanced Features
 */

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }

    // Arrow keys for testimonial navigation
    if (e.key === 'ArrowLeft') {
        const carousel = document.getElementById('testimonialsCarousel');
        if (carousel && isInViewport(carousel)) {
            goToTestimonialSlide(currentTestimonialSlide - 1);
        }
    } else if (e.key === 'ArrowRight') {
        const carousel = document.getElementById('testimonialsCarousel');
        if (carousel && isInViewport(carousel)) {
            goToTestimonialSlide(currentTestimonialSlide + 1);
        }
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    // Check page performance
    if ('performance' in window) {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
});

// Service Worker registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('✅ ServiceWorker registered successfully');
            })
            .catch(function(error) {
                console.log('❌ ServiceWorker registration failed');
            });
    });
}

console.log('🎉 Anzo Controls JavaScript loaded successfully!');
