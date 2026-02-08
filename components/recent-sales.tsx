import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

interface RecentSalesProps {
    data: {
        name: string
        email: string
        amount: string
        image: string | null
    }[]
}

export function RecentSales({ data }: RecentSalesProps) {
    return (
        <div className="space-y-8">
            {data.map((item, index) => (
                <div className="flex items-center" key={index}>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={item.image || "/avatars/01.png"} alt="Avatar" />
                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {item.email}
                        </p>
                    </div>
                    <div className="ml-auto font-medium">{item.amount}</div>
                </div>
            ))}
            {data.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">No recent sales.</p>
            )}
        </div>
    )
}
