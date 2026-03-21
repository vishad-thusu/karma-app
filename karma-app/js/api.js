/* ═══════════════════════════════════════
   KARMA — API Abstraction Layer
   Current: Direct Anthropic API
   Future: Your backend REST API
   ═══════════════════════════════════════ */

const API = {
  model: 'claude-sonnet-4-20250514',
  endpoint: 'https://api.anthropic.com/v1/messages',

  async ask(prompt, maxTokens = 600) {
    const r = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model, max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const d = await r.json();
    return d.content?.[0]?.text || '';
  },

  async askJSON(prompt, maxTokens = 400) {
    const text = await this.ask(prompt, maxTokens);
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  }
};
