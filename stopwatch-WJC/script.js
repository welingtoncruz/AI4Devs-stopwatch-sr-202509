/* ========================================
   APLICAÇÃO DE CRONÔMETRO E COUNTDOWN
   ======================================== */

// ========================================
// CLASSE BASE TIMER
// ========================================
class Timer {
    constructor(id, type) {
        this.id = id;
        this.type = type; // 'stopwatch' ou 'countdown'
        this.isRunning = false;
        this.isPaused = false;
        this.milliseconds = 0;
        this.startTime = 0;
        this.pausedTime = 0;
        this.animationId = null;
        this.element = null;
    }

    // Formatar tempo para exibição (HH:MM:SS e mmm separados)
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor(ms % 1000);

        return {
            time: `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`,
            milliseconds: this.pad(milliseconds, 3),
            total: ms
        };
    }

    // Adicionar zeros à esquerda
    pad(num, size = 2) {
        let s = num.toString();
        while (s.length < size) s = '0' + s;
        return s;
    }

    // Atualizar display visual
    updateDisplay() {
        if (!this.element) return;

        const timeData = this.formatTime(this.milliseconds);
        const displayTimeElement = this.element.querySelector('.display-time');
        const displayMillisecondsElement = this.element.querySelector('.display-milliseconds');
        
        // Atualizar texto (performance otimizada)
        displayTimeElement.textContent = timeData.time;
        displayMillisecondsElement.textContent = timeData.milliseconds;
    }

    // Destruir timer (limpar recursos)
    destroy() {
        this.stop();
        if (this.element) {
            this.element.remove();
        }
    }
}

// ========================================
// CLASSE CRONÔMETRO (STOPWATCH)
// ========================================
class Stopwatch extends Timer {
    constructor(id) {
        super(id, 'stopwatch');
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startTime = performance.now() - this.milliseconds;

        // Usar requestAnimationFrame para atualização suave
        const update = () => {
            if (!this.isRunning) return;

            this.milliseconds = performance.now() - this.startTime;
            this.updateDisplay();
            this.animationId = requestAnimationFrame(update);
        };

        this.animationId = requestAnimationFrame(update);
        this.updateButtonStates();
        this.element.classList.add('running');
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.updateButtonStates();
        this.element.classList.remove('running');
    }

    clear() {
        this.pause();
        this.milliseconds = 0;
        this.startTime = 0;
        this.updateDisplay();
    }

    stop() {
        this.pause();
    }

    updateButtonStates() {
        const startBtn = this.element.querySelector('[data-action="start"]');
        const startBtnText = startBtn.querySelector('.btn-text');

        if (this.isRunning) {
            startBtn.classList.add('paused');
            startBtnText.textContent = 'Pause';
        } else {
            startBtn.classList.remove('paused');
            startBtnText.textContent = 'Start';
        }
    }
}

// ========================================
// CLASSE COUNTDOWN
// ========================================
class Countdown extends Timer {
    constructor(id) {
        super(id, 'countdown');
        this.initialTime = 0;
        this.hasFinished = false;
    }

    // Definir tempo inicial a partir dos inputs
    setInitialTime(hours, minutes, seconds) {
        this.initialTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
        this.milliseconds = this.initialTime;
        this.hasFinished = false;
        this.updateDisplay();
    }

    start() {
        if (this.isRunning) return;
        if (this.milliseconds <= 0) {
            alert('⚠️ Configure um tempo inicial antes de iniciar!');
            return;
        }

        this.isRunning = true;
        this.hasFinished = false;
        this.startTime = performance.now();
        this.pausedTime = this.milliseconds;

        // Desabilitar inputs enquanto roda
        this.toggleInputs(false);
        this.hideAlert();

        const update = () => {
            if (!this.isRunning) return;

            const elapsed = performance.now() - this.startTime;
            this.milliseconds = Math.max(0, this.pausedTime - elapsed);

            this.updateDisplay();

            // Verificar se chegou a zero
            if (this.milliseconds <= 0) {
                this.finish();
                return;
            }

            this.animationId = requestAnimationFrame(update);
        };

        this.animationId = requestAnimationFrame(update);
        this.updateButtonStates();
        this.element.classList.add('running');
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.toggleInputs(true);
        this.updateButtonStates();
        this.element.classList.remove('running');
    }

    clear() {
        this.pause();
        this.hasFinished = false;
        
        // Resetar para tempo inicial
        this.milliseconds = this.initialTime;
        this.updateDisplay();
        this.toggleInputs(true);
        this.hideAlert();
    }

    stop() {
        this.pause();
    }

    finish() {
        this.isRunning = false;
        this.hasFinished = true;
        this.milliseconds = 0;
        this.updateDisplay();
        this.updateButtonStates();
        this.toggleInputs(true);
        this.element.classList.remove('running');

        // Mostrar alerta visual
        this.showAlert();

        // Disparar evento para notificação e som
        const event = new CustomEvent('countdownFinished', {
            detail: { timerId: this.id }
        });
        document.dispatchEvent(event);
    }

