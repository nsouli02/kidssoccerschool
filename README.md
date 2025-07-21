# Kids Soccer School Website

A modern, bilingual (English/Greek) landing page website for a youth soccer school, built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- 🌐 **Bilingual Support**: Full English and Greek translations
- 📱 **Responsive Design**: Mobile-first approach with beautiful animations
- ⚽ **Professional Design**: Modern UI with soccer school branding
- 📧 **Contact Form**: Integrated Formspree contact form
- 🎨 **Beautiful Animations**: Smooth page transitions with Framer Motion
- 🔍 **SEO Optimized**: Complete SEO setup with meta tags and structured data
- 🚀 **Fast Performance**: Static site generation with Next.js

## Tech Stack

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Internationalization**: next-i18next
- **Form Handling**: Formspree integration
- **Deployment**: Vercel (recommended)

## Color Palette

- Royal Blue: `#0033A0` - Strength, prestige, tradition
- Golden Yellow: `#FFD700` - Youth, success, optimism  
- Soft White: `#F7F7F7` - Clarity and space
- Light Gray: `#E0E0E0` - Subtle contrast

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kids-soccer-school-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the website.

### Environment Setup

To enable the contact form:

1. Sign up for a [Formspree](https://formspree.io) account
2. Create a new form and get your form endpoint
3. Update the `ContactForm.tsx` component with your Formspree endpoint:
   ```javascript
   const response = await fetch('https://formspree.io/f/YOUR-FORM-ID', {
   ```

## Project Structure

```
kids-soccer-school-website/
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.tsx      # Navigation with language toggle
│   │   ├── Hero.tsx        # Hero section
│   │   ├── About.tsx       # About section
│   │   ├── Programs.tsx    # Programs/age groups
│   │   ├── Gallery.tsx     # Photo gallery
│   │   ├── ContactForm.tsx # Contact form
│   │   └── Footer.tsx      # Footer
│   ├── pages/              # Next.js pages
│   │   ├── _app.tsx        # App wrapper with i18n
│   │   └── index.tsx       # Main homepage
│   └── styles/
│       └── globals.css     # Global styles with Tailwind
├── public/
│   ├── locales/            # Translation files
│   │   ├── en.json        # English translations
│   │   └── gr.json        # Greek translations
│   └── images/            # Static images
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── next-i18next.config.js # Internationalization config
└── tsconfig.json         # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Export static site

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to [Vercel](https://vercel.com)
3. Vercel will automatically deploy your site with each push

### Manual Static Export

1. Update `next.config.js` to enable static export:
   ```javascript
   output: 'export',
   trailingSlash: true,
   distDir: 'dist',
   ```

2. Build and export:
   ```bash
   npm run build
   npm run export
   ```

3. Upload the `dist` folder to your hosting provider

## Customization

### Adding Content

1. **Text Content**: Update translation files in `public/locales/`
2. **Images**: Replace placeholder images in components with your own
3. **Colors**: Modify the color palette in `tailwind.config.js`
4. **Contact Info**: Update contact details in translation files
5. **Social Links**: Modify social media links in `Footer.tsx`

### Form Configuration

Replace the Formspree endpoint in `ContactForm.tsx` with your own:

```javascript
const response = await fetch('https://formspree.io/f/your-form-id', {
```

### Adding Age Groups

To add or modify age groups, update the translation files and the `Programs.tsx` component.

## SEO Features

- Meta tags and Open Graph tags
- Structured data for search engines
- Static sitemap.xml included
- Multilingual SEO support
- Fast loading times with Next.js optimization
- Robots.txt configured

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions about this project, please contact:
  - Email: kids.soccer.school@gmail.com
- Phone: +357 99530979

---

Built with ⚽ by the Kids Soccer School team. 