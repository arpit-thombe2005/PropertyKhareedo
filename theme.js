// Theme System JavaScript
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.init();
    }

    init() {
        // Apply stored theme on page load
        this.applyTheme(this.currentTheme);
        
        // Create theme toggle button
        this.createThemeToggle();
        
        // Listen for theme toggle clicks
        this.bindEvents();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.setStoredTheme(theme);
        
        // Update theme toggle button icon
        this.updateToggleIcon();
        
        // Dispatch custom event for other scripts to listen
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Add smooth transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    createThemeToggle() {
        // Check if toggle already exists
        if (document.querySelector('.theme-toggle')) {
            return;
        }

        // Respect pages that disable the theme toggle
        if (document.body && document.body.hasAttribute('data-disable-theme-toggle')) {
            return;
        }

        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle theme');
        toggle.innerHTML = `
            <span class="theme-toggle-icon sun">☀️</span>
            <span class="theme-toggle-icon moon">🌙</span>
        `;

        const headerContainer = document.querySelector('.header-container');

        if (headerContainer) {
            let actionsContainer = headerContainer.querySelector('.header-actions');

            if (!actionsContainer) {
                actionsContainer = document.createElement('div');
                actionsContainer.className = 'header-actions';

                const dropdown = headerContainer.querySelector('.dropdown');
                if (dropdown) {
                    headerContainer.removeChild(dropdown);
                    actionsContainer.appendChild(dropdown);
                }

                headerContainer.appendChild(actionsContainer);
            }

            actionsContainer.appendChild(toggle);
        } else {
            document.body.appendChild(toggle);
        }
    }

    updateToggleIcon() {
        const sunIcon = document.querySelector('.theme-toggle-icon.sun');
        const moonIcon = document.querySelector('.theme-toggle-icon.moon');
        
        if (sunIcon && moonIcon) {
            if (this.currentTheme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    }

    bindEvents() {
        // Theme toggle click event
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // Keyboard shortcut (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to set specific theme
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }
}

function initThemeManager() {
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeManager);
} else {
    initThemeManager();
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}

