export default {
  async fetch(request, env) {
    console.log("Received request with method:", request.method); 

    console.log("LLM_API_KEY available in env:", !!env.LLM_API_KEY);
    console.log("env keys:", Object.keys(env));
    console.log("LLM_API_KEY value:", env.LLM_API_KEY);
    
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*' // <-- ADDED THIS LINE
        }
      });
    }

    try {
      const json = await request.json();
      console.log("Received JSON body:", json);

      const cards = json.cards;
      if (!cards || cards.length !== 3) {
        return new Response('Invalid card input - exactly 3 cards required', { status: 400 });
      }

      const authorList = ['William James', 'Kathy Acker', 'Don Delilo', 'Rumi', 'Octavia Butler', 'Mary Shelley', 'TS Eliot', 'William S Burroughs'];
      const randomAuthor = authorList[Math.floor(Math.random() * authorList.length)];

      const payload = {
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `Interpret this spread of Rider-Waite tarot cards in 10 sentences maximum. 
What the user desires: ${cards[0].title}, 
The obstacle the user faces: ${cards[1].title}, 
The path the user should take to overcome the obstacle and achieve wholeness: ${cards[2].title}. 
Focus on the narrative flow between cards and pragmatic advice for the user in the present and future. 
Do not use the word pragmatic. Do not use em dashes (—). 
Write it in the style of ${randomAuthor}. 
Be poetic and oblique where appropriate. 
Point out something about one of the cards that the viewer will not likely notice and incorporate it into the interpretation.`
        }],
        temperature: 0.8, // Adjusted from 1.5 to valid range
        max_tokens: 300,
        stream: false // Explicitly set to false for non-streaming
      };

      console.log("Sending request to DeepSeek with payload:", JSON.stringify(payload, null, 2));
      
      const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
      const deepseekResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.LLM_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log("DeepSeek response status:", deepseekResponse.status);
      
      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text();
        console.error("LLM API error:", errorText);
        return new Response(`LLM API error: ${errorText}`, { 
          status: deepseekResponse.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const data = await deepseekResponse.json();
      console.log("Received DeepSeek data:", JSON.stringify(data, null, 2));
      
      const interpretation = data.choices?.[0]?.message?.content || "No interpretation generated";
      
      return new Response(JSON.stringify({ 
        interpretation,
        author: randomAuthor,
        cards: cards.map(card => card.title)
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Add CORS if needed
        }
      });

    } catch (err) {
      console.error("Caught error:", err.stack || err.message);
      return new Response(JSON.stringify({ 
        error: err.message,
        stack: err.stack
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};