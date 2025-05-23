# TruPulse Frontend Developer Assessment

This project was built as a solution to the technical assessment for the Frontend Developer position at TruPulse. It is a modern, responsive frontend application built with [React/Next.js/Vite/etc.], demonstrating best practices in UI/UX, state management, and code quality.

## 🔧 Setup Instructions
**Clone the repository:**
   ```bash
   git clone https://github.com/shwetkamal-gaud/note-app.git
   cd note-app
   ```
**Install dependencies:**
  ```bash
   npm install
   ```
**Run the development server:**
  ```bash
   npm run dev
   ```
**Live Preview**
```bash
https://note-app-theta-one.vercel.app/
```

**Design & Tradeoffs**
<ul>
  <li>Created Modal compononet with edit and delete functionality and used in App file</li>
  <li> I used Tailwind CSS and TypeScript for rapid development, type safety and a consistent design system.</li>
  <li>I used Zustand to manage global state</li>
  <li>Chose to prioritize functionality and user experience over extensive test coverage due to time constraints.</li>
</ul>


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
