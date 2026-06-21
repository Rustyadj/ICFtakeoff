import { create } from 'zustand'

const useAppStore = create((set) => ({
  // Theme
  isDark: true,
  toggleTheme: () => set((s) => ({ isDark: !s.isDark })),

  // Active project
  activeProject: {
    id: 'pine-ridge',
    name: 'Pine Ridge Custom Home',
    sf: 2847,
    coreSize: 6,
    levels: 'Basement + Main Level',
    openings: 18,
    corners: 42,
    tWalls: 2,
    maxWallHeight: 14,
    image: null,
  },

  // Compare page: which manufacturer is in each of the 4 columns
  compareSelections: ['nudura', 'fox-blocks', 'buildblock', 'superform'],
  setCompareSelection: (index, mfrId) =>
    set((s) => {
      const next = [...s.compareSelections]
      next[index] = mfrId
      return { compareSelections: next }
    }),
}))

export default useAppStore
