// Definición de una base de datos de productos y sus métodos
const db = {
    methods: {
      // Método para encontrar un elemento por su id
      find: (id) => {
        return db.items.find((item) => item.id === id);
      },
      // Método para actualizar el inventario al remover items del carrito
      remove: (items) => {
        // Recorre la lista de items a remover
        items.forEach((item) => {
          // Encuentra el producto correspondiente en la base de datos
          const product = db.methods.find(item.id);
          // Reduce la cantidad de inventario del producto en la cantidad del item removido
          product.qty = product.qty - item.qty;
        });
  
        // Muestra la base de datos actualizada en la consola
        console.log(db);
      },
    },
    // Lista de productos en la base de datos
    items: [
      {
        id: 0,
        title: "Funko Pop",
        price: 250,
        qty: 5,
      },
      {
        id: 1,
        title: "Harry Potter DVD",
        price: 345,
        qty: 50,
      },
      {
        id: 2,
        title: "Phillips Hue",
        price: 1300,
        qty: 80,
      },
    ],
  };
  
  // Objeto que representa el carrito de compras
  const shoppingCart = {
    // Lista de items en el carrito
    items: [],
    methods: {
      // Método para agregar elementos al carrito
      add: (id, qty) => {
        // Obtiene el item del carrito si ya está presente
        const cartItem = shoppingCart.methods.get(id);
        if (cartItem) {
          // Verifica si hay suficiente inventario para agregar la cantidad especificada
          if (shoppingCart.methods.hasInventory(id, qty + cartItem.qty)) {
            // Incrementa la cantidad en el carrito
            cartItem.qty++;
          } else {
            // Muestra una alerta si no hay suficiente inventario
            alert("No hay más inventario");
          }
        } else {
          // Agrega el item al carrito si no está presente
          shoppingCart.items.push({ id, qty });
        }
      },
      // Método para remover elementos del carrito
      remove: (id, qty) => {
        // Obtiene el item del carrito
        const cartItem = shoppingCart.methods.get(id);
  
        // Verifica si la cantidad es mayor que 1 para decrementarla, sino, remueve el item del carrito
        if (cartItem.qty - 1 > 0) {
          cartItem.qty--;
        } else {
          // Filtra la lista de items para remover el item con el id especificado
          shoppingCart.items = shoppingCart.items.filter(
            (item) => item.id !== id
          );
        }
      },
      // Método para contar la cantidad total de items en el carrito
      count: () => {
        // Reduce la lista de items en el carrito para obtener la cantidad total
        return shoppingCart.items.reduce((acc, item) => acc + item.qyt, 0);
      },
      // Método para obtener un item específico del carrito
      get: (id) => {
        // Encuentra el índice del item en la lista del carrito
        const index = shoppingCart.items.findIndex((item) => item.id === id);
        // Retorna el item si se encuentra en el carrito, de lo contrario, retorna null
        return index >= 0 ? shoppingCart.items[index] : null;
      },
      // Método para calcular el total de la compra
      getTotal: () => {
        let total = 0;
        // Calcula el total multiplicando el precio de cada item por su cantidad en el carrito
        shoppingCart.items.forEach((item) => {
          const found = db.methods.find(item.id);
          total += found.price * item.qty;
        });
        return total;
      },
      // Método para verificar si hay suficiente inventario para agregar al carrito
      hasInventory: (id, qty) => {
        // Encuentra el item en la base de datos y verifica si la cantidad en el inventario es suficiente
        return db.items.find((item) => item.id === id).qty - qty >= 0;
      },
      // Método para realizar la compra y actualizar el inventario
      purchase: () => {
        // Llama al método "remove" de la base de datos para actualizar el inventario
        db.methods.remove(shoppingCart.items);
      },
    },
  };
  
  // Renderiza la tienda
  renderStore();
  
  // Función para renderizar la tienda
  function renderStore() {
    // Genera elementos HTML para cada producto en la base de datos
    const html = db.items.map((item) => {
      return `
          <div class="item">
              <div class="title">${item.title}</div>
              <div class="price">${numberToCurrency(item.price)}</div>
              <div class="qty">${item.qty} units</div>
              <div class="actions"><button class="add" data-id="${
                item.id
              }">Add to the shopping cart</button></div>
          </div>`;
    });
  
    // Agrega los elementos HTML generados al contenedor de la tienda
    document.querySelector("#store-container").innerHTML = html.join("");
  
    // Agrega un evento de clic a los botones de agregar al carrito
    document.querySelectorAll(".item .actions .add").forEach((button) => {
      button.addEventListener("click", (e) => {
        // Obtiene el id del producto a partir del atributo data-id del botón
        const id = parseInt(button.getAttribute("data-id"));
        // Encuentra el producto en la base de datos
        const item = db.methods.find(id);
  
        // Verifica si hay inventario suficiente y agrega al carrito
        if (item && item.qty - 1 > 0) {
          shoppingCart.methods.add(id, 1);
          console.log(db, shoppingCart);
          renderShoppingCart();
        } else {
          // Muestra una alerta si no hay suficiente inventario
          alert("Ya no hay existencia de ese artículo");
        }
      });
    });
  }
  
  // Función para renderizar el carrito de compras
  function renderShoppingCart() {
    // Genera elementos HTML para cada item en el carrito de compras
    const html = shoppingCart.items.map((item) => {
      const dbItem = db.methods.find(item.id);
      return `
              <div class="item">
                  <div class="title">${dbItem.title}</div>
                  <div class="price">${numberToCurrency(dbItem.price)}</div>
                  <div class="qty">${item.qty} units</div>
                  <div class="subtotal">Subtotal: ${numberToCurrency(
                    item.qty * dbItem.price
                  )}</div>
                  <div class="actions">
                      <button class="addOne" data-id="${dbItem.id}">+</button>
                      <button class="removeOne" data-id="${dbItem.id}">-</button>
                  </div>
              </div>
          `;
    });
    // Genera el contenido para el cierre del carrito y el botón de compra
    const closeButton = `
    <div class="cart-header">
      <button id="bClose">Close</button>
    </div>`;
    const purchaseButton =
      shoppingCart.items.length > 0
        ? `<div class="cart-actions">
      <button id="bPurchase">Terminar compra</button>
    </div>`
        : "";
    const total = shoppingCart.methods.getTotal();
    const totalDiv = `<div class="total">Total: ${numberToCurrency(total)}</div>`;
  
    // Agrega los elementos HTML generados al contenedor del carrito de compras
    document.querySelector("#shopping-cart-container").innerHTML =
      closeButton + html.join("") + totalDiv + purchaseButton;
  
    // Muestra el contenedor del carrito y oculta el botón de compra
    document.querySelector("#shopping-cart-container").classList.remove("hide");
    document.querySelector("#shopping-cart-container").classList.add("show");
  
    // Agrega eventos a los botones de agregar y remover items del carrito
    document.querySelectorAll(".addOne").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        shoppingCart.methods.add(id, 1);
        renderShoppingCart();
      });
    });
  
    document.querySelectorAll(".removeOne").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        shoppingCart.methods.remove(id, 1);
        renderShoppingCart();
      });
    });
  
    // Agrega evento para cerrar el carrito de compras
    document.querySelector("#bClose").addEventListener("click", (e) => {
      document.querySelector("#shopping-cart-container").classList.remove("show");
      document.querySelector("#shopping-cart-container").classList.add("hide");
    });
  
    // Agrega evento para realizar la compra
    const bPurchase = document.querySelector("#bPurchase");
    if (bPurchase) {
      bPurchase.addEventListener("click", (e) => {
        shoppingCart.methods.purchase();
      });
    }
  }
  
  // Función para convertir un número en formato de moneda
  function numberToCurrency(n) {
    return new Intl.NumberFormat("en-US", {
      maximumSignificantDigits: 2,
      style: "currency",
      currency: "USD",
    }).format(n);
  }
  