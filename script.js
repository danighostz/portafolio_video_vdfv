/* =========================================================
   PORTAFOLIO · VICTO DANIEL FLORES VIDAL
   script.js
   ========================================================= */

// ===== 1. Año dinámico en footer =====
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ===== 2. Menú móvil =====
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

// ===== 3. Animación de aparición al hacer scroll =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // deja de observar después de animar
        }
    });
}, { threshold: 0.1 });

// Aplicamos animación a tarjetas de video, galerías y habilidades
const animatedEls = document.querySelectorAll(
    '.video-card, .gallery__item, .skill'
);

animatedEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
});

// ===== 4. Lightbox para galería =====
// Aplica lightbox a todas las imágenes dentro de .gallery__item
const galleryItems = document.querySelectorAll('.gallery__item img');

galleryItems.forEach(img => {
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

        // Bloquear scroll del body mientras el lightbox está abierto
        document.body.style.overflow = 'hidden';

        // Fade-in
        requestAnimationFrame(() => overlay.style.opacity = '1');

        // Cerrar al hacer clic
        overlay.addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = ''; // restaurar scroll
            }, 300);
        });

        // Cerrar con la tecla ESC
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', closeOnEsc);
                }, 300);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    });
});

// ===== 5. Header con sombra al hacer scroll =====
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,.4)';
        } else {
            header.style.boxShadow = 'none';
        }
    }, { passive: true });
}

// ===== 6. FORZAR QUE LOS VIDEOS NO SE REPRODUZCAN AUTOMÁTICAMENTE =====
// Algunos navegadores ejecutan autoplay aunque el iframe lo tenga en 0.
// Este script asegura que los videos solo se reproduzcan con clic del usuario.
document.addEventListener('DOMContentLoaded', () => {

    // Función para "recargar" un iframe sin autoplay
    const limpiarAutoplay = (iframe) => {
        try {
            const src = iframe.getAttribute('src') || '';
            // Quitar cualquier parámetro de autoplay que se haya colado
            if (src.includes('autoplay=1')) {
                iframe.setAttribute('src', src.replace('autoplay=1', 'autoplay=0'));
            }
            // Vaciar src y reasignar para detener cualquier reproducción en curso
            iframe.src = iframe.src;
        } catch (e) {
            // Ignoramos errores de cross-origin
        }
    };

    // Aplicar a todos los iframes dentro de las tarjetas de video
    document.querySelectorAll('.video-card__frame iframe').forEach(iframe => {
        // Guardar el src original limpio (sin autoplay)
        const srcOriginal = iframe.src.replace(/autoplay=1/g, 'autoplay=0');
        iframe.src = srcOriginal;

        // Refuerzo: cada vez que el iframe se cargue, limpiar autoplay
        iframe.addEventListener('load', () => {
            // Solo se ejecuta la primera vez; después de eso el usuario ya tiene control
        }, { once: true });
    });

    // Para los embeds de TikTok, no hay autoplay por defecto,
    // pero por si acaso reiniciamos su renderizado
    if (window.tiktokEmbed) {
        try { window.tiktokEmbed.lib.render(); } catch (e) {}
    }
});

// ===== 7. Pausar videos cuando salen del viewport (opcional) =====
// Al hacer scroll y que una tarjeta deje de verse, se pausa el video para
// que no siga sonando en segundo plano.
if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            if (!iframe) return;
            try {
                // Enviamos un postMessage genérico de pausa a los reproductores embebidos
                if (!entry.isIntersecting) {
                    // Para YouTube
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    // Para Vimeo
                    iframe.contentWindow.postMessage('{"method":"pause"}', '*');
                }
            } catch (e) {
                // cross-origin: ignoramos silenciosamente
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('.video-card__frame').forEach(frame => {
        videoObserver.observe(frame);
    });
}