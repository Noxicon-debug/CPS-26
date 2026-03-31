# Catholic Professionals PNG Website - PRD

## Original Problem Statement
Build a website about Catholic Professionals PNG using pictures from a provided zip file (234 images), with a headless CMS for content management.

## User Personas
1. **Catholic Professionals** - Members seeking community, networking, and spiritual formation
2. **Prospective Members** - Professionals interested in joining the society
3. **General Public** - Visitors learning about the organization
4. **Administrators** - Staff managing website content

## Core Requirements (Static)
- Informational website showcasing the Catholic Professionals Society of PNG
- Photo gallery featuring community events (234 images provided)
- Events section with calendar and RSVP functionality
- News/blog section for updates
- Contact form for inquiries
- Member directory
- Newsletter subscription
- Headless CMS for content management
- Authentication (Email/Password + Google OAuth)

## Architecture
- **Frontend**: React with Tailwind CSS + Shadcn UI components
- **Backend**: FastAPI with MongoDB
- **Auth**: Dual authentication (JWT email/password + Emergent Google OAuth)
- **Theme**: Organic & Earthy (Cormorant Garamond + Manrope fonts, cream/gold/burgundy colors)

## What's Been Implemented

### Phase 1 - Public Website (March 27, 2025)
- [x] Homepage with hero section, bento image grid, features, gallery preview
- [x] About page with mission/vision, values, leadership team
- [x] Gallery page with masonry/grid layouts, lightbox (234 images)
- [x] Events page with featured event and event cards
- [x] News page with category filtering and articles
- [x] Contact page with form submission
- [x] Responsive navigation with mobile menu
- [x] Footer with contact info and social links

### Phase 2 - Headless CMS (March 27, 2025)
- [x] Login page with Email/Password + Google OAuth
- [x] Login button added to main website header
- [x] Admin Dashboard with sidebar navigation
- [x] **Page Settings Tab**: Hero, About, Footer content management
- [x] **Events & Calendar Tab**: CRUD, recurring events, RSVP tracking
- [x] **News & Blog Tab**: Article management with categories
- [x] **Members Tab**: Member directory management
- [x] **Contact Messages Tab**: View and manage contact submissions
- [x] **Newsletter Tab**: Subscriber management with CSV export
- [x] **Gallery Tab**: Image management (upload + filesystem)
- [x] Dashboard Overview with stats and quick actions

## API Endpoints
### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/google/session
- GET /api/auth/me
- POST /api/auth/logout

### Content Management
- GET/POST/PUT/DELETE /api/events
- GET/POST /api/rsvp/{event_id}
- GET/POST/PUT/DELETE /api/news
- GET/POST/PUT/DELETE /api/members
- GET/POST/PATCH/DELETE /api/contact
- GET/POST/DELETE /api/newsletter
- GET/PUT /api/settings/{page}
- GET/POST/DELETE /api/gallery
- GET /api/dashboard/stats

## Prioritized Backlog

### P0 (Completed)
- [x] Full CMS implementation
- [x] Dual authentication

### P1 (Nice to have)
- [ ] Rich text editor for news articles
- [ ] Drag-and-drop image ordering in gallery
- [ ] Email notifications for new contacts
- [ ] Bulk import for members

### P2 (Future enhancements)
- [ ] Role-based access control (Admin vs Editor)
- [ ] Activity logging/audit trail
- [ ] Email campaign integration for newsletter
- [ ] Member self-registration portal

## Next Tasks
1. Consider adding rich text editor (Tiptap/Quill) for news content
2. Add email notifications when new contact messages arrive
3. Implement member self-registration with admin approval
