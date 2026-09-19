import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS } from '../../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VECTOR_INDEX_PATH = path.join(__dirname, '../data/vector_index.json');
const PRODUCTS_JSON_PATH = path.join(__dirname, '../products (1).json');

const OCCASIONS = ['birthday', 'wedding', 'valentine', 'anniversary', 'housewarming', 'friendship', 'gifting', 'easter', 'baby shower', 'casual', 'sports events'];
const MATERIALS = ['wool', 'cotton', 'acrylic', 'jute', 'metal', 'pearl', 'elastic', 'kraft paper'];
const COLORS = ['pink', 'red', 'blue', 'purple', 'white', 'yellow', 'green', 'cream', 'beige', 'brown', 'orange', 'lavender', 'burgundy', 'turquoise'];
const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };

function loadProductsFromJson() {
  const productsFromJson = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));
  const imageByName = new Map(PRODUCTS.map(product => [product.name, product.image]));

  return productsFromJson.map((product, index) => ({
    ...product,
    id: PRODUCTS.find(item => item.name === product.name)?.id || `CR${String(index + 1).padStart(3, '0')}`,
    image: imageByName.get(product.name)
  }));
}

function ensureDataDir() {
  const dir = path.join(__dirname, '../data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function tokenize(text) {
  return String(text || '').toLowerCase().replace(/[^\w\s]/gi, ' ').split(/\s+/).filter(token => token.length > 1);
}

function computeVector(text, vocabulary) {
  const counts = {};
  tokenize(text).forEach(token => { counts[token] = (counts[token] || 0) + 1; });
  return vocabulary.map(term => counts[term] || 0);
}

function cosineSimilarity(left, right) {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] ** 2;
    rightNorm += right[index] ** 2;
  }
  return leftNorm && rightNorm ? dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm)) : 0;
}

function productText(product) {
  return [
    `Product ID: ${product.id}`,
    `Product Name: ${product.name}`,
    `Category: ${product.category || 'Not specified'}`,
    `Price: ₹${product.price}`,
    `Material: ${product.material || 'Not specified'}`,
    `Availability: ${product.availability ?? 'Not specified'}`,
    `Description: ${product.description || 'Not specified'}`,
    `Occasions: ${Array.isArray(product.occasions) ? product.occasions.join(', ') : 'Not specified'}`,
    `Size: ${product.size ? `${product.size.width || 'N/A'} x ${product.size.height || 'N/A'}` : 'Not specified'}`
  ].join('\n');
}

export function buildRagIndex() {
  ensureDataDir();
  const products = loadProductsFromJson();
  const documents = products.map(product => ({ id: product.id, textContent: productText(product), rawProduct: product }));
  const vocabulary = [...new Set(documents.flatMap(document => tokenize(document.textContent)))];
  const indexData = {
    updatedAt: new Date().toISOString(),
    totalProducts: products.length,
    indexedCount: documents.length,
    vocab: vocabulary,
    documents: documents.map(document => ({ ...document, vector: computeVector(document.textContent, vocabulary) }))
  };
  fs.writeFileSync(VECTOR_INDEX_PATH, JSON.stringify(indexData, null, 2), 'utf-8');
  console.log(`✅ [RAG] Index successfully built: ${products.length} products indexed from products.json.`);
  return indexData;
}

function getVectorIndex() {
  const productCount = loadProductsFromJson().length;
  if (fs.existsSync(VECTOR_INDEX_PATH)) {
    try {
      const index = JSON.parse(fs.readFileSync(VECTOR_INDEX_PATH, 'utf-8'));
      if (index.totalProducts === productCount) return index;
    } catch {
      console.warn('Vector index corrupt, rebuilding...');
    }
  }
  return buildRagIndex();
}

