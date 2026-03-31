export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // AI Chatbot Backend Logic (POST)
    if (request.method === "POST") {
      try {
        const { message } = await request.json();
        const apiKey = env.API_KEY_gradient;
        const model = "gemma-3-27b-it";
        
        if (!apiKey || apiKey.length < 10) {
           return new Response(JSON.stringify({ response: "Error: Your API_KEY_gradient is missing or invalid. Please check your Cloudflare secrets." }), {
             headers: { ...corsHeaders, "Content-Type": "application/json" }
           });
        }

        // System Instruction moved into the message for Gemma compatibility
        const instruction = "System: You are Gradient AI Assistant, a professional AI specialized in school assessments, Question Level Analysis (QLA), and educational reporting. Your goal is to help users understand how Gradient AI transforms school data into insights. Be professional, concise, and helpful.\n\nUser: ";

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: instruction + message }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024
            }
          }),
        });

        const data = await response.json();
        
        if (data.error) {
           return new Response(JSON.stringify({ response: `Gemini API Error: ` + data.error.message }), {
             headers: { ...corsHeaders, "Content-Type": "application/json" }
           });
        }

        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response. Please check your AI API quota.";

        return new Response(JSON.stringify({ response: aiResponse }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ response: "Internal Worker Error: " + e.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Default response for other methods (e.g. GET)
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Allow": "POST, OPTIONS" }
    });
  },
};
