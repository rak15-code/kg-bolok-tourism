// ────────────────────────────────────────────────────────────────────────────
// AppRoutes.jsx — every route in one place.
//   • Public site   → wrapped in <MainLayout> (navbar + footer)
//   • Admin console  → /admin/*, its own shell, gated by Supabase auth + role
// ────────────────────────────────────────────────────────────────────────────

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

import HomePage              from '../pages/HomePage'
import AttractionsPage       from '../pages/AttractionsPage'
import AttractionDetailPage  from '../pages/AttractionDetailPage'
import HomestaysPage         from '../pages/HomestaysPage'
import HomestayDetailPage    from '../pages/HomestayDetailPage'
import PackageBuilderPage    from '../pages/PackageBuilderPage'
import GalleryPage           from '../pages/GalleryPage'
import ContactPage           from '../pages/ContactPage'
import CheckoutPage          from '../pages/CheckoutPage'
import PaymentSuccessPage    from '../pages/PaymentSuccessPage'
import PaymentCancelPage     from '../pages/PaymentCancelPage'
import PaymentFailedPage     from '../pages/PaymentFailedPage'
import NotFoundPage          from '../pages/NotFoundPage'

// Admin console — lazy-loaded so it never ships in the public bundle.
const AdminRoot            = lazy(() => import('../admin/AdminRoot'))
const AdminGuard           = lazy(() => import('../admin/components/AdminGuard'))
const AdminLayout          = lazy(() => import('../admin/components/AdminLayout'))
const AdminLoginPage       = lazy(() => import('../admin/pages/AdminLoginPage'))
const AdminDashboardPage   = lazy(() => import('../admin/pages/AdminDashboardPage'))
const AdminInsightsPage    = lazy(() => import('../admin/pages/AdminInsightsPage'))
const AdminBookingsPage    = lazy(() => import('../admin/pages/AdminBookingsPage'))
const AdminAttractionsPage = lazy(() => import('../admin/pages/AdminAttractionsPage'))
const AdminHomestaysPage   = lazy(() => import('../admin/pages/AdminHomestaysPage'))
const AdminGalleryPage     = lazy(() => import('../admin/pages/AdminGalleryPage'))
const AdminPackagesPage    = lazy(() => import('../admin/pages/AdminPackagesPage'))
const AdminSettingsPage    = lazy(() => import('../admin/pages/AdminSettingsPage'))

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public site ── */}
      <Route element={<MainLayout />}>
        <Route index                    element={<HomePage />} />
        <Route path="attractions"       element={<AttractionsPage />} />
        <Route path="attractions/:slug" element={<AttractionDetailPage />} />
        <Route path="homestays"         element={<HomestaysPage />} />
        <Route path="homestays/:slug"   element={<HomestayDetailPage />} />
        <Route path="builder"           element={<PackageBuilderPage />} />
        <Route path="gallery"           element={<GalleryPage />} />
        <Route path="contact"           element={<ContactPage />} />
        <Route path="checkout"          element={<CheckoutPage />} />
        <Route path="payment/success"   element={<PaymentSuccessPage />} />
        <Route path="payment/failed"    element={<PaymentFailedPage />} />
        <Route path="payment/cancel"    element={<PaymentCancelPage />} />
        <Route path="*"                 element={<NotFoundPage />} />
      </Route>

      {/* ── Admin console (/admin/*) — lazy chunk ── */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
            <AdminRoot />
          </Suspense>
        }
      >
        <Route path="login" element={<AdminLoginPage />} />
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index               element={<AdminDashboardPage />} />
            <Route path="insights"      element={<AdminInsightsPage />} />
            <Route path="bookings"      element={<AdminBookingsPage />} />
            <Route path="attractions"   element={<AdminAttractionsPage />} />
            <Route path="homestays"     element={<AdminHomestaysPage />} />
            <Route path="gallery"       element={<AdminGalleryPage />} />
            <Route path="packages"      element={<AdminPackagesPage />} />
            <Route path="settings"      element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
