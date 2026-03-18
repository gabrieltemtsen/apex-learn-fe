# ApexLearn™ — Frontend

> AI-Native Multi-Tenant Learning Experience Platform  
> Built with **Next.js 15 · TypeScript · Tailwind CSS · Zustand · React Query**

---

## 📱 Pages & Features

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page — hero, TTF methodology, features, pricing | Public |
| `/login` | Sign in with email + password | Public |
| `/register` | Create account with password strength meter | Public |
| `/dashboard` | Student dashboard — progress, stats, enrolled courses | ✅ |
| `/courses` | Course catalog — search, filter by category/level | Public |
| `/courses/[slug]` | Course detail — overview, curriculum, instructor, reviews | Public |
| `/courses/[slug]/learn` | Lesson player — video, curriculum sidebar, progress | ✅ |
| `/assessments/[id]` | Quiz player — timer, questions, results + review | ✅ |
| `/leaderboard` | Championship rankings — weekly/monthly/all-time | ✅ |
| `/certificates` | My QR-verified certificates | ✅ |
| `/admin` | Super admin panel — tenants, analytics, users | Admin only |
| `/instructor` | Instructor studio — course builder, AI tools | Instructor+ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Running `apex-learn-be` backend

### Local Setup

```bash
# Clone
git clone https://github.com/gabrieltemtsen/apex-learn-fe.git
cd apex-learn-fe

# Install
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local

# Start dev server
npm run dev
```

### Environment Variables

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# For production:
# NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## 🏗️ Architecture

```
apex-learn-fe/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── login/              # Auth pages
│   │   ├── register/
│   │   ├── dashboard/          # Protected student dashboard
│   │   ├── courses/            # Course catalog + detail + player
│   │   ├── assessments/        # Quiz player
│   │   ├── leaderboard/        # Rankings
│   │   ├── certificates/       # My certs
│   │   ├── admin/              # Admin panel
│   │   └── instructor/         # Instructor studio
│   ├── components/             # Shared UI components
│   │   ├── Navbar.tsx          # Responsive nav + auth state
│   │   ├── Providers.tsx       # QueryClient + other providers
│   │   └── ...
│   ├── lib/
│   │   └── api.ts              # Axios instance + API helpers
│   └── store/
│       └── auth.store.ts       # Zustand auth store (persisted)
├── middleware.ts               # Route protection
└── public/
```

---

## 🔐 Authentication Flow

1. User submits login/register form
2. FE calls `POST /auth/login` or `POST /auth/register`
3. BE returns `{ user, accessToken, refreshToken }`
4. Tokens stored in Zustand + persisted to localStorage
5. Axios interceptor attaches `Bearer {accessToken}` to all requests
6. On 401 → interceptor auto-refreshes using `refreshToken`
7. On refresh failure → logout + redirect to `/login`

### Route Protection
`middleware.ts` protects:
- `/dashboard/*` — requires auth
- `/admin/*` — requires auth (role check on page)
- `/instructor/*` — requires auth
- `/courses/*/learn` — requires auth
- `/certificates` — requires auth

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `bg-[#0f172a]` | Dark navy | Page backgrounds |
| `bg-slate-800` | Slate | Card backgrounds |
| `bg-slate-900` | Dark slate | Input/nested card bg |
| `border-slate-700` | Border | Card borders |
| `indigo-500/600` | #6366f1 | Primary CTA, active states |
| `violet-500` | #8b5cf6 | Secondary accent |
| `emerald-500` | #10b981 | Success, progress |
| `yellow-400` | #facc15 | Stars, achievements |

**Typography:** Inter (system-ui fallback)  
**Icons:** Lucide React

---

## 📱 Mobile Responsiveness

All pages are designed mobile-first:
- **Navbar:** Hamburger menu on mobile, full nav on desktop
- **Dashboard:** Bottom tab nav on mobile, sidebar on desktop
- **Courses:** 1-col grid mobile → 2-col → 3-col desktop
- **Lesson player:** Full-screen on mobile, sidebar collapses
- **Quiz:** Single column, full-width options

---

## ✅ What Works Now

- [x] Full dark-theme landing page (matches reference design)
- [x] Login page — wired to real API, error handling
- [x] Register page — wired to real API, password strength meter
- [x] Auth store with localStorage persistence + token refresh
- [x] JWT interceptor auto-attaches token to all API calls
- [x] Middleware route protection
- [x] Student dashboard (shows real user name, demo enrollments)
- [x] Course catalog with search + filters
- [x] Course detail page (overview, curriculum, reviews tabs)
- [x] Lesson player with curriculum sidebar + progress tracking
- [x] Assessment/quiz player with timer + results review
- [x] Leaderboard with podium + period tabs
- [x] Certificate gallery
- [x] Admin panel (overview, tenants, analytics)
- [x] Instructor studio with course builder modal
- [x] Mobile responsive all pages

## 🔧 Coming Next

- [ ] Dashboard fetching real enrolled courses from API
- [ ] Course catalog fetching real DB data
- [ ] Enrollment button wired to API
- [ ] Lesson progress synced to backend
- [ ] Assessment submission to real API
- [ ] Admin panel with real tenant/user data
- [ ] File upload for course thumbnails
- [ ] AI quiz generation UI

---

## 🏢 Multi-Tenant Support

The FE supports multi-tenant theming via `TenantProvider`:
- Reads tenant config from API on load
- Applies custom `primaryColor` and `backgroundColor` from tenant settings
- Logo and branding from tenant record

For white-label deployments, set `NEXT_PUBLIC_TENANT_SLUG` env var.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand (persisted) |
| Data Fetching | TanStack React Query |
| HTTP Client | Axios |
| Icons | Lucide React |
| Animation | Framer Motion |
| Deployment | Vercel |

---

## 🚢 Deployment on Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set env variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-apex-learn-be.railway.app
   ```
4. Deploy — auto-deploys on every push to `main`

> **Note:** The backend (`apex-learn-be`) must be deployed on **Railway**, not Vercel. NestJS requires a persistent server process which Vercel serverless doesn't support.
