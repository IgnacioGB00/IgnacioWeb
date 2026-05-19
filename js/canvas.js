const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const internalRes = 1080;
canvas.width = internalRes;
canvas.height = internalRes;

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.transformOrigin = 'top left';
canvas.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '10';

const sectionImages = {
    'header':   'img/scultura-Photoroom.png',
    'about':    'img/corazon.png',
    'works':    'img/mano.png',
    'contacts': 'img/labios.png'
};

let currentImageUrl = '';
let isChangingImage = false;
let forcedSectionId = null;  // ← NUEVO: sección forzada por navegación
let isNavigating = false;    // ← NUEVO: flag de navegación en progreso

const getGlyph = (v) => {
    const charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789¡¿(){}[]#$&%*+/=';
    const ramp = 'M#@%B8&W=*+-:. '.split('');
    if (v < 30) return ' ';
    if (v < 150) {
        const index = Math.floor(((255 - v) / 255) * ramp.length);
        return ramp[Math.min(index, ramp.length - 1)];
    }
    return charPool[Math.floor(Math.random() * charPool.length)];
};

const draw = async (url) => {
    if (isChangingImage) return;
    isChangingImage = true;
    canvas.style.opacity = '0';

    try {
        const image = await new Promise((res, rej) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = url;
        });

        setTimeout(() => {
            const cell = 6;
            const cols = internalRes / cell;
            const rows = internalRes / cell;

            const typeCanvas = document.createElement('canvas');
            typeCanvas.width = cols;
            typeCanvas.height = rows;
            const typeContext = typeCanvas.getContext('2d');
            typeContext.drawImage(image, 0, 0, cols, rows);
            const data = typeContext.getImageData(0, 0, cols, rows).data;

            context.clearRect(0, 0, internalRes, internalRes);
            context.fillStyle = '#FFFFFF';
            context.font = `${cell * 1.5}px monospace`;
            context.textAlign = 'center';

            for (let i = 0; i < cols * rows; i++) {
                const brightness = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
                const col = i % cols;
                const row = Math.floor(i / cols);
                context.fillText(getGlyph(brightness), col * cell + cell / 2, row * cell + cell / 2);
            }

            canvas.style.opacity = '1';
            isChangingImage = false;
        }, 300);

    } catch (e) {
        console.error(e);
        isChangingImage = false;
    }
};

const updatePosition = () => {
    const sectionIds = Object.keys(sectionImages);
    let activeId = forcedSectionId;  // ← PRIORIDAD: usar la sección forzada si existe

    // Solo detectar automáticamente si NO estamos navegando por el menú
    if (!activeId && !isNavigating) {
        let maxVisibleArea = 0;
        
        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            
            const rect = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(viewportHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibleArea = visibleHeight * rect.width;
            
            const sectionCenter = rect.top + rect.height / 2;
            const screenCenter = viewportHeight / 2;
            const distanceFromCenter = Math.abs(screenCenter - sectionCenter);
            const centerBonus = Math.max(0, (viewportHeight - distanceFromCenter) / viewportHeight);
            
            const score = visibleArea * (1 + centerBonus);
            
            if (score > maxVisibleArea) {
                maxVisibleArea = score;
                activeId = id;
            }
        });
    }

    if (!activeId) activeId = sectionIds[0];

    const activeSection = document.getElementById(activeId);
    if (!activeSection) return;

    const container = activeSection.querySelector('.contentCanvas');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const scale = size / internalRes;
    const offsetX = rect.left + (rect.width - size) / 2;
    const offsetY = rect.top + (rect.height - size) / 2;

    canvas.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;

    const newUrl = sectionImages[activeId];
    if (newUrl && newUrl !== currentImageUrl) {
        currentImageUrl = newUrl;
        draw(newUrl);
    }
};

// ── CORREGIDO: Navegación con forzado inmediato ──
const bindNavLinks = () => {
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const targetId = href.replace('#', '');
            
            // Verificar que existe en sectionImages
            if (!sectionImages[targetId]) return;
            
            // ← CRÍTICO: Forzar inmediatamente la sección y bloquear detección automática
            forcedSectionId = targetId;
            isNavigating = true;
            
            // Forzar actualización inmediata de posición e imagen
            updatePosition();
            
            // Limpiar el forzado cuando el scroll termine
            const clearNavigation = () => {
                forcedSectionId = null;
                isNavigating = false;
                updatePosition(); // una última vez con detección normal
            };
            
            // Usar scrollend si está disponible
            if ('onscrollend' in window) {
                const onScrollEnd = () => {
                    clearNavigation();
                    window.removeEventListener('scrollend', onScrollEnd);
                };
                window.addEventListener('scrollend', onScrollEnd);
            } else {
                // Fallback: esperar a que el scroll se estabilice
                let lastScrollY = window.scrollY;
                let stableCount = 0;
                
                const checkStable = setInterval(() => {
                    if (window.scrollY === lastScrollY) {
                        stableCount++;
                        if (stableCount >= 3) { // 3 lecturas estables = ~150ms
                            clearInterval(checkStable);
                            clearNavigation();
                        }
                    } else {
                        stableCount = 0;
                        lastScrollY = window.scrollY;
                    }
                }, 50);
            }
        });
    });
};

// ── Scroll normal (sin navegación por menú) ──
const setupScrollDetection = () => {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        // Solo actualizar automáticamente si NO estamos navegando por el menú
        if (!isNavigating) {
            window.requestAnimationFrame(() => updatePosition());
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (!isNavigating) {
                    updatePosition();
                }
            }, 100);
        }
    }, { passive: true });
};

window.addEventListener('resize', () => updatePosition());

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (header && !header.id) header.id = 'header';

    setupScrollDetection();
    bindNavLinks();
    updatePosition();
});