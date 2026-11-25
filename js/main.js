/* =========================================================
   MAIN.JS · se carga en TODAS las páginas, antes que js/pages/*.js

   1. Configuración del sitio y funciones compartidas  → objeto HK
   2. Animación de los bloques al hacer scroll
   3. Botón "subir"
   4. Imágenes de reemplazo cuando falta una foto
   5. Año automático en el footer
========================================================= */

const HK = {

    /* ---------- 1. CONFIGURACIÓN ---------- */

    config: {
        // ✏️ COMPLETAR: número de WhatsApp con código de país, sin "+" ni espacios.
        // Ejemplo Bolivia: "59170000000"
        whatsapp: "591XXXXXXXX"
    },

    /* ---------- FUNCIONES COMPARTIDAS (las usan pedidos.js y contacto.js) ---------- */

    // ¿Ya se escribió un número real de WhatsApp?
    whatsappConfigurado: function () {
        return /^\d{8,15}$/.test(this.config.whatsapp);
    },

    // Abre WhatsApp con el texto listo. Devuelve false si falta configurar el número.
    enviarWhatsApp: function (texto) {
        if (!this.whatsappConfigurado()) return false;

        const url = "https://wa.me/" + this.config.whatsapp +
                    "?text=" + encodeURIComponent(texto);

        window.open(url, "_blank", "noopener");
        return true;
    },

    // Muestra un mensaje arriba del formulario. tipo: "error" | "ok"
    mostrarMensaje: function (formulario, tipo, texto) {
        const caja = formulario.querySelector(".form-feedback");
        if (!caja) return;

        caja.textContent = texto;
        caja.className = "form-feedback is-" + tipo;
        caja.scrollIntoView({ behavior: "smooth", block: "nearest" });
    },

    // Valida los campos usando los atributos del HTML (required, type, pattern, title).
    // Marca en rojo los que fallan y devuelve true si todo está bien.
    validarFormulario: function (formulario) {
        let primerError = null;

        formulario.querySelectorAll(".form-control").forEach(function (campo) {
            const contenedor = campo.parentElement;
            const anterior = contenedor.querySelector(".help-block");

            if (anterior) anterior.remove();
            contenedor.classList.remove("has-error");

            if (campo.disabled || campo.checkValidity()) return;

            let mensaje = "Revisa este campo.";
            if (campo.validity.valueMissing) mensaje = "Este campo es obligatorio.";
            else if (campo.validity.typeMismatch) mensaje = "Ingresa un correo válido.";
            else if (campo.validity.patternMismatch) mensaje = campo.title || "El formato no es válido.";

            const aviso = document.createElement("p");
            aviso.className = "help-block";
            aviso.textContent = mensaje;

            contenedor.classList.add("has-error");
            contenedor.appendChild(aviso);

            if (!primerError) primerError = campo;
        });

        if (primerError) {
            primerError.focus();
            return false;
        }
        return true;
    },

    // Quita el error de un campo apenas la persona vuelve a escribir
    limpiarErroresAlEscribir: function (formulario) {
        formulario.addEventListener("input", function (e) {
            const contenedor = e.target.parentElement;
            if (!contenedor || !contenedor.classList.contains("has-error")) return;

            contenedor.classList.remove("has-error");
            const aviso = contenedor.querySelector(".help-block");
            if (aviso) aviso.remove();
        });
    }
};


document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 2. ANIMACIÓN AL HACER SCROLL ---------- */
    // Los estilos están en style.css (.animate-box / .in-view)

    const bloques = document.querySelectorAll(".animate-box");

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(function (entradas, obs) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("in-view");
                    obs.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.15 });

        bloques.forEach(function (bloque) {
            observador.observe(bloque);
        });
    } else {
        bloques.forEach(function (bloque) {
            bloque.classList.add("in-view");
        });
    }


    /* ---------- 3. BOTÓN SUBIR ---------- */
    // El desplazamiento suave lo hace el CSS (scroll-behavior: smooth)

    const botonArriba = document.querySelector(".gototop");

    if (botonArriba) {
        const actualizarBoton = function () {
            botonArriba.classList.toggle("visible", window.scrollY > 400);
        };

        window.addEventListener("scroll", actualizarBoton, { passive: true });
        actualizarBoton();
    }


    /* ---------- 4. IMÁGENES DE REEMPLAZO ---------- */
    // Si una imagen no carga (todavía no la subiste), su contenedor recibe
    // la clase .sin-imagen y el CSS muestra un recuadro "Imagen pendiente".

    const imagenes = document.querySelectorAll(
        ".img-frame img, .fh5co-item-img img, #menuCarousel .item img"
    );

    imagenes.forEach(function (img) {
        const marcarSinImagen = function () {
            img.parentElement.classList.add("sin-imagen");
        };

        if (img.complete && img.naturalWidth === 0) {
            marcarSinImagen();                      // ya falló antes de que corriera el script
        } else {
            img.addEventListener("error", marcarSinImagen);
        }
    });


    /* ---------- 5. AÑO DEL FOOTER ---------- */

    document.querySelectorAll("[data-year]").forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

});
