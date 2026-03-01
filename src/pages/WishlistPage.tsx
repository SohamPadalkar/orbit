import { useMemo, useState } from 'react'
import { Heart } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useOrbitStore } from '../store/useOrbitStore'
import { useToast } from '../components/ui/ToastProvider'

const priorityColor: Record<string, string> = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700',
}

export function WishlistPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const wishlist = useOrbitStore((state) => state.wishlist)
  const toggleWishlistPurchased = useOrbitStore((state) => state.toggleWishlistPurchased)
  const deleteWishlistItem = useOrbitStore((state) => state.deleteWishlistItem)
  const undoDelete = useOrbitStore((state) => state.undoDelete)
  const searchQuery = useOrbitStore((state) => state.searchQuery)

  const { notify } = useToast()

  const filtered = useMemo(
    () => wishlist.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())),
    [wishlist, searchQuery],
  )

  const handleDelete = () => {
    if (!deleteId) {
      return
    }
    deleteWishlistItem(deleteId)
    setDeleteId(null)
    notify('Wishlist item deleted', 'Undo', () => undoDelete())
  }

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      <h2 className="text-xl font-semibold">Wishlist</h2>

      {filtered.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item.id} className={item.purchased ? 'opacity-60' : ''}>
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">{item.name}</p>
                <Badge className={priorityColor[item.priority]}>{item.priority}</Badge>
              </div>
              <p className="text-sm text-[var(--text-muted)]">₹{item.price.toLocaleString()}</p>
              {item.notes ? <p className="mt-2 text-sm">{item.notes}</p> : null}
              {item.link ? (
                <a href={item.link} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-[var(--accent)]">
                  Open link
                </a>
              ) : null}
              <div className="mt-3 flex justify-between">
                <Button variant={item.purchased ? 'secondary' : 'primary'} onClick={() => toggleWishlistPurchased(item.id)}>
                  {item.purchased ? 'Purchased' : 'Mark purchased'}
                </Button>
                <Button variant="ghost" onClick={() => setDeleteId(item.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Wishlist is empty" subtitle="Add something you want using +" icon={Heart} />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        description="This wishlist item will be removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
