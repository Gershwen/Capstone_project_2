//SELECT ELEMENTS
const rowOne = document.querySelector(".rowOne");
const cartItemsEl = document.querySelector(".cart-items");
const subtotalEl = document.querySelector(".subtotal");
const totalItemsInCartEl = document.querySelector(".total-items-in-cart");
const couponCode = document.getElementById("coupon");
const discountEl = document.getElementById("discount");
const discountedTotalEl = document.getElementById("discountedTotal");
const vatEl = document.getElementById("vat");
const totalEl = document.getElementById("total");
const deliveryFee = document.getElementById("delivery");
const finalTotalEl = document.getElementById("finalTotal");

//RENDER PRODUCTS
function renderProducts() {
  if (rowOne) {
    products.forEach((product) => {
      rowOne.innerHTML += `<td class="col-md-4 shadow p-3 mb-5 bg-white rounded-top">
        <img class="wine-img img-fluid img-thumbnail rounded-circle"
            src="${product.imgSrc}"
            alt="${product.name}">
        <h2 id="spier" class="name">${product.name}</h2>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                data-bs-toggle="dropdown" aria-expanded="false">
                More info
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                    <p>Description: "${product.description}"</p>
                </li>
                <li>
                    <h3 id="spierP" class="price">${product.price}</h3>
                </li>
            </ul>
        </div>
        <button class="btn btn-warning" onclick="addToCart(${product.id})">Add to cart</button>
        </td>`;
    });
  }
}

renderProducts();

// CART ARRAY
let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

//ADD TO CART
function addToCart(id) {
  //checking of product already exists
  if (cart.some((item) => item.id === id)) {
    changeNumberOfUnits("plus", id);

    //total price needs to alert the user everytime add to cart is clicked
  } else {
    const item = products.find((product) => product.id === id);
    cart.push({
      ...item,
      numberOfUnits: 1,
    });
  }

  updateCart();
}

//update cart
function updateCart() {
  renderCartItems();
  renderSubTotal();

  //save cart to local storage
  localStorage.setItem("CART", JSON.stringify(cart));
}

//calculate and render subtotal

function renderSubTotal() {
  if (subtotalEl) {
    //CHECKING IF THE SUBTOTAL ELEMENT IS PRESENT

    let totalPrice;

    let totalItems = 0;

    if (totalItems > 0) {
      totalPrice = JSON.parse(localStorage.getItem("TOTALPRICE")); //GETS TOTALS FROM DELIVERY AND DISCOUNT FUNCTION
    } else {
      totalPrice = 0;
    }

    cart.forEach((item) => {
      totalPrice += item.price * item.numberOfUnits;
      totalItems += item.numberOfUnits;
    });

    subtotalEl.innerHTML = `Subtotal (${totalItems} items): R${totalPrice.toFixed(
      2
    )}`;

    localStorage.setItem("TOTALPRICE", totalPrice); //STORING total price INSIDE LOCALSTORAGE

    totalItemsInCartEl.innerHTML = totalItems;

    alert("Your current total is R " + totalPrice.toFixed(2)); //ALERT USER THE TOTAL PRICE EACH TIME A PRODUCT IS ADDED
  }
}

//ADD DISCOUNT COUPON

function addDiscountCoupon() {
  let totalPrice = JSON.parse(localStorage.getItem("TOTALPRICE"));

  let discount = (totalPrice * 10) / 100; //10% discount;

  discountEl.innerHTML = `Discount: R${discount.toFixed(2)}`;

  discount = totalPrice - discount;

  discountedTotalEl.innerHTML = `Discounted Total: R${discount.toFixed(2)}`;

  let coupon = 123456;

  if (Number(couponCode.value) === coupon) {
    totalPrice = discount;
  } else {
    alert("Coupon code was incorrect!. Please try again");
  }

  let plusValueAddedtax = discount * 0.15; //CALCULATING VALUE ADDED TAX OF 15%;

  vatEl.innerHTML = `VAT: R${plusValueAddedtax.toFixed(2)}`; //DISPLAY VAT IN SHOPPING CART

  totalPrice = discount + plusValueAddedtax; //ADD VAT TO TOTAL PRICE

  totalEl.innerHTML = `Total: R${totalPrice.toFixed(2)}`;

  localStorage.setItem("TOTALPRICE", totalPrice); //ADDING TOTAL OF PREVIOUS TOTAL MINUS DISCOUNT
}

//SELECTION DELIVERY OPTION

function handleChange(selection) {
  let deliveryOpt;

  if (selection == "express") {
    deliveryOpt = 100;
  } else if (selection == "normal") {
    deliveryOpt = 50;
  } else {
    deliveryOpt = 0;
  }

  deliveryFee.innerHTML = `Delivery fee: R${deliveryOpt}`; //DISPLAYS DELIVERY FEE IN SHOPPING CART

  let totalPrice = JSON.parse(localStorage.getItem("TOTALPRICE")); //GETTING ADJUST TOTAL WHICH INCLUDES VAT AND DISCOUNT

  totalPrice = totalPrice + deliveryOpt;

  finalTotalEl.innerHTML = `Total due including delivery: R${totalPrice.toFixed(
    2
  )}`; //DISPLAYING FINAL TOTAL WHICH INCLUDES THE DISCOUNT, VAT AND DELIVERY COSTS

  localStorage.setItem("TOTALPRICE", totalPrice); //STORES THE FINAL TOTAL IN TOTALPRICE
}

// confirm order function

function confirmOrder() {
  let referenceNum = Math.random() * 1000;

  alert(
    "Your order was successful!. Your reference number is " + referenceNum + "."
  );

  totalPrice = 0; //CLEARS TOTAL PRICE ON ORDER CONFIRMATION

  localStorage.setItem("TOTALPRICE", totalPrice);
}

$(".gotocart").hide();
//render cart items
function renderCartItems() {
  if (cartItemsEl) {
    cartItemsEl.innerHTML = ""; //clear cart element

    cart.forEach((item) => {
      cartItemsEl.innerHTML += `
        <div class="cart-item">
        <div class="item-info" onclick="removeItemFromCart(${item.id})">
            <img style="width:200px; height:auto" src="${item.imgSrc}" alt="${item.name}">
            <h4>${item.name}</h4>
        </div>
        <div class="unit-price">
            <small>R</small>${item.price}
        </div>
        <div class="units">
            <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})">-</div>
            <div class="number">${item.numberOfUnits}</div>
            <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})">+</div>           
        </div>
    </div>
        `;
    });
  }
  $(".gotocart").show(); //SHOWS GO TO CART BUTTON WHEN ITEM IN CART
}

//remove item from cart
function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  updateCart();
}

//change number of units for an item
function changeNumberOfUnits(action, id) {
  cart = cart.map((item) => {
    let numberOfUnits = item.numberOfUnits;

    if (item.id === id) {
      if (action === "minus" && numberOfUnits > 1) {
        numberOfUnits--;
      } else if (action === "plus" && numberOfUnits < item.instock) {
        numberOfUnits++;
      }
    }

    return {
      ...item,
      numberOfUnits: numberOfUnits,
    };
  });

  updateCart();
}

// ■ Animation effects.
$("img").hover(function slideAround() {
  $("img")
    .animate({ right: "50px" }, 1000)
    .animate({ left: "100px" }, 1000)
    .animate({ right: "50px" }, 1000);
  setInterval(slideAround, 2000);
});
