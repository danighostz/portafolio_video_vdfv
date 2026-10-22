/* =========================================================
   PORTAFOLIO · VICTO DANIEL FLORE VIDAL
   script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. Año dinámico en footer
       ========================================================= */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* =========================================================
       2. Menú móvil
       ========================================================= */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav__menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav__menu a').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
    }

    /* =========================================================
       3. Animación de aparición al hacer scroll
       ========================================================= */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // se anima solo una vez
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.video-card, .gallery__item, .skill').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity .6s ease, transform .6s ease';
        observer.observe(el);
    });

    /* =========================================================
       4. Lightbox para galería
       ========================================================= */
    document.querySelectorAll('.gallery__item img').forEach(img => {
        img.style.cursor = 'zoom-in';

        img.addEventListener('click', () => {
            // Crear overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position:fixed;inset:0;background:rgba(0,0,0,.92);
                display:flex;align-items:center;justify-content:center;
                z-index:9999;cursor:zoom-out;padding:20px;
                opacity:0;transition:opacity .3s;
            `;

            // Imagen grande
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

            // Bloquear scroll del body
            document.body.style.overflow = 'hidden';

            // Fade-in
            requestAnimationFrame(() => overlay.style.opacity = '1');

            // Función de cierre (clic o ESC)
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
       6. VIDEOS: cargar iframe SOLO al hacer clic
       ========================================================= */
    document.querySelectorAll('.video-card__thumb').forEach(btn => {

        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const provider = btn.dataset.provider;
            const id = btn.dataset.id;
            const frame = btn.closest('.video-card__frame');

            if (!provider || !id || !frame) {
                console.warn('Faltan datos del video:', { provider, id });
                return;
            }

            let src = '';

            // --- YouTube ---
            if (provider === 'youtube') {
                src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;

            // --- TikTok ---
            } else if (provider === 'tiktok') {
                src = `https://www.tiktok.com/embed/v2/${id}`;

            // --- Facebook ---
            } else if (provider === 'facebook') {
                const fbUrl = encodeURIComponent(`https://www.facebook.com/reel/${id}`);
                src = `https://www.facebook.com/plugins/video.php?href=${fbUrl}&show_text=false&autoplay=1&width=605`;

            } else {
                return;
            }

            // Crear iframe con tamaño explícito (garantiza que se vea)
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.title = 'Video';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write');
            iframe.setAttribute('scrolling', 'no');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = '0';
            iframe.style.display = 'block';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';

            // Reemplazar thumbnail por iframe
            frame.innerHTML = '';
            frame.appendChild(iframe);
            frame.classList.add('is-loaded');
        });

    });

});