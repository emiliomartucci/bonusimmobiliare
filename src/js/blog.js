/**
 * Blog Articles Dynamic Loader
 * v1.1.0 - 2026-02-01
 *
 * Carica articoli da articles.json e renderizza dinamicamente la pagina blog.
 * Supporta filtri per categoria e ricerca testuale.
 * Includes error handling with user-friendly fallback UI.
 */

class BlogLoader {
    constructor(options = {}) {
        this.articlesPath = options.articlesPath || '/blog/articles.json';
        this.articlesContainer = options.articlesContainer || '#articlesList';
        this.featuredContainer = options.featuredContainer || '#featuredArticle';
        this.searchInput = options.searchInput || '#searchInput';
        this.chipsContainer = options.chipsContainer || '.category-chips';
        this.noResultsContainer = options.noResultsContainer || '#noResults';
        this.articleCountEl = options.articleCountEl || '#articleCount';

        this.articles = [];
        this.categories = [];
        this.activeCategory = 'all';
        this.searchTerm = '';
    }

    async init() {
        try {
            await this.loadArticles();
            this.renderArticles();
            this.setupEventListeners();
            this.handleURLParams();
            this.updateArticleCount();
        } catch (error) {
            console.error('Errore caricamento articoli:', error);
            this.showLoadError();
        }
    }

    showLoadError() {
        const container = document.querySelector(this.articlesContainer);
        if (container) {
            container.innerHTML = `
                <div class="load-error" style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
                    <p style="color: var(--gray-600, #6c757d); margin-bottom: 1rem;">
                        Impossibile caricare gli articoli.
                    </p>
                    <button onclick="location.reload()"
                            style="background: var(--olive, #5C6B4A); color: white; padding: 0.5rem 1rem;
                                   border: none; border-radius: 8px; cursor: pointer; font-family: inherit;">
                        Riprova
                    </button>
                </div>
            `;
        }
        // Hide featured section on error
        const featured = document.querySelector(this.featuredContainer);
        if (featured) featured.style.display = 'none';
    }

    async loadArticles() {
        const response = await fetch(this.articlesPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            console.error('Errore parsing JSON:', parseError);
            throw new Error('Formato dati non valido');
        }

        this.articles = data.articles || [];
        this.categories = data.categories || [];

        // Sort by date (newest first)
        this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderArticles() {
        this.renderFeaturedArticle();
        this.renderArticlesList();
    }

    renderFeaturedArticle() {
        const container = document.querySelector(this.featuredContainer);
        if (!container) return;

        const featured = this.articles.find(a => a.featured);
        if (!featured) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = `
            <a href="/blog/${featured.slug}/" class="featured-article-link"
               data-category="${featured.category}"
               data-title="${featured.title.toLowerCase()}"
               data-excerpt="${featured.excerpt.toLowerCase()}"
               data-keywords="${featured.keywords || ''}">
                <div class="featured-article-inner">
                    <p class="featured-label">${featured.categoryLabel}</p>
                    <h2 class="featured-title">${featured.title}</h2>
                    <p class="featured-excerpt">${featured.excerpt}</p>
                    <p class="featured-meta">${featured.readTime} di lettura</p>
                </div>
            </a>
        `;
    }

    renderArticlesList() {
        const container = document.querySelector(this.articlesContainer);
        if (!container) return;

        // Show all articles except the one displayed as main featured
        const mainFeatured = this.articles.find(a => a.featured);
        const listArticles = this.articles.filter(a => a !== mainFeatured);

        container.innerHTML = listArticles.map(article => `
            <a href="/blog/${article.slug}/" class="article-row"
               data-category="${article.category}"
               data-title="${article.title.toLowerCase()}"
               data-excerpt="${article.excerpt.toLowerCase()}"
               data-keywords="${article.keywords || ''}">
                <span class="article-category-tag" data-cat="${article.category}">${article.categoryLabel}</span>
                <div class="article-info">
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                </div>
                <span class="article-meta">${article.readTime}</span>
            </a>
        `).join('');
    }

    setupEventListeners() {
        // Search input
        const searchEl = document.querySelector(this.searchInput);
        if (searchEl) {
            searchEl.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.filterArticles();
            });
        }

        // Category chips
        const chips = document.querySelectorAll(`${this.chipsContainer} .chip`);
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.activeCategory = chip.dataset.filter;
                this.filterArticles();
            });
        });
    }

    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam) {
            const targetChip = document.querySelector(`${this.chipsContainer} .chip[data-filter="${filterParam}"]`);
            if (targetChip) {
                document.querySelectorAll(`${this.chipsContainer} .chip`).forEach(c => c.classList.remove('active'));
                targetChip.classList.add('active');
                this.activeCategory = filterParam;
                this.filterArticles();
            }
        }
    }

    filterArticles() {
        const featured = document.querySelector(`${this.featuredContainer} .featured-article-link`);
        const rows = document.querySelectorAll(`${this.articlesContainer} .article-row`);
        const noResults = document.querySelector(this.noResultsContainer);

        let visibleCount = 0;

        // Filter article rows
        rows.forEach(row => {
            const category = row.dataset.category;
            const title = row.dataset.title || '';
            const excerpt = row.dataset.excerpt || '';
            const keywords = row.dataset.keywords || '';
            const searchText = `${title} ${excerpt} ${keywords}`;

            const matchesCategory = this.activeCategory === 'all' || category === this.activeCategory;
            const matchesSearch = this.searchTerm === '' || searchText.includes(this.searchTerm);

            if (matchesCategory && matchesSearch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Filter featured article
        if (featured) {
            const category = featured.dataset.category;
            const title = featured.dataset.title || '';
            const excerpt = featured.dataset.excerpt || '';
            const keywords = featured.dataset.keywords || '';
            const searchText = `${title} ${excerpt} ${keywords}`;

            const matchesCategory = this.activeCategory === 'all' || category === this.activeCategory;
            const matchesSearch = this.searchTerm === '' || searchText.includes(this.searchTerm);

            const featuredWrapper = document.querySelector(this.featuredContainer);
            if (matchesCategory && matchesSearch) {
                featuredWrapper.style.display = '';
                visibleCount++;
            } else {
                featuredWrapper.style.display = 'none';
            }
        }

        // Show/hide no results message
        if (noResults) {
            noResults.classList.toggle('show', visibleCount === 0);
        }

        this.updateArticleCount(visibleCount);
    }

    updateArticleCount(count) {
        const countEl = document.querySelector(this.articleCountEl);
        if (countEl) {
            const total = count !== undefined ? count : this.articles.length;
            countEl.textContent = `${total} articol${total === 1 ? 'o' : 'i'}`;
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const blogLoader = new BlogLoader();
    blogLoader.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogLoader;
}
