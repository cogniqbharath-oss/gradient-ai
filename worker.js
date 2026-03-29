export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST") {
      try {
        const { message } = await request.json();
        const apiKey = env.API_KEY_gradient;
        const model = "gemma-3-27b-it";
        
        if (!apiKey) {
           return new Response(JSON.stringify({ error: "Gemini API Key (API_KEY_gradient) is missing." }), {
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

    return new Response(getFullContent(), {
      headers: { "Content-Type": "text/html" },
    });
  },
};

function getFullContent() {
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
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
        body { background-color: var(--bg-main); color: var(--text-primary); font-family: var(--font-body); line-height: 1.6; overflow-x: hidden; scroll-behavior: smooth; }
        h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); font-weight: 700; margin-bottom: 1rem; }
        h2 { font-size: 2.5rem; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 5%; }
        a { text-decoration: none; color: inherit; transition: var(--transition); }

        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 50px; font-weight: 600; cursor: pointer; transition: var(--transition); border: none; }
        .btn-lg { padding: 1rem 2rem; font-size: 1.1rem; }
        .btn-primary { background: linear-gradient(135deg, var(--primary), #a673ff); color: #fff; box-shadow: 0 4px 20px rgba(138, 77, 255, 0.4); }
        .btn-secondary { background: transparent; color: var(--text-primary); border: 1px solid var(--glass-border); }
        .btn-outline { background: transparent; color: var(--secondary); border: 1px solid var(--secondary); }

        .navbar { position: fixed; top: 0; width: 100%; z-index: 100; padding: 1.5rem 0; background: rgba(10, 11, 16, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--glass-border); }
        .nav-content { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(90deg, #fff, var(--secondary)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a:hover { color: var(--secondary); }

        .hero { padding: 180px 0 100px; position: relative; }
        .hero-container { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .badge { display: inline-block; padding: 0.4rem 1rem; background: rgba(138, 77, 255, 0.1); border: 1px solid rgba(138, 77, 255, 0.3); border-radius: 50px; color: var(--primary); font-size: 0.9rem; margin-bottom: 1.5rem; }
        .headline { font-size: 4.5rem; line-height: 1.1; margin-bottom: 1.5rem; }
        .headline span { background: linear-gradient(90deg, var(--secondary), var(--primary)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .subtext { font-size: 1.25rem; color: var(--text-secondary); max-width: 600px; margin-bottom: 2.5rem; }
        .hero-cta { display: flex; gap: 1.5rem; }
        .hero-visual { margin-top: 4rem; width: 100%; border-radius: 20px; border: 1px solid var(--glass-border); overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .hero-image { width: 100%; height: auto; display: block; }

        section { padding: 80px 0; }
        .section-title { margin-bottom: 3rem; text-align: center; }
        .section-title p { color: var(--text-secondary); }

        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .feature-card { background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 2.5rem; border-radius: 20px; transition: var(--transition); }
        .feature-card:hover { transform: translateY(-10px); border-color: var(--primary); }
        .feature-icon { font-size: 2.5rem; margin-bottom: 1.5rem; color: var(--secondary); }

        .reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
        .report-col { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 24px; padding: 2rem; }
        .report-img { width: 100%; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid var(--glass-border); }

        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .pricing-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 24px; padding: 3rem 2rem; text-align: center; }
        .pricing-card.popular { border-color: var(--primary); background: rgba(138, 77, 255, 0.05); }
        .price { font-size: 3rem; font-weight: 800; margin: 1rem 0; }
        .features-list { text-align: left; list-style: none; margin: 2rem 0; }
        .features-list li { margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); }
        .features-list i { color: var(--secondary); }

        .ai-assistant { position: fixed; bottom: 30px; right: 30px; z-index: 999; }
        .chat-trigger { width: 65px; height: 65px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; color: #fff; font-size: 1.8rem; cursor: pointer; box-shadow: 0 10px 30px rgba(138, 77, 255, 0.4); }
        .chat-window { position: absolute; bottom: 85px; right: 0; width: 350px; background: var(--bg-secondary); border: 1px solid var(--glass-border); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); overflow: hidden; transition: 0.3s; transform-origin: bottom right; }
        .chat-window.closed { opacity: 0; transform: scale(0); pointer-events: none; }
        .chat-header { padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); background: rgba(255,255,255,0.03); }
        .chat-body { height: 350px; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
        .msg-bubble { padding: 0.75rem 1rem; border-radius: 15px; font-size: 0.9rem; max-width: 85%; }
        .ai-msg .msg-bubble { background: rgba(255,255,255,0.05); align-self: flex-start; }
        .user-msg .msg-bubble { background: rgba(138, 77, 255, 0.2); align-self: flex-end; }
        .chat-footer { padding: 1rem; border-top: 1px solid var(--glass-border); display: flex; gap: 0.5rem; }
        .input-wrap { flex: 1; display: flex; align-items: center; background: rgba(255,255,255,0.05); border-radius: 50px; padding: 0 1rem; border: 1px solid var(--glass-border); }
        #chat-input { background: transparent; border: none; color: #fff; width: 100%; height: 40px; outline: none; }
        .send-btn { width: 45px; height: 45px; border-radius: 50%; background: var(--primary); border: none; color: #fff; cursor: pointer; }

        @media (max-width: 992px) { .headline { font-size: 3rem; } .pricing-grid, .reports-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="container nav-content">
            <a href="#" class="logo"><i class="fa-solid fa-layer-group"></i> Gradient AI</a>
            <nav class="nav-links">
                <a href="#features">Features</a>
                <a href="#reports">Reports</a>
                <a href="#pricing">Pricing</a>
            </nav>
            <div class="nav-actions">
                <a href="#demo" class="btn btn-primary">Get Demo</a>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container hero-container">
            <div class="badge">✨ The Future of Education</div>
            <h1 class="headline">Transform School Assessments into <span>AI-Powered Insights</span></h1>
            <p class="subtext">Gradient AI automates Question Level Analysis (QLA) and generates intelligent, visual reports in seconds.</p>
            <div class="hero-cta">
                <a href="#demo" class="btn btn-primary btn-lg">Get Demo</a>
                <a href="#sample" class="btn btn-outline btn-lg">View Sample Report</a>
            </div>
            <div class="hero-visual">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop" alt="Gradient AI Dashboard" class="hero-image">
            </div>
        </div>
    </section>

    <section class="features" id="features">
        <div class="container">
            <div class="section-title">
                <h2>Powerful Capabilities</h2>
                <p>Everything you need to elevate standard assessments.</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <i class="fa-solid fa-brain feature-icon"></i>
                    <h3>AI QLA Generator</h3>
                    <p>Automatically extract and analyze question-level data without tedious manual entry.</p>
                </div>
                <div class="feature-card">
                    <i class="fa-solid fa-magnifying-glass-chart feature-icon"></i>
                    <h3>Gap Analysis Engine</h3>
                    <p>Identify precise knowledge gaps and learning trends across cohorts.</p>
                </div>
                <div class="feature-card">
                    <i class="fa-solid fa-file-invoice feature-icon"></i>
                    <h3>Smart Reports</h3>
                    <p>Beautifully visualised data for teachers, leadership, and parents.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="reports" id="reports">
        <div class="container">
            <div class="section-title">
                <h2>Reports Showcase</h2>
                <p>Visualised insights tailored for every stakeholder.</p>
            </div>
            <div class="reports-grid">
                <div class="report-col">
                    <img src="https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1000&auto=format&fit=crop" alt="Student Report Example" class="report-img">
                    <h3>Student Report</h3>
                    <p>Personalized feedback showing strengths, gaps, and targeted revision steps.</p>
                </div>
                <div class="report-col">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" alt="School Report Example" class="report-img">
                    <h3>School & Teacher Reports</h3>
                    <p>Macro-level class performance and school-wide trend analysis.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="pricing" id="pricing">
        <div class="container">
            <div class="section-title">
                <h2>Simple Pricing</h2>
            </div>
            <div class="pricing-grid">
                <div class="pricing-card">
                    <div class="tier">Student</div>
                    <div class="price">£4<span>/yr</span></div>
                    <ul class="features-list"><li><i class="fa-check fa-solid"></i> Individual Reports</li><li><i class="fa-check fa-solid"></i> Improvement Roadmap</li></ul>
                    <button class="btn btn-outline btn-lg">Choose Student</button>
                </div>
                <div class="pricing-card popular">
                    <div class="tier">Teacher</div>
                    <div class="price">£99<span>/yr</span></div>
                    <ul class="features-list"><li><i class="fa-check fa-solid"></i> Class Analytics</li><li><i class="fa-check fa-solid"></i> Unlimited QLA</li></ul>
                    <button class="btn btn-primary btn-lg">Choose Teacher</button>
                </div>
                <div class="pricing-card">
                    <div class="tier">Admin</div>
                    <div class="price">£39<span>/yr</span></div>
                    <ul class="features-list"><li><i class="fa-check fa-solid"></i> School Dashboard</li><li><i class="fa-check fa-solid"></i> Export Data</li></ul>
                    <button class="btn btn-outline btn-lg">Choose Admin</button>
                </div>
            </div>
        </div>
    </section>

    <div class="ai-assistant">
        <div class="chat-window closed" id="chat-window">
            <div class="chat-header">
                <div><i class="fa-solid fa-robot"></i> Gradient AI</div>
                <button id="close-chat" style="background:none; border:none; color:#fff; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="chat-body" id="chat-body">
                <div class="ai-msg">
                    <div class="msg-bubble">Hi! How can I help you today?</div>
                </div>
            </div>
            <div class="chat-footer">
                <div class="input-wrap"><input type="text" id="chat-input" placeholder="Type a message..."></div>
                <button class="send-btn" id="send-btn"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
        <button id="chat-trigger" class="chat-trigger"><i class="fa-solid fa-robot"></i></button>
    </div>

    <script>
        const chatTrigger = document.getElementById('chat-trigger');
        const chatWindow = document.getElementById('chat-window');
        const closeChat = document.getElementById('close-chat');
        const chatBody = document.getElementById('chat-body');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');

        chatTrigger.addEventListener('click', () => chatWindow.classList.toggle('closed'));
        closeChat.addEventListener('click', () => chatWindow.classList.add('closed'));

        sendBtn.addEventListener('click', () => {
            const text = chatInput.value.trim();
            if (text) handleMessage(text);
        });

        async function handleMessage(text) {
            addMessage(text, 'user-msg');
            chatInput.value = '';
            const loadId = 'load-' + Date.now();
            addMessage('Thinking...', 'ai-msg', loadId);
            
            try {
                const res = await fetch('/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({message: text})
                });
                const data = await res.json();
                document.getElementById(loadId).remove();
                addMessage(data.response, 'ai-msg');
            } catch {
                document.getElementById(loadId).remove();
                addMessage('Connection error.', 'ai-msg');
            }
        }

        function addMessage(text, type, id) {
            const div = document.createElement('div');
            div.className = type + ' msg-row';
            if(id) div.id = id;
            div.style.display = 'flex';
            div.style.flexDirection = 'column';
            div.innerHTML = '<div class="msg-bubble">' + text + '</div>';
            chatBody.appendChild(div);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    </script>
</body>
</html>
  `;
}
