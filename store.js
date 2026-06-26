import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── App Store ───────────────────────────────────────────────────────────────
export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: {
        id: 'user_001',
        name: 'Arjun Kumar',
        initials: 'AK',
        email: 'arjun@example.com',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        xp: 2840,
        level: 12,
        title: 'Civic Champion',
        topPercent: 3,
        reports: 143,
        resolved: 118,
        votesReceived: 892,
        badges: ['first_responder','photo_pro','speed_reporter','monsoon_watch','validator','top10_weekly'],
        streak: 7,
        avatar: null,
      },

      // Issues
      issues: [],
      issuesLoaded: false,
      activeFilter: 'all',
      searchQuery: '',
      sortBy: 'newest',

      // UI
      reportModalOpen: false,
      selectedIssue: null,
      notifications: [
        { id:1, text:'Your pothole report was verified by 3 neighbors!', time:'5m ago', read:false, type:'verify' },
        { id:2, text:'Issue #1247 assigned to PWD — estimated fix: 2 days', time:'1h ago', read:false, type:'update' },
        { id:3, text:'You earned the "Speed Reporter" badge!', time:'3h ago', read:true, type:'badge' },
        { id:4, text:'Rain alert: 3 drainage zones pre-flagged by AI', time:'6h ago', read:true, type:'ai' },
      ],

      // Actions
      setIssues: (issues) => set({ issues, issuesLoaded: true }),
      addIssue: (issue) => set((s) => ({ issues: [issue, ...s.issues] })),
      updateIssue: (id, updates) => set((s) => ({
        issues: s.issues.map(i => i.id === id ? { ...i, ...updates } : i)
      })),
      setFilter: (filter) => set({ activeFilter: filter }),
      setSearch: (q) => set({ searchQuery: q }),
      setSort: (by) => set({ sortBy: by }),
      openReportModal: () => set({ reportModalOpen: true }),
      closeReportModal: () => set({ reportModalOpen: false }),
      selectIssue: (issue) => set({ selectedIssue: issue }),
      clearSelected: () => set({ selectedIssue: null }),
      markNotificationRead: (id) => set((s) => ({
        notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      addXP: (amount) => set((s) => {
        const newXP = s.user.xp + amount
        const newLevel = Math.floor(newXP / 300) + 1
        return { user: { ...s.user, xp: newXP, level: newLevel } }
      }),
      voteIssue: (id, dir) => set((s) => ({
        issues: s.issues.map(i =>
          i.id === id ? { ...i, votes: i.votes + (dir === 'up' ? 1 : -1), userVoted: dir } : i
        )
      })),
      verifyIssue: (id) => set((s) => ({
        issues: s.issues.map(i =>
          i.id === id ? { ...i, verifications: i.verifications + 1, userVerified: true } : i
        )
      })),

      // Computed
      getFilteredIssues: () => {
        const { issues, activeFilter, searchQuery, sortBy } = get()
        let result = [...issues]

        if (activeFilter !== 'all') {
          result = result.filter(i =>
            i.category === activeFilter ||
            i.severity === activeFilter ||
            i.status === activeFilter
          )
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          result = result.filter(i =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.category.toLowerCase().includes(q) ||
            i.location?.address?.toLowerCase().includes(q)
          )
        }
        const order = { critical:0, high:1, medium:2, low:3 }
        if (sortBy === 'newest') result.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        else if (sortBy === 'votes') result.sort((a,b) => b.votes - a.votes)
        else if (sortBy === 'critical') result.sort((a,b) => (order[a.severity]||4) - (order[b.severity]||4))
        else if (sortBy === 'verifications') result.sort((a,b) => b.verifications - a.verifications)

        return result
      },
    }),
    { name: 'civicpulse-store', partialize: (s) => ({ user: s.user }) }
  )
)
