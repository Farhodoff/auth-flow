import ProfileForm from "../components/ProfileForm";

export default function Profile() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                <p className="text-muted-foreground">Manage your public profile settings</p>
            </div>
            <ProfileForm />
        </div>
    );
}