    showAlert() {
        const alertElement = this.element.querySelector('.countdown-alert');
        if (alertElement) {
            alertElement.style.display = 'flex';
        }
    }

    hideAlert() {
        const alertElement = this.element.querySelector('.countdown-alert');
        if (alertElement) {
            alertElement.style.display = 'none';
        }
    }

    toggleInputs(enabled) {
        const inputs = this.element.querySelectorAll('.input-time');
        inputs.forEach(input => {
            input.disabled = !enabled;
        });
    }

    updateButtonStates() {
        const startBtn = this.element.querySelector('[data-action="start"]');
        const startBtnText = startBtn.querySelector('.btn-text');

        if (this.isRunning) {
            startBtn.classList.add('paused');
            startBtnText.textContent = 'Pause';
        } else {
            startBtn.classList.remove('paused');
            startBtnText.textContent = 'Start';
        }
    }
}

// ========================================
// GERENCIADOR DE TIMERS
// ========================================
class TimerManager {
    constructor() {
        this.timers = new Map();
        this.stopwatchCount = 0;
        this.countdownCount = 0;
        this.notificationPermissionRequested = false;
        this.init();
    }

    init() {
        // Elementos do DOM
        this.timersContainer = document.getElementById('timersContainer');
        this.emptyState = document.getElementById('emptyState');
        this.addStopwatchBtn = document.getElementById('addStopwatch');
        this.addCountdownBtn = document.getElementById('addCountdown');

        // Event listeners
        this.addStopwatchBtn.addEventListener('click', () => this.createStopwatch());
        this.addCountdownBtn.addEventListener('click', () => this.createCountdown());

        // Listener para countdowns finalizados
        document.addEventListener('countdownFinished', (e) => {
            this.handleCountdownFinished(e.detail.timerId);
        });

        // Mostrar empty state inicial
        this.updateEmptyState();

        console.log('✅ Timer Manager inicializado');
    }

    createStopwatch() {
        this.stopwatchCount++;
        const id = `stopwatch-${this.stopwatchCount}-${Date.now()}`;
        const stopwatch = new Stopwatch(id);

        // Clonar template
        const template = document.getElementById('stopwatchTemplate');
        const element = template.content.cloneNode(true).querySelector('.timer-card');
        
        // Configurar elemento
        element.id = id;
        element.querySelector('.timer-number').textContent = this.stopwatchCount;
        stopwatch.element = element;

        // Event listeners do card
        this.attachTimerEvents(element, stopwatch);

        // Adicionar ao container
        this.timersContainer.appendChild(element);
        this.timers.set(id, stopwatch);

        // Animação de entrada
        setTimeout(() => element.classList.add('show'), 10);

        this.updateEmptyState();
        console.log(`➕ Cronômetro #${this.stopwatchCount} criado`);
    }