function normalize(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function nameTokens(text) {
  return new Set(tokenize(normalize(text)));
}

function findProductByName(query, products) {
  const queryTokens = nameTokens(query);
  const ignored = new Set(['a', 'an', 'and', 'for', 'give', 'get', 'how', 'i', 'is', 'me', 'of', 'product', 'products', 'show', 'the', 'to', 'want', 'what', 'which']);
  const meaningfulTokens = [...queryTokens].filter(token => !ignored.has(token));
  if (meaningfulTokens.length < 2) return null;

  return products
    .map(product => {
      const productTokens = nameTokens(product.name);
      const matchesAllTokens = meaningfulTokens.every(token => productTokens.has(token));
      const matchedTokenCount = meaningfulTokens.filter(token => productTokens.has(token)).length;
      return { product, matchesAllTokens, matchedTokenCount };
    })
    .filter(result => result.matchesAllTokens)
    .sort((left, right) => right.matchedTokenCount - left.matchedTokenCount || right.product.name.length - left.product.name.length)[0]?.product || null;
}

function parsePriceRange(query) {
  const text = query.toLowerCase();
  const number = '(?:₹|rs\\.?|inr)?\\s*(\\d+)';
  const under = text.match(new RegExp(`(?:under|below|less than|within|max|budget of)\\s*${number}`, 'i'));
  const between = text.match(new RegExp(`between\\s*${number}\\s*(?:and|to|-)\\s*${number}`, 'i'));
  const above = text.match(new RegExp(`(?:above|over|more than)\\s*${number}`, 'i'));
  return {
    min: between ? Number(between[1]) : above ? Number(above[1]) : null,
    max: between ? Number(between[2]) : under ? Number(under[1]) : null
  };
}

function parseQuantity(query) {
  const numericMatch = query.match(/\b(?:give|show|find|get|recommend|want)\s+(?:me\s+)?(\d+)\s+(?:products?|items?|key\s*chains?|bags?|bouquets?|accessories?)\b/i);
  if (numericMatch) return Number(numericMatch[1]);
  const wordMatch = query.match(/\b(?:give|show|find|get|recommend|want)\s+(?:me\s+)?(one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:products?|items?|key\s*chains?|bags?|bouquets?|accessories?)\b/i);
  return wordMatch ? NUMBER_WORDS[wordMatch[1].toLowerCase()] : null;
}

function parseQuery(userQuery, products) {
  const query = userQuery.toLowerCase();
  const normalizedQuery = query.replace(/key\s+chains?/g, 'keychain').replace(/hair\s+clips?/g, 'hair clip');
  const catalogTokens = new Set(products.flatMap(product => tokenize(productText(product))));
  const price = parsePriceRange(query);
  const quantity = parseQuantity(query);
  const productName = findProductByName(normalizedQuery, products);
  const detectedProductCategory = normalizedQuery.match(/\b(handbags?|bags?|keychains?|accessories|hair accessories|bouquets?|home decor|flowers?)\b/i)?.[1]?.toLowerCase() || null;
  const category = productName ? null : detectedProductCategory;
  const material = MATERIALS.find(item => new RegExp(`\\b${item}\\b`, 'i').test(query)) || null;
  const color = COLORS.find(item => new RegExp(`\\b${item}\\b`, 'i').test(query)) || null;
  const occasions = OCCASIONS.filter(item => query.includes(item));
  if (query.includes('gift') && !occasions.includes('gifting')) occasions.push('gifting');
  const occasion = occasions[0] || null;
  const availability = /\b(available|in stock|in-stock)\b/i.test(query);
  const exactAttribute = query.match(/\b(material|price|cost|availability|available|size|occasion|category|description)\b/i)?.[1]?.toLowerCase() || null;
  const hasProductLanguage = /\b(product|products|item|items|catalog|collection|show|want|find|recommend|buy|give|get|gift|gifts|crochet|dress|clothing|handmade|keychain|keychains)\b/i.test(normalizedQuery);
  const ignoredTerms = new Set([
    'a', 'an', 'and', 'are', 'available', 'below', 'buy', 'catalog', 'category', 'cost', 'find', 'for', 'from', 'gifts', 'give', 'get',
    'how', 'i', 'in', 'is', 'item', 'items', 'me', 'of', 'on', 'or', 'price', 'product', 'products', 'recommend', 'show',
    'size', 'stock', 'tell', 'the', 'under', 'want', 'what', 'which', 'with', 'would', 'you', 'your', 'please', 'current',
      'much', 'need', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'available', 'availability', 'material', 'occasion', 'made', 'using', 'about', 'doesn', 't'
  ]);
  const requestedTerms = tokenize(query).filter(term => {
    const singular = term.endsWith('s') ? term.slice(0, -1) : term;
    return !ignoredTerms.has(term)
      && !/^\d+$/.test(term)
      && !MATERIALS.includes(term)
      && !COLORS.includes(term)
      && !OCCASIONS.includes(term)
      && !['under', 'below', 'less', 'than', 'between', 'above', 'over', 'more', 'within', 'budget', 'of'].includes(term)
      && !catalogTokens.has(term)
      && !catalogTokens.has(singular);
  });

  return {
    intent: 'product_search',
    productName,
    category,
    material,
    color,
    occasion,
    occasions,
    priceMin: price.min,
    priceMax: price.max,
    quantity,
    availability,
    exactAttribute,
    hasProductLanguage,
    unknownTerms: requestedTerms
  };
}

function categoryMatches(product, category) {
  if (!category) return true;
  const text = `${product.name} ${product.category}`.toLowerCase();
  if (category.includes('bag')) return /bag|tote|handbag|sling/.test(text);
  if (category.includes('keychain')) return text.includes('keychain');
  if (category.includes('hair')) return /hair|accessor/.test(text);
  if (category.includes('accessor')) return product.category.toLowerCase().includes('accessor');
  if (category.includes('bouquet')) return text.includes('bouquet');
  if (category.includes('flower')) return /flower|bouquet/.test(text);
  if (category.includes('decor')) return /decor|planter|hanging|blanket/.test(text);
  return text.includes(category.replace(/s$/, ''));
}

function productMatches(product, constraints) {
  const searchableText = `${product.name} ${product.description || ''}`.toLowerCase();
  const materialText = String(product.material || '').toLowerCase();
  return (!constraints.productName || product.id === constraints.productName.id)
    && categoryMatches(product, constraints.category)
    && (!constraints.material || materialText.includes(constraints.material))
    && (!constraints.color || searchableText.includes(constraints.color))
    && (!constraints.occasions.length || constraints.occasions.every(occasion => (product.occasions || []).some(item => item.toLowerCase().includes(occasion))))
    && (constraints.priceMin === null || product.price >= constraints.priceMin)
    && (constraints.priceMax === null || product.price <= constraints.priceMax)
    && (!constraints.availability || Number(product.availability) > 0);
}

export function retrieveRelevantContext(userQuery) {
  const products = loadProductsFromJson();
  const index = getVectorIndex();
  const constraints = parseQuery(userQuery, products);
  const hasExplicitConstraint = Boolean(constraints.productName || constraints.category || constraints.material || constraints.color || constraints.occasions.length || constraints.priceMin !== null || constraints.priceMax !== null || constraints.availability || constraints.quantity !== null);
  let matches = constraints.unknownTerms.length > 0 ? [] : products.filter(product => productMatches(product, constraints));

  if (!hasExplicitConstraint && constraints.hasProductLanguage && constraints.unknownTerms.length === 0) {
    const queryVector = computeVector(userQuery, index.vocab);
    matches = index.documents
      .map(document => ({ ...document, score: cosineSimilarity(queryVector, document.vector) }))
      .filter(document => document.score > 0)
      .sort((left, right) => right.score - left.score)
      .map(document => document.rawProduct);
  }

  if (constraints.quantity !== null) {
    matches = matches.slice(0, constraints.quantity);
  }

  const documents = matches.map(product => index.documents.find(document => document.id === product.id)).filter(Boolean);
  const contextString = documents.length ? documents.map(document => document.textContent).join('\n\n---\n\n') : 'No matching products were found.';

  if (process.env.DEBUG_RAG === 'true') {
    console.log(`🔍 [RAG DEBUG] Query: "${userQuery}"`);
    console.log(`   Constraints: ${JSON.stringify(constraints)}`);
    console.log(`   Retrieved ${matches.length} products: ${matches.map(product => `${product.id} (${product.name})`).join(', ')}`);
  }

  return { contextString, products: matches, constraints };
}

export { loadProductsFromJson, parseQuery };
