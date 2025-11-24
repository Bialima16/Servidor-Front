const productList = document.querySelector('#products');
const productForm = document.querySelector('#product-form');
const formTitle = document.querySelector('#form-title');
const submitBtn = document.querySelector('#submit-btn');
const productId = document.querySelector('#product-id');
const nameInput = document.querySelector('#name');
const descriptionInput = document.querySelector('#description');
const priceInput = document.querySelector('#price');
const searchInput = document.querySelector('#search-id');
const searchBtn = document.querySelector('#search-btn');
const searchResult = document.querySelector('#search-result');


let editing = false; // controla se o formulário está em modo edição

// Fetch products
async function fetchProducts() {
  const response = await fetch('http://localhost:3000/products');
  const products = await response.json();

  productList.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `ID: ${product.id} — ${product.name} — ${product.description} — R$ ${product.price}`;

    // delete
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.onclick = async () => {
      await deleteProduct(product.id);
      fetchProducts();
    };

    // update (coloca o form em modo edição)
    const updateBtn = document.createElement('button');
    updateBtn.innerText = 'Update';
    updateBtn.onclick = () => {
      editing = true;

      productId.value = product.id;
      nameInput.value = product.name;
      descriptionInput.value = product.description;
      priceInput.value = product.price;

      formTitle.innerText = 'Update Product';
      submitBtn.innerText = 'Save Changes';
    };

    li.appendChild(deleteBtn);
    li.appendChild(updateBtn);

    productList.appendChild(li);
  });
}

productForm.addEventListener('submit', async event => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const price = parseFloat(priceInput.value);

  if (!editing) {
    await addProduct(name, description, price);
  } else {
    await updateProduct(productId.value, name, description, price);
  }

  resetForm();
  fetchProducts();
});

searchBtn.addEventListener('click', async () => {
  const id = searchInput.value.trim();

  if (!id) {
    searchResult.innerText = "Digite um ID válido!";
    return;
  }

  const product = await fetchProductById(id);

  if (!product) {
    searchResult.innerText = "Produto não encontrado.";
    return;
  }

  searchResult.innerText = 
    `ID: ${product.id} | ${product.name} — ${product.description} — R$${product.price}`;
});


// add
async function addProduct(name, description, price) {
  await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });
}

// update
async function updateProduct(id, name, description, price) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });
}

// delete
async function deleteProduct(id) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: 'DELETE'
  });
}

async function fetchProductById(id) {
  const response = await fetch(`http://localhost:3000/products/${id}`);
  
  if (!response.ok) {
    return null; 
  }
  return response.json();
}


// voltar o form ao modo "Add"
function resetForm() {
  editing = false;

  productId.value = "";
  productForm.reset();
  formTitle.innerText = "Add Product";
  submitBtn.innerText = "Add";
}



fetchProducts();
