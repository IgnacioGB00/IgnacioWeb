function blurInImagesOnScroll() {
  const pictures = document.querySelectorAll('.sectionContent img');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        entry.target.classList.add('blur-in');
      }
    });
  }, { threshold: 0.15 });

  pictures.forEach(pic => observer.observe(pic));
}

document.addEventListener('DOMContentLoaded', blurInImagesOnScroll);