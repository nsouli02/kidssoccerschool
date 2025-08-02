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

      // Get all clients, ordered by creation date (newest first)
      const clients = await prisma.student.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      res.status(200).json(clients)
    } catch (error) {
      console.error('Error fetching clients:', error)
      res.status(500).json({ 
        error: 'Failed to fetch clients',
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
      
      const { kidName, kidSurname, parentName, payments } = req.body
      
      // Create new client - all fields are optional except auto-generated id
      const client = await prisma.student.create({
        data: {
          kidName: kidName || null,
          kidSurname: kidSurname || null,
          parentName: parentName || null,
          payments: payments || null
        }
      })
      
      res.status(201).json(client)
    } catch (error) {
      console.error('Error creating client:', error)
      res.status(500).json({ error: 'Failed to create client' })
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}