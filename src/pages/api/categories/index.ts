import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

// Category list/create endpoint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
      return res.status(200).json(categories)
    } catch (err) {
      console.error('Error fetching categories:', err)
      return res.status(500).json({ error: 'Failed to fetch categories' })
    }
  }

  if (req.method === 'POST') {
    try {
      // Auth required
      const { data: { user }, error: authError } = await supabase.auth.getUser(
        req.headers.authorization?.replace('Bearer ', '') || ''
      )
      if (authError || !user) return res.status(401).json({ error: 'Unauthorized' })

      const { name } = req.body as { name?: string }
      if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' })

      const created = await prisma.category.create({ data: { name: name.trim() } })
      return res.status(201).json(created)
    } catch (err) {
      console.error('Error creating category:', err)
      return res.status(500).json({ error: 'Failed to create category' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}


