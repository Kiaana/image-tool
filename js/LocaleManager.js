// LocaleManager.js
class LocaleManager {
    constructor() {
        this.currentLanguage = 'en'; // Default language
        this.localeData = {};
    }

    loadLocale(page) {
        const localeFile = `./locales/${this.currentLanguage}/${page}.json`;
        fetch(localeFile)
        .then(response => response.json())
        .then(data => {
            this.localeData = data;
            this.applyLocale();
        })
        .catch(error => console.error('Error loading locale:', error));
    }

    applyLocale() {
        document.querySelectorAll("[data-locale]").forEach(el => {
            const key = el.dataset.locale;
            el.innerText = this.localeData[key] || el.innerText;
        });
    }

    switchLanguage(language) {
        this.currentLanguage = language;
        const page = this.detectPage();
        this.loadLocale(page);
    }

    detectPage() {
        // This method would be customized to detect the current page's name.
        return window.location.pathname.split("/").pop().split(".")[0];
    }
}

// Instantiate the locale manager and load the initial locale
const localeManager = new LocaleManager();
document.addEventListener("DOMContentLoaded", () => {
    const page = localeManager.detectPage();
    localeManager.loadLocale(page);
});
