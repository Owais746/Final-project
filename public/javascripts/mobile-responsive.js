// Mobile Responsive JavaScript Functions
// Handles touch interactions and mobile-specific features

document.addEventListener('DOMContentLoaded', function() {
    // Detect if user is on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile || isTouch) {
        document.body.classList.add('mobile-device');
        initMobileFeatures();
    }
    
    // Initialize responsive features
    initResponsiveNavigation();
    initTouchOptimizations();
    initViewportAdjustments();
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', debounce(handleResize, 250));
});

function initMobileFeatures() {
    // Add mobile-specific styling and behavior
    
    // Prevent zoom on input focus (iOS)
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], select, textarea');
    inputs.forEach(input => {
        input.style.fontSize = '16px'; // Prevent iOS zoom
    });
    
    // Add touch-friendly scroll behavior
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Handle mobile keyboard
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        let content = viewportMeta.getAttribute('content');
        
        // Listen for input focus/blur to adjust viewport
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                viewportMeta.setAttribute('content', content + ', user-scalable=no');
            });
            
            input.addEventListener('blur', () => {
                viewportMeta.setAttribute('content', content);
            });
        });
    }
}

function initResponsiveNavigation() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    // Create mobile menu toggle if navigation has many items
    const navItems = nav.querySelectorAll('a');
    if (navItems.length > 4 && window.innerWidth < 768) {
        createMobileMenu(nav, navItems);
    }
}

function createMobileMenu(nav, navItems) {
    // Create hamburger menu for mobile
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn md:hidden block p-2 text-gray-600 hover:text-gray-900';
    mobileMenuBtn.innerHTML = '<i class="ri-menu-line text-xl"></i>';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
    
    const navItemsContainer = nav.querySelector('.flex.gap-5') || nav.querySelector('.flex');
    if (navItemsContainer) {
        navItemsContainer.classList.add('mobile-nav-items');
        navItemsContainer.style.display = 'none';
        
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navItemsContainer.style.display !== 'none';
            navItemsContainer.style.display = isOpen ? 'none' : 'flex';
            navItemsContainer.style.flexDirection = 'column';
            navItemsContainer.style.position = 'absolute';
            navItemsContainer.style.top = '100%';
            navItemsContainer.style.left = '0';
            navItemsContainer.style.right = '0';
            navItemsContainer.style.backgroundColor = 'white';
            navItemsContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navItemsContainer.style.padding = '1rem';
            navItemsContainer.style.zIndex = '50';
            
            const icon = mobileMenuBtn.querySelector('i');
            icon.className = isOpen ? 'ri-menu-line text-xl' : 'ri-close-line text-xl';
        });
        
        nav.style.position = 'relative';
        nav.appendChild(mobileMenuBtn);
    }
}

function initTouchOptimizations() {
    // Optimize touch interactions
    
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('button, .btn, input[type="submit"]');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
            this.style.opacity = '0.8';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
            this.style.opacity = '1';
        });
    });
    
    // Improve touch scrolling for horizontal containers
    const horizontalScrollContainers = document.querySelectorAll('.overflow-x-auto, .flex.gap-5');
    horizontalScrollContainers.forEach(container => {
        container.style.webkitOverflowScrolling = 'touch';
        container.style.scrollBehavior = 'smooth';
    });
    
    // Add swipe functionality to product cards
    initSwipeGestures();
}

function initSwipeGestures() {
    const productContainers = document.querySelectorAll('.grid');
    
    productContainers.forEach(container => {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        
        container.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });
        
        container.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;
            
            const touch = e.touches[0];
            distX = touch.clientX - startX;
            distY = touch.clientY - startY;
            
            // Prevent default if horizontal swipe is stronger
            if (Math.abs(distX) > Math.abs(distY)) {
                e.preventDefault();
            }
        });
        
        container.addEventListener('touchend', function() {
            // Reset values
            startX = 0;
            startY = 0;
            distX = 0;
            distY = 0;
        });
    });
}

function initViewportAdjustments() {
    // Handle viewport height changes (mobile keyboard)
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update on resize
    window.addEventListener('resize', () => {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
    
    // Handle safe area insets for modern mobile browsers
    if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
        document.body.classList.add('has-safe-area');
    }
}

function handleOrientationChange() {
    // Add slight delay to ensure dimensions are updated
    setTimeout(() => {
        // Trigger resize handlers
        window.dispatchEvent(new Event('resize'));
        
        // Scroll to top to avoid layout issues
        window.scrollTo(0, 0);
        
        // Recalculate viewport height
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100);
}

function handleResize() {
    const width = window.innerWidth;
    
    // Show/hide mobile menu based on screen size
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navItems = document.querySelector('.mobile-nav-items');
    
    if (width >= 768) {
        if (mobileMenuBtn) mobileMenuBtn.style.display = 'none';
        if (navItems) {
            navItems.style.display = 'flex';
            navItems.style.position = 'static';
            navItems.style.flexDirection = 'row';
            navItems.style.backgroundColor = 'transparent';
            navItems.style.boxShadow = 'none';
            navItems.style.padding = '0';
        }
    } else {
        if (mobileMenuBtn) mobileMenuBtn.style.display = 'block';
        if (navItems) {
            navItems.style.display = 'none';
        }
    }
    
    // Adjust product grid layouts
    adjustProductLayouts(width);
}

function adjustProductLayouts(width) {
    const productGrids = document.querySelectorAll('.grid');
    
    productGrids.forEach(grid => {
        // Reset classes
        grid.className = grid.className.replace(/grid-cols-\d+/g, '');
        
        // Apply responsive classes based on width
        if (width < 480) {
            grid.classList.add('grid-cols-1');
        } else if (width < 768) {
            grid.classList.add('grid-cols-2');
        } else if (width < 1024) {
            grid.classList.add('grid-cols-3');
        } else {
            grid.classList.add('grid-cols-4');
        }
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll polyfill for older browsers
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Image lazy loading for better performance
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading-skeleton');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Optimize form submission for mobile
function optimizeFormSubmission() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('input[type="submit"], button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';
                
                // Re-enable after a timeout as fallback
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.getAttribute('value') || 'Submit';
                }, 5000);
            }
        });
    });
}

// Initialize all optimizations
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    optimizeFormSubmission();
});

// Export functions for external use
window.MobileResponsive = {
    initMobileFeatures,
    smoothScrollTo,
    adjustProductLayouts,
    handleOrientationChange
};
