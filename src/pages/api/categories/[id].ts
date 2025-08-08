import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Invalid category id' })
  const categoryId = parseInt(id)
  if (isNaN(categoryId)) return res.status(400).json({ error: 'Category id must be a number' })

  // Auth required for mutating ops
  const requireAuth = async () => {
    const { data: { user }, error } = await supabase.auth.getUser(
      req.headers.authorization?.replace('Bearer ', '') || ''
    )
    if (error || !user) return false
    return true
  }

  if (req.method === 'PUT') {
    if (!(await requireAuth())) return res.status(401).json({ error: 'Unauthorized' })
    const { name } = req.body as { name?: string }
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' })
    try {
      const updated = await prisma.category.update({ where: { id: categoryId }, data: { name: name.trim() } })
      return res.status(200).json(updated)
    } catch (err) {
      console.error('Error updating category:', err)
      return res.status(500).json({ error: 'Failed to update category' })
    }
  }

  if (req.method === 'DELETE') {
    if (!(await requireAuth())) return res.status(401).json({ error: 'Unauthorized' })
    try {
      await prisma.category.delete({ where: { id: categoryId } })
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('Error deleting category:', err)
      return res.status(500).json({ error: 'Failed to delete category' })
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}


