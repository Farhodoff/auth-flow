"use client";

import { deleteUser, toggleUserBlock, updateUserRole } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ShieldAlert, ShieldCheck, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

type Role = "ADMIN" | "USER";

interface UserActionsProps {
    userId: string;
    currentRole: Role;
    isBlocked: boolean;
}

export function UserActions({ userId, currentRole, isBlocked }: UserActionsProps) {
    const [isPending, startTransition] = useTransition();

    const onRoleChange = (role: Role) => {
        startTransition(() => {
            updateUserRole(userId, role)
                .then((data) => {
                    if (data.success) toast.success(data.success);
                    if (data.error) toast.error(data.error);
                })
                .catch(() => toast.error("Something went wrong"));
        });
    };

    const onDelete = () => {
        if (confirm("Are you sure you want to delete this user?")) {
            startTransition(() => {
                deleteUser(userId)
                    .then((data) => {
                        if (data.success) toast.success(data.success);
                        if (data.error) toast.error(data.error);
                    })
                    .catch(() => toast.error("Something went wrong"));
            });
        }
    };

    const onBlockToggle = () => {
        startTransition(() => {
            toggleUserBlock(userId, !isBlocked)
                .then((data) => {
                    if (data.success) toast.success(data.success);
                    if (data.error) toast.error(data.error);
                })
                .catch(() => toast.error("Something went wrong"));
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRoleChange(currentRole === "ADMIN" ? "USER" : "ADMIN")}>
                    <UserCog className="mr-2 h-4 w-4" />
                    {currentRole === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onBlockToggle}>
                    {isBlocked ? (
                        <>
                            <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />
                            Unblock User
                        </>
                    ) : (
                        <>
                            <ShieldAlert className="mr-2 h-4 w-4 text-destructive" />
                            Block User
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
