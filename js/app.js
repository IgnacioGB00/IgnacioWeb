const worksItems = document.querySelectorAll('.list-works li');
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

// Objeto con las imágenes de cada proyecto
const worksImages = {
  'batman':   './img/batmanWeb.avif',
  'ecobottle':'./img/ecoBottleDesktop.avif',
  'cafe':     './img/encentroDesktop.avif',
  'temple':   './img/legoDesktop.avif',
};

// Crear el elemento imagen para cursor (solo desktop)
const cursorImg = document.createElement('img');
cursorImg.className = 'works-cursor-img';
document.body.appendChild(cursorImg);

document.addEventListener('mousemove', e => {
  cursorImg.style.left = e.clientX + 'px';
  cursorImg.style.top  = e.clientY + 'px';
});

worksItems.forEach(item => {
  const key = item.dataset.work;

  // Solo activar el preview con cursor en desktop
  if (!isTouchDevice()) {
    item.addEventListener('mouseenter', () => {
      cursorImg.src = worksImages[key];
      cursorImg.classList.add('visible');
    });
    item.addEventListener('mouseleave', () => {
      cursorImg.classList.remove('visible');
    });
  }
  // En mobile: no hacer nada, el <a> navega normalmente con un toque
});


document.querySelectorAll('.navContent a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('hamburger').checked = false;
    });
});


