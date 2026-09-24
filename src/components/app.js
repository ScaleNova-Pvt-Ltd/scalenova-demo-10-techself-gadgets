/**
 * TechSelf Gadgets — Cart & Interactive Logic
 */

let cart = JSON.parse(localStorage.getItem('techself_cart') || '[]');

function showToast(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  if (badge) badge.textContent = count;

  const itemsContainer = document.getElementById('drawer-items');
  const totalElem = document.getElementById('drawer-total-price');

  if (itemsContainer) {
    if (cart.length === 0) {
      itemsContainer.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:40px 0;">Cart is empty. Check flash deals above!</p>';
      if (totalElem) totalElem.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    itemsContainer.innerHTML = cart.map((item, idx) => {
      subtotal += item.price * item.qty;
      return `
        <div style="display:flex;gap:14px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--border-subtle);align-items:center;">
          <img src="${item.img}" style="width:60px;height:60px;border-radius:6px;object-fit:cover;" alt="${item.title}">
          <div style="flex-grow:1;">
            <div style="font-weight:700;font-size:0.92rem;">${item.title}</div>
            <div style="color:var(--color-cyan);font-weight:800;font-size:0.95rem;">$${item.price} × ${item.qty}</div>
          </div>
          <button onclick="removeFromCart(${idx})" style="background:none;border:none;color:var(--text-light);cursor:pointer;font-size:1.3rem;">&times;</button>
        </div>
      `;
    }).join('');

    if (totalElem) totalElem.textContent = '$' + subtotal.toFixed(2);
  }

  localStorage.setItem('techself_cart', JSON.stringify(cart));
}

function addToCart(title, price, img) {
  const existing = cart.find(i => i.title === title);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ title, price: parseFloat(price), img, qty: 1 });
  }
  updateCartUI();
  showToast(`Added "${title}" to your cart.`);
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCartUI();
}

function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer && overlay) {
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
  }
}

async function handleCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty.');
    return;
  }
  location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});
