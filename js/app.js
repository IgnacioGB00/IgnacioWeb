const worksItems = document.querySelectorAll('.list-works li');
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

// Objeto con las imágenes de cada proyecto
const worksImages = {
  'batman':   './img/batmanWeb.avif',
  'ecobottle':'./img/ecoBottleDesktop.avif',
  'cafe':     './img/encentroDesktop.avif',
  'temple':   './img/legoDesktop.avif',
};

// Crear el elemento imagen para cursor (desktop)
const cursorImg = document.createElement('img');
cursorImg.className = 'works-cursor-img';
document.body.appendChild(cursorImg);

document.addEventListener('mousemove', e => {
  cursorImg.style.left = e.clientX + 'px';
  cursorImg.style.top  = e.clientY + 'px';
});

worksItems.forEach(item => {
  const key = item.dataset.work; // atributo data-work en el <li>

  if (!isTouchDevice()) {
    // Desktop: hover sigue el cursor
    item.addEventListener('mouseenter', () => {
      cursorImg.src = worksImages[key];
      cursorImg.classList.add('visible');
    });
    item.addEventListener('mouseleave', () => {
      cursorImg.classList.remove('visible');
    });
  } else {
    // Mobile/tablet: tap expande preview
    item.querySelector('a').addEventListener('click', e => {
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      worksItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  }
});


