const chat = document.getElementById('chat-wrapper');
const inputField = document.getElementById('user-input');
const btnSend = document.getElementById('send-trigger');
const actionArea = document.getElementById('action-area');

const profissionalPadrao = { nome: "Gabriel Reis", foto: "https://i.postimg.cc/4yryvXQK/gabriel.jpg" };
let agendamento = { nome: '', servico: '', profissional: profissionalPadrao, data: null, hora: '' };
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function scrollToBottom() {
    chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
}

async function botSay(msgHtml) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'bot-msg';
    msgDiv.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
    chat.appendChild(msgDiv);
    scrollToBottom();
    await new Promise(r => setTimeout(r, 1200)); 
    msgDiv.innerHTML = msgHtml; 
    scrollToBottom();
}

function userSay(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'user-msg';
    msgDiv.innerText = text;
    chat.appendChild(msgDiv);
    scrollToBottom();
}

(async () => {
    await botSay("Bem-vindo à <b>Barbearia Efraim</b>. 💈");
    await botSay("Para iniciar seu agendamento, qual o seu <b>nome completo</b>?");
})();

const handleSend = () => {
    const nome = inputField.value.trim();
    if(nome.length > 2) {
        agendamento.nome = nome;
        userSay(nome);
        inputField.value = "";
        actionArea.style.display = 'none'; 
        fluxoServicos();
    }
};

btnSend.onclick = handleSend;
inputField.onkeypress = (e) => { if(e.key === 'Enter') handleSend(); };

async function fluxoServicos() {
    await botSay(`Prazer em conhecer você, ${agendamento.nome.split(' ')[0]}! Selecione o serviço:`);
    const servicos = [
        { nome: 'Corte Degrade', preco: 'R$ 35', tempo: '40min', img: '1.jpg' },
        { nome: 'Corte Social', preco: 'R$ 35', tempo: '30min', img: '2.jpg' },
        { nome: 'Navalhado', preco: 'R$ 25', tempo: '30min', img: '3.jpg' },
        { nome: 'Sobrancelha', preco: 'R$ 15', tempo: '10min', img: '4.jpg' },
        { nome: 'Barba', preco: 'R$ 20', tempo: '15min', img: '1.jpg' }
    ];

    servicos.forEach(s => {
        const item = document.createElement('div');
        item.className = 'option-item';
        item.innerHTML = `
            <img src="${s.img}" class="service-thumb">
            <div class="service-info-wrapper">
                <span class="service-name">${s.nome}</span>
                <span class="service-time">${s.tempo}</span>
                <b class="service-price">${s.preco}</b>
            </div>`;
        item.onclick = () => {
            agendamento.servico = s.nome;
            userSay(s.nome);
            chat.querySelectorAll('.option-item').forEach(el => el.remove());
            fluxoCalendario();
        };
        chat.appendChild(item);
    });
}

async function fluxoCalendario() {
    await botSay("Excelente! Agora, selecione a <b>data</b> no calendário:");
    const box = document.createElement('div');
    box.className = 'calendar-box';
    chat.appendChild(box);

    const render = () => {
        box.innerHTML = '';
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `<button id="prevM" class="calendar-nav-btn"><i class="fas fa-chevron-left"></i></button>
                            <h3 style="text-transform:capitalize">${new Date(currentYear, currentMonth).toLocaleString('pt-BR', {month:'long', year:'numeric'})}</h3>
                            <button id="nextM" class="calendar-nav-btn"><i class="fas fa-chevron-right"></i></button>`;
        box.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'days-grid';
        ['D','S','T','Q','Q','S','S'].forEach(d => grid.innerHTML += `<div class="day-label">${d}</div>`);
        
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const hoje = new Date(); hoje.setHours(0,0,0,0);

        for(let i=0; i<firstDay; i++) grid.innerHTML += `<div class="day-cell empty"></div>`;
        for(let d=1; d<=daysInMonth; d++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell';
            cell.innerText = d;
            const dataV = new Date(currentYear, currentMonth, d);
            dataV.setHours(0,0,0,0);

            if (dataV < hoje) {
                cell.style.color = '#444'; cell.style.opacity = '0.3'; cell.style.cursor = 'not-allowed';
            } else {
                cell.onclick = () => {
                    agendamento.data = dataV;
                    userSay(dataV.toLocaleDateString('pt-BR'));
                    box.remove();
                    fluxoHorarios();
                };
            }
            grid.appendChild(cell);
        }
        box.appendChild(grid);
        scrollToBottom();
        document.getElementById('prevM').onclick = () => { currentMonth--; render(); };
        document.getElementById('nextM').onclick = () => { currentMonth++; render(); };
    };
    render();
}

async function fluxoHorarios() {
    await botSay("Perfeito! Por fim, escolha o melhor <b>horário</b>:");
    const horas = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    horas.forEach(h => {
        const item = document.createElement('div');
        item.className = 'option-item';
        item.style.justifyContent = 'center';
        item.innerHTML = `<b>${h}</b>`;
        item.onclick = () => {
            agendamento.hora = h;
            userSay(h);
            chat.querySelectorAll('.option-item').forEach(el => el.remove());
            finalizar();
        };
        chat.appendChild(item);
    });
}

async function finalizar() {
    await botSay("<b>Tudo pronto!</b> O seu horário foi pré-reservado no nosso sistema.");
    await botSay("Clique no botão abaixo para confirmar pelo WhatsApp. ✂️💈");

    const card = document.createElement('div');
    card.className = 'barber-card-final';
    card.innerHTML = `
        <img src="${agendamento.profissional.foto}" style="width:75px;height:75px;border-radius:50%;border:2px solid var(--primary);margin-bottom:10px; object-fit: cover;">
        <h4 style="margin: 0;">Seu Especialista:</h4>
        <p style="margin: 5px 0 0 0; font-weight: 800; color: var(--primary);">${agendamento.profissional.nome}</p>
    `;
    chat.appendChild(card);

    const resumo = document.createElement('div');
    resumo.style.margin = "10px 0";
    resumo.innerHTML = `
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 15px; border-left: 4px solid var(--primary);">
            <p style="margin: 5px 0; font-size: 0.9rem;">📅 Data: <b>${agendamento.data.toLocaleDateString('pt-BR')}</b> às <b>${agendamento.hora}</b></p>
            <p style="margin: 5px 0; font-size: 0.9rem;">✂️ Serviço: <b>${agendamento.servico}</b></p>
        </div>
    `;
    chat.appendChild(resumo);

    const resumoZap = `*Barbearia Efraim Shop* 💈%0A%0AOlá! Gostaria de confirmar meu agendamento:%0A%0A👤 *Cliente:* ${agendamento.nome}%0A✂️ *Serviço:* ${agendamento.servico}%0A📅 *Data:* ${agendamento.data.toLocaleDateString('pt-BR')}%0A⏰ *Hora:* ${agendamento.hora}`;

    const btn = document.createElement('button');
    btn.className = 'option-item';
    btn.style.background = '#25D366'; btn.style.color = '#000'; btn.style.fontWeight = '900'; btn.style.justifyContent = 'center'; btn.style.width = '100%'; btn.style.marginTop = '15px';
    btn.innerHTML = '<i class="fab fa-whatsapp" style="margin-right:10px;"></i> CONFIRMAR NO WHATSAPP';
    btn.onclick = () => window.open(`https://api.whatsapp.com/send?phone=5566999729221&text=${resumoZap}`);
    
    chat.appendChild(btn);
    setTimeout(scrollToBottom, 300);
}