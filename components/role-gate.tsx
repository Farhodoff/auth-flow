"use client";

import { useSession } from "next-auth/react";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: "ADMIN" | "USER";
}

export const RoleGate = ({
    children,
    allowedRole,
}: RoleGateProps) => {
    const { data: session } = useSession();

    if (session?.user?.role !== allowedRole) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
};
