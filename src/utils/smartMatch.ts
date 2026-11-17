import { SERVICE_CATEGORIES } from '../data/categories';
import { SmartMatchResult, ServiceCategoryId } from '../types';

interface KeywordRule {
  categoryId: ServiceCategoryId;
  keywords: string[];
  dangerousWords?: string[];
}

const KEYWORD_RULES: KeywordRule[] = [
  {
    categoryId: 'appliance-repair',
    keywords: [
      'washing machine', 'fridge', 'refrigerator', 'microwave', 'oven',
      'tv', 'television', 'dryer', 'grinder', 'mixer', 'purifier', 'ro water',
      'dishwasher', 'induction', 'chimney', 'appliance', 'deep freezer', 'spin cycle'
    ]
  },
  {
    categoryId: 'plumbing',
    keywords: [
      'tap', 'leaking', 'leak', 'pipe', 'flush', 'sink', 'drain', 'clog', 
      'water', 'basin', 'geyser', 'shower', 'cistern', 'dripping', 'toilet',
      'faucet', 'motor pump', 'tank', 'overflow', 'plumber', 'pipeline'
    ]
  },
  {
    categoryId: 'electrical',
    keywords: [
      'spark', 'sparking', 'switch', 'socket', 'wire', 'fuse', 'power', 
      'mcb', 'tripping', 'trip', 'fan', 'light', 'shock', 'short circuit',
      'inverter', 'wiring', 'meter', 'breaker', 'choke', 'bulb', 'ceiling fan'
    ],
    dangerousWords: ['spark', 'sparking', 'shock', 'short circuit', 'fire', 'smoke', 'burning smell']
  },
  {
    categoryId: 'ac-repair',
    keywords: [
      'air conditioner', 'ac', 'cooling', 'compressor', 'gas', 'gas leak',
      'filter', 'remote', 'breeze', 'split ac', 'window ac', 'ice', 
      'cooling coil', 'temperature', 'indoor unit', 'outdoor unit'
    ]
  },
  {
    categoryId: 'carpentry',
    keywords: [
      'hinge', 'cupboard', 'door', 'lock', 'wood', 'table', 'chair',
      'wardrobe', 'drawer', 'furniture', 'shelf', 'drilling', 'drill',
      'wooden', 'latches', 'carpenter', 'cabinet', 'bed frame'
    ]
  },
  {
    categoryId: 'home-cleaning',
    keywords: [
      'clean', 'cleaning', 'sofa', 'deep clean', 'dust', 'bathroom clean',
      'kitchen clean', 'stain', 'sanitization', 'scrubbing', 'mop',
      'tile cleaning', 'upholstery', 'balcony clean'
    ]
  }
];

export const matchProblemDescription = (userInput: string): SmartMatchResult | null => {
  const normalized = userInput.toLowerCase();
  
  // Track match scores
  let bestMatch: {
    rule: KeywordRule;
    matchedKeywords: string[];
    score: number;
    hasDanger: boolean;
  } | null = null;

  for (const rule of KEYWORD_RULES) {
    const matched: string[] = [];
    let dangerFound = false;
    let ruleScore = 0;

    for (const kw of rule.keywords) {
      // For short words (e.g. <= 3 chars like 'ac'), require word boundary to avoid matching inside 'machine'
      let isMatch = false;
      if (kw.length <= 3) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        isMatch = regex.test(normalized);
      } else {
        isMatch = normalized.includes(kw);
      }

      if (isMatch) {
        matched.push(kw);
        // Multi-word phrases give higher priority
        ruleScore += kw.length > 5 ? 5 : 2;
      }
    }

    if (rule.dangerousWords) {
      for (const dw of rule.dangerousWords) {
        if (normalized.includes(dw)) {
          dangerFound = true;
          break;
        }
      }
    }

    if (matched.length > 0) {
      if (!bestMatch || ruleScore > bestMatch.score) {
        bestMatch = {
          rule,
          matchedKeywords: matched,
          score: ruleScore,
          hasDanger: dangerFound
        };
      }
    }
  }

  if (!bestMatch) {
    return null;
  }

  const category = SERVICE_CATEGORIES.find(c => c.id === bestMatch!.rule.categoryId);
  if (!category) return null;

  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (bestMatch.score >= 5) {
    confidence = 'high';
  } else if (bestMatch.score >= 2) {
    confidence = 'medium';
  }

  let safetyWarning: string | undefined = undefined;
  if (bestMatch.rule.categoryId === 'electrical') {
    if (bestMatch.hasDanger) {
      safetyWarning = 'CRITICAL SAFETY ALERT: Live sparks, shocks or burning smells are urgent electrical hazards. Please turn OFF your main MCB switch immediately, stay away from water and metal surfaces, and wait for a licensed technician.';
    } else {
      safetyWarning = 'Safety Reminder: Do not open live switchboards or attempt domestic rewiring without turning off the circuit breaker.';
    }
  }

  return {
    category,
    confidence,
    matchedKeywords: bestMatch.matchedKeywords,
    safetyWarning,
    isDangerous: bestMatch.hasDanger
  };
};
