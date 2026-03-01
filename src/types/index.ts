export type ThemeMode = 'light' | 'dark'

export type CareCategory = 'skincare' | 'haircare' | 'hygiene' | 'health' | 'other'

export interface PersonalCareItem {
  id: string
  name: string
  category: CareCategory
  purchaseDate: string
  expiryDate?: string
  estimatedDays: number
  refillDate: string
  stockLevel: number
  notes?: string
  createdAt: string
}

export type SubscriptionCategory = 'Entertainment' | 'Fitness' | 'Education' | 'Software' | 'Other'
export type BillingCycle = 'monthly' | 'yearly'

export interface SubscriptionItem {
  id: string
  name: string
  category: SubscriptionCategory
  monthlyPrice: number
  billingCycle: BillingCycle
  nextRenewalDate: string
  yearlyTotal: number
  isActive: boolean
  remindersEnabled: boolean
  createdAt: string
}

export interface ExpenseItem {
  id: string
  category: string
  amount: number
  date: string
  note?: string
  createdAt: string
}

export interface GoalItem {
  id: string
  title: string
  targetValue: number
  currentValue: number
  deadline: string
  unit?: string
  createdAt: string
}

export interface HabitItem {
  id: string
  title: string
  completedDates: string[]
  createdAt: string
}

export type WishlistPriority = 'low' | 'medium' | 'high'

export interface WishlistItem {
  id: string
  name: string
  price: number
  priority: WishlistPriority
  link?: string
  notes?: string
  purchased: boolean
  createdAt: string
}

export interface RenewalItem {
  id: string
  title: string
  type: string
  dueDate: string
  notes?: string
  createdAt: string
}

export interface OrbitBackup {
  personalCare: PersonalCareItem[]
  subscriptions: SubscriptionItem[]
  expenses: ExpenseItem[]
  goals: GoalItem[]
  habits: HabitItem[]
  wishlist: WishlistItem[]
  renewals: RenewalItem[]
}
