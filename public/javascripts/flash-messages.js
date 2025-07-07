// Beautiful Flash Message System
// Auto-dismissing notifications with smooth animations

class FlashMessage {
    constructor() {
        this.container = this.createContainer();
        this.messages = [];
    }

    createContainer() {
        let container = document.getElementById('flash-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'flash-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 8000) {
        const messageElement = this.createMessageElement(message, type);
        this.container.appendChild(messageElement);
        this.messages.push(messageElement);

        // Trigger animation
        requestAnimationFrame(() => {
            messageElement.classList.add('show');
        });

        // Auto dismiss
        setTimeout(() => {
            this.dismiss(messageElement);
        }, duration);

        return messageElement;
    }

    createMessageElement(message, type) {
        const element = document.createElement('div');
        element.className = `flash-message ${type}`;
        element.style.pointerEvents = 'auto';

        const icon = this.getIcon(type);
        
        element.innerHTML = `
            <div class="icon">${icon}</div>
            <div class="content">${message}</div>
            <button class="close-btn" onclick="flashMessage.dismiss(this.parentElement)">
                <i class="ri-close-line" style="font-size: 12px;"></i>
            </button>
            <div class="progress-bar"></div>
        `;

        return element;
    }

    getIcon(type) {
        const icons = {
            success: '<i class="ri-check-circle-line"></i>',
            error: '<i class="ri-error-warning-line"></i>',
            info: '<i class="ri-information-line"></i>',
            warning: '<i class="ri-alert-line"></i>'
        };
        return icons[type] || icons.info;
    }

    dismiss(messageElement) {
        if (!messageElement || !messageElement.parentElement) return;

        messageElement.style.transform = 'translateX(100%)';
        messageElement.style.opacity = '0';

        setTimeout(() => {
            if (messageElement.parentElement) {
                messageElement.parentElement.removeChild(messageElement);
            }
            const index = this.messages.indexOf(messageElement);
            if (index > -1) {
                this.messages.splice(index, 1);
            }
        }, 400);
    }

    success(message, duration = 8000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 8000) {
        return this.show(message, 'error', duration);
    }

    info(message, duration = 8000) {
        return this.show(message, 'info', duration);
    }

    warning(message, duration = 8000) {
        return this.show(message, 'warning', duration);
    }

    clear() {
        this.messages.forEach(message => this.dismiss(message));
    }
}

// Initialize flash message system
const flashMessage = new FlashMessage();

// Function to show server-side flash messages
function showServerFlashMessages() {
    // Check for server flash messages
    const serverFlashContainer = document.getElementById('server-flash-messages');
    if (serverFlashContainer) {
        const serverFlashElements = serverFlashContainer.querySelectorAll('.server-flash');
        serverFlashElements.forEach(element => {
            const message = element.textContent.trim();
            const type = element.dataset.type;
            if (message && type) {
                flashMessage.show(message, type);
            }
        });
        // Hide the server flash container after processing
        serverFlashContainer.style.display = 'none';
    }

// Check for legacy flash messages and convert them
const legacyElements = document.querySelectorAll('.legacy-flash');
legacyElements.forEach(element => {
    const message = element.textContent.trim();
    if (message) {
        let type = 'info';
        if (element.classList.contains('bg-green-500') || element.classList.contains('bg-green-100')) {
            type = 'success';
        } else if (element.classList.contains('bg-red-500') || element.classList.contains('bg-red-100')) {
            type = 'error';
        } else if (element.classList.contains('bg-yellow-500') || element.classList.contains('bg-yellow-100')) {
            type = 'warning';
        }
        flashMessage.show(message, type);
        element.style.display = 'none'; // Hide ONLY old-style container
    }
});
// END legacy flash block
}

// Dark theme functionality
function initializeDarkTheme() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIcon = document.querySelector('.dark-mode-icon');
    const lightModeIcon = document.querySelector('.light-mode-icon');
    
    if (darkModeToggle) {
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        if (currentTheme === 'dark') {
            document.body.classList.add('dark');
            darkModeIcon.classList.add('hidden');
            lightModeIcon.classList.remove('hidden');
        }
        
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark');
            
            if (document.body.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                darkModeIcon.classList.add('hidden');
                lightModeIcon.classList.remove('hidden');
            } else {
                localStorage.setItem('theme', 'light');
                darkModeIcon.classList.remove('hidden');
                lightModeIcon.classList.add('hidden');
            }
        });
    }
}

// Auto-run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark theme
    initializeDarkTheme();
    
    // Small delay to ensure all elements are rendered
    setTimeout(showServerFlashMessages, 100);
    
    // Clear server flash messages from session after showing them
    setTimeout(() => {
        // Make a request to clear server flash messages
        fetch('/clearflash', { method: 'POST' })
            .then(response => response.json())
            .then(() => {
                console.log('Flash messages cleared from session');
            })
            .catch(error => {
                console.log('Failed to clear flash messages:', error);
            });
    }, 2000);
});

// Example usage functions for client-side messages
function showSuccessMessage(message) {
    flashMessage.success(message);
}

function showErrorMessage(message) {
    flashMessage.error(message);
}

function showInfoMessage(message) {
    flashMessage.info(message);
}

function showWarningMessage(message) {
    flashMessage.warning(message);
}

// Export for global use
window.flashMessage = flashMessage;
window.showSuccessMessage = showSuccessMessage;
window.showErrorMessage = showErrorMessage;
window.showInfoMessage = showInfoMessage;
window.showWarningMessage = showWarningMessage;
