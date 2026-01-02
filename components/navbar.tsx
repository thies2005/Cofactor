import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2 font-bold text-xl">
                        Cofactor Club
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/leaderboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Leaderboard</Link>
                        <Link href="/wiki" className="transition-colors hover:text-foreground/80 text-foreground/60">Wiki</Link>
                        <Link href="/profile" className="transition-colors hover:text-foreground/80 text-foreground/60">Profile</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search could go here */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        <Link href="/members">
                            <Button variant="ghost" size="sm">Members</Button>
                        </Link>
                        <Link href="/admin/dashboard">
                            <Button variant="ghost" size="sm">Admin</Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </nav>
    )
}
