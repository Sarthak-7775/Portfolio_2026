// Portfolio JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initTabNavigation();
    initContactForm();
    initSmoothAnimations();
    initMobileMenu();
});

// Tab Navigation Functionality
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                // Show success message
                showFormMessage('success', 'Thank you for your message! I\'ll get back to you soon.');
                
                // Reset form after a short delay
                setTimeout(() => {
                    this.reset();
                }, 1000);
                
                // In a real application, you would send the form data to a server
                console.log('Form submitted:', formObject);
            }
        });

        // Add real-time validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateSingleField(this);
            });
            
            input.addEventListener('input', function() {
                // Remove error styling on input
                this.classList.remove('error');
                const errorMsg = this.parentNode.querySelector('.field-error');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
        });
    }
}

// Single field validation
function validateSingleField(field) {
    const value = field.value.trim();
    let error = '';
    
    switch(field.name) {
        case 'name':
            if (!value || value.length < 2) {
                error = 'Name must be at least 2 characters long';
            }
            break;
        case 'email':
            if (!value || !isValidEmail(value)) {
                error = 'Please enter a valid email address';
            }
            break;
        case 'subject':
            if (!value || value.length < 3) {
                error = 'Subject must be at least 3 characters long';
            }
            break;
        case 'message':
            if (!value || value.length < 10) {
                error = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Show error if exists
    if (error) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = error;
        errorElement.style.cssText = `
            color: var(--color-error);
            font-size: 12px;
            margin-top: 4px;
        `;
        field.parentNode.appendChild(errorElement);
        return false;
    } else {
        field.classList.remove('error');
        return true;
    }
}

// Form Validation
function validateForm(data) {
    const errors = [];
    
    // Validate required fields
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject.trim().length < 3) {
        errors.push('Subject must be at least 3 characters long');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    // Show errors if any
    if (errors.length > 0) {
        showFormMessage('error', errors.join('<br>'));
        return false;
    }
    
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form messages
function showFormMessage(type, message) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type === 'success' ? 'status--success' : 'status--error'}`;
    messageElement.innerHTML = message;
    
    // Add styling
    messageElement.style.cssText = `
        padding: 12px 16px;
        border-radius: 6px;
        margin-bottom: 16px;
        font-size: 14px;
        line-height: 1.5;
        animation: slideIn 0.3s ease-out;
        ${type === 'success' 
            ? 'background-color: rgba(33, 128, 141, 0.15); color: var(--color-success); border: 1px solid rgba(33, 128, 141, 0.25);'
            : 'background-color: rgba(192, 21, 47, 0.15); color: var(--color-error); border: 1px solid rgba(192, 21, 47, 0.25);'
        }
    `;
    
    // Add slide-in animation
    const slideInKeyframes = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    if (!document.getElementById('slideInStyles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'slideInStyles';
        styleElement.textContent = slideInKeyframes;
        document.head.appendChild(styleElement);
    }
    
    // Insert message at the top of the form
    const contactForm = document.getElementById('contactForm');
    contactForm.insertBefore(messageElement, contactForm.firstChild);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.opacity = '0';
                setTimeout(() => messageElement.remove(), 300);
            }
        }, 5000);
    }
}

// Smooth animations and interactions
function initSmoothAnimations() {
    // Add scroll reveal animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
        '.service-card, .project-card, .timeline-item, .contact-detail'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add hover effects for interactive elements
    addHoverEffects();
}

// Add enhanced hover effects
function addHoverEffects() {
    // Skill tags interactive effects
    const skillTags = document.querySelectorAll('.skill-tag, .project-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Social links enhanced effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
    
    // Contact items pulse effect
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Service cards enhanced hover
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Project cards enhanced hover
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    // Create mobile menu toggle button if screen is small
    if (window.innerWidth <= 768) {
        createMobileMenuToggle();
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            createMobileMenuToggle();
        } else {
            removeMobileMenuToggle();
        }
    });
}

// Create mobile menu toggle
function createMobileMenuToggle() {
    // Check if toggle already exists
    if (document.querySelector('.mobile-menu-toggle')) {
        return;
    }
    
    const toggleButton = document.createElement('button');
    toggleButton.className = 'mobile-menu-toggle';
    toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
    toggleButton.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
        border: none;
        border-radius: 6px;
        padding: 12px;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
    `;
    
    toggleButton.addEventListener('click', function(e) {
        e.stopPropagation();
        const sidebar = document.querySelector('.sidebar');
        const isOpen = sidebar.classList.contains('mobile-open');
        
        if (isOpen) {
            sidebar.classList.remove('mobile-open');
            this.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            sidebar.classList.add('mobile-open');
            this.innerHTML = '<i class="fas fa-times"></i>';
        }
    });
    
    document.body.appendChild(toggleButton);
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.sidebar');
        const toggleButton = document.querySelector('.mobile-menu-toggle');
        
        if (sidebar && toggleButton && !sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
            toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Remove mobile menu toggle
function removeMobileMenuToggle() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    if (toggleButton) {
        toggleButton.remove();
    }
    
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.remove('mobile-open');
    }
}

// Typing animation for the profile title
function initTypingAnimation() {
    const titleElement = document.querySelector('.profile-title');
    if (!titleElement) return;
    
    const titles = [
        'B.Tech (MAC) Student',
        'AI/ML Enthusiast',
        'Full-Stack Developer',
        'Problem Solver'
    ];
    
    let currentTitleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentTitle = titles[currentTitleIndex];
        
        if (isDeleting) {
            titleElement.textContent = currentTitle.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            titleElement.textContent = currentTitle.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        let typeSpeed = 100;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && currentCharIndex === currentTitle.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
            typeSpeed = 500; // Pause before typing next title
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing animation after a short delay
    setTimeout(typeEffect, 1000);
}

// Initialize typing animation after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initTypingAnimation, 2000);
});

// Add loading animation
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-spinner">
            <div class="spinner"></div>
            <p>Loading Portfolio...</p>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--color-background);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    const spinnerStyles = `
        .loader-spinner {
            text-align: center;
            color: var(--color-text);
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--color-border);
            border-top: 3px solid var(--color-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = spinnerStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(loader);
    
    // Hide loader after content is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                }
                styleSheet.remove();
            }, 500);
        }, 1000);
    });
}

// Show loading animation
showLoadingAnimation();

// Add console message for developers
console.log(`
🚀 Sarthak Kandpal's Portfolio
============================
Built with modern web technologies
Contact: sarthakkandpal2005@gmail.com
`);

// Performance monitoring
function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
                }
            }
        });
        observer.observe({ entryTypes: ['navigation'] });
    }
}

// Initialize performance monitoring
initPerformanceMonitoring();