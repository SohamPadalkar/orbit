import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { RouteSkeleton } from './components/ui/RouteSkeleton'
import { ToastProvider } from './components/ui/ToastProvider'

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const PersonalCarePage = lazy(() => import('./pages/PersonalCarePage').then((module) => ({ default: module.PersonalCarePage })))
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage').then((module) => ({ default: module.SubscriptionsPage })))
const ExpensesPage = lazy(() => import('./pages/ExpensesPage').then((module) => ({ default: module.ExpensesPage })))
const GoalsPage = lazy(() => import('./pages/GoalsPage').then((module) => ({ default: module.GoalsPage })))
const HabitsPage = lazy(() => import('./pages/HabitsPage').then((module) => ({ default: module.HabitsPage })))
const RenewalsPage = lazy(() => import('./pages/RenewalsPage').then((module) => ({ default: module.RenewalsPage })))
const WishlistPage = lazy(() => import('./pages/WishlistPage').then((module) => ({ default: module.WishlistPage })))

function App() {
  // Architecture: route-level pages use a shared app shell and global persisted state.
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/care"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <PersonalCarePage />
                </Suspense>
              }
            />
            <Route
              path="/subscriptions"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <SubscriptionsPage />
                </Suspense>
              }
            />
            <Route
              path="/expenses"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <ExpensesPage />
                </Suspense>
              }
            />
            <Route
              path="/goals"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <GoalsPage />
                </Suspense>
              }
            />
            <Route
              path="/habits"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <HabitsPage />
                </Suspense>
              }
            />
            <Route
              path="/renewals"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <RenewalsPage />
                </Suspense>
              }
            />
            <Route
              path="/wishlist"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <WishlistPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
