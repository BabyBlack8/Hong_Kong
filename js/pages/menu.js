/* =========================================================
   MENU.JS · barra de categorías
   Resalta en la barra la categoría que se está viendo al hacer scroll.
   (El salto suave al hacer clic lo hace el CSS: scroll-behavior: smooth)
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const enlaces = document.querySelectorAll(".menu-categorias a");
    if (!enlaces.length || !("IntersectionObserver" in window)) return;

    function marcarActivo(id) {
        enlaces.forEach(function (enlace) {
            const activo = enlace.getAttribute("href") === "#" + id;
            enlace.classList.toggle("active", activo);

            // en celular la barra se desplaza: mantener visible el botón activo
            if (activo) {
                enlace.scrollIntoView({ block: "nearest", inline: "center" });
            }
        });
    }

    // Una sección cuenta como "actual" cuando cruza la franja central de la pantalla
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) marcarActivo(entrada.target.id);
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    document.querySelectorAll(".menu-seccion").forEach(function (seccion) {
        observador.observe(seccion);
    });

});
