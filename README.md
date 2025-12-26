# Portfolio - The Software House

A modern React portfolio website built with Vite, Tailwind CSS, and Framer Motion.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

**IMPORTANT:** Use `npm run dev` (NOT `npm start`) - this project uses Vite, not Create React App!

### Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
portfolio/
├── index.html          # Vite entry HTML
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.mjs  # PostCSS configuration
├── eslint.config.js    # ESLint configuration
├── package.json
└── src/
    ├── main.jsx        # Application entry point
    ├── App.jsx         # Main App component
    ├── App.css         # App styles
    ├── index.css       # Global styles with Tailwind
    ├── styles.js       # Shared style constants
    ├── components/     # React components
    │   ├── Navbar.jsx
    │   ├── Hero.jsx
    │   ├── Skills.jsx
    │   ├── Projects.jsx
    │   ├── FreelanceProjects.jsx
    │   └── Footer.jsx
    ├── hoc/            # Higher Order Components
    │   ├── SectionWrapper.jsx
    │   └── index.js
    └── utils/          # Utility functions
        └── motion.js   # Framer Motion animations
```

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library

## 📝 Notes

- This project uses **Vite**, not Create React App
- Always use `npm run dev` to start the development server
- The project structure follows modern React best practices
- All components use `.jsx` extension
