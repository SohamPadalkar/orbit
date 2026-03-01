import { useState } from 'react'
import { useOrbitStore } from '../../store/useOrbitStore'
import type { CareCategory, SubscriptionCategory, WishlistPriority } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Tabs } from '../ui/Tabs'
import { useToast } from '../ui/ToastProvider'

const tabs = ['Care', 'Subscription', 'Expense', 'Goal', 'Habit', 'Renewal', 'Wishlist']
const careCategories: CareCategory[] = ['skincare', 'haircare', 'hygiene', 'health', 'other']
const subscriptionCategories: SubscriptionCategory[] = [
  'Entertainment',
  'Fitness',
  'Education',
  'Software',
  'Other',
]
const wishlistPriorities: WishlistPriority[] = ['low', 'medium', 'high']

interface QuickAddModalProps {
  open: boolean
  onClose: () => void
}

const today = new Date().toISOString().slice(0, 10)

export function QuickAddModal({ open, onClose }: QuickAddModalProps) {
  const [tab, setTab] = useState('Care')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(today)
  const [secondary, setSecondary] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<WishlistPriority>('medium')

  const addPersonalCare = useOrbitStore((state) => state.addPersonalCare)
  const addSubscription = useOrbitStore((state) => state.addSubscription)
  const addExpense = useOrbitStore((state) => state.addExpense)
  const addGoal = useOrbitStore((state) => state.addGoal)
  const addHabit = useOrbitStore((state) => state.addHabit)
  const addRenewal = useOrbitStore((state) => state.addRenewal)
  const addWishlistItem = useOrbitStore((state) => state.addWishlistItem)

  const { notify } = useToast()

  const reset = () => {
    setName('')
    setAmount('')
    setSecondary('')
    setDate(today)
    setCategory('')
    setPriority('medium')
  }

  const submit = () => {
    const numeric = Number(amount)

    if (!name.trim()) {
      notify('Please enter a name')
      return
    }

    if (!Number.isFinite(numeric) && tab !== 'Habit' && tab !== 'Renewal') {
      notify('Enter a valid number')
      return
    }

    if (numeric < 0) {
      notify('Number cannot be negative')
      return
    }

    if (tab === 'Care') {
      addPersonalCare({
        name,
        category: (category || 'skincare') as CareCategory,
        purchaseDate: date,
        estimatedDays: numeric || 30,
        stockLevel: 100,
        notes: secondary,
      })
    }

    if (tab === 'Subscription') {
      addSubscription({
        name,
        category: (category || 'Entertainment') as SubscriptionCategory,
        monthlyPrice: numeric || 0,
        billingCycle: 'monthly',
        nextRenewalDate: date,
        isActive: true,
        remindersEnabled: true,
      })
    }

    if (tab === 'Expense') {
      addExpense({
        category: category || 'General',
        amount: numeric || 0,
        date,
        note: name,
      })
    }

    if (tab === 'Goal') {
      addGoal({
        title: name,
        targetValue: numeric || 100,
        currentValue: 0,
        deadline: date,
        unit: secondary || '',
      })
    }

    if (tab === 'Habit') {
      addHabit(name)
    }

    if (tab === 'Renewal') {
      addRenewal({ title: name, type: secondary || 'General', dueDate: date })
    }

    if (tab === 'Wishlist') {
      addWishlistItem({
        name,
        price: numeric || 0,
        priority,
        link: secondary,
      })
    }

    notify(`${tab} added`)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Quick Add">
      <div className="space-y-4">
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
        <Input placeholder="Name / Title" value={name} onChange={(event) => setName(event.target.value)} />

        {tab === 'Care' ? (
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
          >
            <option value="">Select care category</option>
            {careCategories.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        ) : null}

        {tab === 'Subscription' ? (
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
          >
            <option value="">Select subscription category</option>
            {subscriptionCategories.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        ) : null}

        {tab === 'Expense' ? (
          <Input
            placeholder="Expense category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
        ) : null}

        {tab === 'Wishlist' ? (
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as WishlistPriority)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
          >
            {wishlistPriorities.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        ) : null}

        <Input
          type="number"
          placeholder={tab === 'Care' ? 'Estimated days' : 'Amount / Price / Target'}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <Input
          placeholder={tab === 'Expense' ? 'Optional note' : 'Optional note / link / unit'}
          value={secondary}
          onChange={(event) => setSecondary(event.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>Add item</Button>
        </div>
      </div>
    </Modal>
  )
}
