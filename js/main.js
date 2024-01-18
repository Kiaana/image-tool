
// AOS
AOS.init();

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll to Top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show or hide the button with a gradient fade effect
window.addEventListener('scroll', function () {
    var backToTopButton = document.getElementById('back-to-top');
    if (window.scrollY > 100) {
        backToTopButton.classList.remove('hidden');
        setTimeout(() => backToTopButton.style.opacity = '1', 0); // Delay required to trigger fade-in animation
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.addEventListener('transitionend', () => {
            if (window.scrollY < 100) backToTopButton.classList.add('hidden');
        }, { once: true });
    }
});

