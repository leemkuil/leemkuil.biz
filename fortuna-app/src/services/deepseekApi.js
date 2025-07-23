// ./services/deepseekApi.js

export async function generateInterpretation(cards) {
  if (!Array.isArray(cards) || cards.length !== 3) {
    throw new Error('Exactly 3 cards are required for interpretation.');
  }

  const apiUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8787'
    : 'https://tarot-worker-production.wfleemkuil.workers.dev';
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // No Authorization header needed, worker uses its own secret key internally
    },
    body: JSON.stringify({ cards })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${errorText}`);
  }

  const data = await response.json();

  // data contains { interpretation, author, cards }
  return data.interpretation;
}
