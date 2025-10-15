const { z } = require('zod');
const config = require('../config');
const { error } = require('../utils/logger');

const rewriteSchema = z.object({
  sentence: z.string().min(1).max(1500),
  keepTerms: z.array(z.string()).optional().default([]),
});

const translateSchema = z.object({
  text: z.string().min(1),
  targetLanguage: z.string().min(2),
});

async function callOpenAi(messages) {
  if (!config.openAiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.openAiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    error('OpenAI error', response.status, details);
    throw new Error(`OpenAI request failed (${response.status})`);
  }

  const payload = await response.json();
  return payload?.choices?.[0]?.message?.content?.trim() || '';
}

async function rewrite(body) {
  const data = rewriteSchema.parse(body);
  const systemPrompt = `You are an Easy Read editor. Rewrite the user's text in Easy Read style:\n- Short sentences (<= 15 words)\n- Simple, common words\n- Keep these terms exactly: ${data.keepTerms.join(', ')}\n- If a hard word remains, define it once in brackets.\nReturn only the rewritten text.`;

  return callOpenAi([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: data.sentence },
  ]);
}

async function translate(body) {
  const data = translateSchema.parse(body);
  const systemPrompt = `Translate the provided Easy Read content into ${data.targetLanguage}.\nKeep the Easy Read tone and formatting. Return only the translated text.`;

  return callOpenAi([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: data.text },
  ]);
}

module.exports = { rewrite, translate };
