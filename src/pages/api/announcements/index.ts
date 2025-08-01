import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Check if environment variables are configured
      if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL environment variable is not configured')
        return res.status(500).json({ 
          error: 'Database not configured. Please check environment variables.' 
        })
      }

      // Debug: Log which URL is being used (visible in browser console)
      console.log('🔍 Database URL being used:', process.env.DATABASE_URL)
      console.log('🔍 Port being used:', process.env.DATABASE_URL.includes(':6543') ? '6543 (Transaction Pooler)' : '5432 (Direct Pooler)')

      // Get all announcements, ordered by creation date (newest first)
      const announcements = await prisma.announcement.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      res.status(200).json(announcements)
    } catch (error) {
      console.error('Error fetching announcements:', error)
      res.status(500).json({ 
        error: 'Failed to fetch announcements',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      })
    }
  } 
  else if (req.method === 'POST') {
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser(
        req.headers.authorization?.replace('Bearer ', '') || ''
      )
      
      if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      
      const { title, content, location, eventDate, imageUrl } = req.body
      
      // Validate required fields
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' })
      }
      
      // Create new announcement
      const announcement = await prisma.announcement.create({
        data: {
          title,
          content,
          location: location || null,
          eventDate: eventDate ? new Date(eventDate) : null,
          imageUrl: imageUrl || null
        }
      })
      
      res.status(201).json(announcement)
    } catch (error) {
      console.error('Error creating announcement:', error)
      res.status(500).json({ error: 'Failed to create announcement' })
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
} 