/**
 * Side Panel UI Component
 *
 * Manages the educational content side panel:
 * - Shows content categories (Concepts, PID Terms, Advanced)
 * - Displays detailed content when terms are clicked
 * - Handles responsive drawer behavior on mobile
 */

import { EDUCATIONAL_CONTENT, getCategoryContent, getContent } from './educational-content.js';

export class SidePanel {
    constructor() {
        this.panel = document.getElementById('side-panel');
        this.contentArea = document.getElementById('content-area');
        this.closeBtn = document.getElementById('close-panel-btn');
        this.navBtns = document.querySelectorAll('.nav-btn');

        this.currentCategory = 'concepts';
        this.currentView = 'list'; // 'list' or 'detail'

        this.init();
    }

    /**
     * Initialize side panel
     */
    init() {
        // Navigation buttons
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchCategory(btn.dataset.category);
            });
        });

        // Close button (mobile)
        this.closeBtn.addEventListener('click', () => {
            this.close();
        });

        // Click handlers for all [data-term] elements
        document.addEventListener('click', (e) => {
            const termElement = e.target.closest('[data-term]');
            if (termElement) {
                const termId = termElement.dataset.term;
                this.showContent(termId);
                this.open();
            }
        });

        // Initial content
        this.showCategoryList(this.currentCategory);
    }

    /**
     * Switch to a different category
     */
    switchCategory(category) {
        this.currentCategory = category;

        // Update nav button active state
        this.navBtns.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Show category content list
        this.showCategoryList(category);
    }

    /**
     * Show list of content items for a category
     */
    showCategoryList(category) {
        this.currentView = 'list';
        const content = getCategoryContent(category);

        let html = '';

        Object.entries(content).forEach(([id, item]) => {
            const termClass = item.termType ? `${item.termType}-term-card` : '';
            html += `
                <div class="content-card ${termClass}" data-term="${id}">
                    <h3>${item.title}</h3>
                    <p>${item.shortDesc}</p>
                </div>
            `;
        });

        if (html === '') {
            html = '<p class="placeholder">No content available for this category.</p>';
        }

        this.contentArea.innerHTML = html;
    }

    /**
     * Show detailed content for a specific term
     */
    showContent(termId) {
        const content = getContent(termId);

        if (!content) {
            this.contentArea.innerHTML = '<p class="placeholder">Content not found.</p>';
            return;
        }

        this.currentView = 'detail';

        let html = `
            <div class="content-detail">
                <button class="back-btn">← Back to list</button>
                <h2>${content.title}</h2>
                ${content.content}
        `;

        // Add related links if present
        if (content.relatedTerms && content.relatedTerms.length > 0) {
            html += '<div class="related-links"><h4>Related Topics:</h4>';
            content.relatedTerms.forEach(termId => {
                const relatedContent = getContent(termId);
                if (relatedContent) {
                    html += `<a href="#" data-term="${termId}">${relatedContent.title}</a>`;
                }
            });
            html += '</div>';
        }

        html += '</div>';

        this.contentArea.innerHTML = html;

        // Back button handler
        const backBtn = this.contentArea.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showCategoryList(this.currentCategory);
            });
        }
    }

    /**
     * Open side panel (mobile/tablet)
     */
    open() {
        this.panel.classList.add('open');
    }

    /**
     * Close side panel (mobile/tablet)
     */
    close() {
        this.panel.classList.remove('open');
    }

    /**
     * Toggle side panel
     */
    toggle() {
        if (this.panel.classList.contains('open')) {
            this.close();
        } else {
            this.open();
        }
    }
}
