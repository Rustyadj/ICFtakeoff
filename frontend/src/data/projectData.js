// Mock project data — Pine Ridge Custom Home
export const ACTIVE_PROJECT = {
  id: 'pine-ridge',
  name: 'Pine Ridge Custom Home',
  status: 'Active',
  sf: 2847,
  coreSize: 6,
  levels: 'Basement + Main Level',
  openings: 18,
  corners: 42,
  tWalls: 2,
  maxWallHeightFt: 14,
  date: 'May 6, 2025',
  manufacturer: 'nudura',
  image: null,

  takeoff: {
    wallAreaSf: 18732,
    courses: 48,
    blocksTotal: 2873,
    corners: 240,
    tBlocks: 86,
    concreteYd3: 156.3,
    rebarLf: 12456,
    bucksLintelsLf: 164,
    bracing: 312,
    estimatedMaterial: 48923,
    estimatedLabor: 15840,
    estimatedBid: 64763,
    margin: 18,
  },

  pipeline: [
    { stage: 'Leads', count: 8, value: 215000 },
    { stage: 'Plans Received', count: 5, value: 143200 },
    { stage: 'Proposal Sent', count: 5, value: 187450 },
    { stage: 'Negotiation', count: 2, value: 86300 },
    { stage: 'Won', count: 3, value: 154600 },
    { stage: 'Lost', count: 1, value: 32400 },
  ],

  activity: [
    { icon: 'check', text: 'Takeoff completed', project: 'Pine Ridge Custom Home', ago: '1h ago' },
    { icon: 'upload', text: 'Plans uploaded', project: 'Modern Farmhouse', ago: '3h ago' },
    { icon: 'mail', text: 'Proposal sent to client', project: 'Willow Creek Residence', ago: '1d ago' },
    { icon: 'cpu', text: 'AI review completed', project: 'Lakeside Walkout', ago: '2d ago' },
    { icon: 'edit', text: 'Estimate updated', project: 'Mountain View Estate', ago: '2d ago' },
  ],

  recentProjects: [
    { name: 'Pine Ridge Custom Home', manufacturer: 'Nudura 8" Core', status: 'Takeoff', updatedAgo: '1h ago' },
    { name: 'Willow Creek Residence', manufacturer: 'Fox Blocks 6" Core', status: 'Estimating', updatedAgo: '3h ago' },
    { name: 'Lakeside Walkout', manufacturer: 'BuildBlock 8" Core', status: 'Proposal Sent', updatedAgo: '1d ago' },
    { name: 'Mountain View Estate', manufacturer: 'Nudura 6" Core', status: 'Draft', updatedAgo: '2d ago' },
  ],
}

// Estimate data for Pine Ridge
export const ESTIMATE_DATA = {
  projectName: 'Pine Ridge Custom Home',
  status: 'Active',
  sf: 2847,
  manufacturer: 'Nudura 6" Core',
  levels: 'Main Level + Basement',
  date: 'May 6, 2025',

  subtotal: 186540,
  markupPct: 15,
  contingencyPct: 5,
  grandTotal: 224547,
  costPerSf: 78.88,

  summary: {
    totalEstimatedCost: 186540,
    costPerSf: 65.56,
    materialCost: 98734,
    materialPct: 52.9,
    laborCost: 62418,
    laborPct: 33.5,
    grossMargin: 25388,
    grossMarginPct: 13.6,
  },

  breakdown: [
    { category: 'ICF Walls', material: 60432, labor: 32184, equipment: 2850, total: 95466, costPerSf: 33.55, pct: 51.2 },
    { category: 'Concrete', material: 14256, labor: 7392, equipment: 1125, total: 22773, costPerSf: 8.00, pct: 12.2 },
    { category: 'Rebar & Reinforcement', material: 7895, labor: 4320, equipment: 680, total: 12895, costPerSf: 4.53, pct: 6.9 },
    { category: 'Waterproofing', material: 6734, labor: 3456, equipment: 320, total: 10510, costPerSf: 3.69, pct: 5.6 },
    { category: 'Windows & Doors', material: 18650, labor: 4200, equipment: 0, total: 22850, costPerSf: 8.02, pct: 12.3 },
    { category: 'Insulation & Accessories', material: 4823, labor: 1872, equipment: 0, total: 6695, costPerSf: 2.35, pct: 3.6 },
    { category: 'Labor & Installation', material: 0, labor: 9360, equipment: 1250, total: 10610, costPerSf: 3.72, pct: 5.7 },
    { category: 'Equipment & Tools', material: 0, labor: 0, equipment: 2150, total: 2150, costPerSf: 0.75, pct: 1.2 },
    { category: 'General Conditions', material: 0, labor: 0, equipment: 2430, total: 2430, costPerSf: 0.85, pct: 1.3 },
  ],

  costDistribution: [
    { name: 'Materials', value: 52.9, color: '#14b8a6' },
    { name: 'Labor', value: 33.5, color: '#8b5cf6' },
    { name: 'Equipment', value: 5.8, color: '#f59e0b' },
    { name: 'Other', value: 7.8, color: '#6b7280' },
  ],

  timeline: {
    durationWeeks: 24,
    startDate: 'May 19, 2025',
    endDate: 'Oct 31, 2025',
  },

  insights: [
    'Material costs are aligned with current market rates.',
    'Labor productivity is based on historical data for similar projects.',
    'Shipping and taxes are not included.',
    'Review alternates to optimize project costs.',
  ],
}
