export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS/Options
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // AI API Endpoint (POST)
    if (request.method === "POST") {
      try {
        const { message } = await request.json();
        const apiKey = env.API_KEY_gradient;
        const model = "gemma-3-27b-it";
        
        if (!apiKey) {
           return new Response(JSON.stringify({ error: "API Key (API_KEY_gradient) not set in environment." }), {
             status: 500,
             headers: { ...corsHeaders, "Content-Type": "application/json" }
           });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
          }),
        });

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

        return new Response(JSON.stringify({ response: aiResponse }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Serve Landing Page (GET)
    return new Response(getFullHTML(), {
      headers: { "Content-Type": "text/html" },
    });
  },
};

function getFullHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gradient AI | AI-Powered School Assessments</title>
    <meta name="description" content="Transform School Assessments into AI-Powered Insights. Gradient AI automates Question Level Analysis (QLA) and generates intelligent, visual reports.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* ===== Base Reset & Variables ===== */
        :root {
            --bg-main: #0a0b10;
            --bg-secondary: #13141f;
            --text-primary: #ffffff;
            --text-secondary: rgba(255, 255, 255, 0.7);
            --primary: #8a4dff;
            --primary-hover: #7b3aff;
            --secondary: #00e5ff;
            --glass-bg: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.08);
            --font-heading: 'Outfit', sans-serif;
            --font-body: 'Inter', sans-serif;
            --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg-main);
            color: var(--text-primary);
            font-family: var(--font-body);
            line-height: 1.6;
            overflow-x: hidden;
            scroll-behavior: smooth;
        }

        h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); font-weight: 700; line-height: 1.2; margin-bottom: 1rem; }
        h2 { font-size: 2.5rem; }
        a { text-decoration: none; color: inherit; }
        ul { list-style: none; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 5%; }
        img { max-width: 100%; height: auto; display: block; }

        /* ===== Buttons ===== */
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 50px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: var(--transition); border: none; outline: none; }
        .btn-lg { padding: 1rem 2rem; font-size: 1.1rem; }
        .btn-block { width: 100%; margin-top: 1.5rem; }
        .btn-primary { background: linear-gradient(135deg, var(--primary), #a673ff); color: #fff; box-shadow: 0 4px 20px rgba(138, 77, 255, 0.4); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(138, 77, 255, 0.6); }
        .btn-secondary { background: transparent; color: var(--text-primary); border: 1px solid var(--glass-border); }
        .btn-secondary:hover { background: var(--glass-bg); border-color: var(--text-secondary); }
        .btn-outline { background: transparent; color: var(--secondary); border: 1px solid var(--secondary); }
        .btn-outline:hover { background: rgba(0, 229, 255, 0.1); }

        /* ===== Navigation ===== */
        .navbar { position: fixed; top: 0; width: 100%; z-index: 100; padding: 1.5rem 0; background: rgba(10, 11, 16, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--glass-border); transition: var(--transition); }
        .nav-content { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(90deg, #fff, var(--secondary)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a { color: var(--text-secondary); font-weight: 500; transition: var(--transition); position: relative; }
        .nav-links a:hover { color: var(--text-primary); }
        .nav-actions { display: flex; gap: 1rem; }
        .menu-toggle { display: none; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }

        /* ===== Hero Section ===== */
        .hero { padding: 180px 0 100px; position: relative; overflow: hidden; }
        .hero::after { content: ''; position: absolute; top: -50%; left: -20%; width: 140%; height: 100%; background: radial-gradient(circle, rgba(138,77,255,0.15) 0%, transparent 60%); z-index: -1; }
        .hero-container { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .hero-content { max-width: 800px; margin-bottom: 4rem; }
        .badge { display: inline-block; padding: 0.4rem 1rem; background: rgba(138, 77, 255, 0.1); border: 1px solid rgba(138, 77, 255, 0.3); border-radius: 50px; color: var(--primary); font-size: 0.9rem; font-weight: 600; margin-bottom: 1.5rem; }
        .headline { font-size: 4.5rem; line-height: 1.1; margin-bottom: 1.5rem; }
        .headline span { background: linear-gradient(90deg, var(--secondary), var(--primary)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .subtext { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2.5rem; max-width: 600px; margin: 0 auto; }
        .hero-cta { display: flex; gap: 1.5rem; justify-content: center; }
        .hero-visual { position: relative; width: 100%; border-radius: 20px; border: 1px solid var(--glass-border); box-shadow: 0 20px 50px rgba(0,0,0,0.5); overflow: hidden; }
        .hero-visual .glow-bg { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; height: 80%; background: radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, transparent 70%); filter: blur(80px); z-index: -1; }
        .hero-image { width: 100%; height: auto; object-fit: cover; z-index: 1; position: relative; }

        /* ===== Problem & Solution ===== */
        .problem-solution { background: var(--bg-secondary); padding: 100px 0; }
        .ps-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .ps-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 24px; padding: 3rem; transition: var(--transition); }
        .ps-card:hover { background: rgba(255, 255, 255, 0.05); }
        .icon-wrap { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.5rem; }
        .red-glow { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; box-shadow: 0 0 20px rgba(255, 77, 77, 0.2); }
        .green-glow { background: rgba(0, 229, 255, 0.1); color: var(--secondary); box-shadow: 0 0 20px rgba(0, 229, 255, 0.2); }

        /* ===== Features ===== */
        .features { padding: 100px 0; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .feature-card { background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 2.5rem; border-radius: 20px; transition: var(--transition); }
        .feature-card:hover { transform: translateY(-10px); border-color: rgba(138, 77, 255, 0.3); box-shadow: 0 10px 30px rgba(138, 77, 255, 0.1); }
        .feature-icon { font-size: 2.5rem; margin-bottom: 1.5rem; background: linear-gradient(135deg, var(--secondary), var(--primary)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }

        /* ===== How It Works ===== */
        .how-it-works { background: var(--bg-secondary); padding: 100px 0; }
        .steps-container { display: flex; justify-content: space-between; position: relative; padding-top: 2rem; }
        .step-line { position: absolute; top: 45px; left: 5%; width: 90%; height: 2px; background: linear-gradient(90deg, var(--primary), var(--secondary)); z-index: 1; }
        .step { flex: 1; text-align: center; position: relative; z-index: 2; padding: 0 1rem; }
        .step-num { width: 60px; height: 60px; border-radius: 50%; background: var(--bg-main); border: 2px solid var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin: 0 auto 1.5rem; box-shadow: 0 0 20px rgba(138, 77, 255, 0.3); }

        /* ===== Reports ===== */
        .reports { padding: 100px 0; }
        .reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
        .report-col { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 24px; padding: 2rem; }
        .report-img { width: 100%; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid var(--glass-border); }

        /* ===== Pricing ===== */
        .pricing { background: var(--bg-secondary); padding: 100px 0; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .pricing-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 24px; padding: 3rem 2rem; text-align: center; position: relative; }
        .pricing-card.popular { border-color: var(--primary); background: rgba(138, 77, 255, 0.05); }
        .price { font-size: 3.5rem; font-weight: 800; }
        .features-list { text-align: left; margin: 2rem 0; }
        .features-list li { margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); }
        .features-list i { color: var(--secondary); }

        /* ===== Footer ===== */
        footer { background: #050508; padding: 4rem 0 2rem; border-top: 1px solid var(--glass-border); }
        .footer-content { display: flex; justify-content: space-between; }
        .link-col h4 { color: #fff; margin-bottom: 1.5rem; }
        .link-col a { display: block; color: var(--text-secondary); margin-bottom: 0.5rem; font-size: 0.9rem; }

        /* ===== AI Chatbot ===== */
        .ai-assistant { position: fixed; bottom: 30px; right: 30px; z-index: 999; }
        .chat-trigger { width: 65px; height: 65px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; color: white; font-size: 1.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; box-shadow: 0 10px 30px rgba(138, 77, 255, 0.4); transition: 0.3s; }
        .chat-trigger:hover { transform: scale(1.1); }
        .chat-window { position: absolute; bottom: 85px; right: 0; width: 350px; background: var(--bg-secondary); border: 1px solid var(--glass-border); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); overflow: hidden; transition: 0.3s; transform-origin: bottom right; }
        .chat-window.closed { opacity: 0; transform: scale(0); pointer-events: none; }
        .chat-header { background: rgba(255,255,255,0.03); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); }
        .chat-body { height: 350px; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
        .message { max-width: 85%; }
        .ai-msg { align-self: flex-start; }
        .user-msg { align-self: flex-end; }
        .msg-bubble { padding: 0.75rem 1rem; border-radius: 15px; font-size: 0.9rem; }
        .ai-msg .msg-bubble { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-bottom-left-radius: 0; }
        .user-msg .msg-bubble { background: rgba(138, 77, 255, 0.2); border: 1px solid rgba(138, 77, 255, 0.3); border-bottom-right-radius: 0; }
        .chat-footer { padding: 1rem; border-top: 1px solid var(--glass-border); display: flex; gap: 0.5rem; }
        .input-wrap { flex: 1; display: flex; align-items: center; background: rgba(255,255,255,0.05); border-radius: 50px; border: 1px solid var(--glass-border); }
        #chat-input { background: transparent; border: none; color: #fff; padding: 0.75rem 1rem; width: 100%; outline: none; }
        .send-btn { width: 45px; height: 45px; border-radius: 50%; background: var(--primary); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 768px) {
            .headline { font-size: 2.2rem; }
            .nav-links, .nav-actions { display: none; }
            .pricing-grid, .ps-grid, .reports-grid { grid-template-columns: 1fr; }
            .chat-window { width: calc(100vw - 40px); right: 20px; }
        }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="container nav-content">
            <a href="#" class="logo"><i class="fa-solid fa-layer-group"></i> Gradient AI</a>
            <nav class="nav-links">
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#reports">Reports</a>
                <a href="#pricing">Pricing</a>
            </nav>
            <div class="nav-actions">
                <a href="#demo" class="btn btn-secondary">View Sample</a>
                <a href="#demo" class="btn btn-primary">Get Demo</a>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container hero-container">
            <div class="hero-content">
                <div class="badge">✨ The Future of Education</div>
                <h1 class="headline">Transform School Assessments into <span>AI-Powered Insights</span></h1>
                <p class="subtext">Gradient AI automates Question Level Analysis (QLA) and generates intelligent reports in seconds.</p>
                <div class="hero-cta">
                    <a href="#demo" class="btn btn-primary btn-lg">Get Demo</a>
                    <a href="#sample" class="btn btn-outline btn-lg">View Sample Report</a>
                </div>
            </div>
        </div>
    </section>

    <section class="features" id="features">
        <div class="container">
            <div class="features-grid">
                <div class="feature-card">
                    <i class="fa-solid fa-brain feature-icon"></i>
                    <h3>AI QLA Generator</h3>
                    <p>Automatically extract and analyze question-level data without tedious manual entry.</p>
                </div>
                <!-- Add more cards as needed -->
            </div>
        </div>
    </section>

    <!-- AI Voice Chatbot UI -->
    <div id="ai-assistant" class="ai-assistant">
        <div class="chat-window closed" id="chat-window">
            <div class="chat-header">
                <div class="chat-title"><i class="fa-solid fa-robot"></i> Gradient Voice AI</div>
                <button id="close-chat" class="icon-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="chat-body" id="chat-body">
                <div class="message ai-msg">
                    <div class="msg-bubble">Hi! I'm Gradient AI Assistant. How can I help you today? You can type or use voice!</div>
                </div>
            </div>
            <div class="chat-footer">
                <div class="input-wrap">
                    <input type="text" id="chat-input" placeholder="Type or speak a message...">
                </div>
                <button class="send-btn" id="send-btn"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
        <button id="chat-trigger" class="chat-trigger">
            <i class="fa-solid fa-robot"></i>
        </button>
    </div>

    <script>
        const chatTrigger = document.getElementById('chat-trigger');
        const chatWindow = document.getElementById('chat-window');
        const closeChat = document.getElementById('close-chat');
        const chatBody = document.getElementById('chat-body');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');

        chatTrigger.addEventListener('click', () => {
            chatWindow.classList.toggle('closed');
        });

        closeChat.addEventListener('click', () => {
            chatWindow.classList.add('closed');
        });

        sendBtn.addEventListener('click', () => {
            const text = chatInput.value.trim();
            if (text) handleUserMessage(text);
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = chatInput.value.trim();
                if (text) handleUserMessage(text);
            }
        });

        async function handleUserMessage(text) {
            addMessage(text, 'user-msg');
            chatInput.value = '';
            
            const loadingId = 'loading-' + Date.now();
            addMessage("Thinking...", 'ai-msg', loadingId);
            
            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                const data = await response.json();
                
                document.getElementById(loadingId).remove();
                addMessage(data.response, 'ai-msg');
            } catch (err) {
                document.getElementById(loadingId).remove();
                addMessage("Oops! Something went wrong.", 'ai-msg');
            }
        }

        function addMessage(text, type, id = null) {
            const div = document.createElement('div');
            div.className = 'message ' + type;
            if (id) div.id = id;
            div.innerHTML = '<div class="msg-bubble">' + text + '</div>';
            chatBody.appendChild(div);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    </script>
</body>
</html>
  `;
}
