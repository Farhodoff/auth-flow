import { useAuth } from "../contexts/AuthContext";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: "ADMIN" | "USER";
}

export const RoleGate = ({
    children,
    allowedRole,
}: RoleGateProps) => {
    const { user } = useAuth();

    if (user?.role !== allowedRole) {
        return null; // Or return a fallback UI like "Not Authorized"
    }

    return (
        <>
            {children}
        </>
    );
};
