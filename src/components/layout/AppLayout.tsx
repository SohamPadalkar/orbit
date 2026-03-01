import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeIndianRupee,
  CircleFadingPlus,
  Download,
  Goal,
  HeartPulse,
  House,
  ListChecks,
  Moon,
  RefreshCcw,
  Sparkles,
  Sun,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { useOrbitStore } from '../../store/useOrbitStore'
import { parseOrbitBackup } from '../../utils/backup'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useToast } from '../ui/ToastProvider'
import { QuickAddModal } from '../quick-add/QuickAddModal'

const navItems = [
  { to: '/', label: 'Dashboard', icon: House },
  { to: '/care', label: 'Care', icon: HeartPulse },
  { to: '/subscriptions', label: 'Subscriptions', icon: RefreshCcw },
  { to: '/expenses', label: 'Expenses', icon: BadgeIndianRupee },
  { to: '/goals', label: 'Goals', icon: Goal },
  { to: '/habits', label: 'Habits', icon: Sparkles },
  { to: '/renewals', label: 'Renewals', icon: ListChecks },
  { to: '/wishlist', label: 'Wishlist', icon: CircleFadingPlus },
]

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function AppLayout() {
  const location = useLocation()
  const { notify } = useToast()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  const theme = useOrbitStore((state) => state.theme)
  const setTheme = useOrbitStore((state) => state.setTheme)
  const searchQuery = useOrbitStore((state) => state.searchQuery)
  const setSearchQuery = useOrbitStore((state) => state.setSearchQuery)
  const exportData = useOrbitStore((state) => state.exportData)
  const importData = useOrbitStore((state) => state.importData)

  const isDark = theme === 'dark'

  useEffect(() => {
    if (isStandaloneMode()) {
      return
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredInstallPrompt(event as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    const onAppInstalled = () => {
      setDeferredInstallPrompt(null)
      setIsInstallable(false)
      notify('Orbit installed successfully')
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [notify])

  useKeyboardShortcuts({
    onNewItem: () => setQuickAddOpen(true),
    onToggleTheme: () => setTheme(isDark ? 'light' : 'dark'),
  })

  const navMarkup = useMemo(
    () =>
      navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition ${
              isActive
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
            }`
          }
        >
          <item.icon size={16} />
          <span>{item.label}</span>
        </NavLink>
      )),
    [],
  )

  const handleExport = () => {
    const payload = exportData()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `orbit-backup-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    notify('Backup exported successfully')
  }

  const handleImportFile = async (file?: File) => {
    if (!file) {
      return
    }
    const text = await file.text()
    const parsed = parseOrbitBackup(text)
    if (!parsed) {
      notify('Invalid backup file')
      return
    }

    importData(parsed)
    notify('Backup imported')
  }

  const handleInstallApp = async () => {
    if (!deferredInstallPrompt) {
      return
    }

    await deferredInstallPrompt.prompt()
    const choice = await deferredInstallPrompt.userChoice
    if (choice.outcome === 'accepted') {
      notify('Installing Orbit...')
    }

    setDeferredInstallPrompt(null)
    setIsInstallable(false)
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto grid max-w-7xl gap-4 p-4 md:grid-cols-[220px_1fr] md:p-6">
        <aside className="hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] md:block">
          <h1 className="mb-5 text-xl font-semibold">Orbit</h1>
          <nav className="space-y-2">{navMarkup}</nav>
          <p className="mt-6 text-xs text-[var(--text-muted)]">Press N for quick add · D for dark mode</p>
        </aside>

        <main>
          <header className="mb-4 flex flex-wrap items-center gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)]">
            <div className="min-w-[220px] flex-1">
              <Input
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <Button variant="secondary" onClick={handleExport}>
              Export
            </Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Import
            </Button>
            {isInstallable ? (
              <Button variant="secondary" onClick={handleInstallApp}>
                <Download size={14} className="mr-1" />
                Install
              </Button>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="application/json"
              onChange={(event) => {
                handleImportFile(event.target.files?.[0])
                event.currentTarget.value = ''
              }}
            />
            <Button variant="secondary" onClick={() => setTheme(isDark ? 'light' : 'dark')} className="px-3">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex gap-2 overflow-x-auto border-t border-[var(--border)] bg-[var(--surface)]/95 p-2 backdrop-blur md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `shrink-0 rounded-xl p-2 ${isActive ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' : 'text-[var(--text-muted)]'}`
            }
          >
            <item.icon size={18} />
          </NavLink>
        ))}
      </nav>

      <Button
        className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full p-0 shadow-lg md:bottom-6"
        onClick={() => setQuickAddOpen(true)}
        aria-label="Quick add"
      >
        <CircleFadingPlus size={22} />
      </Button>

      <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </div>
  )
}
