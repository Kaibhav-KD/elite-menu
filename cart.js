// ============================================
// Elite Diner — Shared Cart Logic (localStorage)
// ============================================

const CART_KEY = 'eliteDinerCart';
const WHATSAPP_NUMBER = '919548907207';

// --- Helpers ---
function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, price) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price: Number(price), qty: 1 });
    }
    saveCart(cart);
    updateCartBadge();
}

function removeFromCart(name) {
    let cart = getCart().filter(item => item.name !== name);
    saveCart(cart);
}

function changeQty(name, delta) {
    const cart = getCart();
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(name);
            return;
        }
    }
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// --- Badge ---
function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

// --- WhatsApp Order ---
function orderOnWhatsApp() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    const total = getCartTotal();
    let msg = `Hey Elite's Diner Restaurant 🍽️\nPlz Confirm My Order\n\n`;
    cart.forEach(item => {
        msg += `${item.qty} × ${item.name} : ₹${item.price * item.qty}\n`;
    });
    msg += `\n💰 Total Bill Amount : ₹${total}\n\nLet's proceed with the payment.`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
}

// Auto-update badge on page load
document.addEventListener('DOMContentLoaded', updateCartBadge);
