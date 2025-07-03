document.addEventListener('DOMContentLoaded', () => {
    // Safely get hamburger and navList, log if not found
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    if (!hamburger || !navList) {
        console.error('Error: .hamburger or .nav-list not found in the DOM');
        return; // Exit if elements are missing
    }

    hamburger.addEventListener('click', () => {
        navList.classList.toggle('nav-open');
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', (event) => {
        if (!hamburger.contains(event.target) && !navList.contains(event.target) && navList.classList.contains('nav-open')) {
            navList.classList.remove('nav-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});