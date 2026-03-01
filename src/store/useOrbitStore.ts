import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ExpenseItem,
  GoalItem,
  HabitItem,
  OrbitBackup,
  PersonalCareItem,
  RenewalItem,
  SubscriptionItem,
  ThemeMode,
  WishlistItem,
} from '../types'
import { addDays, toIsoDate } from '../utils/date'

type DeletedEntityType =
  | 'personalCare'
  | 'subscriptions'
  | 'expenses'
  | 'goals'
  | 'habits'
  | 'wishlist'
  | 'renewals'

interface DeletedEntry {
  type: DeletedEntityType
  item:
    | PersonalCareItem
    | SubscriptionItem
    | ExpenseItem
    | GoalItem
    | HabitItem
    | WishlistItem
    | RenewalItem
}

interface OrbitState extends OrbitBackup {
  theme: ThemeMode
  searchQuery: string
  lastDeleted?: DeletedEntry
  setTheme: (theme: ThemeMode) => void
  setSearchQuery: (query: string) => void
  addPersonalCare: (item: Omit<PersonalCareItem, 'id' | 'createdAt' | 'refillDate'>) => void
  updatePersonalCare: (id: string, updates: Partial<PersonalCareItem>) => void
  deletePersonalCare: (id: string) => void
  addSubscription: (item: Omit<SubscriptionItem, 'id' | 'createdAt' | 'yearlyTotal'>) => void
  updateSubscription: (id: string, updates: Partial<SubscriptionItem>) => void
  deleteSubscription: (id: string) => void
  addExpense: (item: Omit<ExpenseItem, 'id' | 'createdAt'>) => void
  deleteExpense: (id: string) => void
  addGoal: (item: Omit<GoalItem, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, updates: Partial<GoalItem>) => void
  deleteGoal: (id: string) => void
  addHabit: (title: string) => void
  toggleHabitDay: (id: string, isoDate?: string) => void
  deleteHabit: (id: string) => void
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'createdAt' | 'purchased'>) => void
  toggleWishlistPurchased: (id: string) => void
  deleteWishlistItem: (id: string) => void
  addRenewal: (item: Omit<RenewalItem, 'id' | 'createdAt'>) => void
  deleteRenewal: (id: string) => void
  undoDelete: () => boolean
  exportData: () => OrbitBackup
  importData: (payload: OrbitBackup) => void
}

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const useOrbitStore = create<OrbitState>()(
  persist(
    // Architecture: one persisted store powers all trackers and utility actions.
    (set, get) => ({
      personalCare: [],
      subscriptions: [],
      expenses: [],
      goals: [],
      habits: [],
      wishlist: [],
      renewals: [],
      theme: 'dark',
      searchQuery: '',
      setTheme: (theme) => set({ theme }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      addPersonalCare: (item) =>
        set((state) => {
          const refillDate = addDays(item.purchaseDate, item.estimatedDays)
          return {
            personalCare: [
              {
                ...item,
                id: uid('pc'),
                refillDate,
                createdAt: toIsoDate(new Date()),
              },
              ...state.personalCare,
            ],
          }
        }),
      updatePersonalCare: (id, updates) =>
        set((state) => ({
          personalCare: state.personalCare.map((item) => {
            if (item.id !== id) {
              return item
            }
            const next = { ...item, ...updates }
            if (updates.purchaseDate || updates.estimatedDays) {
              next.refillDate = addDays(next.purchaseDate, next.estimatedDays)
            }
            return next
          }),
        })),
      deletePersonalCare: (id) =>
        set((state) => {
          const item = state.personalCare.find((entry) => entry.id === id)
          return {
            personalCare: state.personalCare.filter((entry) => entry.id !== id),
            lastDeleted: item ? { type: 'personalCare', item } : state.lastDeleted,
          }
        }),

      addSubscription: (item) =>
        set((state) => ({
          subscriptions: [
            {
              ...item,
              id: uid('sub'),
              yearlyTotal: item.billingCycle === 'monthly' ? item.monthlyPrice * 12 : item.monthlyPrice,
              createdAt: toIsoDate(new Date()),
            },
            ...state.subscriptions,
          ],
        })),
      updateSubscription: (id, updates) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((item) => {
            if (item.id !== id) {
              return item
            }
            const next = { ...item, ...updates }
            next.yearlyTotal =
              next.billingCycle === 'monthly' ? next.monthlyPrice * 12 : next.monthlyPrice
            return next
          }),
        })),
      deleteSubscription: (id) =>
        set((state) => {
          const item = state.subscriptions.find((entry) => entry.id === id)
          return {
            subscriptions: state.subscriptions.filter((entry) => entry.id !== id),
            lastDeleted: item ? { type: 'subscriptions', item } : state.lastDeleted,
          }
        }),

      addExpense: (item) =>
        set((state) => ({
          expenses: [{ ...item, id: uid('exp'), createdAt: toIsoDate(new Date()) }, ...state.expenses],
        })),
      deleteExpense: (id) =>
        set((state) => {
          const item = state.expenses.find((entry) => entry.id === id)
          return {
            expenses: state.expenses.filter((entry) => entry.id !== id),
            lastDeleted: item ? { type: 'expenses', item } : state.lastDeleted,
          }
        }),

      addGoal: (item) =>
        set((state) => ({
          goals: [{ ...item, id: uid('goal'), createdAt: toIsoDate(new Date()) }, ...state.goals],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({ goals: state.goals.map((item) => (item.id === id ? { ...item, ...updates } : item)) })),
      deleteGoal: (id) =>
        set((state) => {
          const item = state.goals.find((entry) => entry.id === id)
          return {
            goals: state.goals.filter((entry) => entry.id !== id),
            lastDeleted: item ? { type: 'goals', item } : state.lastDeleted,
          }
        }),

      addHabit: (title) =>
        set((state) => ({
          habits: [{ id: uid('habit'), title, completedDates: [], createdAt: toIsoDate(new Date()) }, ...state.habits],
        })),
      toggleHabitDay: (id, isoDate = toIsoDate(new Date())) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) {
              return habit
            }
            const exists = habit.completedDates.includes(isoDate)
            return {
              ...habit,
              completedDates: exists
                ? habit.completedDates.filter((entry) => entry !== isoDate)
                : [...habit.completedDates, isoDate],
            }
          }),
        })),
      deleteHabit: (id) =>
        set((state) => {
          const item = state.habits.find((entry) => entry.id === id)
          return {
            habits: state.habits.filter((entry) => entry.id !== id),
            lastDeleted: item ? { type: 'habits', item } : state.lastDeleted,
          }
        }),

      addWishlistItem: (item) =>
        set((state) => ({
          wishlist: [{ ...item, purchased: false, id: uid('wish'), createdAt: toIsoDate(new Date()) }, ...state.wishlist],
        })),
      toggleWishlistPurchased: (id) =>
        set((state) => ({
          wishlist: state.wishlist.map((item) =>
            item.id === id ? { ...item, purchased: !item.purchased } : item,
          ),
        })),
      deleteWishlistItem: (id) =>
        set((state) => {
          const item = state.wishlist.find((entry) => entry.id === id)
          return {
            wishlist: state.wishlist.filter((entry) => entry.id !== id),
            lastDeleted: item ? { type: 'wishlist', item } : state.lastDeleted,
          }
        }),

      addRenewal: (item) =>
        set((state) => ({
          renewals: [{ ...item, id: uid('renew'), createdAt: toIsoDate(new Date()) }, ...state.renewals],
        })),
      deleteRenewal: (id) =>
        set((state) => {
          const item = state.renewals.find((entry) => entry.id === id)
          return {
            renewals: state.renewals.filter((entry) => entry.id !== id),
            lastDeleted: item ? { type: 'renewals', item } : state.lastDeleted,
          }
        }),

      undoDelete: () => {
        const deleted = get().lastDeleted
        if (!deleted) {
          return false
        }

        set((state) => {
          switch (deleted.type) {
            case 'personalCare':
              return { personalCare: [deleted.item as PersonalCareItem, ...state.personalCare], lastDeleted: undefined }
            case 'subscriptions':
              return {
                subscriptions: [deleted.item as SubscriptionItem, ...state.subscriptions],
                lastDeleted: undefined,
              }
            case 'expenses':
              return { expenses: [deleted.item as ExpenseItem, ...state.expenses], lastDeleted: undefined }
            case 'goals':
              return { goals: [deleted.item as GoalItem, ...state.goals], lastDeleted: undefined }
            case 'habits':
              return { habits: [deleted.item as HabitItem, ...state.habits], lastDeleted: undefined }
            case 'wishlist':
              return { wishlist: [deleted.item as WishlistItem, ...state.wishlist], lastDeleted: undefined }
            case 'renewals':
              return { renewals: [deleted.item as RenewalItem, ...state.renewals], lastDeleted: undefined }
            default:
              return state
          }
        })

        return true
      },

      exportData: () => ({
        personalCare: get().personalCare,
        subscriptions: get().subscriptions,
        expenses: get().expenses,
        goals: get().goals,
        habits: get().habits,
        wishlist: get().wishlist,
        renewals: get().renewals,
      }),

      importData: (payload) =>
        set({
          personalCare: payload.personalCare ?? [],
          subscriptions: payload.subscriptions ?? [],
          expenses: payload.expenses ?? [],
          goals: payload.goals ?? [],
          habits: payload.habits ?? [],
          wishlist: payload.wishlist ?? [],
          renewals: payload.renewals ?? [],
        }),
    }),
    {
      name: 'orbit-storage-v1',
      partialize: (state) => ({
        personalCare: state.personalCare,
        subscriptions: state.subscriptions,
        expenses: state.expenses,
        goals: state.goals,
        habits: state.habits,
        wishlist: state.wishlist,
        renewals: state.renewals,
        theme: state.theme,
      }),
    },
  ),
)
