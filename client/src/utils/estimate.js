export const TIERS = ['Economy', 'Standard', 'Premium', 'Luxury']
export const SIZES = ['1 BHK', '2 BHK', '3 BHK', '3+ BHK / Villa', 'Full Floor / Bulk Units']

const TIER_RATE = { Economy: 1, Standard: 1.3, Premium: 1.7, Luxury: 2.3 }
const SIZE_BASE = {
  '1 BHK': 250000, '2 BHK': 400000, '3 BHK': 600000,
  '3+ BHK / Villa': 900000, 'Full Floor / Bulk Units': 1500000,
}
export const UNIT_PRICE = {
  wardrobes: 60000, kitchen: 120000, tvUnit: 40000,
  crockery: 35000, study: 30000, bed: 35000,
}

export function calcEstimate({ size, tier, units, ceilingPaint, bulk }) {
  const unitTotal = Object.entries(units).reduce((s, [k, n]) => s + n * (UNIT_PRICE[k] || 0), 0)
  const ceiling = ceilingPaint ? (SIZE_BASE[size] || 0) * 0.25 : 0
  let total = (unitTotal + ceiling) * (TIER_RATE[tier] || 1)
  if (bulk) total *= 0.92 // 8% bulk multi-flat discount
  const round = (n) => Math.round(n / 5000) * 5000
  return { min: round(total * 0.9), max: round(total * 1.15) }
}

export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')