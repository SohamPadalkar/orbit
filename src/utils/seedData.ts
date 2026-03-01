import type {
  ExpenseItem,
  GoalItem,
  HabitItem,
  PersonalCareItem,
  RenewalItem,
  SubscriptionItem,
  WishlistItem,
} from '../types'
import { addDays, toIsoDate } from './date'

const today = toIsoDate(new Date())

export const seedPersonalCare: PersonalCareItem[] = [
  {
    id: 'pc-1',
    name: 'Face Wash',
    category: 'skincare',
    purchaseDate: addDays(today, -20),
    expiryDate: addDays(today, 260),
    estimatedDays: 45,
    refillDate: addDays(today, 25),
    stockLevel: 32,
    notes: 'Use twice daily.',
    createdAt: addDays(today, -20),
  },
  {
    id: 'pc-2',
    name: 'Shampoo',
    category: 'haircare',
    purchaseDate: addDays(today, -40),
    estimatedDays: 60,
    refillDate: addDays(today, 20),
    stockLevel: 22,
    createdAt: addDays(today, -40),
  },
]

export const seedSubscriptions: SubscriptionItem[] = [
  {
    id: 'sub-1',
    name: 'Netflix',
    category: 'Entertainment',
    monthlyPrice: 649,
    billingCycle: 'monthly',
    nextRenewalDate: addDays(today, 4),
    yearlyTotal: 649 * 12,
    isActive: true,
    remindersEnabled: true,
    createdAt: addDays(today, -120),
  },
  {
    id: 'sub-2',
    name: 'Gym',
    category: 'Fitness',
    monthlyPrice: 1500,
    billingCycle: 'monthly',
    nextRenewalDate: addDays(today, 8),
    yearlyTotal: 1500 * 12,
    isActive: true,
    remindersEnabled: true,
    createdAt: addDays(today, -80),
  },
]

export const seedExpenses: ExpenseItem[] = [
  { id: 'exp-1', category: 'Food', amount: 2800, date: addDays(today, -3), note: 'Groceries', createdAt: addDays(today, -3) },
  { id: 'exp-2', category: 'Transport', amount: 950, date: addDays(today, -2), createdAt: addDays(today, -2) },
  { id: 'exp-3', category: 'Study', amount: 1200, date: addDays(today, -1), createdAt: addDays(today, -1) },
]

export const seedGoals: GoalItem[] = [
  {
    id: 'goal-1',
    title: 'Save ₹10,000',
    targetValue: 10000,
    currentValue: 3400,
    deadline: addDays(today, 120),
    unit: '₹',
    createdAt: addDays(today, -10),
  },
  {
    id: 'goal-2',
    title: 'Read 12 books',
    targetValue: 12,
    currentValue: 3,
    deadline: addDays(today, 250),
    unit: 'books',
    createdAt: addDays(today, -20),
  },
]

export const seedHabits: HabitItem[] = [
  {
    id: 'habit-1',
    title: 'Workout',
    completedDates: [addDays(today, -3), addDays(today, -2), addDays(today, -1), today],
    createdAt: addDays(today, -30),
  },
  {
    id: 'habit-2',
    title: 'Study 1 hour',
    completedDates: [addDays(today, -2), addDays(today, -1)],
    createdAt: addDays(today, -18),
  },
]

export const seedWishlist: WishlistItem[] = [
  {
    id: 'wish-1',
    name: 'Noise-cancelling Headphones',
    price: 6999,
    priority: 'high',
    link: 'https://example.com',
    purchased: false,
    notes: 'For focused study sessions',
    createdAt: addDays(today, -12),
  },
]

export const seedRenewals: RenewalItem[] = [
  {
    id: 'renew-1',
    title: 'College ID Renewal',
    type: 'Education',
    dueDate: addDays(today, 6),
    notes: 'Bring passport photo',
    createdAt: addDays(today, -10),
  },
]
