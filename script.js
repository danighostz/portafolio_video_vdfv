/* =========================================================
   PORTAFOLIO · VICTOR DANIEL FLORES VIDAL
   script.js — versión corregida (menú hamburguesa funcional)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. Año dinámico en footer
       ========================================================= */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* =========================================================
       2. Menú móvil (hamburguesa) — CORREGIDO
       ========================================================= */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav__menu');

    if (navToggle && navMenu) {

        // Abrir/cerrar menú + animación de la X
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav__menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (
                navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !navToggle.contains(e.target)
            ) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Cerrar menú al hacer scroll (mejora UX)
        window.addEventListener('scroll', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }, { passive: true });
    }

    /* =========================================================
       3. Animación de aparición al hacer scroll
       ========================================================= */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.video-card, .gallery__item, .skill').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity .6s ease, transform .6s ease';
            observer.observe(el);
        });
    }

    /* =========================================================
       4. Lightbox para galería
       ========================================================= */
    document.querySelectorAll('.gallery__item img').forEach(img => {
        img.style.cursor = 'zoom-in';

        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position:fixed;inset:0;background:rgba(0,0,0,.92);
                display:flex;align-items:center;justify-content:center;
                z-index:9999;cursor:zoom-out;padding:20px;
                opacity:0;transition:opacity .3s;
            `;

            const bigImg = document.createElement('img');
            bigImg.src = img.src;
            bigImg.alt = img.alt || '';
            bigImg.style.cssText = `
                max-width:95%;max-height:95%;
                border-radius:12px;
                box-shadow:0 20px 60px rgba(0,0,0,.8);
            `;

            overlay.appendChild(bigImg);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => overlay.style.opacity = '1');

            const closeLightbox = () => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.overflow = '';
                }, 300);
                document.removeEventListener('keydown', onKey);
            };

            const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };

            overlay.addEventListener('click', closeLightbox);
            document.addEventListener('keydown', onKey);
        });
    });

    /* =========================================================
       5. Header con sombra al hacer scroll
       ========================================================= */
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 40
                ? '0 10px 30px rgba(0,0,0,.4)'
                : 'none';
        }, { passive: true });
    }

    /* =========================================================
       6. Forzar que los videos no se reproduzcan automáticamente
       ========================================================= */
    document.querySelectorAll('.video-card__frame iframe').forEach(iframe => {
        try {
            const src = iframe.getAttribute('src') || '';
            if (src.includes('autoplay=1')) {
                iframe.setAttribute('src', src.replace('autoplay=1', 'autoplay=0'));
            }
        } catch (e) {
            // cross-origin: ignoramos
        }
    });

});