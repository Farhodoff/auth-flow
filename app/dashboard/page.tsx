import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logout-button";
import AvatarUpload from "@/components/avatar-upload";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="flex justify-between items-start mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <LogoutButton />
                        </div>

                        <div className="space-y-8">
                            {/* Profile Section */}
                            <div className="flex flex-col items-center text-center pb-8 border-b border-gray-200">
                                <AvatarUpload currentImage={session.user.image} />
                                <h2 className="text-2xl font-semibold mt-6 text-gray-800">
                                    {session.user.name || "User"}
                                </h2>
                                <p className="text-gray-600 mt-1">{session.user.email}</p>
                            </div>

                            {/* Account Info Section */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                    Account Information
                                </h3>
                                <div className="space-y-3 bg-gray-50 rounded-lg p-6">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600 font-medium">User ID:</span>
                                        <span className="text-gray-800 font-mono text-sm">
                                            {session.user.id}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600 font-medium">Name:</span>
                                        <span className="text-gray-800">
                                            {session.user.name || "Not set"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600 font-medium">Email:</span>
                                        <span className="text-gray-800">{session.user.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Welcome Message */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                                <h3 className="text-xl font-semibold mb-2">
                                    🎉 Welcome to AuthFlow!
                                </h3>
                                <p className="text-indigo-100">
                                    Your account is set up and ready to go. You can now access all
                                    protected features of the application.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
