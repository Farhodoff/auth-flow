# AuthFlow

A robust full-stack authentication system featuring Next.js, Express, and Vite. Integrated with NextAuth.js and Passport.js for social logins, Prisma with Supabase (PostgreSQL) for data management, and Stripe for payments. Designed with modern UI/UX using Tailwind CSS and GSAP animations.

## Features

✅ Google & GitHub OAuth authentication  
✅ Protected routes with middleware  
✅ User profiles with avatar uploads  
✅ Supabase PostgreSQL database  
✅ Supabase Storage for file uploads  
✅ Type-safe with TypeScript  
✅ Modern UI with TailwindCSS  

## Architecture

### 1. Auth.js Flow
- **Providers**: Users authenticate using Google or GitHub OAuth providers.
- **Session Strategy**: Uses JWT (JSON Web Tokens) for fast, stateless session management, combined with database synchronization when required.
- **Callbacks**:
  - `jwt`: Encodes necessary user information (e.g., ID, active status) into the token.
  - `session`: Attaches information from the JWT to the session object accessible on the client side.
- **Middleware**: Intercepts requests to protected routes (`/dashboard`). If the user is unauthenticated, they are redirected to `/login`.

### 2. Supabase Tables (Managed via Prisma)
The system uses Supabase (PostgreSQL) as the primary database.
- **`User`**: Stores core user details (e.g., `name`, `email`, `image` for avatars).
- **`Account`**: Links the `User` to their respective OAuth providers (Google, GitHub) securing access tokens and provider IDs.
- **`Session`**: Used if database sessions are enabled instead of strictly JWT-based sessions.
- **`VerificationToken`**: Stores tokens for potentially passwordless sign-in or email verification flows.

### 3. Supabase Storage
- **Bucket (`avatars`)**: A public bucket used specifically to host user-uploaded profile pictures.
- **Upload Process**: 
  - Users select an image using the `avatar-upload` component.
  - The application uploads the file securely to the `avatars` bucket.
  - The resulting public URL is saved to the `image` field in the `User` table and immediately displayed in the UI.

### 4. Rate Limiting & Brute-Force Protection

All auth endpoints (`/login`, `/register`, `/reset`) are protected by a two-layer system stored in the **`RateLimit`** Prisma table.

#### Layer 1 — IP-based rate limit (`lib/rate-limit.ts → ipRateLimit`)
| Setting | Value |
|---|---|
| Window | 15 minutes |
| Max requests | 20 per window |
| On breach | Blocked until window expires |

Applied to every public auth route regardless of credentials. Defends against distributed credential-stuffing.

#### Layer 2 — Account-based rate limit (`lib/rate-limit.ts → accountRateLimit`)
| Setting | Value |
|---|---|
| Window | 15 minutes |
| Max failures | 5 per window |
| Lock duration | 30 minutes |

Applied to `/login` only (after IP passes). On 5 consecutive failures the `RateLimit.lockedUntil` field is set, blocking that email for 30 minutes even from different IPs.

#### Generic Error Messages (anti-enumeration)
All auth responses use **deliberately vague messages** to prevent user-enumeration attacks:

| Scenario | Message shown to user |
|---|---|
| Email not registered | `"Invalid credentials."` |
| Wrong password | `"Invalid credentials."` |
| Email not verified | `"Invalid credentials."` |
| Account blocked | `"Invalid credentials."` |
| Account temp-locked | `"Too many failed attempts. Try again in N minutes."` |
| Password reset (any email) | `"If that email is registered, you will receive a reset link shortly."` |
| Registration (duplicate email) | `"If this email is not yet registered, you will receive a verification link shortly."` |

> **Why?** An attacker who can distinguish "email not found" from "wrong password" can harvest valid emails silently. Generic messages eliminate this surface.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

You'll need:
- **Supabase Project**: Create at [supabase.com](https://supabase.com)
- **Google OAuth**: Create at [Google Cloud Console](https://console.cloud.google.com)
- **GitHub OAuth**: Create at [GitHub Developer Settings](https://github.com/settings/developers)

### 3. Configure OAuth Apps

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

### 4. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy the database connection string (Settings → Database → Connection String → URI)
3. Update `DATABASE_URL` in `.env`
4. Create a storage bucket named `avatars`:
   - Go to Storage in Supabase dashboard
   - Create a new bucket: `avatars`
   - Set it to **public**
5. Copy Project URL and Anon Key to `.env`

### 5. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 6. Generate Auth Secret

```bash
openssl rand -base64 32
```

Add the output to `NEXTAUTH_SECRET` in `.env`

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
auth/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # Auth.js handlers
│   │   └── upload-avatar/route.ts       # Avatar upload API
│   ├── dashboard/page.tsx               # Protected dashboard
│   ├── login/page.tsx                   # Login page
│   └── page.tsx                         # Landing page
├── components/
│   ├── avatar-upload.tsx                # Avatar upload component
│   └── logout-button.tsx                # Logout button
├── lib/
│   └── supabase.ts                      # Supabase client
├── prisma/
│   └── schema.prisma                    # Database schema
├── types/
│   └── next-auth.d.ts                   # Auth.js type extensions
├── auth.ts                              # Auth.js configuration
└── middleware.ts                        # Route protection
```

### 🚀 Tech Stack

#### **Frontend & UI**
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DBFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161616?style=for-the-badge&logo=radix-ui&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=gsap&logoColor=black)
![Recharts](https://img.shields.io/badge/Recharts-222222?style=for-the-badge&logo=recharts&logoColor=white)

#### **Backend & Auth**
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextauthdotjs&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

#### **Database & ORM**
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

#### **Services & Tools**
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Update `NEXTAUTH_URL` to production URL
5. Update OAuth redirect URIs to production URL

## License

MIT
