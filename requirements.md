# ✅ Website Requirements Document  
**Client:** Youth Soccer Coach & Club Owner  
**Project Type:** Bilingual Landing Page Website  
**Purpose:** Establish a polished, prestigious online presence for a children’s football academy that can be easily found via search engines and contacted by interested parents or schools.

---

## 1. 🎯 Project Goals

- Present the club as **professional, trusted, and nurturing**.
- Provide clear, attractive information about the club's **mission, age groups, programs, and training philosophy**.
- Allow interested parties (parents, sponsors, schools) to easily **get in touch**.
- Be **discoverable via Google** and optimized for search.
- Be available in **both English and Greek** to serve the local and international community.

---

## 2. 🌐 Website Structure

### 1. Home (Landing Page)
- Hero section with an inspiring image of kids training or celebrating.
- Club name and tagline (e.g., *"Building Character Through Football"*).
- Call-to-action: *"Join Our Academy"*, *"Contact Us"*

### 2. About
- Founder/coach introduction with a photo.
- Academy values: sportsmanship, teamwork, confidence.
- Quick facts: Year established, training location, ages served.

### 3. Programs / Age Groups
- List of age categories (e.g., U6, U8, U10, U12)
- Short description of training focus per group.
- Training days or seasons (optional)

### 4. Gallery
- Photo gallery of kids in training, matches, awards, and team events.

### 5. Contact
- Simple contact form (name, email, message).
- Clickable phone number and email.
- Optionally: Google Map location or directions to the field.

---

## 3. 📱 Functional Requirements

- **Multilingual** with language toggle (English / Greek).
- **Responsive design** — optimized for mobile-first experience.
- **Contact form** with submission via external handler (Formspree or similar).
- **SEO-friendly** structure for discoverability.
- **Static content** only — no login, backend, or admin panel required.

---

## 4. 🧠 Content Management

- All translatable content will be stored in:
  - `en.json` (English)
  - `gr.json` (Greek)
- The codebase must dynamically pull text from these files.
- Example structure:
```json
{
  "hero_title": "Building Character Through Football",
  "about_title": "About Our Club",
  "contact_cta": "Get in Touch"
}
