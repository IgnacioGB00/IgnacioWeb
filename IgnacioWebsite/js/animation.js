document.addEventListener("DOMContentLoaded", () => {

  const headerImg     = document.getElementById("headerImge");
  const headerArticle = document.querySelector("header article");
  const nav           = document.querySelector("nav");

  const hideEl = (el, ty) => {
    if (!el) return;
    el.style.opacity    = "0";
    el.style.transform  = `translateY(${ty}px)`;
    el.style.transition = "none";
  };
  hideEl(nav, -20);
  hideEl(headerArticle, 30);

  if (!headerImg) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {

      // ✅ Leer primero TODAS las propiedades del DOM juntas
      const rect = headerImg.getBoundingClientRect();
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;
      const imgCX = rect.left + rect.width  / 2;
      const imgCY = rect.top  + rect.height / 2;
      const dx = vw / 2 - imgCX;
      const dy = vh / 2 - imgCY;
      const initialPx = Math.min(vw * 0.28, 240);
      const scale     = initialPx / rect.width;

      // ✅ Escribir después de leer (sin mezclar lectura/escritura)
      headerImg.style.transition      = "none";
      headerImg.style.transformOrigin = "center center";
      headerImg.style.transform       = `translate(${dx}px, ${dy}px) scale(${scale})`;
      headerImg.style.webkitMaskImage = "none";
      headerImg.style.maskImage       = "none";

      setTimeout(() => {

        headerImg.style.transition = [
          "transform 1.05s cubic-bezier(0.65, 0, 0.35, 1)",
          "-webkit-mask-image 0.5s ease 0.75s",
          "mask-image 0.5s ease 0.75s",
        ].join(", ");

        headerImg.style.transform       = "none";
        headerImg.style.webkitMaskImage = "linear-gradient(to bottom, black 50%, transparent 100%)";
        headerImg.style.maskImage       = "linear-gradient(to bottom, black 50%, transparent 100%)";

        setTimeout(() => {
          if (nav) {
            nav.style.transition = "opacity 0.55s ease, transform 0.55s ease";
            nav.style.opacity    = "1";
            nav.style.transform  = "translateY(0)";
          }
        }, 480);

        setTimeout(() => {
          if (!headerArticle) return;

          headerArticle.style.transition = "none";
          headerArticle.style.opacity    = "1";
          headerArticle.style.transform  = "none";

          // ✅ SOLUCIÓN PRINCIPAL: leer offsetHeight de todos ANTES de escribir
          const children = [...headerArticle.children];
          
          // Fase de LECTURA: forzar layout una sola vez para todos
          children.forEach(el => {
            el.style.opacity    = "0";
            el.style.transform  = "translateY(18px)";
            el.style.transition = "none";
          });

          // Un solo reflow para todos usando requestAnimationFrame
          requestAnimationFrame(() => {
            children.forEach((el, i) => {
              el.style.transition =
                `opacity 0.6s ease ${i * 0.16}s,
                 transform 0.6s ease ${i * 0.16}s`;
              el.style.opacity   = "1";
              el.style.transform = "translateY(0)";
            });
          });

        }, 700);

      }, 500);
    });
  });
});


