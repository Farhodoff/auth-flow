import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AuditLogTable } from "@/components/audit-log-table";
import { RoleGate } from "@/components/role-gate";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">You are not authorized to view this page.</p>
            </div>
        );
    }

    const logs = await (prisma as any).auditLog.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                }
            }
        },
        take: 50,
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
                    <p className="text-muted-foreground">Monitor system activity and user actions.</p>
                </div>
            </div>

            <RoleGate allowedRole="ADMIN">
                <AuditLogTable logs={logs} />
            </RoleGate>
        </div>
    );
}
