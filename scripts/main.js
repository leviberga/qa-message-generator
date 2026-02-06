// Pontos de revisão predefinidos
const predefinedPoints = [
    'Está faltando a TAG na Conta pai',
    'Está faltando a TAG na Conta filho',
    'A conta pai não foi criada',
    'A conta filho não foi criada',
    'A oportunidade está na conta pai',
    'Há um erro de hierarquia na conta, só deve haver uma única conta pai',
    'Está faltando o anexo do Checklist',
    'Está faltando o anexo do simulador',
    'Está faltando o anexo do DA do seller',
    'Há divergências entre as taxas do simulador e do DA do seller',
    'A solicitação para pricing está pendente',
    'O caso de risco não foi criado',
    'O CNPJ do caso de risco é diferente do CNPJ cadastrado na conta',
    'O TPV do caso de risco é diferente do TPV informado na oportunidade',
    'A análise de risco foi feita há mais de 3 meses',
    'O caso de risco está pendente da análise de PLD',
    'A análise de risco está pendente',
    'O cadastro do KYC está incompleto',
    'A plataforma do simulador diverge da plataforma da opp'
];

const pointPredefinedPoints = [
    'Está faltando o E-mail',
    'Está faltando o CNPJ',
    'Está faltando as Account Tags na conta pai',
    'Está faltando o simulador',
    'Está faltando o Cartão CNPJ',
    'Está faltando o DA da gestão',
    'Está faltando o DA do seller',
    'Está faltando o documento do administrador',
    'Está faltando o documento da empresa',
    'Há divergências entre o simulador e o DA da gestão',
    'Há divergências entre o simulador e o DA do seller',
    'O simulador possui CNPJ divergente do cartão CNPJ',
    'O simulador possui CNAE divergente do cartão CNPJ',
    'O CNPJ do caso de risco é divergente do CNPJ do simulador',
    'O TPV do caso de risco é divergente do TPV do simulador',
    'A análise de risco está expirada',
    'O caso de risco foi reprovado'   
];

let customPoints = [];
let selectedPoints = new Set();
let currentPointsArray = predefinedPoints;
let messageType = 'rejection'; // 'rejection' ou 'approval'
let selectedOnboarder = null;
let onboarderLink = null;

// Inicializar checkboxes
function initializeCheckboxes() {
    currentPointsArray = predefinedPoints;
    selectedPoints.clear();

    const grid = document.getElementById('checkboxGrid');
    
    grid.innerHTML = '';
    
    document.getElementById('btn-op').classList.add('active');
    document.getElementById('btn-point').classList.remove('active');

    predefinedPoints.forEach((point, index) => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.onclick = () => toggleCheckbox(index);
        
        div.innerHTML = `
            <input type="checkbox" id="point_${index}" onchange="togglePoint('${point.replace(/'/g, "\\'")}', this.checked)">
            <label for="point_${index}">${point}</label>
        `;
        
        grid.appendChild(div);
    });

    grid.style.display = 'grid';
    updateClearButtonVisibility();
}

function pointInitializeCheckboxes() {
    currentPointsArray = pointPredefinedPoints; 
    selectedPoints.clear();

    const grid = document.getElementById('checkboxGrid');
    
    grid.innerHTML = '';
    
    document.getElementById('btn-op').classList.remove('active');
    document.getElementById('btn-point').classList.add('active');

    pointPredefinedPoints.forEach((point, index) => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.onclick = () => toggleCheckbox(index);
        
        div.innerHTML = `
            <input type="checkbox" id="point_${index}" onchange="togglePoint('${point.replace(/'/g, "\\'")}', this.checked)">
            <label for="point_${index}">${point}</label>
        `;
        
        grid.appendChild(div);
    });

    grid.style.display = 'grid';
    updateClearButtonVisibility();
}

function toggleCheckbox(index) {
    const checkbox = document.getElementById(`point_${index}`);
    const item = checkbox.closest('.checkbox-item');
    const point = currentPointsArray[index];
    
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        selectedPoints.add(point);
        item.classList.add('checked');
    } else {
        selectedPoints.delete(point);
        item.classList.remove('checked');
    }
    setTimeout(() => updateClearButtonVisibility(), 0);
}

function togglePoint(point, checked) {
    if (checked) {
        selectedPoints.add(point);
    } else {
        selectedPoints.delete(point);
    }
    setTimeout(() => updateClearButtonVisibility(), 0);
}

function clearAllCheckboxes() {
    // Limpar todos os checkboxes predefinidos
    currentPointsArray.forEach((point, index) => {
        const checkbox = document.getElementById(`point_${index}`);
        if (checkbox) { 
            const item = checkbox.closest('.checkbox-item');
            
            if (checkbox.checked) {
                checkbox.checked = false;
                item.classList.remove('checked');
            }
        }
    });
    // Limpar todos os pontos personalizados
    customPoints = [];
    selectedPoints.clear();
    updateCustomPointsList();
    updateClearButtonVisibility();
}

function updateClearButtonVisibility() {
    const clearButton = document.getElementById('clearButton');
    if (selectedPoints.size > 0) {
        clearButton.style.display = 'block';
    } else {
        clearButton.style.display = 'none';
    }
}

