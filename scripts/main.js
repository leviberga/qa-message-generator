// Pontos de revisão predefinidos
        const predefinedPoints = [
            'Está faltando a TAG na Conta pai',
            'Está faltando a TAG na Conta filho',
            'A conta pai não foi criada',
            'A conta filho não foi criada',
            'A oportunidade está na conta pai',
            'Está faltando o anexo do Checklist',
            'Está faltando o anexo do simulador',
            'Está faltando o anexo do DA do seller',
            'Há divergências entre as taxas do simulador e do DA do seller',
            'A solicitação para pricing está pendente',
            'O caso de risco não foi criado',
            'O CNPJ do caso de risco é diferente do CNPJ cadastrado na conta',
            'A análise de risco foi feita há mais de 3 meses',
            'O caso de risco está pendente da análise de PLD',
            'A análise de risco está pendente'
        ];
        
        let customPoints = [];
        let selectedPoints = new Set();
        
        // Inicializar checkboxes
        function initializeCheckboxes() {
            const grid = document.getElementById('checkboxGrid');
            
            predefinedPoints.forEach((point, index) => {
                const div = document.createElement('div');
                div.className = 'checkbox-item';
                div.onclick = () => toggleCheckbox(index);
                
                div.innerHTML = `
                    <input type="checkbox" id="point_${index}" onchange="togglePoint('${point}', this.checked)">
                    <label for="point_${index}">${point}</label>
                `;
                
                grid.appendChild(div);
            });
        }
        
        function toggleCheckbox(index) {
            const checkbox = document.getElementById(`point_${index}`);
            const item = checkbox.closest('.checkbox-item');
            const point = predefinedPoints[index];
            
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
            predefinedPoints.forEach((point, index) => {
                const checkbox = document.getElementById(`point_${index}`);
                const item = checkbox.closest('.checkbox-item');
                
                if (checkbox.checked) {
                    checkbox.checked = false;
                    item.classList.remove('checked');
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
        
        function generateMessage() {
            const recipient = document.getElementById('recipient').value || 'Equipe';
            const additionalNotes = document.getElementById('additionalNotes').value;
            
            if (selectedPoints.size === 0) {
                alert('Por favor, selecione pelo menos um ponto de revisão.');
                return;
            }
            

            // Construir mensagem
            let message = `Olá, @${recipient}, tudo bem? Fizemos o processo de QA e há alguns pontos que preciso que você ajuste antes de seguirmos com o processo de onboarding.

`;
            
            // Adicionar pontos selecionados
            const allPoints = [...selectedPoints];
            allPoints.forEach((point, index) => {
                message += `${index + 1}. ${point}\n`;
            });
            
            if (additionalNotes) {
                message += `
OBS: ${additionalNotes}
`;
            }
            
            message += `
Assim que esses pontos forem ajustados, peço que retorne a opp para a fase de "Integração/Onboarding" para seguirmos com as devidas tratativas.
 
Qualquer dúvida, só me chamar! Conte comigo
Abraços!`;
            
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
        document.getElementById('customPoint').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addCustomPoint();
            }
        });