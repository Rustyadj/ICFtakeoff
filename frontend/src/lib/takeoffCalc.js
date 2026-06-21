// ICF Takeoff Calculation Engine
// All inputs in feet (lengths, heights) or inches (block dimensions).
// Returns per-segment detail and project-level totals.

/**
 * @param {Array}  segments       — from wallSegments.js
 * @param {Object} block          — getMfrBlock(mfrId, coreSize)
 * @param {number} coreSizeIn     — e.g. 6 (inches)
 * @param {Object} corners        — PROJECT_CORNERS from wallSegments.js
 * @param {Object} wastePcts      — { blocks, rebar, concrete } in percent (e.g. 5)
 * @param {Object} rebarSpacing   — { horizIn: 18, vertIn: 24 } spacing in inches
 */
export function calcTakeoff(
  segments,
  block,
  coreSizeIn,
  corners,
  wastePcts = { blocks: 5, rebar: 7.5, concrete: 4 },
  rebarSpacing = { horizIn: 18, vertIn: 24 },
) {
  const { blockHeightIn, blockLengthIn, sfPerBlock } = block
  const blockLengthFt = blockLengthIn / 12
  const coreWidthFt = coreSizeIn / 12

  // ── Per-segment calculations ──────────────────────────────────────────
  const segCalcs = segments.map((seg) => {
    const openingsAreaSf = seg.openings.reduce((s, o) => s + o.widthFt * o.heightFt, 0)
    const grossAreaSf = seg.lengthFt * seg.heightFt
    const netAreaSf = Math.max(0, grossAreaSf - openingsAreaSf)

    // Courses: always ceiling — a partial course still needs a full (or cut) course
    const courses = Math.ceil((seg.heightFt * 12) / blockHeightIn)
    const isCutCourse = (seg.heightFt * 12) % blockHeightIn !== 0

    // Block count — course-first: ceil(length / blockLength) per course
    const blocksPerCourse = Math.ceil(seg.lengthFt / blockLengthFt)
    const grossBlocks = blocksPerCourse * courses

    // Deduct blocks covered by openings (area-based)
    const openingBlockDeduct = Math.round(openingsAreaSf / sfPerBlock)
    const netBlocks = Math.max(0, grossBlocks - openingBlockDeduct)

    // Concrete for this segment: length × core width × height ÷ 27
    const concreteYd3 = (seg.lengthFt * coreWidthFt * seg.heightFt) / 27

    return {
      id: seg.id,
      label: seg.label,
      level: seg.level,
      lengthFt: seg.lengthFt,
      heightFt: seg.heightFt,
      openings: seg.openings,
      openingsAreaSf: round1(openingsAreaSf),
      grossAreaSf: round1(grossAreaSf),
      netAreaSf: round1(netAreaSf),
      courses,
      isCutCourse,
      blocksPerCourse,
      grossBlocks,
      openingBlockDeduct,
      netBlocks,
      concreteYd3: round2(concreteYd3),
    }
  })

  // ── Project totals ────────────────────────────────────────────────────
  const totalLengthFt = sumBy(segCalcs, 'lengthFt')
  const totalGrossAreaSf = sumBy(segCalcs, 'grossAreaSf')
  const totalOpeningsAreaSf = sumBy(segCalcs, 'openingsAreaSf')
  const totalNetAreaSf = round1(totalGrossAreaSf - totalOpeningsAreaSf)

  // Max courses (drives rebar row count)
  const maxCourses = Math.max(...segCalcs.map((s) => s.courses))

  // ── Block quantities ──────────────────────────────────────────────────
  const totalNetBlocks = sumBy(segCalcs, 'netBlocks')

  // Corner blocks: each 90° junction uses 2 corner blocks per course
  // Interior L-corners: same formula
  const cornerBlockCount =
    (corners.junctions90 + corners.junctionsInterior) * 2 * maxCourses

  // T-wall blocks: each T-junction uses 1 T-block (or cut) per course
  const tBlockCount = corners.tWallJunctions * maxCourses

  // Straight blocks = everything that isn't a corner or T-block
  const specialBlockCount = cornerBlockCount + tBlockCount
  const straightBlocks = Math.max(0, totalNetBlocks - specialBlockCount)

  // Waste-adjusted quantities
  const bw = 1 + wastePcts.blocks / 100
  const straightWithWaste = Math.ceil(straightBlocks * bw)
  const cornersWithWaste = Math.ceil(cornerBlockCount * bw)
  const tBlocksWithWaste = Math.ceil(tBlockCount * bw)
  const totalBlocksWithWaste = straightWithWaste + cornersWithWaste + tBlocksWithWaste

  // ── Top course check ─────────────────────────────────────────────────
  // Per the domain spec: does wall height land on a full course?
  const topCourseCheck = segCalcs.map((s) => ({
    id: s.id,
    label: `${s.level} — ${s.label}`,
    heightFt: s.heightFt,
    courses: s.courses,
    exactFit: !s.isCutCourse,
    cutHeightIn:
      s.isCutCourse
        ? (s.heightFt * 12) % blockHeightIn
        : 0,
  }))

  // ── Concrete ─────────────────────────────────────────────────────────
  // Formula: Wall Length × Core Width (ft) × Wall Height ÷ 27
  const totalConcreteRaw = sumBy(segCalcs, 'concreteYd3')
  const concreteWithWaste = round2(totalConcreteRaw * (1 + wastePcts.concrete / 100))

  // ── Rebar ─────────────────────────────────────────────────────────────
  // Horizontal: (wall length ÷ rebar spacing) × rows per course × courses
  // rows per course = 2 (top + bottom of cavity)
  // Then × 1.15 for corner laps and development lengths
  const horizRows = maxCourses * 2 // 2 bars per course
  const rebarHorizRaw = totalLengthFt * horizRows
  const rebarHorizWithLaps = Math.ceil(rebarHorizRaw * 1.15)

  // Vertical: (wall length ÷ vertical spacing in ft) × wall height
  const vertSpacingFt = rebarSpacing.vertIn / 12
  const vertBarCount = Math.ceil(totalLengthFt / vertSpacingFt)
  // Use max wall height across project
  const maxWallHeightFt = Math.max(...segments.map((s) => s.heightFt))
  const rebarVertRaw = vertBarCount * maxWallHeightFt
  const rebarVertWithLaps = Math.ceil(rebarVertRaw * 1.15)

  const totalRebarLf = rebarHorizWithLaps + rebarVertWithLaps
  const totalRebarWithWaste = Math.ceil(totalRebarLf * (1 + wastePcts.rebar / 100))

  // Standard 20′ rebar bars
  const rebarBarCount = Math.ceil(totalRebarWithWaste / 20)

  // ── Buck material (LF of 2× lumber framing around openings) ──────────
  // Each opening needs a rough buck: 2 sides + top = (2×h + w) × 2 sides of foam
  const buckLf = Math.ceil(
    segments.reduce(
      (sum, seg) =>
        sum + seg.openings.reduce((os, o) => os + 2 * o.heightFt + o.widthFt, 0),
      0,
    ) * 2, // doubled for both sides of the ICF foam
  )

  // Opening count
  const totalOpeningsCount = segments.reduce((s, seg) => s + seg.openings.length, 0)

  // Lintel rebar: one #5 bar × 2 per opening × (widthFt + 1.5ft each side development)
  const lintelBarLf = segments.reduce(
    (sum, seg) =>
      sum + seg.openings.reduce((os, o) => os + (o.widthFt + 3) * 2, 0),
    0,
  )

  // ── Bracing ───────────────────────────────────────────────────────────
  // Typical: 1 brace set per 5 LF of wall height ≥ 6′
  const braceCount = Math.ceil(totalLengthFt / 5)
  const scaffoldCount = braceCount // scaffold matches brace sets

  // Strongbacks: required when wall height > 10′ or large openings > 8′ wide
  const strongbackSegments = segments.filter(
    (s) => s.heightFt > 10 || s.openings.some((o) => o.widthFt > 8),
  )
  const strongbackCount = strongbackSegments.length > 0
    ? Math.ceil(strongbackSegments.reduce((s, x) => s + x.lengthFt, 0) / 4)
    : 0

  // ── Foam loss (opening cutouts) ───────────────────────────────────────
  // Foam cut from openings — typically charged as waste to manufacturer blocks
  const foamLossBlocks = sumBy(segCalcs, 'openingBlockDeduct')

  return {
    // Segment detail
    segCalcs,
    topCourseCheck,

    // Dimensions
    totalLengthFt,
    totalGrossAreaSf,
    totalOpeningsAreaSf: round1(totalOpeningsAreaSf),
    totalNetAreaSf,
    totalOpeningsCount,
    maxCourses,
    maxWallHeightFt,

    // Blocks (no waste)
    straightBlocks,
    cornerBlocks: cornerBlockCount,
    tBlocks: tBlockCount,
    foamLossBlocks,
    totalNetBlocks,

    // Blocks (with waste)
    straightWithWaste,
    cornersWithWaste,
    tBlocksWithWaste,
    totalBlocksWithWaste,

    // Concrete
    concreteRaw: round2(totalConcreteRaw),
    concreteWithWaste,

    // Rebar
    rebarHorizLf: rebarHorizWithLaps,
    rebarVertLf: rebarVertWithLaps,
    totalRebarLf,
    totalRebarWithWaste,
    rebarBarCount,
    lintelBarLf: Math.ceil(lintelBarLf),

    // Buck material
    buckLf,

    // Bracing / scaffold / strongbacks
    braceCount,
    scaffoldCount,
    strongbackCount,
    strongbackSegments: strongbackSegments.map((s) => s.label),

    // Waste factors used
    wastePcts,
    rebarSpacing,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────
const sumBy = (arr, key) => arr.reduce((s, x) => s + (x[key] || 0), 0)
const round1 = (n) => Math.round(n * 10) / 10
const round2 = (n) => Math.round(n * 100) / 100
