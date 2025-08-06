// AI Tools Directory - Interactive JavaScript
// Author: Yathin
// Description: Adds interactive functionality to the AI Tools Directory

class AIToolsDirectory {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupTooltips();
        this.setupCardAnimations();
        this.setupSearchFunctionality();
        this.setupKeyboardNavigation();
        this.loadUserPreferences();
        this.setupAnalytics();
    }

    // Theme Toggle Functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        const icon = themeToggle.querySelector('i');

        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            
            // Add click animation
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }

    setTheme(theme) {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle.querySelector('i');

        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    }

    // Advanced Tooltip System
    setupTooltips() {
        const toolCards = document.querySelectorAll('.tool-card');
        let tooltip = null;

        toolCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const tooltipText = card.getAttribute('data-tooltip');
                if (tooltipText) {
                    this.showTooltip(e, tooltipText);
                }
            });

            card.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            card.addEventListener('mousemove', (e) => {
                if (tooltip) {
                    this.updateTooltipPosition(e);
                }
            });
        });
    }

    showTooltip(event, text) {
        // Remove existing tooltip
        this.hideTooltip();

        // Create new tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip show';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);

        // Store reference
        this.tooltip = tooltip;

        // Position tooltip
        this.updateTooltipPosition(event);
    }

    updateTooltipPosition(event) {
        if (!this.tooltip) return;

        const tooltip = this.tooltip;
        const rect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = event.clientX;
        let y = event.clientY - rect.height - 10;

        // Adjust if tooltip goes off screen
        if (x + rect.width > viewportWidth) {
            x = viewportWidth - rect.width - 10;
        }
        if (x < 10) {
            x = 10;
        }
        if (y < 10) {
            y = event.clientY + 10;
        }

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }

    // Enhanced Card Animations
    setupCardAnimations() {
        const toolCards = document.querySelectorAll('.tool-card');
        
        // Intersection Observer for scroll animations
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

        toolCards.forEach((card, index) => {
            // Initial state for animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            
            observer.observe(card);

            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });

            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });

            // Click animation
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.tool-link')) {
                    this.animateCardClick(card);
                }
            });
        });
    }

    animateCardHover(card, isHovering) {
        const icon = card.querySelector('.tool-icon');
        const tags = card.querySelectorAll('.tag');
        
        if (isHovering) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            icon.style.transform = 'rotate(360deg) scale(1.1)';
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.05)';
                }, index * 50);
            });
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            icon.style.transform = 'rotate(0deg) scale(1)';
            tags.forEach(tag => {
                tag.style.transform = 'scale(1)';
            });
        }
    }

    animateCardClick(card) {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        }, 150);
    }

    // Search Functionality
    setupSearchFunctionality() {
        // Create search bar
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-wrapper">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="search-input" placeholder="Search AI tools..." class="search-input">
                <button id="clear-search" class="clear-search" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="Conversational AI">Chat</button>
                <button class="filter-btn" data-filter="Image Generation">Images</button>
                <button class="filter-btn" data-filter="Coding">Code</button>
                <button class="filter-btn" data-filter="Writing">Writing</button>
            </div>
        `;

        // Insert search container after intro
        const intro = document.querySelector('.intro');
        intro.parentNode.insertBefore(searchContainer, intro.nextSibling);

        // Add search styles
        this.addSearchStyles();

        // Setup search functionality
        const searchInput = document.getElementById('search-input');
        const clearButton = document.getElementById('clear-search');
        const filterButtons = document.querySelectorAll('.filter-btn');

        searchInput.addEventListener('input', (e) => {
            this.filterTools(e.target.value);
            clearButton.style.display = e.target.value ? 'block' : 'none';
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            this.filterTools('');
            clearButton.style.display = 'none';
            searchInput.focus();
        });

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterByCategory(btn.dataset.filter);
            });
        });
    }

    filterTools(searchTerm) {
        const toolCards = document.querySelectorAll('.tool-card');
        const searchLower = searchTerm.toLowerCase();

        toolCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchLower) || 
                          description.includes(searchLower) || 
                          tags.some(tag => tag.includes(searchLower));

            if (matches) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });

        this.updateResultsCount();
    }

    filterByCategory(category) {
        const toolCards = document.querySelectorAll('.tool-card');

        toolCards.forEach(card => {
            if (category === 'all') {
                card.style.display = 'block';
            } else {
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent);
                const matches = tags.some(tag => tag.includes(category));
                card.style.display = matches ? 'block' : 'none';
            }
        });

        this.updateResultsCount();
    }

    updateResultsCount() {
        const visibleCards = document.querySelectorAll('.tool-card[style*="display: block"], .tool-card:not([style*="display: none"])').length;
        
        let resultsInfo = document.querySelector('.results-info');
        if (!resultsInfo) {
            resultsInfo = document.createElement('div');
            resultsInfo.className = 'results-info';
            document.querySelector('.tools-grid').parentNode.insertBefore(resultsInfo, document.querySelector('.tools-grid'));
        }
        
        resultsInfo.textContent = `Showing ${visibleCards} AI tools`;
    }

    addSearchStyles() {
        const styles = `
            .search-container {
                margin: 2rem 0;
                text-align: center;
            }
            
            .search-wrapper {
                position: relative;
                max-width: 500px;
                margin: 0 auto 1rem;
            }
            
            .search-input {
                width: 100%;
                padding: 1rem 3rem 1rem 3rem;
                border: 2px solid var(--border-color);
                border-radius: 50px;
                background: var(--bg-primary);
                color: var(--text-primary);
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .search-input:focus {
                outline: none;
                border-color: var(--color-1);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }
            
            .search-icon {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-secondary);
            }
            
            .clear-search {
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .clear-search:hover {
                background: var(--bg-secondary);
                color: var(--text-primary);
            }
            
            .search-filters {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .filter-btn {
                padding: 0.5rem 1rem;
                border: 2px solid var(--border-color);
                background: var(--bg-primary);
                color: var(--text-secondary);
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }
            
            .filter-btn:hover, .filter-btn.active {
                background: var(--color-1);
                color: white;
                border-color: var(--color-1);
            }
            
            .results-info {
                text-align: center;
                color: var(--text-secondary);
                margin-bottom: 1rem;
                font-size: 0.9rem;
            }
            
            @media (max-width: 768px) {
                .search-filters {
                    gap: 0.25rem;
                }
                
                .filter-btn {
                    padding: 0.4rem 0.8rem;
                    font-size: 0.8rem;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Search shortcut (Ctrl/Cmd + K)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Theme toggle shortcut (Ctrl/Cmd + Shift + T)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                document.getElementById('theme-toggle').click();
            }

            // Escape to clear search
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('search-input');
                if (searchInput && searchInput.value) {
                    searchInput.value = '';
                    this.filterTools('');
                    document.getElementById('clear-search').style.display = 'none';
                }
            }
        });
    }

    // User Preferences
    loadUserPreferences() {
        // Load and apply saved preferences
        const preferences = JSON.parse(localStorage.getItem('aiToolsPreferences') || '{}');
        
        // Apply saved search filters if any
        if (preferences.lastFilter && preferences.lastFilter !== 'all') {
            setTimeout(() => {
                const filterBtn = document.querySelector(`[data-filter="${preferences.lastFilter}"]`);
                if (filterBtn) {
                    filterBtn.click();
                }
            }, 100);
        }
    }

    saveUserPreferences() {
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const preferences = {
            lastFilter: activeFilter,
            theme: localStorage.getItem('theme') || 'light'
        };
        localStorage.setItem('aiToolsPreferences', JSON.stringify(preferences));
    }

    // Analytics and Tracking
    setupAnalytics() {
        const toolLinks = document.querySelectorAll('.tool-link');
        
        toolLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const toolName = link.closest('.tool-card').querySelector('h3').textContent;
                this.trackToolClick(toolName, link.href);
            });
        });

        // Track search usage
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.length > 2) {
                        this.trackSearch(e.target.value);
                    }
                }, 1000);
            });
        }
    }

    trackToolClick(toolName, url) {
        // Store click data locally (can be extended to send to analytics service)
        const clickData = {
            tool: toolName,
            url: url,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        const clicks = JSON.parse(localStorage.getItem('toolClicks') || '[]');
        clicks.push(clickData);
        
        // Keep only last 100 clicks
        if (clicks.length > 100) {
            clicks.splice(0, clicks.length - 100);
        }
        
        localStorage.setItem('toolClicks', JSON.stringify(clicks));
        console.log(`Tracked click: ${toolName}`);
    }

    trackSearch(searchTerm) {
        const searchData = {
            term: searchTerm,
            timestamp: new Date().toISOString()
        };
        
        const searches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        searches.push(searchData);
        
        // Keep only last 50 searches
        if (searches.length > 50) {
            searches.splice(0, searches.length - 50);
        }
        
        localStorage.setItem('searchHistory', JSON.stringify(searches));
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public API for external use
    getPopularTools() {
        const clicks = JSON.parse(localStorage.getItem('toolClicks') || '[]');
        const toolCounts = {};
        
        clicks.forEach(click => {
            toolCounts[click.tool] = (toolCounts[click.tool] || 0) + 1;
        });
        
        return Object.entries(toolCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([tool, count]) => ({ tool, count }));
    }

    getSearchHistory() {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiToolsDirectory = new AIToolsDirectory();
    
    // Save preferences before page unload
    window.addEventListener('beforeunload', () => {
        window.aiToolsDirectory.saveUserPreferences();
    });
});

// Add some additional utility functions
window.addEventListener('load', () => {
    // Add loading animation completion
    document.body.classList.add('loaded');
    
    // Performance monitoring
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});

// Handle offline/online status
window.addEventListener('online', () => {
    console.log('Connection restored');
    // Could show a notification here
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    // Could show offline indicator here
});

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIToolsDirectory;
}
