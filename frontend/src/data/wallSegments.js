// Pine Ridge Custom Home — Wall Segments
// Used by calcTakeoff() to produce per-segment and total quantities.
// Lengths, heights, and openings are all in feet.

export const WALL_SEGMENTS = [
  // ── BASEMENT LEVEL (9′–0″ walls) ─────────────────────────────────────
  {
    id: 'bl-north', label: 'North Exterior', level: 'Basement',
    lengthFt: 60, heightFt: 9,
    openings: [
      { label: 'Egress Window A', widthFt: 3.33, heightFt: 2.5 },
      { label: 'Egress Window B', widthFt: 3.33, heightFt: 2.5 },
    ],
  },
  {
    id: 'bl-east', label: 'East Exterior', level: 'Basement',
    lengthFt: 44, heightFt: 9,
    openings: [
      { label: 'Egress Window', widthFt: 3.33, heightFt: 3 },
      { label: 'Window', widthFt: 3.33, heightFt: 2.5 },
    ],
  },
  {
    id: 'bl-south', label: 'South Exterior', level: 'Basement',
    lengthFt: 60, heightFt: 9,
    openings: [
      { label: 'Walk-out Door', widthFt: 3, heightFt: 6.83 },
      { label: 'Window A', widthFt: 3.33, heightFt: 2.5 },
      { label: 'Window B', widthFt: 3.33, heightFt: 2.5 },
    ],
  },
  {
    id: 'bl-west', label: 'West Exterior', level: 'Basement',
    lengthFt: 44, heightFt: 9,
    openings: [],
  },
  {
    id: 'bl-gar-front', label: 'Garage Front', level: 'Basement',
    lengthFt: 26, heightFt: 9,
    openings: [
      { label: 'Overhead Door', widthFt: 16, heightFt: 7 },
    ],
  },
  {
    id: 'bl-gar-west', label: 'Garage West', level: 'Basement',
    lengthFt: 20, heightFt: 9,
    openings: [],
  },
  {
    id: 'bl-int-a', label: 'Interior Partition', level: 'Basement',
    lengthFt: 40, heightFt: 9,
    openings: [
      { label: 'Interior Door', widthFt: 3, heightFt: 6.83 },
    ],
  },

  // ── MAIN LEVEL (9′–0″ walls) ──────────────────────────────────────────
  {
    id: 'ml-north', label: 'North Exterior', level: 'Main Level',
    lengthFt: 60, heightFt: 9,
    openings: [
      { label: 'Entry Door', widthFt: 3.5, heightFt: 6.83 },
      { label: 'Window A', widthFt: 4, heightFt: 4 },
      { label: 'Window B', widthFt: 4, heightFt: 4 },
      { label: 'Window C', widthFt: 3, heightFt: 3.5 },
    ],
  },
  {
    id: 'ml-east', label: 'East Exterior', level: 'Main Level',
    lengthFt: 44, heightFt: 9,
    openings: [
      { label: 'Patio Door', widthFt: 6, heightFt: 6.83 },
      { label: 'Window A', widthFt: 4, heightFt: 4 },
      { label: 'Window B', widthFt: 4, heightFt: 4 },
    ],
  },
  {
    id: 'ml-south', label: 'South Exterior', level: 'Main Level',
    lengthFt: 60, heightFt: 9,
    openings: [
      { label: 'Back Door', widthFt: 3, heightFt: 6.83 },
      { label: 'Window A', widthFt: 4, heightFt: 4 },
      { label: 'Window B', widthFt: 4, heightFt: 4 },
      { label: 'Window C', widthFt: 3, heightFt: 3.5 },
    ],
  },
  {
    id: 'ml-west', label: 'West Exterior', level: 'Main Level',
    lengthFt: 44, heightFt: 9,
    openings: [
      { label: 'Window', widthFt: 3, heightFt: 3.5 },
    ],
  },
  {
    id: 'ml-gar-front', label: 'Garage Front', level: 'Main Level',
    lengthFt: 26, heightFt: 9,
    openings: [
      { label: 'Overhead Door', widthFt: 16, heightFt: 7 },
    ],
  },
  {
    id: 'ml-gar-west', label: 'Garage West', level: 'Main Level',
    lengthFt: 20, heightFt: 9,
    openings: [
      { label: 'Window', widthFt: 3, heightFt: 3.5 },
    ],
  },
  {
    id: 'ml-int-a', label: 'Interior Partition A', level: 'Main Level',
    lengthFt: 28, heightFt: 9,
    openings: [
      { label: 'Interior Door', widthFt: 3, heightFt: 6.83 },
    ],
  },
  {
    id: 'ml-int-b', label: 'Interior Partition B', level: 'Main Level',
    lengthFt: 16, heightFt: 9,
    openings: [
      { label: 'Interior Door', widthFt: 3, heightFt: 6.83 },
    ],
  },
]

// Corner junctions: each 90° junction uses 2 corner blocks per course
// T-wall junctions: each uses 1 T-block per course (or cut straight)
export const PROJECT_CORNERS = {
  junctions90: 8,    // 4 per level × 2 levels (exterior rectangle + garage junction)
  junctionsInterior: 4, // 2 per level interior L-corners
  tWallJunctions: 4, // 2 per level (partition endpoints into exterior)
}
