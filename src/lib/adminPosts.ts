export interface AdminPost {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string[]
  date: string
  category: 'Update' | 'Community' | 'Tournament' | 'Patch'
  author: string
  role: 'Admin' | 'Moderator'
}

const POSTS_KEY = 'primefront-admin-posts'
const SESSION_KEY = 'primefront-editor-session'

export interface EditorSession {
  name: string
  role: 'Admin' | 'Moderator'
}

export function loadAdminPosts(): AdminPost[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY)
    return raw ? (JSON.parse(raw) as AdminPost[]) : []
  } catch {
    return []
  }
}

export function saveAdminPost(post: AdminPost) {
  const posts = loadAdminPosts()
  posts.unshift(post)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

export function deleteAdminPost(id: string) {
  const posts = loadAdminPosts().filter((p) => p.id !== id)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

export function getEditorSession(): EditorSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as EditorSession) : null
  } catch {
    return null
  }
}

export function setEditorSession(session: EditorSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearEditorSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `post-${Date.now()}`
  )
}
