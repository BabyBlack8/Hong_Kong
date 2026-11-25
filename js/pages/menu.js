document.addEventListener("DOMContentLoaded", function () {

    const enlaces = document.querySelectorAll(".menu-categorias a");
    if (!enlaces.length || !("IntersectionObserver" in window)) return;

    function marcarActivo(id) {
        enlaces.forEach(function (enlace) {
            const activo = enlace.getAttribute("href") === "#" + id;
            enlace.classList.toggle("active", activo);

            if (activo) {
                enlace.scrollIntoView({ block: "nearest", inline: "center" });
            }
        });
    }

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) marcarActivo(entrada.target.id);
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    document.querySelectorAll(".menu-seccion").forEach(function (seccion) {
        observador.observe(seccion);
    });

});
