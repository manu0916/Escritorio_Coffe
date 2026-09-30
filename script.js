const products = [
  { name: 'Croissant de parma', image: 'croissant-parma.jpg', price: 28 },
  { name: 'Bolo de milho', image: 'bolo-de-milho.jpg', price: 12 },
  { name: 'Pão de mel', image: 'pao-de-mel.jpg', price: 12 },
  { name: 'Camarão da casa', image: 'camarao-grelhado.jpg', price: 44 },
  { name: 'Banoffee', image: 'banoffee.jpg', price: 18 },
  { name: 'Camarão na moranga', image: 'camarao-na-moranga.jpg', price: 52 },
  { name: 'PF de camarão na moranga', image: 'pf-camarao.jpg', price: 42 },
  { name: 'Empada de camarão', image: 'empada-camarao.jpg', price: 13 },
  { name: 'Mil-folhas', image: 'mil-folhas.jpg', price: 20 },
  { name: 'Merengue de limão', image: 'merengue-limao.jpg', price: 18 },
  { name: 'Torta de merengue com morango', image: 'torta-morango.jpg', price: 18 },
  { name: 'Merengue de maracujá', image: 'merengue-maracuja.jpg', price: 95 },
];

const cart = new Map();
const body = document.body;
const drawer = document.querySelector('[data-cart-drawer]');
const cartItems = document.querySelector('[data-cart-items]');
const cartCount = document.querySelector('[data-cart-count]');
const checkoutButton = document.querySelector('[data-checkout]');
const checkoutLayer = document.querySelector('[data-checkout-layer]');
const checkoutForm = document.querySelector('[data-checkout-form]');
const checkoutFormView = document.querySelector('[data-checkout-form-view]');
const checkoutSuccess = document.querySelector('[data-checkout-success]');
const toast = document.querySelector('[data-toast]');
let toastTimer;
let previousFocus;

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function showToast(message = 'Adicionado ao seu pedido') {
  toast.firstChild.textContent = `${message} `;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2300);
}

function updateQuantity(name, delta) {
  const item = cart.get(name);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) cart.delete(name);
  else cart.set(name, item);
  renderCart();
}

function renderCart() {
  const items = [...cart.values()];
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = quantity;
  cartCount.setAttribute('aria-label', `${quantity} ${quantity === 1 ? 'item' : 'itens'} no pedido`);
  document.querySelector('[data-cart-total]').textContent = formatPrice(subtotal);
  document.querySelector('[data-checkout-total]').textContent = formatPrice(subtotal);
  checkoutButton.disabled = quantity === 0;

  if (quantity === 0) {
    cartItems.innerHTML = '<div class="cart-empty"><span class="empty-star">✳</span><p>Sua sacola está à espera<br />de uma boa escolha.</p><button type="button" class="text-link text-link-dark" data-close-cart>Ver o cardápio <span>↘</span></button></div>';
    return;
  }

  cartItems.replaceChildren();
  for (const item of items) {
    const row = document.createElement('div');
    row.className = 'cart-row';
    const img = document.createElement('img');
    img.className = 'cart-row-image';
    img.src = `assets/images/${item.image}`;
    img.alt = '';
    const detail = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = item.name;
    const unitPrice = document.createElement('small');
    unitPrice.textContent = `${formatPrice(item.price)} cada`;
    const controls = document.createElement('div');
    controls.className = 'quantity-control';
    const decrease = document.createElement('button');
    decrease.type = 'button';
    decrease.textContent = '−';
    decrease.setAttribute('aria-label', `Diminuir ${item.name}`);
    decrease.addEventListener('click', () => updateQuantity(item.name, -1));
    const quantityLabel = document.createElement('span');
    quantityLabel.textContent = item.quantity;
    const increase = document.createElement('button');
    increase.type = 'button';
    increase.textContent = '+';
    increase.setAttribute('aria-label', `Adicionar mais ${item.name}`);
    increase.addEventListener('click', () => updateQuantity(item.name, 1));
    controls.append(decrease, quantityLabel, increase);
    detail.append(title, unitPrice, controls);
    const lineTotal = document.createElement('strong');
    lineTotal.className = 'cart-line-total';
    lineTotal.textContent = formatPrice(item.price * item.quantity);
    row.append(img, detail, lineTotal);
    cartItems.append(row);
  }
}

