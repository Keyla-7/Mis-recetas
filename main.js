// main.js

let recetas = JSON.parse(localStorage.getItem("recetas")) || [
  {
    id: crypto.randomUUID(),
    nombre: "Tarta de Frutilla 🍓",
    categoria: "postres",
    tiempo: "30 min",
    ingredientes: ["1 masa de tarta", "250g frutillas", "Crema pastelera", "Azúcar"],
    pasos: [
      "Hornear la masa sola durante 10 min.",
      "Rellenar con crema pastelera.",
      "Colocar frutillas cortadas encima.",
      "Espolvorear con azúcar y enfriar."
    ]
  },
  {
    id: crypto.randomUUID(),
    nombre: "Sándwich de Atún 🥪",
    categoria: "comidas",
    tiempo: "10 min",
    ingredientes: ["2 rebanadas de pan", "1 lata de atún", "Mayonesa", "Lechuga"],
    pasos: [
      "Mezclar el atún con mayonesa.",
      "Untar sobre una rebanada de pan.",
      "Agregar lechuga y cerrar.",
      "Cortar en triángulos y servir."
    ]
  },
  {
    id: crypto.randomUUID(),
    nombre: "Limonada fresca 🍋",
    categoria: "bebidas",
    tiempo: "5 min",
    ingredientes: ["3 limones", "1 litro de agua", "Azúcar al gusto", "Hielo"],
    pasos: [
      "Exprimir los limones.",
      "Mezclar con el agua y azúcar.",
      "Agregar hielo y servir bien fría."
    ]
  }
];

let recetaActual = null;

// Guardar en localStorage
function guardarLocal() {
  localStorage.setItem("recetas", JSON.stringify(recetas));
}

// Mostrar recetas en cada categoría
function mostrarRecetas() {
  ["comidas", "postres", "bebidas"].forEach(cat => {
    const contenedor = document.getElementById("lista-" + cat);
    contenedor.innerHTML = "";
  });

  recetas.forEach(receta => {
    const contenedor = document.getElementById("lista-" + receta.categoria);
    const tarjeta = document.createElement("div");
    tarjeta.className = "receta-card";
    tarjeta.innerHTML = `<h3>${receta.nombre}</h3>`;
    tarjeta.addEventListener("click", () => verReceta(receta.id));
    contenedor.appendChild(tarjeta);
  });
}

// Mostrar detalle de receta
function verReceta(id) {
  const receta = recetas.find(r => r.id === id);
  recetaActual = receta;

  document.getElementById("detalle-nombre").textContent = receta.nombre;
  document.getElementById("detalle-tiempo").textContent = receta.tiempo;

  const ulIng = document.getElementById("detalle-ingredientes");
  ulIng.innerHTML = "";
  receta.ingredientes.forEach(i => {
    const li = document.createElement("li");
    li.textContent = "🍓 " + i;
    ulIng.appendChild(li);
  });

  const ulPasos = document.getElementById("detalle-pasos");
  ulPasos.innerHTML = "";
  receta.pasos.forEach(p => {
    const li = document.createElement("li");
    li.textContent = "📝 " + p;
    ulPasos.appendChild(li);
  });

  document.getElementById("detalle-receta").style.display = "block";
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cerrar detalle
function cerrarDetalle() {
  document.getElementById("detalle-receta").style.display = "none";
  recetaActual = null;
}

// Abrir formulario para agregar o editar receta
function abrirFormulario(categoria) {
  document.getElementById("formulario-container").style.display = "block";
  document.getElementById("form-categoria").value = categoria;
  document.getElementById("form-id").value = "";
  document.getElementById("form-nombre").value = "";
  document.getElementById("form-tiempo").value = "";
  document.getElementById("form-ingredientes").value = "";
  document.getElementById("form-pasos").value = "";
  document.getElementById("formulario-titulo").textContent = "Agregar receta";
}

// Cerrar formulario
function cerrarFormulario() {
  document.getElementById("formulario-container").style.display = "none";
}

// Guardar receta (nuevo o editado)
function guardarReceta(event) {
  event.preventDefault();

  const id = document.getElementById("form-id").value || crypto.randomUUID();
  const nuevaReceta = {
    id,
    nombre: document.getElementById("form-nombre").value.trim(),
    categoria: document.getElementById("form-categoria").value,
    tiempo: document.getElementById("form-tiempo").value.trim(),
    ingredientes: document.getElementById("form-ingredientes").value.split(",").map(i => i.trim()).filter(i => i),
    pasos: document.getElementById("form-pasos").value.split(";").map(p => p.trim()).filter(p => p)
  };

  const index = recetas.findIndex(r => r.id === id);
  if (index >= 0) {
    recetas[index] = nuevaReceta; // Editar
  } else {
    recetas.push(nuevaReceta); // Nuevo
  }

  guardarLocal();
  mostrarRecetas();
  cerrarFormulario();
}

// Eliminar receta actual
function eliminarReceta() {
  if (!recetaActual) return;
  if (confirm("¿Seguro que querés borrar esta receta?")) {
    recetas = recetas.filter(r => r.id !== recetaActual.id);
    guardarLocal();
    cerrarDetalle();
    mostrarRecetas();
  }
}

// Editar receta actual
function editarReceta() {
  if (!recetaActual) return;
  abrirFormulario(recetaActual.categoria);
  document.getElementById("formulario-titulo").textContent = "Editar receta";
  document.getElementById("form-id").value = recetaActual.id;
  document.getElementById("form-nombre").value = recetaActual.nombre;
  document.getElementById("form-tiempo").value = recetaActual.tiempo;
  document.getElementById("form-ingredientes").value = recetaActual.ingredientes.join(", ");
  document.getElementById("form-pasos").value = recetaActual.pasos.join("; ");
}

// Event listeners para botones

document.querySelectorAll(".agregar-btn").forEach(btn =>
  btn.addEventListener("click", () => abrirFormulario(btn.dataset.categoria))
);

document.getElementById("eliminar-receta").addEventListener("click", eliminarReceta);

document.getElementById("editar-receta").addEventListener("click", editarReceta);

document.getElementById("form-receta").addEventListener("submit", guardarReceta);

// Inicializar mostrando recetas
mostrarRecetas();
