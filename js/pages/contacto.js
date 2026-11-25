/* =========================================================
   CONTACTO.JS · formulario de contacto → WhatsApp
   Necesita que main.js (objeto HK) se haya cargado antes.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("contacto-form");
    if (!formulario) return;

    HK.limpiarErroresAlEscribir(formulario);

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!HK.validarFormulario(formulario)) {
            HK.mostrarMensaje(formulario, "error", "Revisa los campos marcados en rojo.");
            return;
        }

        const datos = new FormData(formulario);

        const texto = "Hola, soy " + datos.get("nombre").trim() + ".\n\n" +
                      "Correo: " + datos.get("correo").trim() + "\n" +
                      "Asunto: " + datos.get("asunto").trim() + "\n\n" +
                      "Mensaje:\n" + datos.get("mensaje").trim();

        if (!HK.enviarWhatsApp(texto)) {
            HK.mostrarMensaje(formulario, "error",
                "Falta configurar el número de WhatsApp (js/main.js → HK.config.whatsapp).");
            return;
        }

        HK.mostrarMensaje(formulario, "ok",
            "¡Gracias! Se abrió WhatsApp con tu mensaje. Solo falta que lo envíes.");
        formulario.reset();
    });

});
