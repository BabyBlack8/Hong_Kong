/* =========================================================
   PEDIDOS.JS · formulario de pedido → WhatsApp
   Necesita que main.js (objeto HK) se haya cargado antes.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("pedido-form");
    if (!formulario) return;

    const tipoPedido = document.getElementById("tipo-pedido");
    const direccionContenedor = document.getElementById("direccion-container");
    const direccion = document.getElementById("direccion");

    // Los valores deben coincidir con los <option value="..."> del HTML
    const nombresTipo = {
        delivery: "Delivery (entrega a domicilio)",
        recojo: "Recojo en el local",
        local: "Consumo en el local"
    };

    // La dirección solo se pide (y valida) cuando el pedido es delivery
    function actualizarDireccion() {
        const esDelivery = tipoPedido.value === "delivery";

        direccionContenedor.classList.toggle("is-hidden", !esDelivery);
        direccion.disabled = !esDelivery;
        direccion.required = esDelivery;
    }

    tipoPedido.addEventListener("change", actualizarDireccion);
    actualizarDireccion();

    HK.limpiarErroresAlEscribir(formulario);

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!HK.validarFormulario(formulario)) {
            HK.mostrarMensaje(formulario, "error", "Revisa los campos marcados en rojo.");
            return;
        }

        const datos = new FormData(formulario);
        const tipo = datos.get("tipo-pedido");

        let texto = "¡Hola! Quiero realizar un pedido.\n\n" +
                    "Nombre: " + datos.get("nombre").trim() + "\n" +
                    "Teléfono: " + datos.get("telefono").trim() + "\n" +
                    "Tipo de pedido: " + nombresTipo[tipo] + "\n";

        if (tipo === "delivery") {
            texto += "Dirección: " + datos.get("direccion").trim() + "\n";
        }

        texto += "\nMi pedido:\n" + datos.get("detalle").trim() +
                 "\n\nObservaciones:\n" + (datos.get("observaciones").trim() || "Ninguna");

        if (!HK.enviarWhatsApp(texto)) {
            HK.mostrarMensaje(formulario, "error",
                "Falta configurar el número de WhatsApp (js/main.js → HK.config.whatsapp).");
            return;
        }

        HK.mostrarMensaje(formulario, "ok",
            "¡Listo! Se abrió WhatsApp con tu pedido. Solo falta que lo envíes.");
        formulario.reset();
        actualizarDireccion();
    });

});
