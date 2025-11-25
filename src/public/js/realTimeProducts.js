const socket = io();

// 🟢 Formulario de creación
const form = document.getElementById("productForm");
const container = document.getElementById("productsContainer");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: form.title.value,
    description: form.description.value,
    code: form.code.value,
    price: parseFloat(form.price.value),
    stock: parseInt(form.stock.value),
    category: form.category.value,
  };

  socket.emit("createProduct", product);
  form.reset();
});

// 🔴 Eliminar producto
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    socket.emit("deleteProduct", parseInt(id));
  }
});

// 🔄 Cuando se crea un producto
socket.on("productCreated", (product) => {
  const card = document.createElement("div");
  card.classList.add("product-card");
  card.setAttribute("data-id", product.id);
  card.innerHTML = `
    <h3>${product.title}</h3>
    <p>${product.description}</p>
    <p class="product-price">$${product.price}</p>
    <p class="product-code">Código: ${product.code}</p>
    <button class="btn btn-danger delete-btn" data-id="${product.id}">Eliminar</button>
  `;
  container.appendChild(card);
});

// 🗑️ Cuando se elimina un producto
socket.on("productDeleted", (id) => {
  const card = container.querySelector(`[data-id="${id}"]`);
  if (card) card.remove();
});