    createCountdown() {
        this.countdownCount++;
        const id = `countdown-${this.countdownCount}-${Date.now()}`;
        const countdown = new Countdown(id);

        // Solicitar permissão de notificação na primeira vez
        if (this.countdownCount === 1) {
            this.requestNotificationPermission();
        }

        // Clonar template
        const template = document.getElementById('countdownTemplate');
        const element = template.content.cloneNode(true).querySelector('.timer-card');
        
        // Configurar elemento
        element.id = id;
        element.querySelector('.timer-number').textContent = this.countdownCount;
        countdown.element = element;

        // Event listeners do card
        this.attachTimerEvents(element, countdown);

        // Event listeners dos inputs
        const inputs = element.querySelectorAll('.input-time');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateCountdownTime(countdown);
            });

            // Validação: apenas números
            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
        });

        // Adicionar ao container
        this.timersContainer.appendChild(element);
        this.timers.set(id, countdown);

        // Animação de entrada
        setTimeout(() => element.classList.add('show'), 10);

        this.updateEmptyState();
        console.log(`➕ Countdown #${this.countdownCount} criado`);
    }

    attachTimerEvents(element, timer) {
        // Botão Start/Pause
        const startBtn = element.querySelector('[data-action="start"]');
        startBtn.addEventListener('click', () => {
            if (timer.isRunning) {
                timer.pause();
            } else {
                timer.start();
            }
        });

        // Botão Clear
        const clearBtn = element.querySelector('[data-action="clear"]');
        clearBtn.addEventListener('click', () => {
            timer.clear();
        });

        // Botão Remover
        const removeBtn = element.querySelector('.btn-remove');
        removeBtn.addEventListener('click', () => {
            this.removeTimer(timer.id);
        });
    }

    updateCountdownTime(countdown) {
        const element = countdown.element;
        const hours = parseInt(element.querySelector('.input-hours').value) || 0;
        const minutes = parseInt(element.querySelector('.input-minutes').value) || 0;
        const seconds = parseInt(element.querySelector('.input-seconds').value) || 0;

        // Validar limites
        const validHours = Math.max(0, Math.min(99, hours));
        const validMinutes = Math.max(0, Math.min(59, minutes));
        const validSeconds = Math.max(0, Math.min(59, seconds));

        // Atualizar inputs se necessário
        element.querySelector('.input-hours').value = validHours;
        element.querySelector('.input-minutes').value = validMinutes;
        element.querySelector('.input-seconds').value = validSeconds;

        countdown.setInitialTime(validHours, validMinutes, validSeconds);
    }

    removeTimer(id) {
        const timer = this.timers.get(id);
        if (!timer) return;

        // Animação de saída
        const element = document.getElementById(id);
        element.style.animation = 'slideOut 0.3s ease-out';
        
        setTimeout(() => {
            timer.destroy();
            this.timers.delete(id);
            this.updateEmptyState();
            console.log(`🗑️ Timer ${id} removido`);
        }, 300);
    }

    updateEmptyState() {
        if (this.timers.size === 0) {
            this.emptyState.classList.remove('hidden');
        } else {
            this.emptyState.classList.add('hidden');
        }
    }

    handleCountdownFinished(timerId) {
        console.log(`⏰ Countdown ${timerId} finalizado!`);
        
        // Reproduzir som
        this.playAlertSound();
        
        // Mostrar notificação
        this.showNotification(timerId);
    }

    playAlertSound() {
        try {
            // Criar contexto de áudio
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Função para criar um beep com frequência específica
            const createBeep = (frequency, startTime, duration) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Configurar oscilador
                oscillator.frequency.value = frequency;
                oscillator.type = 'square'; // Onda quadrada para som mais "eletrônico"
                
                // Envelope de volume (rápido subida/descida)
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
                gainNode.gain.linearRampToValueAtTime(0.3, startTime + duration - 0.01);
                gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
                
                return oscillator;
            };
            
            // Som de alarme alternado (3 ciclos de alto-baixo)
            const currentTime = audioContext.currentTime;
            const beepDuration = 0.15;
            const pauseDuration = 0.1;
            
            // Frequências alternadas (típico de alarme)
            const highFreq = 1200; // Frequência alta
            const lowFreq = 800;   // Frequência baixa
            
            // Criar 6 beeps alternados (alto-baixo-alto-baixo-alto-baixo)
            for (let i = 0; i < 6; i++) {
                const startTime = currentTime + (i * (beepDuration + pauseDuration));
                const freq = i % 2 === 0 ? highFreq : lowFreq;
                createBeep(freq, startTime, beepDuration);
            }
            
            console.log('🔊 Alarme reproduzido (3 ciclos alternados)');
        } catch (error) {
            console.warn('⚠️ Erro ao reproduzir som:', error);
        }
    }

    async requestNotificationPermission() {
        // Verificar suporte
        if (!('Notification' in window)) {
            console.warn('⚠️ Navegador não suporta notificações');
            return;
        }

        // Solicitar permissão apenas se ainda não foi solicitada
        if (!this.notificationPermissionRequested && Notification.permission === 'default') {
            this.notificationPermissionRequested = true;
            
            try {
                const permission = await Notification.requestPermission();
                console.log(`🔔 Permissão de notificação: ${permission}`);
                
                if (permission === 'granted') {
                    // Mostrar notificação de teste
                    const testNotification = new Notification('✅ Notificações Ativadas!', {
                        body: 'Você receberá alertas quando os countdowns finalizarem.',
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">✅</text></svg>',
                        requireInteraction: false,
                        silent: true
                    });
                    setTimeout(() => testNotification.close(), 3000);
                }
            } catch (error) {
                console.warn('⚠️ Erro ao solicitar permissão:', error);
            }
        }
    }

    async showNotification(timerId) {
        // Verificar suporte
        if (!('Notification' in window)) {
            console.warn('⚠️ Navegador não suporta notificações');
            return;
        }

        // Apenas mostrar notificação se permissão já foi concedida
        if (Notification.permission === 'granted') {
            try {
                const notification = new Notification('⏰ Countdown Finalizado!', {
                    body: 'O tempo do contador regressivo chegou a zero.',
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">⏰</text></svg>',
                    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">⏰</text></svg>',
                    requireInteraction: false,
                    silent: false
                });

                // Auto-fechar após 5 segundos
                setTimeout(() => notification.close(), 5000);

                console.log('🔔 Notificação exibida');
            } catch (error) {
                console.warn('⚠️ Erro ao exibir notificação:', error);
            }
        } else if (Notification.permission === 'denied') {
            console.warn('⚠️ Permissão de notificação negada pelo usuário');
        } else {
            console.warn('⚠️ Permissão de notificação ainda não concedida');
        }
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando aplicação...');
    
    // Criar gerenciador de timers
    window.timerManager = new TimerManager();
    
    console.log('✅ Aplicação inicializada - Crie um countdown para ativar notificações');
});

// Adicionar animação de saída ao CSS via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateX(50px) scale(0.9);
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Script carregado com sucesso');
