import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/theme-provider';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder pages (will be replaced by actual components)
const Home = () => <div className="p-4">Home Page</div>;
const Login = () => <div className="p-4">Login Page</div>;
const Register = () => <div className="p-4">Register Page</div>;
const Dashboard = () => <div className="p-4">Dashboard</div>;
const Profile = () => <div className="p-4">Profile</div>;
const Settings = () => <div className="p-4">Settings</div>;
const Pricing = () => <div className="p-4">Pricing</div>;
const Docs = () => <div className="p-4">Docs</div>;

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="docs" element={<Docs />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="dashboard/profile" element={<Profile />} />
                <Route path="dashboard/settings" element={<Settings />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
