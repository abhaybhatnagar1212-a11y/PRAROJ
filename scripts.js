/* Simple cart using localStorage
   Each product: {id, title, price, image, qty}
*/

const CART_KEY = 'praroj_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }

function updateCartCount(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const badge = document.getElementById('cartCount');
  if(badge) badge.textContent = count;
}

// Add item to cart
function addToCart(id, title, price, image){
  const cart = getCart();
  const found = cart.find(i=>i.id==id);
  if(found){ found.qty += 1; }
  else { cart.push({id, title, price: Number(price), image, qty:1}); }
  saveCart(cart);
  alert(title + ' added to cart');
}

// Render products (used on Products page)
function renderProducts(productList, containerId){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  productList.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <div class="card-body">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <div class="price">$${p.price.toLocaleString()}</div>
        <div class="card-actions">
          <button class="btn" onclick="addToCart('${p.id}','${p.title}','${p.price}','${p.image}')">Add to Cart</button>
          <a class="btn secondary" href="product.html?id=${p.id}">Details</a>
        </div>
      </div>`;
    container.appendChild(div);
  });
}

// Use this list for demo products (you can replace images)
const demoProducts = [
  {id:'p1', title:'PRAROJ Chronograph', price:2499, image:'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3', desc:'Automatic watch with sapphire crystal & 24K accents.'},
  {id:'p2', title:'PRAROGEN Pen', price:899, image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3', desc:'Handcrafted fountain pen with gold nib.'},
  {id:'p3', title:'PRAROVUE Sunglasses', price:450, image:'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3', desc:'24K gold frame polarized lenses.'},
  {id:'p4', title:'PRAROWALLET', price:350, image:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3', desc:'Genuine leather wallet with gold emblem.'}
];

// If page has a container with id 'productsHere' render demoProducts
document.addEventListener('DOMContentLoaded',()=>{
  updateCartCount();
  if(document.getElementById('productsHere')){
    renderProducts(demoProducts, 'productsHere');
  }

  // If product details page (product.html?id=...)
  if(window.location.pathname.endsWith('product.html')){
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const p = demoProducts.find(x=>x.id===id) || demoProducts[0];
    const el = document.getElementById('productDetail');
    if(el){
      el.innerHTML = `
        <div class="product-detail">
          <img src="${p.image}" alt="${p.title}">
          <div>
            <h2 style="color:var(--gold)">${p.title}</h2>
            <p style="color:var(--muted)">${p.desc}</p>
            <div style="font-size:22px;color:var(--gold);margin:12px 0">$${p.price}</div>
            <div style="display:flex;gap:12px">
              <button class="btn" onclick="addToCart('${p.id}','${p.title}','${p.price}','${p.image}')">Add to Cart</button>
              <a class="btn secondary" href="index.html">Back to Shop</a>
            </div>
          </div>
        </div>
      `;
    }
  }

  // If cart page
  if(window.location.pathname.endsWith('cart.html')){
    const cart = getCart();
    const table = document.getElementById('cartTableBody');
    const totalEl = document.getElementById('cartTotal');
    if(table){
      table.innerHTML = '';
      let total = 0;
      cart.forEach(item=>{
        total += item.qty * item.price;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="width:80px"><img src="${item.image}" style="width:70px;height:50px;object-fit:cover;border-radius:6px"></td>
          <td>${item.title}</td>
          <td>$${item.price}</td>
          <td><input class="qty" type="number" min="1" value="${item.qty}" onchange="changeQty('${item.id}',this.value)"></td>
          <td><button class="btn secondary" onclick="removeItem('${item.id}')">Remove</button></td>
        `;
        table.appendChild(tr);
      });
      if(totalEl) totalEl.textContent = '$' + total.toFixed(2);
    }
  }
});

// change qty
function changeQty(id, val){
  const cart = getCart();
  const found = cart.find(i=>i.id===id);
  if(found){ found.qty = Math.max(1, Number(val)); saveCart(cart); }
  // re-render cart page
  if(window.location.pathname.endsWith('cart.html')) location.reload();
}

// remove
function removeItem(id){
  let cart = getCart();
  cart = cart.filter(i=>i.id!==id);
  saveCart(cart);
  if(window.location.pathname.endsWith('cart.html')) location.reload();
}

// clear cart (used on checkout simulation)
function clearCart(){ localStorage.removeItem(CART_KEY); updateCartCount(); }