function addProduct(name) {
  const product = products.find((item) => item.name === name);
  if (!product) return;
  const current = cart.get(name);
  cart.set(name, { ...product, quantity: (current?.quantity ?? 0) + 1 });
  renderCart();
  showToast();
}

function openCart() {
  previousFocus = document.activeElement;
  body.classList.add('cart-open');
  drawer.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => drawer.querySelector('.cart-close').focus(), 80);
}

function closeCart() {
  body.classList.remove('cart-open');
  drawer.setAttribute('aria-hidden', 'true');
  previousFocus?.focus?.();
}

function openCheckout() {
  if (cart.size === 0) return;
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('aria-modal', 'false');
  checkoutLayer.classList.add('is-open');
  checkoutLayer.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => checkoutForm.querySelector('input').focus(), 100);
}

function closeCheckout() {
  checkoutLayer.classList.remove('is-open');
  checkoutLayer.setAttribute('aria-hidden', 'true');
  if (body.classList.contains('cart-open')) {
    drawer.setAttribute('aria-hidden', 'false');
    drawer.setAttribute('aria-modal', 'true');
  }
}

document.querySelectorAll('[data-add]').forEach((button) => {
  button.addEventListener('click', () => addProduct(button.dataset.add));
});

document.querySelectorAll('[data-open-cart]').forEach((button) => button.addEventListener('click', openCart));
document.querySelectorAll('[data-close-cart]').forEach((button) => button.addEventListener('click', closeCart));
cartItems.addEventListener('click', (event) => {
  if (event.target.closest('[data-close-cart]')) closeCart();
});
document.querySelectorAll('[data-close-checkout]').forEach((button) => button.addEventListener('click', closeCheckout));
checkoutButton.addEventListener('click', openCheckout);

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!checkoutForm.reportValidity()) return;
  const formData = new FormData(checkoutForm);
  const name = String(formData.get('name')).trim();
  const fulfillment = String(formData.get('fulfillment'));
  const payment = String(formData.get('payment'));
  const orderList = [...cart.values()].map((item) => `${item.quantity}× ${item.name}`).join(' · ');
  const subtotal = [...cart.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector('[data-success-copy]').textContent = `Obrigada, ${name}. Esta é uma confirmação demonstrativa; nenhum pedido ou dado foi enviado.`;
  document.querySelector('[data-success-order]').textContent = `${orderList} · ${formatPrice(subtotal)} · ${fulfillment} · ${payment}`;
  checkoutFormView.hidden = true;
  checkoutSuccess.hidden = false;
  checkoutSuccess.querySelector('[data-finish-checkout]').focus();
});

document.querySelector('[data-finish-checkout]').addEventListener('click', () => {
  cart.clear();
  renderCart();
  checkoutForm.reset();
  checkoutSuccess.hidden = true;
  checkoutFormView.hidden = false;
  closeCheckout();
  closeCart();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && checkoutLayer.classList.contains('is-open')) closeCheckout();
  else if (event.key === 'Escape' && body.classList.contains('cart-open')) closeCart();
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((filterButton) => {
      const active = filterButton === button;
      filterButton.classList.toggle('is-active', active);
      filterButton.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('.product-card').forEach((card) => {
      card.classList.toggle('is-hidden', filter !== 'todos' && card.dataset.category !== filter);
    });
  });
});

const menuToggle = document.querySelector('.mobile-menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  primaryNav.classList.toggle('is-open', open);
});
primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  primaryNav.classList.remove('is-open');
}));

document.querySelector('[data-year]').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

renderCart();

if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
  const watchedFiles = ['index.html', 'styles.css', 'script.js'];
  const readModifiedTimes = async () => {
    const times = await Promise.all(watchedFiles.map(async (file) => {
      try {
        const response = await fetch(`${file}?preview=${Date.now()}`, { method: 'HEAD', cache: 'no-store' });
        return response.headers.get('last-modified') ?? '';
      } catch {
        return '';
      }
    }));
    return times.join('|');
  };
  let previewVersion;
  readModifiedTimes().then((version) => { previewVersion = version; });
  window.setInterval(async () => {
    const nextVersion = await readModifiedTimes();
    if (previewVersion && nextVersion && nextVersion !== previewVersion) window.location.reload();
  }, 1400);
}
