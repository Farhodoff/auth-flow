# AuthFlow

A modern authentication system built with Next.js, Auth.js (NextAuth.js v5), Supabase, and Prisma.

## Features

✅ Google & GitHub OAuth authentication  
✅ Protected routes with middleware  
✅ User profiles with avatar uploads  
✅ Supabase PostgreSQL database  
✅ Supabase Storage for file uploads  
✅ Type-safe with TypeScript  
✅ Modern UI with TailwindCSS  

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

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Authentication**: Auth.js v5 (NextAuth.js)
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Storage**: Supabase Storage
- **Styling**: TailwindCSS
- **Language**: TypeScript

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Update `NEXTAUTH_URL` to production URL
5. Update OAuth redirect URIs to production URL

## License

MIT
