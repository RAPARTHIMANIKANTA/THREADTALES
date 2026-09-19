import '../config/env.js';
import Groq from 'groq-sdk';
import { retrieveRelevantContext, buildRagIndex, loadProductsFromJson } from '../services/ragService.js';

const SCOPE_MESSAGE = "I'm the THREADTALES Product Assistant. I can help with our crochet products, prices, categories, materials, sizes, occasions, and availability.";
const NO_MATCH_MESSAGE = "I couldn't find a matching product in the current THREADTALES catalog.";

const SYSTEM_PROMPT = `You are the THREADTALES Product Assistant.
Answer ONLY about products in the supplied THREADTALES product context. The context is the only source of truth.
Never invent products, prices, availability, materials, sizes, occasions, ratings, reviews, links, images, SVG, HTML, or React code.
The backend has already applied every explicit filter. Explain only the supplied products and do not add products.
Do not repeat raw JSON or database records. Write a concise, natural conversational answer.
For discovery questions, briefly explain why the products match. For exact product questions, answer the requested attribute directly.
If there are no matching products, explain that no matching product was found.
Return ONLY valid JSON with exactly this shape: {"answer":"Natural answer","productIds":["CR001"]}`;

function extractJson(text) {
  const cleaned = String(text || '').replace(/```json|```/gi, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function fallbackAnswer(products, constraints) {
  if (!products.length) {
    if (constraints.unknownTerms?.length) {
      const requested = constraints.unknownTerms.filter(term => term.length > 2).join(' ');
      return requested
        ? `I couldn't find any ${requested} products in the current THREADTALES catalog.`
        : NO_MATCH_MESSAGE;
    }
    if (constraints.material && constraints.category) {
      return `I couldn't find any ${constraints.material} ${constraints.category} in the current THREADTALES product catalog.`;
    }
    if (constraints.occasions?.length > 1) {
      return `I couldn't find any products matching these occasions in the current THREADTALES catalog.`;
    }
    if (constraints.category) return `I couldn't find any ${constraints.category} products in the current THREADTALES catalog.`;
    if (constraints.material) return `I couldn't find any products made with ${constraints.material} in the current THREADTALES catalog.`;
    return NO_MATCH_MESSAGE;
  }
  if (constraints.productName && constraints.exactAttribute === 'material') {
    return `The ${products[0].name} is made from ${products[0].material || 'material not specified in the catalog'}.`;
  }
  if (constraints.productName && ['price', 'cost'].includes(constraints.exactAttribute)) {
    return `The ${products[0].name} costs ₹${products[0].price}.`;
  }
  if (constraints.productName && constraints.exactAttribute === 'availability') {
    return `${products[0].name} has ${products[0].availability ?? 'unspecified'} item(s) listed as available.`;
  }
  return `I found ${products.length} THREADTALES product${products.length === 1 ? '' : 's'} matching your request.`;
}

function isProductQuery(query) {
  if (/\b(product|products|item|items|catalog|collection|show|want|find|recommend|buy|give|get|gift|gifts|crochet|dress|clothing|handmade|bag|bags|key\s*chain|keychains|accessor|bouquet|flower|decor|planter|blanket|hair|price|cost|available|availability|stock|material|size|occasion|birthday|wedding|valentine|anniversary|housewarming|friendship|gifting|easter|baby shower|casual|wool|cotton|acrylic|jute|pink|red|blue|purple|white|yellow|green|cream|beige|brown|orange|lavender)\b/i.test(query)) {
    return true;
  }

  const queryTokens = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return loadProductsFromJson().some(product => {
    const productTokens = product.name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const overlap = queryTokens.filter(token => productTokens.includes(token));
    return overlap.length >= 2;
  });
}

export async function chatWithAi(req, res) {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message string is required' });
    }

    const query = message.trim();
    if (!isProductQuery(query)) {
      return res.json({ success: true, scope: 'out_of_scope', intent: 'out_of_scope', answer: SCOPE_MESSAGE, products: [], productIds: [], sources: [] });
    }

    const { contextString, products, constraints } = retrieveRelevantContext(query);
    const productIds = products.map(product => product.id);
    const noMatch = products.length === 0;
    let answer = '';
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

    // Large catalog responses should not send every full record to Groq; the
    // validated IDs and React cards already provide the complete catalog view.
    if (!noMatch && products.length <= 12 && apiKey && apiKey !== 'gsk_demo_threadtales_key') {
      try {
        const groq = new Groq({ apiKey });
        const completion = await groq.chat.completions.create({
          model,
          temperature: 0.2,
          max_tokens: 500,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `User question:\n${query}\n\nValidated product context (internal only):\n${contextString}\n\nAllowed product IDs only: ${JSON.stringify(productIds)}` }
          ]
        });
        const parsed = extractJson(completion.choices[0]?.message?.content);
        const allowedIds = new Set(productIds);
        const returnedIds = Array.isArray(parsed?.productIds) ? parsed.productIds.filter(id => allowedIds.has(id)) : [];
        if (parsed?.answer && returnedIds.length === productIds.length && returnedIds.every(id => productIds.includes(id))) {
          answer = parsed.answer;
        }
      } catch (error) {
        console.warn('Groq response warning, using grounded fallback:', error.message);
      }
    }

    answer = answer || fallbackAnswer(products, constraints);
    return res.json({
      success: true,
      scope: 'product',
      intent: constraints.intent,
      answer,
      products: [],
      productIds: noMatch ? [] : productIds,
      sources: noMatch ? [] : products.map(product => ({ id: product.id, name: product.name }))
    });
  } catch (error) {
    console.error('AI Controller Error:', error);
    return res.status(500).json({ error: 'Failed to process AI Product Assistant query' });
  }
}

export function reindexRag(req, res) {
  try {
    const result = buildRagIndex();
    return res.json({ success: true, message: 'RAG Vector Index successfully rebuilt from products.json', indexedProducts: result.totalProducts, timestamp: result.updatedAt });
  } catch (error) {
    console.error('Reindex Error:', error);
    return res.status(500).json({ error: 'Failed to rebuild RAG index' });
  }
}
