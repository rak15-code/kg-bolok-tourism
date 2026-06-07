// ────────────────────────────────────────────────────────────────────────────
// AppRoutes.jsx — every route in one place.
// ────────────────────────────────────────────────────────────────────────────

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
import NotFoundPage          from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
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
        <Route path="payment/cancel"    element={<PaymentCancelPage />} />
        <Route path="*"                 element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
