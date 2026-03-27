# Catholic Professionals PNG Website - PRD

## Original Problem Statement
Build a website about Catholic Professionals PNG using pictures from a provided zip file (234 images).

## User Personas
1. **Catholic Professionals** - Members seeking community, networking, and spiritual formation
2. **Prospective Members** - Professionals interested in joining the society
3. **General Public** - Visitors learning about the organization

## Core Requirements (Static)
- Informational website showcasing the Catholic Professionals Society of PNG
- Photo gallery featuring community events (234 images provided)
- Events section for upcoming gatherings
- News/blog section for updates
- Contact form for inquiries
- Responsive design with traditional Catholic aesthetics

## Architecture
- **Frontend**: React with Tailwind CSS + Shadcn UI components
- **Backend**: FastAPI with MongoDB
- **Theme**: Organic & Earthy (Cormorant Garamond + Manrope fonts, cream/gold/burgundy colors)

## What's Been Implemented (March 27, 2025)
- [x] Homepage with hero section, bento image grid, features, gallery preview
- [x] About page with mission/vision, values, leadership team
- [x] Gallery page with masonry/grid layouts, lightbox, load more (47 images displayed)
- [x] Events page with featured event and event cards
- [x] News page with category filtering and articles
- [x] Contact page with form submission (saves to MongoDB)
- [x] Responsive navigation with mobile menu
- [x] Footer with contact info and social links
- [x] Backend API endpoints: /api/contact, /api/events, /api/news

## Prioritized Backlog

### P0 (Not needed for static site)
- N/A - MVP complete

### P1 (Nice to have)
- [ ] Add remaining 187 images to gallery (currently showing 47)
- [ ] Connect events/news to admin dashboard for content management
- [ ] Google Maps integration for contact page

### P2 (Future enhancements)
- [ ] Newsletter subscription with email integration
- [ ] Member directory with profiles
- [ ] Event registration system
- [ ] Photo upload by admins

## Next Tasks
1. Add more images from the Highlights folder to the gallery
2. Consider adding CMS capabilities for events/news management
3. Add email notification for contact form submissions
