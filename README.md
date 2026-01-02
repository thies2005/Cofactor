# Cofactor Club 🚀

A student ambassador network platform for managing referrals, tracking viral growth, and building a moderated University Wiki with a gamified Power Score system.

## Features

### 🎯 Power Score System
- **Referrals**: +50 points per successful invite
- **Wiki Contributions**: +20 points for approved edits
- **Social Reach**: Points based on aggregate followers (Instagram, TikTok, LinkedIn)

### 👥 User Roles
| Role | Capabilities |
|------|-------------|
| **Student** | Create referrals, propose wiki edits, sync social accounts |
| **Staff** | Auto-approved wiki edits, same as student |
| **Pending Staff** | Awaiting admin approval for staff privileges |
| **Admin** | Full access: approve/reject revisions, manage users, delete pages |

### 📚 University Wiki
- Community-contributed university pages
- Revision-based editing with moderation workflow
- **Published State**: Pages only visible after first approval
- **Diff Viewer**: Visual comparison of edit proposals
- **XSS Protection**: All content sanitized with DOMPurify

### 📊 Admin Dashboard
- **KPI Cards**: Total users, referrals, social reach, pending actions
- **Leaderboard**: Top 10 performers by Power Score
- **Recent Signups**: Latest members with role badges
- **Activity Hotspots**: Most edited wiki pages
- **Staff Applications**: Approve/reject pending staff

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Docker (optional, for database)

### 1. Clone & Install
```bash
git clone https://github.com/your-repo/cofactor-club.git
cd cofactor-club
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cofactor_db

# NextAuth
NEXTAUTH_SECRET=your-super-secret-random-string
NEXTAUTH_URL=http://localhost:3000

# Admin Seeding
ADMIN_EMAIL=admin@cofactor.world
ADMIN_PASSWORD=your-secure-admin-password

# Staff Sign-up (optional secret code)
STAFF_SECRET_CODE=STAFF_2026

# SMTP Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Cofactor Club" <no-reply@cofactor.world>
```

### 3. Database Setup
```bash
# Start PostgreSQL (if using Docker)
docker-compose up -d db

# Apply schema
npm run prisma:push

# Generate Prisma client
npm run prisma:generate
```

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`

---

## Project Structure

```
cofactor-club/
├── app/
│   ├── admin/
│   │   ├── actions.ts        # Admin server actions
│   │   └── dashboard/        # Admin dashboard page
│   ├── auth/
│   │   ├── actions.ts        # Sign-up action
│   │   ├── signin/           # Login page
│   │   └── signup/           # Registration page
│   ├── profile/
│   │   ├── page.tsx          # User profile
│   │   └── connect/          # Social account linking
│   ├── wiki/
│   │   ├── actions.ts        # Wiki edit action
│   │   └── [slug]/           # Dynamic wiki pages
│   └── leaderboard/          # Power Score rankings
├── components/
│   ├── ui/                   # Shadcn UI components
│   ├── DiffViewer.tsx        # Wiki diff comparison
│   └── SignOutButton.tsx     # Logout button
├── lib/
│   ├── prisma.ts             # Prisma client
│   ├── auth.ts               # Auth utilities
│   ├── auth-config.ts        # NextAuth configuration
│   ├── email.ts              # Nodemailer SMTP
│   └── types.ts              # TypeScript types
├── prisma/
│   └── schema.prisma         # Database schema
└── instrumentation.ts        # Admin seeding on startup
```

---

## API & Server Actions

### Authentication
- `signUp(formData)` - Register new user with referral code
- Uses NextAuth.js Credentials Provider
- Passwords hashed with bcryptjs

### Wiki
- `proposeEdit(formData)` - Submit wiki edit (auto-approved for Admin/Staff)
- `deletePage(slug)` - Admin only: remove page and revisions

### Admin
- `approveRevision(id)` - Approve wiki edit, publish page
- `rejectRevision(id)` - Reject wiki edit
- `approveStaff(userId)` - Promote pending staff to staff
- `rejectStaff(userId)` - Demote pending staff to student

### Social
- `saveSocialApiKeys(formData)` - Connect social accounts
- `syncSocials(formData)` - Refresh follower counts

---

## Security

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcryptjs (10 rounds) |
| Session Management | NextAuth.js JWT |
| Admin Protection | Middleware + Server Action guards |
| XSS Prevention | isomorphic-dompurify |
| CSRF Protection | Server Actions with form tokens |
| Secrets | Environment variables only |

---

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker
```bash
docker-compose up --build
```

### Environment Variables (Production)
Ensure all `.env` variables are set in your hosting provider:
- `DATABASE_URL` - Production PostgreSQL URL
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your production domain

---

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS + Shadcn UI
- **Email**: Nodemailer

---

## License
MIT

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

Built with ❤️ by the Cofactor Team
