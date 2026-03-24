// src/lib/productRelationships.js

export function getRelationshipConfig(slug) {
  if (!slug) return getFallbackConfig();

  const database = {
    // --- METABOLIC & GLP-1 RESEARCH (Weight/Fat Loss) ---
    "retatrutide-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "cagrilintide-australia",
        "mots-c-australia",
        "5-amino-1mq-australia",
        "tirzepatide-australia",
      ],
    },
    "tirzepatide-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "cagrilintide-australia",
        "retatrutide-australia",
        "mots-c-australia",
        "5-amino-1mq-australia",
      ],
    },
    "cagrilintide-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "tirzepatide-australia",
        "retatrutide-australia",
        "5-amino-1mq-australia",
        "mots-c-australia",
      ],
    },
    "5-amino-1mq-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "mots-c-australia",
        "tirzepatide-australia",
        "slu-pp-322-australia",
        "retatrutide-australia",
      ],
    },
    "slu-pp-322-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "5-amino-1mq-australia",
        "mots-c-australia",
        "retatrutide-australia",
        "tirzepatide-australia",
      ],
    },

    // --- RECOVERY, HEALING & INFLAMMATION ---
    "bpc-157-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "bpc-157-and-tb500-blend-australia",
        "ghk-cu-australia",
        "kpv-australia",
        "thymosin-alpha-1-australia",
      ],
    },
    "bpc-157-and-tb500-blend-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "ghk-cu-australia",
        "thymosin-alpha-1-australia",
        "kpv-australia",
        "igf-1-lr3-peptide-australia",
      ],
    },
    "ghk-cu-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "bpc-157-australia",
        "epitalon-australia",
        "glutathione-australia",
        "nadplus-australia",
      ],
    },
    "kpv-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "bpc-157-australia",
        "thymosin-alpha-1-australia",
        "bpc-157-and-tb500-blend-australia",
        "ghk-cu-australia",
      ],
    },

    // --- GROWTH HORMONE SECRETAGOGUES (Muscle/Recovery) ---
    "cjc-1295-no-dac-ipamorelin-blend-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "tesamorelin-australia",
        "igf-1-lr3-peptide-australia",
        "bpc-157-and-tb500-blend-australia",
        "hgh-kit-blue-tops-australia",
      ],
    },
    "ipamorelin-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "cjc-with-dac-peptide-australia",
        "tesamorelin-australia",
        "igf-1-lr3-peptide-australia",
        "cjc-1295-no-dac-ipamorelin-blend-australia",
      ],
    },
    "cjc-with-dac-peptide-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "ipamorelin-australia",
        "igf-1-lr3-peptide-australia",
        "tesamorelin-australia",
        "hgh-kit-blue-tops-australia",
      ],
    },
    "tesamorelin-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "ipamorelin-australia",
        "igf-1-lr3-peptide-australia",
        "cjc-1295-no-dac-ipamorelin-blend-australia",
        "hgh-kit-blue-tops-australia",
      ],
    },
    "hgh-kit-blue-tops-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "igf-1-lr3-peptide-australia",
        "tesamorelin-australia",
        "hcg-australia",
        "bpc-157-and-tb500-blend-australia",
      ],
    },
    "igf-1-lr3-peptide-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "tesamorelin-australia",
        "hgh-kit-blue-tops-australia",
        "bpc-157-and-tb500-blend-australia",
        "cjc-1295-no-dac-ipamorelin-blend-australia",
      ],
    },

    // --- ANTI-AGING, MITOCHONDRIAL & CELLULAR HEALTH ---
    "mots-c-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "ss-31-australia",
        "nadplus-australia",
        "5-amino-1mq-australia",
        "glutathione-australia",
      ],
    },
    "ss-31-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "mots-c-australia",
        "nadplus-australia",
        "epitalon-australia",
        "glutathione-australia",
      ],
    },
    "nadplus-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "glutathione-australia",
        "ss-31-australia",
        "mots-c-australia",
        "epitalon-australia",
      ],
    },
    "glutathione-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "nadplus-australia",
        "ghk-cu-australia",
        "epitalon-australia",
        "ss-31-australia",
      ],
    },
    "epitalon-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "thymosin-alpha-1-australia",
        "pinealon-australia",
        "nadplus-australia",
        "ss-31-australia",
      ],
    },
    "thymosin-alpha-1-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "epitalon-australia",
        "kpv-australia",
        "bpc-157-australia",
        "bpc-157-and-tb500-blend-australia",
      ],
    },

    // --- NEURO / COGNITIVE (Nootropics) ---
    "semax-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "selank-australia",
        "pinealon-australia",
        "dsip-peptide-australia",
        "epitalon-australia",
      ],
    },
    "selank-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "semax-australia",
        "dsip-peptide-australia",
        "pinealon-australia",
        "epitalon-australia",
      ],
    },
    "pinealon-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "epitalon-australia",
        "semax-australia",
        "selank-australia",
        "dsip-peptide-australia",
      ],
    },
    "dsip-peptide-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "selank-australia",
        "epitalon-australia",
        "semax-australia",
        "pinealon-australia",
      ],
    },

    // --- TANNING, LIBIDO & HORMONAL ---
    "melanotan-2-peptide-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "pt-141-australia",
        "melanotan-1-peptide-australia",
        "oxytocin-acetate-australia",
        "bpc-157-australia",
      ],
    },
    "melanotan-1-peptide-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "melanotan-2-peptide-australia",
        "pt-141-australia",
        "oxytocin-acetate-australia",
        "bpc-157-australia",
      ],
    },
    "pt-141-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "melanotan-2-peptide-australia",
        "oxytocin-acetate-australia",
        "melanotan-1-peptide-australia",
        "dsip-peptide-australia",
      ],
    },
    "oxytocin-acetate-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "pt-141-australia",
        "selank-australia",
        "dsip-peptide-australia",
        "melanotan-2-peptide-australia",
      ],
    },
    "hcg-australia": {
      relatedAccessories: ["bac-water-australia"],
      relatedPeptides: [
        "hgh-kit-blue-tops-australia",
        "cjc-1295-no-dac-ipamorelin-blend-australia",
        "pt-141-australia",
        "bpc-157-australia",
      ],
    },
  };

  // Fetch the specific mapping or fall back to defaults
  const config = database[slug.toLowerCase()] || getFallbackConfig();

  // FORCE INJECT BAC WATER: Even if it was somehow missed above, ensure it's always included.
  if (!config.relatedAccessories.includes("bac-water-australia")) {
    config.relatedAccessories.unshift("bac-water-australia");
  }

  return config;
}

