// ==================================================
// PROJECT BLUEPRINT: WHIZLITE | Final Polished Client Logic (v5.3)
// AUTHOR: WHIZ MBURU
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // --- State Containers ---
    const states = {
        initial: document.getElementById('initial-state'),
        loading: document.getElementById('loading-state'),
        code: document.getElementById('code-state'),
        final: document.getElementById('final-state'),
    };

    // --- UI Elements ---
    const phoneForm = document.getElementById('phone-form');
    const phoneNumberInput = document.getElementById('phone-number');
    const loadingTextEl = document.getElementById('loading-text');
    const pairingCodeEl = document.getElementById('pairing-code');
    const timerTextEl = document.getElementById('timer-text');
    const finalIcon = document.getElementById('final-icon');
    const finalTitle = document.getElementById('final-title');
    const finalMessage = document.getElementById('final-message');
    const finalButton = document.getElementById('final-button');

    let countdownInterval;

    // --- State Management ---
    const showState = (stateName) => {
        Object.values(states).forEach(el => el.classList.add('hidden'));
        if (states[stateName]) {
            states[stateName].classList.remove('hidden');
            states[stateName].style.display = 'flex';
        }
    };

    // --- NEW: Function to reset the view to the initial state ---
    const resetToInitialState = () => {
        phoneNumberInput.value = ''; // Clear the last entered number
        showState('initial');
    };
    
    // --- Timer Logic ---
    const startTimer = () => {
        let timeLeft = 45;
        const updateTimer = () => {
            timerTextEl.textContent = `Expires in ${timeLeft}s`;
            if (timeLeft < 0) {
                clearInterval(countdownInterval);
                showFinalState('expired');
            }
            timeLeft--;
        };
        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    };

    // --- Final State Handler ---
    const showFinalState = (type, message) => {
        showState('final');
        switch (type) {
            case 'success':
                finalIcon.setAttribute('data-lucide', 'party-popper');
                finalIcon.style.color = '#51cf66';
                finalTitle.textContent = 'Pairing Successful!';
                finalTitle.style.color = '#51cf66';
                finalMessage.textContent = 'Your Session ID has been sent to your WhatsApp.';
                finalButton.textContent = 'Pair Another Number';
                finalButton.className = 'final-button success';
                break;
            case 'error':
                finalIcon.setAttribute('data-lucide', 'wifi-off');
                finalIcon.style.color = '#fa5252';
                finalTitle.textContent = 'Connection Failed';
                finalTitle.style.color = '#fa5252';
                finalMessage.textContent = message || 'An unknown error occurred.';
                finalButton.textContent = 'Try Again';
                finalButton.className = 'final-button error';
                break;
            case 'expired':
                finalIcon.setAttribute('data-lucide', 'alert-triangle');
                finalIcon.style.color = '#fa5252';
                finalTitle.textContent = 'Code Expired';
                finalTitle.style.color = '#fa5252';
                finalMessage.textContent = 'Please request a new code.';
                finalButton.textContent = 'Get New Code';
                finalButton.className = 'final-button error';
                break;
        }
        lucide.createIcons();
        // --- MODIFIED: 'Start Over' button now resets the view instead of reloading the page ---
        finalButton.onclick = resetToInitialState;
    };

    // --- Form Submission ---
    phoneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const phoneNumber = phoneNumberInput.value.trim();
        if (phoneNumber) {
            socket.emit('get_code', phoneNumber);
            showState('loading');
            loadingTextEl.textContent = 'Connecting to WhatsApp...';
        }
    });
    
    // --- NEW: Click-to-Copy Functionality ---
    pairingCodeEl.addEventListener('click', () => {
        const codeToCopy = pairingCodeEl.textContent.replace(/\s/g, ''); // Remove spaces for clean copy
        navigator.clipboard.writeText(codeToCopy).then(() => {
            const originalText = pairingCodeEl.textContent;
            pairingCodeEl.textContent = 'COPIED!';
            setTimeout(() => {
                pairingCodeEl.textContent = originalText;
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    // --- Socket.IO Event Handlers ---
    socket.on('status', (message) => {
        loadingTextEl.textContent = message;
    });

    socket.on('pairing_code', (code) => {
        pairingCodeEl.textContent = code;
        showState('code');
        startTimer();
    });

    socket.on('session_sent', () => {
        clearInterval(countdownInterval);
        showFinalState('success');
    });
    
    socket.on('error', (message) => {
        clearInterval(countdownInterval);
        showFinalState('error', message);
    });

    // --- Initial Icon Rendering ---
    lucide.createIcons();
});