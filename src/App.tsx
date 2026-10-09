import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { CartProvider } from './contexts/CartContext'
import { NavigationProvider } from './contexts/NavigationContext'
import { LocaleProvider } from './contexts/LocaleContext'

import CookieConsent from './components/Layout/CookieConsent'
import RegionNotice from './components/Layout/RegionNotice'
import ColorExpansionOverlay from './components/transitions/ColorExpansionOverlay'
import ScrollToTop from './components/Layout/ScrollToTop'
import DiscountPopup from './components/ui/DiscountPopup'

// Route-level code splitting: each page loads on demand so the initial
// bundle stays small (three.js in particular only loads with Home's scene)
const HomeGate = lazy(() => import('./v2/HomeGate'))
const GivingV2 = lazy(() => import('./v2/GivingV2'))
const V2Only = lazy(() => import('./v2/V2Only'))
const Swap = lazy(() => import('./v2/Swap'))
const VisionV2 = lazy(() => import('./v2/VisionV2'))
const CausesV2 = lazy(() => import('./v2/CausesV2'))
const CauseV2 = lazy(() => import('./v2/CauseV2'))
const CookieV2 = lazy(() => import('./v2/CookieV2'))
const V2Pages = () => import('./v2/Pages')
const NotFoundV2 = lazy(() => V2Pages().then((m) => ({ default: m.NotFoundV2 })))
const ContactV2 = lazy(() => V2Pages().then((m) => ({ default: m.ContactV2 })))
const CartPageV2 = lazy(() => V2Pages().then((m) => ({ default: m.CartPageV2 })))
const OrderSuccessV2 = lazy(() => V2Pages().then((m) => ({ default: m.OrderSuccessV2 })))
const InfoV2 = lazy(() => V2Pages().then((m) => ({ default: m.InfoV2 })))
const To = lazy(() => V2Pages().then((m) => ({ default: m.To })))
const ProductHandleV2 = lazy(() => import('./v2/ProductHandleV2'))
const ShopV2 = lazy(() => import('./v2/ShopV2'))
const ProductV2 = lazy(() => import('./v2/ProductV2'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const Shop = lazy(() => import('./pages/Shop'))
const RichInLifePreOrder = lazy(() => import('./pages/RichInLifePreOrder'))
const InfoAllProfits = lazy(() => import('./pages/InfoAllProfits'))
const InfoTogether = lazy(() => import('./pages/InfoTogether'))
const InfoFashionTool = lazy(() => import('./pages/InfoFashionTool'))
const ProjectSelection = lazy(() => import('./pages/ProjectSelection'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const Founders = lazy(() => import('./pages/Founders'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const LegalNotice = lazy(() => import('./pages/LegalNotice'))
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const Contact = lazy(() => import('./pages/Contact'))
const ComponentDemo = lazy(() => import('./pages/ComponentDemo'))
const VisualEditor = lazy(() => import('./pages/VisualEditor'))

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" aria-label="Loading page" />
    </div>
  )
}

function App() {
  return (
    <Router>
      <LocaleProvider>
      <CartProvider>
        <NavigationProvider>
          <ScrollToTop />
          <ColorExpansionOverlay />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomeGate />} />
              <Route path="/how-giving-works" element={<V2Only><GivingV2 /></V2Only>} />
              <Route path="/projects" element={<Swap next={<CausesV2 />} current={<ProjectSelection />} />} />
              <Route path="/project/:slug" element={<Swap next={<CauseV2 />} current={<ProjectPage />} />} />
              <Route path="/product/:handle" element={<Swap next={<ProductHandleV2 />} current={<ProductDetail />} />} />
              <Route path="/about" element={<Swap next={<VisionV2 />} current={<AboutUs />} />} />
              <Route path="/transparency" element={<Swap next={<To to="/how-giving-works" />} current={<AboutUs />} />} />
              <Route path="/founders" element={<Swap next={<To to="/about" />} current={<Founders />} />} />
              <Route path="/shop" element={<Swap next={<ShopV2 />} current={<Shop />} />} />
              <Route path="/design/:slug" element={<V2Only><ProductV2 /></V2Only>} />
              <Route path="/rich-in-life" element={<Swap next={<To to="/project/rich-in-life" />} current={<RichInLifePreOrder />} />} />
              <Route path="/cart" element={<Swap next={<CartPageV2 />} current={<Cart />} />} />
              <Route path="/checkout" element={<Swap next={<CartPageV2 />} current={<Checkout />} />} />
              <Route path="/order-success" element={<Swap next={<OrderSuccessV2 />} current={<OrderSuccess />} />} />
              <Route path="/info/all-profits-donated" element={<Swap next={<To to="/how-giving-works" />} current={<InfoAllProfits />} />} />
              <Route path="/info/together-not-alone" element={<Swap next={<InfoV2 k="together" />} current={<InfoTogether />} />} />
              <Route path="/info/fashion-as-a-tool" element={<Swap next={<InfoV2 k="fashionTool" />} current={<InfoFashionTool />} />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/legal-notice" element={<LegalNotice />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/contact" element={<Swap next={<ContactV2 />} current={<Contact />} />} />
              {/* Dev-only tooling pages, excluded from production */}
              {import.meta.env.DEV && <Route path="/demo" element={<ComponentDemo />} />}
              {import.meta.env.DEV && <Route path="/editor" element={<VisualEditor />} />}
              <Route path="*" element={<Swap next={<NotFoundV2 />} current={<NotFound />} />} />
            </Routes>
          </Suspense>
          <Swap next={<CookieV2 />} current={<CookieConsent />} />
          <Swap next={<RegionNotice v2 />} current={<RegionNotice />} />
          <Swap next={null} current={<DiscountPopup />} />
          <Analytics />
          <SpeedInsights />
        </NavigationProvider>
      </CartProvider>
      </LocaleProvider>
    </Router>
  )
}

export default App
