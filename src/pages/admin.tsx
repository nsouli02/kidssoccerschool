import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

// Import components
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Announcement {
  id: number
  title: string
  content: string
  location?: string
  eventDate?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

interface AnnouncementFormData {
  title: string
  content: string
  location: string
  eventDate: string
  imageUrl: string
}

// Student interfaces for payment tracking
interface Student {
  id: number
  kidName?: string
  kidSurname?: string
  parentName?: string
  payments?: any // JSON field containing payment data
  createdAt: string
  updatedAt: string
}

interface StudentFormData {
  kidName: string
  kidSurname: string
  parentName: string
  payments: any
}

interface PaymentData {
  [year: string]: {
    [month: string]: boolean // true if paid, false if not paid
  }
}

export default function Admin() {
  const { t, ready } = useTranslation('common')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    location: '',
    eventDate: '',
    imageUrl: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

    // Student management state
  const [students, setStudents] = useState<Student[]>([])  
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [studentFormData, setStudentFormData] = useState<StudentFormData>({
    kidName: '',
    kidSurname: '',
    parentName: '',
    payments: {}
  })
  const [activeTab, setActiveTab] = useState<'announcements' | 'students'>('announcements')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString())

  useEffect(() => {
    checkUser()
    fetchAnnouncements()
    fetchStudents()
    
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Cleanup subscription
    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [loginError, setLoginError] = useState('')

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('') // Clear previous errors
    
    if (!email || !password) {
      setLoginError('Please enter both email and password')
      return
    }

    setIsSigningIn(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        // Handle specific Supabase auth errors
        if (error.message === 'Invalid login credentials') {
          setLoginError('Invalid email or password. Please check your credentials and try again.')
        } else if (error.message.includes('Email not confirmed')) {
          setLoginError('Please confirm your email address before signing in.')
        } else if (error.message.includes('Too many requests')) {
          setLoginError('Too many login attempts. Please wait a moment and try again.')
        } else {
          setLoginError(error.message || 'Login failed. Please try again.')
        }
        return
      }
      
      console.log('Login successful:', data.user?.email)
      // The onAuthStateChange listener will handle setting the user state
      
    } catch (error) {
      console.error('Error signing in:', error)
      setLoginError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSigningIn(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      // The onAuthStateChange listener will handle setting user to null
      console.log('Signed out successfully')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      if (!response.ok) throw new Error('Failed to fetch announcements')
      const data = await response.json()
      setAnnouncements(data)
    } catch (error) {
      console.error('Error fetching announcements:', error)
    }
  }

  // Student management functions
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/clients')
      if (!response.ok) throw new Error('Failed to fetch students')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      const url = editingStudent 
        ? `/api/clients/${editingStudent.id}`
        : '/api/clients'
      
      const method = editingStudent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(studentFormData)
      })

      if (!response.ok) throw new Error('Failed to save client')

      // Reset form and refresh students
      setStudentFormData({ kidName: '', kidSurname: '', parentName: '', payments: {} })
      setShowStudentForm(false)
      setEditingStudent(null)
      fetchStudents()
      
      alert(editingStudent ? 'Student updated!' : 'Student created!')
    } catch (error) {
      console.error('Error saving client:', error)
      alert('Error saving client. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStudentEdit = (student: Student) => {
    setEditingStudent(student)
    setStudentFormData({
      kidName: student.kidName || '',
      kidSurname: student.kidSurname || '',
      parentName: student.parentName || '',
      payments: student.payments || {}
    })
    setShowStudentForm(true)
  }

  const handleStudentDelete = async (id: number) => {
    if (!user || !confirm('Are you sure you want to delete this student?')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete client')

      fetchStudents()
      alert('Student deleted!')
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Error deleting client. Please try again.')
    }
  }

  const updatePaymentStatus = (studentId: number, year: string, month: string, paid: boolean) => {
    const student = students.find(c => c.id === studentId)
    if (!student) return

    const currentPayments = student.payments || {}
    if (!currentPayments[year]) {
      currentPayments[year] = {}
    }
    currentPayments[year][month] = paid

    // Update client with new payment data
    handlePaymentUpdate(studentId, currentPayments)
  }

  const handlePaymentUpdate = async (studentId: number, payments: any) => {
    if (!user) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      const student = students.find(c => c.id === studentId)
      if (!student) return

      const response = await fetch(`/api/clients/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          kidName: student.kidName,
          kidSurname: student.kidSurname,
          parentName: student.parentName,
          payments: payments
        })
      })

      if (!response.ok) throw new Error('Failed to update payment status')

      fetchStudents()
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Error updating payment status. Please try again.')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      setSelectedFile(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `announcement-${Date.now()}-${file.name}`
    
    try {
      // Make sure we have a valid session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No valid session for upload')
      }

      const { data, error } = await supabase.storage
        .from('announcements')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Supabase storage error:', error)
        if (error.message.includes('row-level security policy')) {
          throw new Error('Upload permission denied. Please check your storage policies.')
        }
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('announcements')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    setUploading(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      let imageUrl = formData.imageUrl

      // Upload new image if selected
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile)
        } catch (uploadError) {
          alert('Failed to upload image. Please try again.')
          return
        }
      }

      const url = editingAnnouncement 
        ? `/api/announcements/${editingAnnouncement.id}`
        : '/api/announcements'
      
      const method = editingAnnouncement ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...formData,
          eventDate: formData.eventDate || null,
          location: formData.location || null,
          imageUrl: imageUrl || null
        })
      })

      if (!response.ok) throw new Error('Failed to save announcement')

      // Reset form and refresh announcements
      setFormData({ title: '', content: '', location: '', eventDate: '', imageUrl: '' })
      setSelectedFile(null)
      setShowForm(false)
      setEditingAnnouncement(null)
      fetchAnnouncements()
      
      alert(editingAnnouncement ? 'Announcement updated!' : 'Announcement created!')
    } catch (error) {
      console.error('Error saving announcement:', error)
      alert('Error saving announcement. Please try again.')
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    
    // Format date for datetime-local input without timezone conversion
    let formattedEventDate = ''
    if (announcement.eventDate) {
      const date = new Date(announcement.eventDate)
      // Use UTC methods to preserve the intended time
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      const hours = String(date.getUTCHours()).padStart(2, '0')
      const minutes = String(date.getUTCMinutes()).padStart(2, '0')
      formattedEventDate = `${year}-${month}-${day}T${hours}:${minutes}`
    }
    
    setFormData({
      title: announcement.title,
      content: announcement.content,
      location: announcement.location || '',
      eventDate: formattedEventDate,
      imageUrl: announcement.imageUrl || ''
    })
    setShowForm(true)
  }

  const handleRemoveImage = async () => {
    if (!formData.imageUrl || !confirm('Are you sure you want to remove this image?')) return

    try {
      // Delete the image from storage
      await deleteImageFromStorage(formData.imageUrl)
      
      // Clear the image URL from form data
      setFormData({ ...formData, imageUrl: '' })
      
      alert('Image removed successfully!')
    } catch (error) {
      console.error('Error removing image:', error)
      alert('Error removing image. Please try again.')
    }
  }

  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      // Extract filename from the URL
      const urlParts = imageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      
      const { error } = await supabase.storage
        .from('announcements')
        .remove([fileName])

      if (error) {
        console.error('Error deleting image from storage:', error)
      }
    } catch (error) {
      console.error('Error deleting image from storage:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!user || !confirm('Are you sure you want to delete this announcement?')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      // Find the announcement to get the image URL before deleting
      const announcementToDelete = announcements.find(a => a.id === id)

      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete announcement')

      // Delete the image from storage if it exists
      if (announcementToDelete?.imageUrl) {
        await deleteImageFromStorage(announcementToDelete.imageUrl)
      }

      fetchAnnouncements()
      alert('Announcement deleted!')
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert('Error deleting announcement. Please try again.')
    }
  }

  // Format event dates - preserve exact time entered (use UTC)
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // Preserve intended event time
    })
  }

  // Format posted/updated dates - show in local timezone
  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
      // No timeZone specified - uses local timezone
    })
  }

  if (loading || !ready) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Head>
          <title>Admin Login - Kids Soccer School</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-soft-white via-blue-50 to-indigo-100">
          <Navbar />
          <div className="pt-24 pb-16">
            <div className="container-custom section-padding">
              <div className="max-w-md mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-royal-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-royal-blue to-blue-600 bg-clip-text text-transparent mb-2">Admin Portal</h1>
                    <p className="text-gray-600">Secure access to manage announcements</p>
                  </div>
                  
                  {loginError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 text-sm font-medium">{loginError}</p>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={signIn} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          </div>
                                                      <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value)
                                if (loginError) setLoginError('') // Clear error when typing
                              }}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal-blue/20 focus:border-royal-blue transition-all duration-200 bg-gray-50/50 hover:bg-white"
                              placeholder="admin@kidssoccerschool.com"
                            />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                                                      <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value)
                                if (loginError) setLoginError('') // Clear error when typing
                              }}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal-blue/20 focus:border-royal-blue transition-all duration-200 bg-gray-50/50 hover:bg-white"
                              placeholder="Enter your secure password"
                            />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSigningIn}
                      className="w-full bg-gradient-to-r from-royal-blue to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSigningIn ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Signing In...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Access Admin Panel
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Admin Panel - Kids Soccer School</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container-custom section-padding">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-8 mb-8">
              {/* Desktop Layout */}
              <div className="hidden md:flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-royal-blue to-blue-600 bg-clip-text text-transparent mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600">Manage announcements and content</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Welcome back,</p>
                    <p className="font-semibold text-gray-700">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-royal-blue to-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <button 
                    onClick={signOut} 
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-royal-blue to-blue-600 bg-clip-text text-transparent mb-1">
                      Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-600">Manage announcements and content</p>
                  </div>
                  <button 
                    onClick={signOut} 
                    className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-royal-blue to-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Welcome back,</p>
                    <p className="text-sm font-semibold text-gray-700">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'announcements'
                      ? 'bg-white text-royal-blue shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Announcements
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'students'
                      ? 'bg-white text-royal-blue shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Payment Tracking
                </button>
              </div>
            </div>

            {/* Announcements Tab Content */}
            {activeTab === 'announcements' && (
              <>
                <div className="mb-8">
                  <button
                    onClick={() => {
                      setShowForm(!showForm)
                      setEditingAnnouncement(null)
                      setFormData({ title: '', content: '', location: '', eventDate: '', imageUrl: '' })
                      setSelectedFile(null)
                    }}
                    className={`${
                      showForm 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                    } px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 w-full sm:w-auto`}
                  >
                    {showForm ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Cancel</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="whitespace-nowrap">Create New Announcement</span>
                      </>
                    )}
                  </button>
                </div>

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 mb-8"
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-royal-blue to-blue-600 bg-clip-text text-transparent">
                      {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {editingAnnouncement ? 'Update the announcement details' : 'Share important news with your community'}
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Training Field or @https://maps.google.com/..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Image
                    </label>
                    <div className="space-y-4">
                      {/* Show current image if editing and has image */}
                      {editingAnnouncement && formData.imageUrl && (
                        <div className="space-y-3">
                          <div className="text-sm font-medium text-gray-700">Current Image:</div>
                          <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={formData.imageUrl}
                              alt="Current image"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-royal-blue file:text-white hover:file:bg-blue-700"
                      />
                      {selectedFile && (
                        <div className="text-sm text-gray-600">
                          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Supported formats: JPG, PNG, GIF. Max size: 5MB.
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={submitting || uploading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : submitting ? 'Saving...' : (editingAnnouncement ? 'Update' : 'Create')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingAnnouncement(null)
                        setFormData({ title: '', content: '', location: '', eventDate: '', imageUrl: '' })
                        setSelectedFile(null)
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Existing Announcements
                  </h2>
                  <p className="text-gray-600">Manage your published announcements</p>
                </div>
              </div>
              
              {announcements.length === 0 ? (
                <p className="text-gray-600">No announcements yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6 hover:shadow-xl transition-all duration-200">
                      {/* Desktop Layout */}
                      <div className="hidden sm:flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-royal-blue">{announcement.title}</h3>
                          <p className="text-sm text-gray-500">Posted: {formatPostedDate(announcement.updatedAt)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(announcement)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(announcement.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="sm:hidden mb-4">
                        <div className="mb-3">
                          <h3 className="text-lg font-bold text-royal-blue mb-1">{announcement.title}</h3>
                          <p className="text-xs text-gray-500">Posted: {formatPostedDate(announcement.updatedAt)}</p>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(announcement)}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium flex items-center justify-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(announcement.id)}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium flex items-center justify-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-3 text-sm sm:text-base">{announcement.content}</p>
                      
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                        <div className="break-words">
                          <span className="font-medium">Location:</span> {announcement.location || 'None'}
                        </div>
                        <div className="break-words">
                          <span className="font-medium">Event Date:</span> {announcement.eventDate ? formatEventDate(announcement.eventDate) : 'None'}
                        </div>
                        {announcement.imageUrl && (
                          <div>
                            <div className="font-medium mb-2">Image:</div>
                            <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden border border-gray-200">
                              <Image
                                src={announcement.imageUrl}
                                alt={announcement.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
              </>
            )}

            {/* Student Management Tab Content */}
            {activeTab === 'students' && (
              <>
                <div className="mb-8">
                  <button
                    onClick={() => {
                      setShowStudentForm(!showStudentForm)
                      setEditingStudent(null)
                      setStudentFormData({ kidName: '', kidSurname: '', parentName: '', payments: {} })
                    }}
                    className={`${
                      showStudentForm 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                    } px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 w-full sm:w-auto`}
                  >
                    {showStudentForm ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Cancel</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="whitespace-nowrap">Add New Student</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Student Form */}
                {showStudentForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 mb-8"
                  >
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {editingStudent ? 'Edit Student' : 'Add New Student'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {editingStudent ? 'Update student information' : 'Add a new student for payment tracking'}
                        </p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleStudentSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kid&apos;s Name
                          </label>
                          <input
                            type="text"
                            value={studentFormData.kidName}
                            onChange={(e) => setStudentFormData({ ...studentFormData, kidName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter kid's first name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kid&apos;s Surname
                          </label>
                          <input
                            type="text"
                            value={studentFormData.kidSurname}
                            onChange={(e) => setStudentFormData({ ...studentFormData, kidSurname: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter kid's last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parent&apos;s Full Name
                        </label>
                        <input
                          type="text"
                          value={studentFormData.parentName}
                          onChange={(e) => setStudentFormData({ ...studentFormData, parentName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter parent's full name"
                        />
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-primary disabled:opacity-50"
                        >
                          {submitting ? 'Saving...' : (editingStudent ? 'Update Student' : 'Add Student')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowStudentForm(false)
                            setEditingStudent(null)
                            setStudentFormData({ kidName: '', kidSurname: '', parentName: '', payments: {} })
                          }}
                          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Payment Tracking Section */}
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        Payment Tracking
                      </h2>
                      <p className="text-gray-600">Track monthly payments for each student</p>
                    </div>
                  </div>

                  {/* Year/Month Selector */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i
                            return (
                              <option key={year} value={year.toString()}>{year}</option>
                            )
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = i + 1
                            const monthName = new Date(2024, i).toLocaleString('default', { month: 'long' })
                            return (
                              <option key={month} value={month.toString()}>{monthName}</option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Students List with Payment Status */}
                  {students.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-lg">No students yet.</p>
                      <p className="text-gray-500 text-sm mt-2">Add your first student to start tracking payments.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {students.map((student) => {
                        const payments = student.payments || {}
                        const yearPayments = payments[selectedYear] || {}
                        const isPaid = yearPayments[selectedMonth] === true
                        
                        return (
                          <div key={student.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6 hover:shadow-xl transition-all duration-200">
                            {/* Desktop Layout */}
                            <div className="hidden sm:flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800">
                                  {student.kidName || 'No name'} {student.kidSurname || ''}
                                </h3>
                                <p className="text-gray-600">Parent: {student.parentName || 'Not specified'}</p>
                                <p className="text-sm text-gray-500">Added: {new Date(student.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-700">
                                    {new Date(0, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
                                  </p>
                                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    isPaid 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {isPaid ? 'PAID' : 'NOT PAID'}
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => updatePaymentStatus(student.id, selectedYear, selectedMonth, !isPaid)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                      isPaid
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                  >
                                    Mark as {isPaid ? 'Unpaid' : 'Paid'}
                                  </button>
                                  <button
                                    onClick={() => handleStudentEdit(student)}
                                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleStudentDelete(student.id)}
                                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Mobile Layout */}
                            <div className="sm:hidden space-y-4">
                              <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                  {student.kidName || 'No name'} {student.kidSurname || ''}
                                </h3>
                                <p className="text-gray-600 text-sm">Parent: {student.parentName || 'Not specified'}</p>
                                <p className="text-xs text-gray-500">Added: {new Date(student.createdAt).toLocaleDateString()}</p>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    {new Date(0, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
                                  </p>
                                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    isPaid 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {isPaid ? 'PAID' : 'NOT PAID'}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-3">
                                <button
                                  onClick={() => updatePaymentStatus(student.id, selectedYear, selectedMonth, !isPaid)}
                                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isPaid
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                >
                                  Mark as {isPaid ? 'Unpaid' : 'Paid'}
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                  <button
                                    onClick={() => handleStudentEdit(student)}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleStudentDelete(student.id)}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
} 