// ────────────────────────────────────────────────────────────────────────────
// CurrencyContext.jsx
// ────────────────────────────────────────────────────────────────────────────
// Stores the user's chosen display currency. Base prices stay in MYR;
// components call `format(amountMYR)` to render in the chosen currency.
// ────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { SUPPORTED_CURRENCIES, formatPrice, convertFromMYR } from '../utils/currency'

const CurrencyContext = createContext(null)
const STORAGE_KEY = 'kgbolok_currency'

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    if (typeof window === 'undefined') return 'MYR'
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return SUPPORTED_CURRENCIES.includes(saved) ? saved : 'MYR'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, currency)
    }
  }, [currency])

  const setCurrency = (c) => {
    if (SUPPORTED_CURRENCIES.includes(c)) setCurrencyState(c)
  }

  const value = useMemo(() => ({
    currency,
    setCurrency,
    supported: SUPPORTED_CURRENCIES,
    format: (amountMYR) => formatPrice(amountMYR, currency),
    convert: (amountMYR) => convertFromMYR(amountMYR, currency),
  }), [currency])

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside <CurrencyProvider>')
  return ctx
}
