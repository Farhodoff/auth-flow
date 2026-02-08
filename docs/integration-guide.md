# Loyihani Integratsiya Qilish Qo'llanmasi

Bu loyiha **Next.js (App Router)**, **Auth.js (NextAuth v5)**, **Prisma** va **Supabase** asosida qurilgan tayyor autentifikatsiya tizimidir. Uni boshqa loyihalarda ishlatishning ikki yo'li bor.

## 1-usul: Yangi Loyiha Boshlash (Tavsiya etiladi)
Agar siz yangi loyiha boshlayotgan bo'lsangiz, bu repozitoriyni to'g'ridan-to'g'ri ko'chirib (clone) olib ishlatishingiz mumkin.

1.  **Repozitoriyni ko'chirib olish:**
    ```bash
    git clone [REPO_URL] my-new-project
    cd my-new-project
    ```

2.  **Yangi Git tarixi boshlash:**
    Eski git tarixini o'chirib, yangisini boshlang:
    ```bash
    rm -rf .git
    git init
    ```

3.  **Kutubxonalarni o'rnatish:**
    ```bash
    npm install
    ```

4.  **Muhit o'zgaruvchilarini sozlash:**
    - `.env.example` faylidan nusxa olib `.env` yarating.
    - Supabase, Google va GitHub kalitlarini yozing.

5.  **Baza sxemasini yuklash:**
    ```bash
    npx prisma db push
    ```

## 2-usul: Mavjud Loyihaga Qo'shish
Agar sizda allaqachon Next.js loyihasi bor bo'lsa va unga bu auth tizimini qo'shmoqchi bo'lsangiz, quyidagi fayllarni ko'chirib o'tishingiz kerak.

### 1. Kerakli kutubxonalarni o'rnating
Avval `package.json` dagi asosiy kutubxonalarni o'rnating:

```bash
npm install next-auth@beta @auth/prisma-adapter @prisma/client bcryptjs
npm install -D prisma @types/bcryptjs
```

### 2. Fayllarni ko'chirish
Quyidagi fayl va papkalarni o'z loyihangizga ko'chiring:

- **Config**: `auth.ts`, `middleware.ts`, `types/next-auth.d.ts`
- **Database**: `prisma/schema.prisma`, `lib/prisma.ts` (yoki `lib/supabase.ts`)
- **API**: `app/api/auth/[...nextauth]/route.ts`, `app/api/auth/register/route.ts`
- **Pages**: `app/login/page.tsx`, `app/register/page.tsx`
- **Components**: `components/` papkasidagi kerakli komponentlar (masalan, tugmalar).

### 3. Sozlash
- `prisma/schema.prisma` dagi `User`, `Account`, `Session` modellarini o'z sxemangizga qo'shing.
- `.env` faylga kerakli o'zgaruvchilarni qo'shing.
- `middleware.ts` da himoyalangan yo'llarni (matcher) o'zingizga moslang.

Bu tayyor shablon sizga vaqtingizni tejashga yordam beradi!
