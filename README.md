# Modern Resume Website

A beautiful, responsive personal resume website built with Next.js, TypeScript, and Tailwind CSS. Features smooth animations, mobile-first design, and clean code/content separation.

## Features

- 🎨 Modern, beautiful design with gradient backgrounds and animations
- 📱 Fully responsive - works perfectly on all device sizes
- ⚡ Fast performance with Next.js 15 and Turbopack
- 🎭 Smooth animations with Framer Motion
- 🎯 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 📊 Interactive skills visualization
- 📚 Publications timeline with categorization
- 🎓 Education timeline
- 💼 Professional experience showcase
- 📧 Contact form and social links

## Architecture

The project maintains clear separation between content and code:

- **Content Data**: All personal information is stored in JSON files in `/src/data/`
- **Components**: Reusable UI components in `/src/components/`
- **Styling**: Tailwind CSS with custom gradients and animations
- **Type Safety**: Full TypeScript coverage

## Content Structure

```
src/data/
├── personal.json     # Basic info, contact details, social links
├── experience.json   # Work experience and roles
├── education.json    # Academic background
├── skills.json       # Technical skills organized by category
└── publications.json # Research publications and papers
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Update Personal Information

Edit the JSON files in `src/data/` to reflect your information:

- `personal.json`: Name, title, summary, email, social links
- `experience.json`: Work history, roles, descriptions, technologies
- `education.json`: Degrees, institutions, dates, descriptions
- `skills.json`: Technical skills organized by categories and subcategories
- `publications.json`: Research papers, conference presentations, etc.

### Modify Styling

The design uses Tailwind CSS with custom color schemes. Key design elements:

- **Colors**: Purple and blue gradients throughout
- **Typography**: Geist font family
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Mobile-first approach

### Add New Sections

Create new components in `src/components/` and add them to `src/app/page.tsx`.

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Heroicons**: Icon library
- **Lucide React**: Additional icons

## Performance

- ✅ Mobile-first responsive design
- ✅ Smooth 60fps animations
- ✅ Optimized images and fonts
- ✅ Fast loading with Next.js optimization
- ✅ SEO-friendly with proper metadata

## Deployment

Deploy easily on Vercel:

```bash
vercel deploy
```

Or build for production:

```bash
npm run build
npm start
```

## Comparison with Original

The original Python/Dash version has been completely rebuilt with modern web technologies:

- **Old**: Python + Dash + Plotly (not responsive, limited styling)
- **New**: Next.js + TypeScript + Tailwind (fully responsive, modern animations)
- **Maintained**: Content/code separation principle
- **Improved**: Mobile experience, performance, maintainability
