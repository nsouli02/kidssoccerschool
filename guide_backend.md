# Backend Setup Guide - Kids Soccer School

## Overview
This guide documents all manual steps required to set up the backend for the announcements system using Supabase and Prisma.

## Prerequisites
- Node.js installed
- Supabase account
- Vercel account

---

## 1. Package Installation

### Install Required Dependencies
```bash
npm install @supabase/supabase-js prisma @prisma/client
npm install framer-motion  # For animations
```

---

## 2. Prisma Setup

### Initialize Prisma
```bash
npx prisma init
```

### Create Database Schema
Edit `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Announcement {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  location  String?
  eventDate DateTime?
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Push Schema to Database
```bash
npx prisma db push
```

### Optional: View Database
```bash
npx prisma studio
```

---

## 3. Supabase Configuration

### 3.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose region and database password
4. Wait for project to be ready

### 3.2 Get Project Credentials
Navigate to **Settings → API**:
- **Project URL**: `https://your-project-id.supabase.co`
- **Anon Key**: Public key for client-side operations
- **Service Role Key**: Secret key for server-side operations

### 3.3 Database URL
Navigate to **Settings → Database**:
- **Connection String**: Use for `DATABASE_URL`
- Format: `postgresql://postgres:[PASSWORD]@db.your-project-id.supabase.co:5432/postgres`

---

## 4. Supabase Storage Setup

### 4.1 Create Storage Bucket
1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Name: `announcements`
4. **Select all available SQL options** from the bucket configuration
5. Click **Create bucket**

### 4.2 Set Up Storage Policies
Navigate to **Storage → Policies → announcements bucket**:

1. **Select all SQL policy options** available
2. At the end of the configuration, add this condition:
```sql
(bucket_id = 'announcements'::text)
```

This simple condition ensures all policies apply specifically to the `announcements` bucket.

---

## 5. Supabase Authentication Setup

### 5.1 Create Admin User
1. Go to **Authentication → Users**
2. Click **Add user**
3. Enter email and password for admin
4. Set **Email Confirmed**: ✅
5. Click **Create user**

### 5.2 Authentication Settings
Navigate to **Authentication → Settings**:
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: Add your domain URLs
- **Email Templates**: Customize if needed

---

## 6. Environment Variables Setup

### 6.1 Local Development (.env.local)
Create `.env.local` file (never commit this):
```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.your-project-id.supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_public_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
```

### 6.2 Vercel Production Environment
Add these variables in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production, Preview, Development |

---

## 7. Next.js Configuration

### 7.1 Update next.config.js
Add Supabase storage domain for images:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-project-id.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
```

---

## 8. File Structure Created

### Backend Files
```
src/
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── prisma.ts            # Prisma client configuration
├── pages/
│   ├── api/
│   │   └── announcements/
│   │       ├── index.ts     # GET, POST endpoints
│   │       └── [id].ts      # PUT, DELETE endpoints
│   ├── admin.tsx            # Admin panel (English only)
│   └── announcements.tsx    # Public announcements page (bilingual)
└── components/              # Existing components updated
    └── Navbar.tsx           # Added announcements link

prisma/
└── schema.prisma            # Database schema

public/
├── sitemap.xml              # Updated with announcements routes
└── robots.txt               # Updated to block admin routes
```

---

## 9. Deployment Commands

### 9.1 After Environment Variables Setup
```bash
# Pull environment variables from Vercel
vercel env pull

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

### 9.2 After Schema Changes
```bash
# Regenerate Prisma client
npx prisma generate

# Push changes to database
npx prisma db push
```

### 9.3 Production Deployment
```bash
# Deploy to Vercel
vercel --prod

# Or push to main branch (auto-deploys)
git add .
git commit -m "Backend setup complete"
git push origin main
```

---

## 10. Testing the Setup

### 10.1 Test Database Connection
```bash
npx prisma studio
```
Should open database GUI at `http://localhost:5555`

### 10.2 Test API Endpoints
- **GET** `/api/announcements` - List all announcements
- **POST** `/api/announcements` - Create announcement (requires auth)
- **PUT** `/api/announcements/[id]` - Update announcement (requires auth)
- **DELETE** `/api/announcements/[id]` - Delete announcement (requires auth)

### 10.3 Test Image Upload
1. Login to admin panel
2. Create announcement with image
3. Verify image appears in Supabase Storage
4. Verify image displays on announcements page

---

## 11. Features Implemented

### 11.1 Core Functionality
- ✅ Create, read, update, delete announcements
- ✅ Image upload with file validation
- ✅ Authentication-protected admin panel
- ✅ Bilingual announcements page (EN/GR)
- ✅ Clickable location links (Google Maps, etc.)

### 11.2 Advanced Features
- ✅ Automatic image deletion from storage
- ✅ Image thumbnails with click-to-expand
- ✅ Locale-aware date formatting (AM/PM vs ΠΜ/ΜΜ)
- ✅ Smart link detection for map services
- ✅ SEO optimization (sitemap, robots.txt)

---

## 12. Security Considerations

### 12.1 Authentication
- Admin panel requires email/password login
- API endpoints protected with Supabase auth
- Service role key used for server-side operations

### 12.2 Storage Security
- Row Level Security (RLS) policies implemented
- Public read access for images only
- Authenticated upload/delete permissions

### 12.3 Environment Variables
- Sensitive data in environment variables
- `.env.local` excluded from git
- Production variables in Vercel dashboard

---

## 13. Troubleshooting

### 13.1 Common Issues
- **Database connection**: Check `DATABASE_URL` format
- **Image upload fails**: Verify storage bucket and RLS policies
- **Auth errors**: Confirm Supabase credentials
- **Build errors**: Run `npx prisma generate`

### 13.2 Useful Commands
```bash
# Reset database (destructive!)
npx prisma db push --force-reset

# View database schema
npx prisma db pull

# Check Vercel environment variables
vercel env ls

# View deployment logs
vercel logs
```

---

## 14. Maintenance

### 14.1 Regular Tasks
- Monitor Supabase usage and storage
- Update environment variables if keys rotate
- Backup database periodically
- Review and update RLS policies as needed

### 14.2 Updates
- Keep dependencies updated
- Monitor Prisma and Supabase for breaking changes
- Test thoroughly after updates

---

## Conclusion

This backend setup provides a robust, scalable foundation for the announcements system with proper authentication, file storage, and bilingual support. All manual steps are documented for reproducibility and maintenance.

**Last Updated**: January 2025
**Version**: 1.0 