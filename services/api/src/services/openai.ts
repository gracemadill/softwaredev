import OpenAI from "openai";

const basePromptLines = [
  "You are an Easy Read editor. Rewrite the user's text in Easy Read style:",
  "- Short sentences (<= 15 words)",
  "- Simple, common words",
  "- If a hard word remains, define it once in brackets.",
  "Return only the rewritten text.",
];

let client: OpenAI | null = null;

function ensureClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

interface RewriteOptions {
  keepTerms?: string[];
  temperature?: number;
}

export async function rewriteText(text: string, options: RewriteOptions = {}): Promise<string> {
  const sdk = ensureClient();

  if (!sdk) {
    return `${text}\n\n(Easy Read mock: set OPENAI_API_KEY to enable real rewriting.)`;
  }

  const keepTermsLine = options.keepTerms?.length
    ? `- Keep these terms exactly as written: ${options.keepTerms.join(", ")}`
    : "- Keep provided terms exactly as written";

  const messages = [
    {
      role: "system" as const,
      content: [...basePromptLines.slice(0, 3), keepTermsLine, ...basePromptLines.slice(3)].join("\n"),
    },
    { role: "user" as const, content: text },
  ];

  const response = await sdk.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages,
    temperature: options.temperature ?? 0.3,
  });

  const easyRead = response.choices?.[0]?.message?.content?.trim();
  if (!easyRead) {
    throw new Error("Empty response from OpenAI");
  }
  return easyRead;
}
