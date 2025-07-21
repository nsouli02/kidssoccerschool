# ⚙️ Technology Stack & Implementation Guidelines

This document outlines the recommended technology stack and implementation approach for the bilingual landing page described in `requirements.md`.

---

## 🧱 Stack Overview

### 💡 Approach:
A **static, SEO-optimized website** built with **Next.js** and **Tailwind CSS**, deployed on **Vercel**, with bilingual support (English & Greek), and an integrated external contact form. No backend or CMS is required.

---

## 🧰 Core Technologies

| Layer            | Tool/Library                     | Notes |
|------------------|----------------------------------|-------|
| Framework        | [Next.js](https://nextjs.org)    | For routing, static generation (SSG), and deployment |
| Styling          | [Tailwind CSS](https://tailwindcss.com) | For modern, responsive UI styling |
| Hosting & CI/CD  | [Vercel](https://vercel.com)     | Seamless hosting and deployment |
| Internationalization | [next-i18next](https://github.com/i18next/next-i18next) | Manages English/Greek content via JSON translation files |
| Forms            | [Formspree](https://formspree.io), [Netlify Forms](https://docs.netlify.com/forms/setup/), or [Getform](https://getform.io) | Contact form integration with email forwarding |
| Animations       | [Framer Motion](https://www.framer.com/motion/) | Smooth motion for entrances, galleries, and hover effects |
| SEO              | `next/head`, static sitemap.xml | For metadata, discoverability, and structured sitemap |
| Analytics (optional) | Google Analytics or Plausible | Optional visitor tracking and insights |

---

## 📁 Project Structure

Folder layout for a clean and scalable static landing page:

/pages
├── index.tsx // Main home page (localized)
├── _app.tsx // App layout with i18n support
└── [...slug].tsx // Optional dynamic routing if needed
/components
├── Navbar.tsx
├── Hero.tsx
├── About.tsx
├── Programs.tsx
├── Gallery.tsx
├── ContactForm.tsx
└── Footer.tsx
/public
├── images/ // Hero images, training photos
└── locales/
├── en.json // English translations
└── gr.json // Greek translations
/styles
└── globals.css // Tailwind base styles
next.config.js
tailwind.config.js


---

## 🚀 Deployment Workflow

1. Develop locally using:
   ```bash
   npm install
   npm run dev

## 📬 Example (Formspree)

```html
<form action="https://formspree.io/f/{form_id}" method="POST">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>

## 🌍 Multilingual, Design & SEO Considerations

### 🌐 Multilingual Support (English & Greek)

- Implement internationalization (i18n) using [`next-i18next`](https://github.com/i18next/next-i18next).
- Create JSON translation files:
  - `/public/locales/en.json`
  - `/public/locales/gr.json`
- Use translation keys in all components to dynamically pull localized content.
- Add a language toggle (EN | GR) in the navbar or footer for switching languages.
- Ensure all SEO metadata (titles, descriptions, og:image, etc.) is localized per language.

## 🎨 Design Style & Branding

### 🎨 Color Palette (Youthful & Prestigious)

- **Royal Blue** `#0033A0` – Strength, prestige, tradition  
- **Golden Yellow** `#FFD700` – Youth, success, optimism  
- **Soft White** `#F7F7F7` – Clarity and space  
- **Light Gray** `#E0E0E0` – Subtle contrast  

### 🖼️ Visual Styling Guidelines

- Clean layouts with rounded corners and soft shadows  
- Emphasis on large, joyful images of children training and playing  
- Clear call-to-action buttons (e.g., "Join Now", "Contact Us")  
- Legible, friendly fonts (e.g., *Poppins*, *Montserrat*)  
- Subtle hover effects and section animations using **Framer Motion**

## 🔍 SEO Best Practices

- Use `next/head` to define:
  - Page titles  
  - Meta descriptions  
  - Canonical links

- Add Open Graph tags:
  - `og:title`
  - `og:description`
  - `og:image`

- Configure a static sitemap.xml file in the public directory

- Use semantic HTML tags such as:
  - `<section>`, `<article>`, `<header>`, `<footer>`, etc.

- Optimize all images using the Next.js `<Image />` component

- Include descriptive `alt` text for all images to improve accessibility and SEO

- Use clean, readable, and localized URLs:
  - `/about`, `/programs`, `/contact` (English)
  - `/el/about`, `/el/programs`, `/el/contact` (Greek)
