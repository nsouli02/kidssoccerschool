import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  // Validate ID parameter
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid client ID' })
  }
  
  const clientId = parseInt(id)
  if (isNaN(clientId)) {
    return res.status(400).json({ error: 'Client ID must be a number' })
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
      
      const { kidName, kidSurname, parentName, payments } = req.body
      
      // Check if client exists
      const existingClient = await prisma.student.findUnique({
        where: { id: clientId }
      })
      
      if (!existingClient) {
        return res.status(404).json({ error: 'Client not found' })
      }
      
      // Update client - all fields are optional
      const updatedClient = await prisma.student.update({
        where: { id: clientId },
        data: {
          kidName: kidName || null,
          kidSurname: kidSurname || null,
          parentName: parentName || null,
          payments: payments || null
        }
      })
      
      res.status(200).json(updatedClient)
    } catch (error) {
      console.error('Error updating client:', error)
      res.status(500).json({ error: 'Failed to update client' })
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
      
      // Check if client exists
      const existingClient = await prisma.student.findUnique({
        where: { id: clientId }
      })
      
      if (!existingClient) {
        return res.status(404).json({ error: 'Client not found' })
      }
      
      // Delete client
      await prisma.student.delete({
        where: { id: clientId }
      })
      
      res.status(200).json({ message: 'Client deleted successfully' })
    } catch (error) {
      console.error('Error deleting client:', error)
      res.status(500).json({ error: 'Failed to delete client' })
    }
  } 
  else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}