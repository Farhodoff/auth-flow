import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'sonner';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <Toaster />
        </div>
    );
};

export default Layout;
