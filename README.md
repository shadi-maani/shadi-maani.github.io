# Portfolio

A personal portfolio built with React and Vite that showcases projects, blogs, skills, and GitHub activity.

## Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- React Router
- next-themes

## What It Includes

- Home page with hero, skills, featured projects, featured blogs, GitHub activity, and a quote section
- Dedicated pages for `projects`, `blogs`, and `contact`
- Detail routes for individual projects and blog posts
- Theme switching with system, light, and dark support
- Smooth scrolling and motion-driven section reveals

## Routes

- `/` home
- `/projects` all projects
- `/projects/:slug` project detail
- `/blogs` all blogs
- `/blogs/:slug` blog detail
- `/contact` contact page

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/components/` reusable UI and section components
- `src/pages/` route-level pages
- `src/data/` portfolio content for projects, blogs, socials, and tech
- `src/lib/` shared utilities
- `public/` static assets

## Notes

- Most of the main page content is data-driven, so updating `src/data/*` changes the public portfolio content without touching layout code.
