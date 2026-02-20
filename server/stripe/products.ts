/**
 * Gods of Insurance — Stripe Products & Pricing
 * Dual mode: test keys auto-used in dev, live keys in production.
 * All prices are in USD cents.
 */

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  tokensIncluded: number;
  leadsPerMonth: number;
  features: string[];
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  highlighted?: boolean;
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    id: "free",
    name: "Mortal",
    description: "Try the platform — no card required",
    monthlyPriceCents: 0,
    yearlyPriceCents: 0,
    tokensIncluded: 10,
    leadsPerMonth: 5,
    features: [
      "5 quote submissions/month",
      "10 AI comparison tokens",
      "Basic SR-22 filing guide",
      "Public compliance data",
    ],
  },
  small: {
    id: "small",
    name: "Demigod",
    description: "Solo agents and small offices",
    monthlyPriceCents: 4900,
    yearlyPriceCents: 47040, // 20% off
    tokensIncluded: 100,
    leadsPerMonth: 50,
    features: [
      "50 leads/month",
      "100 AI comparison tokens",
      "Lead Gen Engine access",
      "Agent Motivation Hub",
      "Email support",
    ],
  },
  medium: {
    id: "medium",
    name: "Olympian",
    description: "Growing agencies",
    monthlyPriceCents: 9900,
    yearlyPriceCents: 95040,
    tokensIncluded: 300,
    leadsPerMonth: 200,
    highlighted: true,
    features: [
      "200 leads/month",
      "300 AI comparison tokens",
      "Public records scraper",
      "AI Chat Assistant",
      "Priority support",
      "Analytics dashboard",
    ],
  },
  large: {
    id: "large",
    name: "Titan",
    description: "Large agencies and brokerages",
    monthlyPriceCents: 24900,
    yearlyPriceCents: 239040,
    tokensIncluded: 1000,
    leadsPerMonth: 1000,
    features: [
      "1,000 leads/month",
      "1,000 AI comparison tokens",
      "AI Phone Agent (24/7)",
      "White-label option",
      "Dedicated account manager",
      "Custom compliance reports",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Zeus",
    description: "Insurance networks and carriers",
    monthlyPriceCents: 99900,
    yearlyPriceCents: 959040,
    tokensIncluded: 9999,
    leadsPerMonth: 9999,
    features: [
      "Unlimited leads",
      "Unlimited AI tokens",
      "Full API access",
      "Custom scraper targets",
      "SLA guarantee",
      "On-site training",
    ],
  },
};

export const TOKEN_PACK_PRICES = {
  pack_50: { tokens: 50, priceCents: 999, label: "50 tokens — $9.99" },
  pack_200: { tokens: 200, priceCents: 2999, label: "200 tokens — $29.99" },
  pack_500: { tokens: 500, priceCents: 5999, label: "500 tokens — $59.99" },
};

export const PLAN_IDS = Object.keys(PLANS) as Array<keyof typeof PLANS>;
