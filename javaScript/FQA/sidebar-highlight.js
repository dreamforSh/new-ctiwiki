
const fqaNavLinks = document.querySelectorAll('.fqa-nav-link');
const questionCards = document.querySelectorAll('.question-card');


const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            fqaNavLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.5 });


questionCards.forEach(card => {
    const id = card.getAttribute('id');
    if (id) {
        observer.observe(card);
    }
});


fqaNavLinks[0].classList.add('active');