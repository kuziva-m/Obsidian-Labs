// src/lib/relatedProducts.js

import { getRelationshipConfig } from "./productRelationships";

// Ensures we never show duplicates in our suggestion carousels
export function uniqueBySlug(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.slug || seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

function slugMap(products = []) {
  return new Map(products.map((product) => [product.slug, product]));
}

export function resolveRelatedProducts({ currentProduct, allProducts = [] }) {
  if (!currentProduct?.slug || !Array.isArray(allProducts)) {
    return { peopleAlsoBought: [], futureResearchLinks: [] };
  }

  const bySlug = slugMap(allProducts);
  const config = getRelationshipConfig(currentProduct.slug);

  // Combine accessories and peptides into one "People Also Bought" pool
  const peopleAlsoBought = uniqueBySlug([
    ...(config.relatedAccessories || []).map((slug) => bySlug.get(slug)),
    ...(config.relatedPeptides || []).map((slug) => bySlug.get(slug)),
  ]).filter((item) => item && item.slug !== currentProduct.slug);

  return {
    peopleAlsoBought: peopleAlsoBought.slice(0, 4), // Keep it to max 4 on the page
    futureResearchLinks: config.futureResearchLinks || [],
  };
}
