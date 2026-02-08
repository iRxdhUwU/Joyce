const produtos = [
    { id: 1, nome: "Choconinho", preco: 12.00, img: "https://images.unsplash.com/photo-1570696516188-ade861b84a49?q=80&w=400" },
    { id: 2, nome: "Brigadeiro", preco: 12.00, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400" },
    { id: 3, nome: "Leite Ninho", preco: 12.00, img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400" },
    { id: 4, nome: "Brigadeiro com Maracujá", preco: 12.00, img: "https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?q=80&w=400" },
    { id: 5, nome: "Ninho com Prestígio", preco: 12.00, img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=400" },
    { id: 6, nome: "Ninho com Maracujá", preco: 12.00, img: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?q=80&w=400" },
    { id: 7, nome: "Prestígio", preco: 12.00, img: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=400" },
    { id: 8, nome: "Maracujá", preco: 12.00, img: "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?q=80&w=400" },
    { id: 9, nome: "Prestígio e Brigadeiro", preco: 12.00, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400" },
    { id: 10, nome: "Surpresa de Uva", preco: 15.00, img: "https://images.unsplash.com/photo-1541336032412-2048a678540d?q=80&w=400" }
];

let cart = [];

function renderProdutos() {
    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = produtos.map(p => `
        <div class="bg-white p-4 rounded-[2rem] flex items-center gap-4 shadow-sm border border-pink-50">
            <img src="${p.img}" class="w-20 h-20 object-cover rounded-2xl">
            <div class="flex-1">
                <h3 class="font-bold text-gray-800 text-sm">${p.nome}</h3>
                <p class="text-pink-500 font-bold">R$ ${p.preco.toFixed(2)}</p>
            </div>
            <button onclick="addToCart(${p.id})" class="bg-pink-500 text-white w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    `).join('');
}

function addToCart(id) {
    const itemInCart = cart.find(i => i.id === id);
    itemInCart ? itemInCart.qtd++ : cart.push({ ...produtos.find(p => p.id === id), qtd: 1 });
    renderCart();
    validarForm();
}

function updateQtd(id, delta) {
    const item = cart.find(i => i.id === id);
    item.qtd += delta;
    if (item.qtd <= 0) cart = cart.filter(i => i.id !== id);
    renderCart();
    validarForm();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const frete = parseFloat(document.getElementById('select-bairro').value) || 0;
    
    container.innerHTML = cart.length === 0 ? '<div class="text-center py-20 text-gray-300 italic">Sua sacola está vazia...</div>' : 
    cart.map(item => `
        <div class="cart-item-container">
            <img src="${item.img}" class="cart-item-img">
            <div class="cart-item-info">
                <p class="cart-item-nome">${item.nome}</p>
                <p class="cart-item-preco">R$ ${item.preco.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQtd(${item.id}, -1)" class="cart-btn-minus">-</button>
                <span class="font-bold text-sm mx-2">${item.qtd}</span>
                <button onclick="updateQtd(${item.id}, 1)" class="cart-btn-plus">+</button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((acc, i) => acc + (i.preco * i.qtd), 0);
    document.getElementById('cart-count').innerText = cart.reduce((acc, i) => acc + i.qtd, 0);
    document.getElementById('cart-count').classList.toggle('hidden', cart.length === 0);
    document.getElementById('total-valor').innerText = `R$ ${(subtotal + frete).toFixed(2)}`;
}

function validarForm() {
    const nome = document.getElementById('nome-cliente').value.trim();
    const rua = document.getElementById('rua-numero').value.trim();
    const bairro = document.getElementById('select-bairro').value;
    const btn = document.getElementById('btn-enviar');
    const pronto = nome.length >= 3 && rua.length >= 5 && bairro !== "0" && cart.length > 0;
    btn.disabled = !pronto;
    btn.classList.toggle('btn-ativo', pronto);
}

function toggleCart() { document.getElementById('cart-drawer').classList.toggle('hidden'); }

function enviarPedido() {
    const nome = document.getElementById('nome-cliente').value;
    const rua = document.getElementById('rua-numero').value;
    const ref = document.getElementById('referencia').value || "Não informado"; // Corrigido
    const bairro = document.getElementById('select-bairro').options[document.getElementById('select-bairro').selectedIndex].text;

    let texto = "*ENCANTOS DA JOYCE - NOVO PEDIDO*\n\n";
    texto += "● *Cliente:* " + nome + "\n";
    texto += "● *Endereco:* " + rua + "\n";
    texto += "● *Bairro:* " + bairro + "\n";
    texto += "● *Referencia:* " + ref + "\n\n"; // Agora aparece no WhatsApp
    texto += "● *ITENS DO PEDIDO:* \n";
    
    cart.forEach(item => {
        texto += "  ○ " + item.qtd + "x " + item.nome + " - R$ " + (item.preco * item.qtd).toFixed(2) + "\n";
    });
    
    texto += "\n● *VALOR TOTAL:* " + document.getElementById('total-valor').innerText + "\n\n";
    texto += "----------------------------------\n";
    texto += "Pedido enviado via Cardapio Digital";

    const numeroWhats = "5566999729221";
    window.open(`https://wa.me/${numeroWhats}?text=${encodeURIComponent(texto)}`, '_blank');
}

renderProdutos();