function getFallbackConfig() {
  return {
    relatedAccessories: ["bac-water-australia"],
    relatedPeptides: [
      "bpc-157-australia",
      "cjc-1295-no-dac-ipamorelin-blend-australia",
      "tirzepatide-australia",
      "mots-c-australia",
    ],
  };
}

// --- HELPER FOR THE CART DRAWER ---
export function getSuggestedProductSlugsForCart(cartItems = []) {
  if (!Array.isArray(cartItems)) return ["bac-water-australia"]; // Always fall back to Bac Water

  const suggestedSlugs = new Set();

  // 1. ABSOLUTE RULE: ALWAYS suggest Bac Water first.
  suggestedSlugs.add("bac-water-australia");

  let hasAccessory = false;

  cartItems.forEach((item) => {
    if (!item?.slug) return;
    if (item.category === "Accessories") hasAccessory = true;

    const config = getRelationshipConfig(item.slug);
    (config.relatedAccessories || []).forEach((slug) =>
      suggestedSlugs.add(slug),
    );
  });

  // 2. If they already have an accessory, heavily suggest related peptides
  if (hasAccessory) {
    cartItems.forEach((item) => {
      if (!item?.slug) return;
      const config = getRelationshipConfig(item.slug);
      (config.relatedPeptides || []).forEach((slug) =>
        suggestedSlugs.add(slug),
      );
    });
  } else {
    // If they DON'T have an accessory, still add a couple related peptides after Bac Water
    cartItems.forEach((item) => {
      if (!item?.slug) return;
      const config = getRelationshipConfig(item.slug);
      (config.relatedPeptides || []).forEach((slug) =>
        suggestedSlugs.add(slug),
      );
    });
  }

  // 3. Filter out items already in the cart so we don't suggest what they've already bought!
  const cartSlugs = new Set(cartItems.map((item) => item.slug));
  return Array.from(suggestedSlugs).filter((slug) => !cartSlugs.has(slug));
}

// --- HELPER FOR THE PRODUCT PAGE ---
export function getRelatedProductSlugsForProduct(slug) {
  if (!slug) return ["bac-water-australia"];
  const config = getRelationshipConfig(slug);

  // Combine accessories (Bac Water always first) and peptides to show on the product page grid
  return [
    ...(config.relatedAccessories || []),
    ...(config.relatedPeptides || []),
  ];
}
