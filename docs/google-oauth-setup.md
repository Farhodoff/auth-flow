# Google OAuth Sozlash Qo'llanmasi

Ilovangizda "Google bilan kirish" tugmasini ishlatish uchun Google Cloud Console'dan **Client ID** va **Client Secret** olishingiz kerak.

## 1-qadam: Google Cloud Loyiha Yaratish
1.  [Google Cloud Console](https://console.cloud.google.com/) saytiga kiring.
2.  Chap yuqoridagi loyihalar ro'yxatini ochib, **"New Project"** (Yangi Loyiha) tugmasini bosing.
3.  Loyihaga nom bering (masalan, "Mening-Ilovam") va **"Create"** tugmasini bosing.
4.  Yaratilgan loyihani tanlang.

## 2-qadam: OAuth Consent Screen Sozlash
1.  Chap menyudan **APIs & Services** > **OAuth consent screen** bo'limiga o'ting.
2.  **External** (Tashqi) ni tanlang va **Create** tugmasini bosing.
3.  So'ralgan ma'lumotlarni to'ldiring:
    - **App name**: Ilovangiz nomi
    - **User support email**: O'z emailingizni tanlang
    - **Developer contact information**: O'z emailingizni yozing
4.  **Save and Continue** tugmasini bosing.
5.  **Scopes** bo'limida **Add or Remove Scopes** tugmasini bosing va quyidagilarni tanlang:
    - `.../auth/userinfo.email`
    - `.../auth/userinfo.profile`
    - `openid`
6.  **Update**, keyin **Save and Continue** tugmasini bosing.
7.  **Test Users** bo'limida o'z emailingizni qo'shing ("+ ADD USERS" orqali).
    - *Eslatma: Bu juda muhim, aks holda login ishlamaydi.*
8.  **Save and Continue** tugmasini bosing.

## 3-qadam: Credentials Yaratish
1.  Chap menyudan **APIs & Services** > **Credentials** bo'limiga o'ting.
2.  Yuqoridagi **+ CREATE CREDENTIALS** tugmasini bosib, **OAuth client ID** ni tanlang.
3.  **Application type** qatorida **Web application** ni tanlang.
4.  **Name**: "Next.js Client" deb nomlang.
5.  **Authorized JavaScript origins** bo'limiga:
    - `http://localhost:3000` ni qo'shing.
    *(Agar ilovangiz 3001 portda ishlayotgan bo'lsa, `http://localhost:3001` yozing)*
6.  **Authorized redirect URIs** bo'limiga:
    - `http://localhost:3000/api/auth/callback/google` ni qo'shing.
    *(Bu yerda ham portga e'tibor bering)*
7.  **Create** tugmasini bosing.

## 4-qadam: Kalitlarni Loyihaga Qo'shish
1.  Ekranda **Client ID** va **Client Secret** paydo bo'ladi.
2.  Ularni nusxalab oling.
3.  Loyihangizdagi `.env` faylni oching.
4.  Google OAuth qismini topib, o'zgartiring:

```env
GOOGLE_CLIENT_ID="nusxalangan-client-id"
GOOGLE_CLIENT_SECRET="nusxalangan-client-secret"
```

5.  O'zgarishlar ishlashi uchun terminalni o'chirib, qayta yoqing:
    - `Ctrl+C` bosing (to'xtatish uchun).
    - `npm run dev` buyrug'ini tering.

Tamom! Endi Google orqali kirish ishlashi kerak.
