import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  // Validate ID parameter
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid announcement ID' })
  }
  
  const announcementId = parseInt(id)
  if (isNaN(announcementId)) {
    return res.status(400).json({ error: 'Announcement ID must be a number' })
  }
  
  if (req.method === 'PUT') {
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
      
      // Check if announcement exists
      const existingAnnouncement = await prisma.announcement.findUnique({
        where: { id: announcementId }
      })
      
      if (!existingAnnouncement) {
        return res.status(404).json({ error: 'Announcement not found' })
      }
      
      // Update announcement
      const updatedAnnouncement = await prisma.announcement.update({
        where: { id: announcementId },
        data: {
          title,
          content,
          location: location || null,
          eventDate: eventDate ? new Date(eventDate) : null,
          imageUrl: imageUrl || null
        }
      })
      
      res.status(200).json(updatedAnnouncement)
    } catch (error) {
      console.error('Error updating announcement:', error)
      res.status(500).json({ error: 'Failed to update announcement' })
    }
  } 
  else if (req.method === 'DELETE') {
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser(
        req.headers.authorization?.replace('Bearer ', '') || ''
      )
      
      if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      
      // Check if announcement exists
      const existingAnnouncement = await prisma.announcement.findUnique({
        where: { id: announcementId }
      })
      
      if (!existingAnnouncement) {
        return res.status(404).json({ error: 'Announcement not found' })
      }
      
      // Delete announcement
      await prisma.announcement.delete({
        where: { id: announcementId }
      })
      
      res.status(200).json({ message: 'Announcement deleted successfully' })
    } catch (error) {
      console.error('Error deleting announcement:', error)
      res.status(500).json({ error: 'Failed to delete announcement' })
    }
  } 
  else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
} 