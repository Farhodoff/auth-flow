import { useState } from "react";
import api from "../services/api";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

export default function AvatarUpload({ currentImage }: { currentImage?: string | null }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("avatar", file); // Backend expects 'avatar' field

            const response = await api.post("/upload/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.url) {
                toast.success("Avatar uploaded successfully");
                // Ideally update user context here or reload
                // For now, let's assume parent component might handle context refresh if needed,
                // or we just rely on next page load.
                // To trigger context update, we might need a method from useAuth, but let's stick to simple for now.
                window.location.reload();
            }
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload avatar");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <img
                    src={preview || "https://github.com/shadcn.png"}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg transition-opacity group-hover:opacity-75"
                />
                <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                        <Upload className="w-8 h-8" />
                    )}
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                />
            </div>
            {uploading && (
                <p className="text-sm text-muted-foreground animate-pulse">Uploading...</p>
            )}
        </div>
    );
}
