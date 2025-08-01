# 🛠 backend_todo.md

## ✅ Tech Stack
- **Framework**: Next.js (App structure with pages and API routes)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Auth**: Supabase Auth (client-side session)
- **Image Upload**: Supabase Storage (optional fields)
- **Backend**: API Routes via `/pages/api`

---

## 🔧 Feature: Add "Announcements" Tab to Navbar
- [ ] Add a new tab called **"Announcements"** to the site’s navigation bar.
  - Clicking it should navigate to the page `/announcements`.

---

## 🛠️ Feature: Admin Panel for Managing Announcements

### Route: `/admin`
- [ ] Create a new **Next.js page** at `/pages/admin.tsx`.
- [ ] Protect this route using Supabase Auth:
  - Use Supabase `useUser()` hook to detect session.
  - If unauthenticated, redirect to login or display a message.
  - Optional: use `getServerSideProps` to enforce SSR-based protection.

---

## 📌 Admin Panel Functionality

### Form Fields for New Announcement:
- [ ] **Title** (required)
- [ ] **Content** (required)
- [ ] **Location** (optional)
- [ ] **Event Date and Time** (optional, `timestamp`)
- [ ] **Image Upload** (optional)
  - Upload to Supabase Storage bucket
  - Store the public image URL in the DB

### Admin Permissions:
- [ ] **Create** announcements
- [ ] **Edit** announcements
- [ ] **Delete** announcements
- [ ] All announcements should be publicly visible at `/announcements`

---

## 🧱 Database Schema (`prisma/schema.prisma`)

```prisma
model Announcement {
  id          Int       @id @default(autoincrement())
  title       String
  content     String
  location    String?
  eventDate   DateTime?
  imageUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
---

API Route Structure
Located in /pages/api/announcements/

1. /pages/api/announcements/index.ts
 GET – List all announcements

 POST – Create new announcement

2. /pages/api/announcements/[id].ts
 PUT – Update an announcement by ID

 DELETE – Delete an announcement by ID

---

Image Upload Handling
Use Supabase client SDK (@supabase/supabase-js)

Store in a public bucket like announcements

Store resulting imageUrl string in the database

---

Authentication Notes
Use Supabase's createClient() with supabase.auth.getUser() on client side.

Optional SSR auth enforcement in getServerSideProps.

