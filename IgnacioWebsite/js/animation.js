

document.addEventListener("DOMContentLoaded", () => {

  const headerImg     = document.getElementById("headerImge");
  const headerArticle = document.querySelector("header article");
  const nav           = document.querySelector("nav");

  // ── Ocultar nav y contenido hero desde el inicio ──────────
  const hideEl = (el, ty) => {
    if (!el) return;
    el.style.opacity    = "0";
    el.style.transform  = `translateY(${ty}px)`;
    el.style.transition = "none";
  };
  hideEl(nav, -20);
  hideEl(headerArticle, 30);

  if (!headerImg) return;

  // Espera dos frames para que el browser haya pintado el layout
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {

      const rect = headerImg.getBoundingClientRect();
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;

      // Centro actual de la imagen (posición CSS real)
      const imgCX = rect.left + rect.width  / 2;
      const imgCY = rect.top  + rect.height / 2;

      // Cuánto moverla para que quede en el centro de la pantalla
      const dx = vw / 2 - imgCX;
      const dy = vh / 2 - imgCY;

      // Escala: queremos que ocupe ~28vw desde su tamaño real
      const initialPx = Math.min(vw * 0.28, 240);
      const scale     = initialPx / rect.width;

      // ── Estado inicial: imagen "centrada y pequeña" ────────
      headerImg.style.transition      = "none";
      headerImg.style.transformOrigin = "center center";
      headerImg.style.transform       = `translate(${dx}px, ${dy}px) scale(${scale})`;
      headerImg.style.webkitMaskImage = "none";
      headerImg.style.maskImage       = "none";

      // ── Pausa: usuario ve la imagen centrada ───────────────
      setTimeout(() => {

        // ── Fase 2: imagen vuela a su posición real ───────────
        headerImg.style.transition = [
          "transform 1.05s cubic-bezier(0.65, 0, 0.35, 1)",
          "-webkit-mask-image 0.5s ease 0.75s",
          "mask-image 0.5s ease 0.75s",
        ].join(", ");

        headerImg.style.transform       = "none";   // vuelve al CSS original
        headerImg.style.webkitMaskImage =
          "linear-gradient(to bottom, black 50%, transparent 100%)";
        headerImg.style.maskImage =
          "linear-gradient(to bottom, black 50%, transparent 100%)";

        // ── Nav: aparece mientras la imagen viaja ─────────────
        setTimeout(() => {
          if (nav) {
            nav.style.transition = "opacity 0.55s ease, transform 0.55s ease";
            nav.style.opacity    = "1";
            nav.style.transform  = "translateY(0)";
          }
        }, 480);

        // ── Contenido hero: stagger al terminar ───────────────
        setTimeout(() => {
          if (!headerArticle) return;

          headerArticle.style.transition = "none";
          headerArticle.style.opacity    = "1";
          headerArticle.style.transform  = "none";

          [...headerArticle.children].forEach((el, i) => {
            el.style.opacity    = "0";
            el.style.transform  = "translateY(18px)";
            el.style.transition = "none";
            void el.offsetHeight; // reflow
            el.style.transition =
              `opacity 0.6s ease ${i * 0.16}s,
               transform 0.6s ease ${i * 0.16}s`;
            el.style.opacity   = "1";
            el.style.transform = "translateY(0)";
          });
        }, 700);

      }, 500); // pausa inicial: 500 ms
    });
  });
});


