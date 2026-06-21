// Seeded from icf_manufacturer_block_database.xlsx
// Pricing is illustrative for 2,847 SF / 6" core (Pine Ridge project)
// All values editable via Cost Database

export const MANUFACTURERS = [
  {
    id: 'nudura',
    name: 'Nudura®',
    shortName: 'Nudura',
    tagline: 'Build Better. Build Faster.',
    coreSizes: [4, 6, 8, 10, 12],
    defaultCore: 6,
    blocks: {
      6: {
        blockHeightIn: 18,
        blockLengthIn: 96,
        overallWidthIn: 11.25,
        foamPerSideIn: 2.625,
        sfPerBlock: 12.0,
        rValueCore: 24,
        rValueTotal: 24,
        bundleQtyStraight: 3,
        weightLbs: 5.2,
        compressiveStrengthPsi: 40,
      },
    },
    pricing: {
      6: {
        blocksQty: 2.873,          // blocks per SF of wall
        blocksTotal: 97682,
        accessoriesTotal: 8456,
        concreteTotal: 24251,
        rebarMeshTotal: 10561,
        laborInstallTotal: 30250,
        totalInstalledCost: 171200,
      },
    },
    accentColor: '#14b8a6',
  },
  {
    id: 'fox-blocks',
    name: 'Fox Blocks®',
    shortName: 'Fox Blocks',
    tagline: 'Be Clever. Build Green.',
    coreSizes: [4, 6, 8, 10, 12],
    defaultCore: 6,
    blocks: {
      6: {
        blockHeightIn: 16,
        blockLengthIn: 48,
        overallWidthIn: 11.25,
        foamPerSideIn: 2.625,
        sfPerBlock: 5.33,
        rValueCore: 23,
        rValueTotal: 23,
        bundleQtyStraight: 4,
        weightLbs: 2.8,
        compressiveStrengthPsi: 35,
      },
    },
    pricing: {
      6: {
        blocksQty: 2.873,
        blocksTotal: 97482,
        accessoriesTotal: 9123,
        concreteTotal: 24251,
        rebarMeshTotal: 10561,
        laborInstallTotal: 33120,
        totalInstalledCost: 174537,
      },
    },
    accentColor: '#10b981',
  },
  {
    id: 'buildblock',
    name: 'BuildBlock®',
    shortName: 'BuildBlock',
    tagline: 'Insulating Concrete Forms.',
    coreSizes: [4, 6, 8],
    defaultCore: 6,
    blocks: {
      6: {
        blockHeightIn: 16,
        blockLengthIn: 48,
        overallWidthIn: 11.0,
        foamPerSideIn: 2.5,
        sfPerBlock: 5.33,
        rValueCore: 22,
        rValueTotal: 24,
        bundleQtyStraight: 12,
        weightLbs: 5.0,
        compressiveStrengthPsi: 40,
      },
    },
    pricing: {
      6: {
        blocksQty: 2.873,
        blocksTotal: 138984,
        accessoriesTotal: 8967,
        concreteTotal: 24251,
        rebarMeshTotal: 10561,
        laborInstallTotal: 28450,
        totalInstalledCost: 211213,
      },
    },
    accentColor: '#3b82f6',
  },
  {
    id: 'amvic',
    name: 'Amvic®',
    shortName: 'Amvic',
    tagline: 'Building Systems.',
    coreSizes: [4, 6, 8, 10, 12],
    defaultCore: 6,
    blocks: {
      6: {
        blockHeightIn: 16,
        blockLengthIn: 48,
        overallWidthIn: 11.0,
        foamPerSideIn: 2.5,
        sfPerBlock: 5.33,
        rValueCore: 22,
        rValueTotal: 30,
        bundleQtyStraight: 4,
        weightLbs: 2.9,
        compressiveStrengthPsi: 35,
      },
    },
    pricing: {
      6: {
        blocksQty: 2.873,
        blocksTotal: 96800,
        accessoriesTotal: 8200,
        concreteTotal: 24251,
        rebarMeshTotal: 10561,
        laborInstallTotal: 32000,
        totalInstalledCost: 171812,
      },
    },
    accentColor: '#f59e0b',
  },
  {
    id: 'quad-lock',
    name: 'Quad-Lock®',
    shortName: 'Quad-Lock',
    tagline: 'Building Systems.',
    systemType: 'panel', // panel/tie system, not a block
    coreSizes: [4, 6, 8, 10, 12],
    defaultCore: 6,
    blocks: {
      6: {
        blockHeightIn: 12,
        blockLengthIn: 48,
        overallWidthIn: null,       // panel width varies
        foamPerSideIn: null,        // needs verification
        sfPerBlock: 4.0,
        rValueCore: null,           // needs verification
        rValueTotal: null,
        bundleQtyStraight: null,
        weightLbs: null,
        compressiveStrengthPsi: null,
      },
    },
    pricing: {
      6: {
        blocksQty: 2.873,
        blocksTotal: 97000,
        accessoriesTotal: 11000,
        concreteTotal: 24251,
        rebarMeshTotal: 10561,
        laborInstallTotal: 31000,
        totalInstalledCost: 173812,
      },
    },
    accentColor: '#8b5cf6',
  },
  {
    id: 'superform',
    name: 'SuperForm®',
    shortName: 'SuperForm',
    tagline: 'Build Stronger.',
    coreSizes: [4, 6, 8, 10],
    defaultCore: 6,
    blocks: {
      6: {
        blockHeightIn: 16,
        blockLengthIn: 48,
        overallWidthIn: 11.0,
        foamPerSideIn: 2.5,
        sfPerBlock: 5.33,
        rValueCore: 23,
        rValueTotal: 23,
        bundleQtyStraight: 4,
        weightLbs: 2.7,
        compressiveStrengthPsi: 35,
      },
    },
    pricing: {
      6: {
        blocksQty: 2.873,
        blocksTotal: 97352,
        accessoriesTotal: 8734,
        concreteTotal: 24251,
        rebarMeshTotal: 10561,
        laborInstallTotal: 32160,
        totalInstalledCost: 173058,
      },
    },
    accentColor: '#ef4444',
  },
  {
    id: 'element-icf',
    name: 'Element ICF®',
    shortName: 'Element',
    tagline: 'Building Systems.',
    coreSizes: [4, 6, 8, 10, 12],
    defaultCore: 6,
    blocks: {
      6: {
        blockHeightIn: 16,
        blockLengthIn: 48,
        overallWidthIn: 11.0,
        foamPerSideIn: 2.5,
        sfPerBlock: 5.33,
        rValueCore: 24,
        rValueTotal: 26,
        bundleQtyStraight: 4,
        weightLbs: 3.0,
        compressiveStrengthPsi: 38,
      },
    },
    pricing: {
      6: {
        blocksQty: 2.873,
        blocksTotal: 97500,
        accessoriesTotal: 8600,
        concreteTotal: 24251,
        rebarMeshTotal: 10561,
        laborInstallTotal: 31500,
        totalInstalledCost: 172412,
      },
    },
    accentColor: '#06b6d4',
  },
  {
    id: 'stronghold',
    name: 'StrongHold®',
    shortName: 'StrongHold',
    tagline: 'ICF Systems.',
    coreSizes: [6, 8],
    defaultCore: 6,
    blocks: {
      6: {
        blockHeightIn: 16,
        blockLengthIn: 48,
        overallWidthIn: 11.5,
        foamPerSideIn: 2.75,
        sfPerBlock: 5.33,
        rValueCore: 25,
        rValueTotal: 25,
        bundleQtyStraight: 4,
        weightLbs: 3.1,
        compressiveStrengthPsi: 38,
      },
    },
    pricing: {
      6: {
        blocksQty: 2.873,
        blocksTotal: 98100,
        accessoriesTotal: 8900,
        concreteTotal: 24251,
        rebarMeshTotal: 10561,
        laborInstallTotal: 31800,
        totalInstalledCost: 173612,
      },
    },
    accentColor: '#dc2626',
  },
  {
    id: 'liteform',
    name: 'LiteForm®',
    shortName: 'LiteForm',
    tagline: 'Technologies Inc.',
    coreSizes: [4, 6, 8, 10, 12],
    defaultCore: 6,
    blocks: {
      6: {
        blockHeightIn: 16,
        blockLengthIn: 48,
        overallWidthIn: 11.0,
        foamPerSideIn: 2.5,
        sfPerBlock: 5.33,
        rValueCore: 23,
        rValueTotal: 23,
        bundleQtyStraight: 4,
        weightLbs: 2.8,
        compressiveStrengthPsi: 35,
      },
    },
    pricing: {
      6: {
        blocksQty: 2.873,
        blocksTotal: 96900,
        accessoriesTotal: 8300,
        concreteTotal: 24251,
        rebarMeshTotal: 10561,
        laborInstallTotal: 31200,
        totalInstalledCost: 171212,
      },
    },
    accentColor: '#64748b',
  },
]

export const getMfr = (id) => MANUFACTURERS.find((m) => m.id === id)

export const getMfrBlock = (id, coreSize = 6) => {
  const m = getMfr(id)
  return m?.blocks[coreSize] ?? m?.blocks[m.coreSizes[0]] ?? null
}

export const getMfrPricing = (id, coreSize = 6) => {
  const m = getMfr(id)
  return m?.pricing[coreSize] ?? m?.pricing[m.coreSizes[0]] ?? null
}
