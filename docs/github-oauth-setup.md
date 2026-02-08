# GitHub OAuth Sozlash Qo'llanmasi

Ilovangizda "GitHub bilan kirish" tugmasini ishlatish uchun GitHub'dan **Client ID** va **Client Secret** olishingiz kerak.

## 1-qadam: GitHub OAuth Ilova Yaratish
1.  [GitHub Developer Settings](https://github.com/settings/developers) sahifasiga kiring.
2.  **"New OAuth App"** tugmasini bosing.
3.  So'ralgan ma'lumotlarni to'ldiring:
    - **Application name**: Ilovangiz nomi (masalan, AuthFlow)
    - **Homepage URL**: `http://localhost:3000`
    - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
    *(Agar port boshqacha bo'lsa, moslang)*
4.  **"Register application"** tugmasini bosing.

## 2-qadam: Client ID va Secret Olish
1.  Ilova yaratilgandan so'ng, **Client ID** ni ko'rasiz.
2.  **"Generate a new client secret"** tugmasini bosing.
3.  Endi **Client Secret** ham paydo bo'ladi.

## 3-qadam: Kalitlarni Loyihaga Qo'shish
1.  `Client ID` va `Client Secret` ni nusxalab oling.
2.  Loyihangizdagi `.env` faylni oching.
3.  GitHub OAuth qismini topib, o'zgartiring:

```env
GITHUB_CLIENT_ID="sizning-client-id"
GITHUB_CLIENT_SECRET="sizning-client-secret"
```

4.  O'zgarishlar ishlashi uchun terminalni o'chirib, qayta yoqing:
    - `Ctrl+C` bosing (to'xtatish uchun).
    - `npm run dev` buyrug'ini tering.

Tamom! Endi GitHub orqali kirish ishlashi kerak.
