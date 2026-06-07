// ────────────────────────────────────────────────────────────────────────────
// App.jsx — wires up providers + router. All UI lives inside <AppRoutes/>.
// ────────────────────────────────────────────────────────────────────────────

import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { BuilderProvider } from './context/BuilderContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <BuilderProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </BuilderProvider>
      </CurrencyProvider>
    </LanguageProvider>
  )
}
