// ==========================
// CONSTANTES Y MENSAJES
// ==========================
const SELECTORS = {
    carrito: "#carrito",
    contenedorCarrito: "#lista-carrito tbody",
    vaciarCarritoBtn: "#vaciar-carrito",
    listaCursos: "#lista-cursos",
    btnComprar: "#btn-comprar"
};

const MENSAJES = {
    carritoVacio: "El carrito está vacío. Agrega productos antes de comprar.",
    compraExitosa: "¡Gracias por tu compra!",
    eliminarCurso: "Producto eliminado del carrito",
    errorSubirImagen: "Error al procesar la imagen del producto",
};

// ==========================
// VARIABLES
// ==========================
const carrito = document.querySelector(SELECTORS.carrito);
const contenedorCarrito = document.querySelector(SELECTORS.contenedorCarrito);
const vaciarCarritoBtn = document.querySelector(SELECTORS.vaciarCarritoBtn);
const listaCursos = document.querySelector(SELECTORS.listaCursos);
const btnComprar = document.querySelector(SELECTORS.btnComprar);

let articulosCarrito = [];

// ==========================
// EVENT LISTENERS
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    actualizarBotonComprar();
});

listaCursos.addEventListener("click", agregarCurso);
carrito.addEventListener("click", eliminarCurso);
vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
btnComprar.addEventListener("click", comprarCarrito);

// ==========================
// FUNCIONES PRINCIPALES
// ==========================
function agregarCurso(e) {
    e.preventDefault();
    if (!e.target.classList.contains("agregar-carrito")) return;

    try {
        const cursoSeleccionado = e.target.closest(".curso");
        if (!cursoSeleccionado) throw new Error("No se pudo identificar el curso seleccionado.");

        leerDatosCurso(cursoSeleccionado);
    } catch (error) {
        console.error("Error al agregar curso:", error.message);
        alert(error.message);
    }
}

function leerDatosCurso(curso) {
    const precioTexto = curso.querySelector(".precio span").textContent;
    if (!precioTexto) throw new Error("Precio no disponible.");

    const infoCurso = {
        imagen: curso.querySelector("img")?.src || "",
        titulo: curso.querySelector("h4")?.textContent || "Sin título",
        precio: parseFloat(precioTexto.replace("$", "")) || 0,
        id: curso.querySelector("a")?.dataset.id || "",
        cantidad: 1,
    };

    if (!infoCurso.id) throw new Error("ID del curso no encontrado.");

    const existe = articulosCarrito.some(c => c.id === infoCurso.id);

    if (existe) {
        articulosCarrito = articulosCarrito.map(c => {
            if (c.id === infoCurso.id) {
                c.cantidad++;
                c.precio = c.precio * c.cantidad;
            }
            return c;
        });
    } else {
        articulosCarrito.push(infoCurso);
    }

    carritoHTML();
}

function carritoHTML() {
    limpiarHTML();

    articulosCarrito.forEach(curso => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;"><img src="${curso.imagen}" width="100"></td>
            <td style="text-align: center;">${curso.titulo}</td>
            <td style="text-align: center;">$ ${curso.precio}</td>
            <td style="text-align: center;">${curso.cantidad}</td>
            <td style="text-align: center;">
                <a href="#" class="borrar-curso" data-id="${curso.id}" 
                style="background-color:#dc3545;color:white;padding:8px 16px;border-radius:4px;text-decoration:none;">ELIMINAR</a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    });

    actualizarBotonComprar();
}

function limpiarHTML() {
    contenedorCarrito.innerHTML = "";
}

function eliminarCurso(e) {
    if (!e.target.classList.contains("borrar-curso")) return;

    const cursoId = e.target.dataset.id;
    articulosCarrito = articulosCarrito.filter(c => c.id !== cursoId);

    carritoHTML();
    console.log(MENSAJES.eliminarCurso);
}

function vaciarCarrito() {
    articulosCarrito = [];
    carritoHTML();
}

function comprarCarrito() {
    if (articulosCarrito.length === 0) {
        alert(MENSAJES.carritoVacio);
        return;
    }

    alert(MENSAJES.compraExitosa);
    articulosCarrito = [];
    carritoHTML();
}

function actualizarBotonComprar() {
    if (!btnComprar) return;
    btnComprar.style.display = articulosCarrito.length > 0 ? "block" : "none";
}
