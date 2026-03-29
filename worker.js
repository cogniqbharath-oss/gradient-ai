// Navigation Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 11, 16, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 11, 16, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// --- AI Chatbot & Voice Assistant Logic ---

// UI Elements
const chatTrigger = document.getElementById('chat-trigger');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');

// State
let isRecording = false;

// Speech Recognition Setup
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (window.SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        isRecording = true;
        voiceBtn.classList.add('recording');
        chatInput.placeholder = "Listening...";
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        handleUserMessage(transcript);
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error", event.error);
        stopRecording();
        addMessage("Sorry, I had trouble understanding that. Could you try typing instead?", 'ai-msg');
    };

    recognition.onend = function() {
        stopRecording();
    };
} else {
    // Hide voice button if browser doesn't support it
    voiceBtn.style.display = 'none';
}

function startRecording() {
    if (recognition) {
        try {
            recognition.start();
        } catch (e) {
            console.error(e);
        }
    }
}

function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        voiceBtn.classList.remove('recording');
        chatInput.placeholder = "Type or speak a message...";
    }
}

// Speech Synthesis Setup
function speakText(text) {
    if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-GB'; // British English to match the UK pricing in demo
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

// Toggle Chat Window
chatTrigger.addEventListener('click', () => {
    chatWindow.classList.remove('closed');
    chatTrigger.style.transform = 'scale(0)';
    setTimeout(() => chatInput.focus(), 300);
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.add('closed');
    chatTrigger.style.transform = 'scale(1)';
    stopRecording();
});

// Handle text input
sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
        handleUserMessage(text);
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const text = chatInput.value.trim();
        if (text) {
            handleUserMessage(text);
        }
    }
});

// Handle voice input toggle
voiceBtn.addEventListener('click', () => {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
});

// Add message to UI
function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.innerHTML = `<div class="msg-bubble">${text}</div>`;
    
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Handle User Message and Generate AI Response
function handleUserMessage(text) {
    addMessage(text, 'user-msg');
    chatInput.value = '';
    
    // Simulate AI processing delay
    setTimeout(() => {
        const response = generateAIResponse(text.toLowerCase());
        addMessage(response, 'ai-msg');
        speakText(response); // Read response aloud
    }, 800);
}

// Simple logic-based mock AI for the Landing Page demo
function generateAIResponse(input) {
    if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
        return "Hello! Welcome to Gradient AI. Are you interested in transforming your school's assessments today?";
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('pricing')) {
        return "Our pricing is transparent: £4 per student, £39 per admin, and £99 per teacher annually. Which plan interests you?";
    }

    if (input.includes('feature') || input.includes('what do you do') || input.includes('how does it work')) {
        return "Gradient AI automates Question Level Analysis (QLA), acts as a gap analysis engine, and generates smart reports mapped to your syllabus.";
    }

    if (input.includes('report') || input.includes('student') || input.includes('teacher')) {
        return "We generate highly visual Student Reports, Teacher Reports, and School-wide Reports to give every stakeholder clear, actionable insights.";
    }

    if (input.includes('demo') || input.includes('sample') || input.includes('try')) {
        return "Excellent! You can request a demo by clicking the 'Get Demo' button on our page, or I can help connect you with our sales team.";
    }

    if (input.includes('qla') || input.includes('analysis')) {
        return "Manual QLA is a thing of the past. Simply upload your marking scheme, and our AI automatically extracts and generates deep insights.";
    }

    if (input.includes('safe') || input.includes('gdpr') || input.includes('privacy')) {
        return "We take data privacy seriously. Gradient AI is fully GDPR compliant, highly scalable, and built on trusted AI infrastructure.";
    }

    return "I'm a demo AI assistant for Gradient AI. Ask me about our features, pricing, or how we automate Question Level Analysis!";
}