function addCustomPoint() {
    const input = document.getElementById('customPoint');
    const point = input.value.trim();
    
    if (point && !customPoints.includes(point)) {
        customPoints.push(point);
        selectedPoints.add(point);
        updateCustomPointsList();
        updateClearButtonVisibility();
        input.value = '';
    }
}

function removeCustomPoint(point) {
    customPoints = customPoints.filter(p => p !== point);
    selectedPoints.delete(point);
    updateCustomPointsList();
    updateClearButtonVisibility();
}

function updateCustomPointsList() {
    const list = document.getElementById('customPointsList');
    list.innerHTML = '';
    
    customPoints.forEach(point => {
        const div = document.createElement('div');
        div.className = 'custom-point-item';
        div.innerHTML = `
            <span>${point}</span>
            <button class="remove-btn" onclick="removeCustomPoint('${point}')">×</button>
        `;
        list.appendChild(div);
    });
}

// ... (todo o código anterior permanece igual até a função setMessageType)

function setMessageType(type) {
    messageType = type;
    
    // Atualizar botões
    document.getElementById('btn-rejection').classList.remove('active');
    document.getElementById('btn-approval').classList.remove('active');
    
    if (type === 'rejection') {
        document.getElementById('btn-rejection').classList.add('active');
        document.getElementById('rejection-sections').style.display = 'block';
        document.getElementById('switchproduct').style.display = 'block';
        document.getElementById('onboarder-section').style.display = 'none';
        
        // Inicializar checkboxes OP por padrão
        if (document.getElementById('checkboxGrid').innerHTML === '') {
            initializeCheckboxes();
        }
    } else {
        document.getElementById('btn-approval').classList.add('active');
        document.getElementById('rejection-sections').style.display = 'none';
        document.getElementById('switchproduct').style.display = 'none';
        document.getElementById('onboarder-section').style.display = 'block';
    }
}

// ... (resto do código permanece igual)

// Permitir adicionar ponto personalizado com Enter
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('customPoint').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCustomPoint();
        }
    });
    
    // Inicializar com OP por padrão (só se estiver em modo recusa)
    if (messageType === 'rejection') {
        initializeCheckboxes();
    }
});

function selectOnboarder(name, link) {
    selectedOnboarder = name;
    onboarderLink = link;
    
    // Atualizar botões
    document.querySelectorAll('.btn-onboarder').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Mostrar seleção
    document.getElementById('selected-onboarder').style.display = 'block';
    document.getElementById('onboarder-name').textContent = name;
}

function generateMessage() {
    const recipient = document.getElementById('recipient').value.trim() || 'Hunter';
    const additionalNotes = document.getElementById('additionalNotes').value;
    
    let message = '';
    
    if (messageType === 'approval') {
        // Mensagem de Aprovação
        if (!selectedOnboarder) {
            alert('Por favor, selecione um Onboarder responsável.');
            return;
        }
        
        message = `Olá, @${recipient}, tudo bem? Fizemos o processo de QA e sua oportunidade foi aprovada. Responsável por sua conta será @${selectedOnboarder}.

Abaixo segue o link de agendamento de integração para ser enviado ao seller:
${onboarderLink}

Caso tenha dúvidas, estamos à disposição.
Abraço!`;
        
    } else {
        // Mensagem de Recusa
        if (selectedPoints.size === 0) {
            alert('Por favor, selecione pelo menos um ponto de revisão.');
            return;
        }
        
        const allPoints = [...selectedPoints];
        
        if (allPoints.length === 1) {
            message = `Olá, @${recipient}, tudo bem? Fizemos o processo de QA e há apenas um ponto que preciso que você ajuste antes de seguirmos com o processo de onboarding.

* ${allPoints[0]}

Assim que esse ponto for ajustado, peço que retorne a opp para a fase de "Integração/Onboarding" para seguirmos com as devidas tratativas.

Qualquer dúvida, só me chamar!
Abraços!`;
        } else {
            message = `Olá, @${recipient}, tudo bem? Fizemos o processo de QA e há alguns pontos que preciso que você ajuste antes de seguirmos com o processo de onboarding.

`;
            allPoints.forEach(point => {
                message += `* ${point}\n`;
            });
            
            message += `
Assim que esses pontos forem ajustados, peço que retorne a opp para a fase de "Integração/Onboarding" para seguirmos com as devidas tratativas.

Qualquer dúvida, só me chamar! Conte comigo
Abraços!`;
        }
        
        if (additionalNotes) {
            const lines = message.split('\n');
            lines.splice(-4, 0, `\nOBS: ${additionalNotes}`);
            message = lines.join('\n');
        }
    }
    
    // Mostrar resultado
    document.getElementById('messageOutput').textContent = message;
    document.getElementById('outputSection').style.display = 'block';
    document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
}

function copyMessage() {
    const messageText = document.getElementById('messageOutput').textContent;
    navigator.clipboard.writeText(messageText).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copiado!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Permitir adicionar ponto personalizado com Enter
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('customPoint').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCustomPoint();
        }
    });
    
    // Inicializar com OP por padrão
    initializeCheckboxes();
});
