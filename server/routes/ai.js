// ────────────────────────────────────────────────────────────────────────────
// routes/ai.js — mounted at /api/ai
// ────────────────────────────────────────────────────────────────────────────

import { Router } from 'express'
import { chat } from '../controllers/aiController.js'

const router = Router()

// POST /api/ai/chat  → streamed assistant reply (text/plain chunks)
router.post('/chat', chat)

export default router
