import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect(userId) {
    if (this.socket?.connected) return this.socket

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: { userId },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket.id)
      if (userId) this.socket.emit('join:user', userId)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
    })

    this.socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // ─── Emit ───────────────────────────────────────────────────────────────
  joinCity(city) {
    this.socket?.emit('join:city', city)
  }

  leaveCity(city) {
    this.socket?.emit('leave:city', city)
  }

  reportIssue(issue) {
    this.socket?.emit('issue:create', issue)
  }

  voteIssue(issueId, direction) {
    this.socket?.emit('issue:vote', { issueId, direction })
  }

  verifyIssue(issueId) {
    this.socket?.emit('issue:verify', { issueId })
  }

  sendComment(issueId, text) {
    this.socket?.emit('issue:comment', { issueId, text })
  }

  // ─── Listen ─────────────────────────────────────────────────────────────
  on(event, callback) {
    this.socket?.on(event, callback)
    this.listeners.set(event, callback)
  }

  off(event) {
    this.socket?.off(event, this.listeners.get(event))
    this.listeners.delete(event)
  }

  // ─── Real-time events ───────────────────────────────────────────────────
  onNewIssue(cb) { this.on('issue:new', cb) }
  onIssueUpdated(cb) { this.on('issue:updated', cb) }
  onIssueResolved(cb) { this.on('issue:resolved', cb) }
  onVoteUpdated(cb) { this.on('issue:vote_updated', cb) }
  onVerificationAdded(cb) { this.on('issue:verified', cb) }
  onNewComment(cb) { this.on('issue:comment_added', cb) }
  onAIInsight(cb) { this.on('ai:insight', cb) }
  onNewPrediction(cb) { this.on('ai:prediction', cb) }
  onXPGained(cb) { this.on('user:xp_gained', cb) }
  onBadgeEarned(cb) { this.on('user:badge_earned', cb) }
  onNotification(cb) { this.on('notification', cb) }
}

export const socketService = new SocketService()
export default socketService
