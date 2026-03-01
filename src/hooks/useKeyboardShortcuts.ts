import { useEffect } from 'react'

interface KeyboardShortcutOptions {
  onNewItem: () => void
  onToggleTheme: () => void
}

export function useKeyboardShortcuts({ onNewItem, onToggleTheme }: KeyboardShortcutOptions) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.tagName === 'INPUT' || (event.target as HTMLElement)?.tagName === 'TEXTAREA') {
        return
      }

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        onNewItem()
      }

      if (event.key.toLowerCase() === 'd') {
        event.preventDefault()
        onToggleTheme()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onNewItem, onToggleTheme])
}
