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
  const key = item.dataset.work;
  const link = item.querySelector('a');

  if (!isTouchDevice()) {
    // Desktop: imagen sigue al cursor (sin cambios)
    item.addEventListener('mouseenter', () => {
      cursorImg.src = worksImages[key];
      cursorImg.classList.add('visible');
    });
    item.addEventListener('mouseleave', () => {
      cursorImg.classList.remove('visible');
    });

  } else {
    // Mobile/Tablet: primer tap = preview, segundo tap = navegar
    link.addEventListener('click', e => {
      const isAlreadyOpen = item.classList.contains('open');

      // Cerrar todos los demás primero
      worksItems.forEach(i => i.classList.remove('open'));

      if (isAlreadyOpen) {
        // Ya estaba abierto → dejar que el enlace navegue normalmente
        return; // No hacer preventDefault, no añadir clase
      } else {
        // Primer tap → mostrar preview, bloquear navegación
        e.preventDefault();
        item.classList.add('open');
      }
    });
  }
});


