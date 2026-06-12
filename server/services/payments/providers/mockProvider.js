// ────────────────────────────────────────────────────────────────────────────
// services/payments/providers/mockProvider.js
// ────────────────────────────────────────────────────────────────────────────
// A fake payment gateway for local dev / demos. It ALWAYS simulates a
// successful payment, but does so by mimicking a real gateway's round-trip:
//
//   createPayment() → returns a URL on OUR backend (/api/payments/mock/complete)
//   the browser hits that URL → we mark the booking paid → redirect to success
//
// This means the Mock and HitPay flows share the exact same "mark paid" logic,
// so swapping providers changes nothing downstream.
//
// Implements the PaymentProvider contract:
//   name
//   createPayment(input)  → { url, providerReference, status, raw }
//   verifyWebhook(req)    → { valid, bookingReference, paymentReference, status }
// ────────────────────────────────────────────────────────────────────────────

const mockProvider = {
  name: 'mock',

  async createPayment({ reference, successUrl, backendBaseUrl }) {
    const providerReference = 'MOCK-' + reference

    // Point the user at our own "complete" endpoint, which simulates the
    // gateway finishing the payment and then redirects to the success page.
    const params = new URLSearchParams({
      reference,
      payment_reference: providerReference,
      redirect: successUrl,
    })
    const url = `${backendBaseUrl}/api/payments/mock/complete?${params.toString()}`

    return {
      url,
      providerReference,
      status: 'pending',
      raw: { simulated: true },
    }
  },

  // Mock has no real server-to-server webhook; the /mock/complete route does
  // the status update directly. This exists only to satisfy the contract.
  verifyWebhook(req) {
    const b = req.body || {}
    return {
      valid: true,
      bookingReference: b.reference || null,
      paymentReference: b.payment_reference || null,
      status: 'paid',
    }
  },
}

export default mockProvider
