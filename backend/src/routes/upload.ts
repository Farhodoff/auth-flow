import { Router, Response, Request } from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
        }
    },
});

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Upload avatar
router.post(
    '/avatar',
    authenticateToken,
    upload.single('avatar'),
    async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }

            const userId = req.user!.userId;
            const fileExt = req.file.originalname.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error } = await supabase.storage
                .from('avatars')
                .upload(filePath, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true,
                });

            if (error) {
                console.error('Supabase upload error:', error);
                res.status(500).json({ error: 'Failed to upload file' });
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update user's image in database
            const user = await prisma.user.update({
                where: { id: userId },
                data: { image: publicUrl },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            });

            res.json({
                message: 'Avatar uploaded successfully',
                imageUrl: publicUrl,
                user,
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Failed to upload avatar' });
        }
    }
);

export default router;
