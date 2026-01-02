import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function WikiIndexPage() {
    const pages = await prisma.uniPage.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">University Wiki</h1>
                <Link href="/wiki/new-university/edit">
                    <Button>Add University</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.length === 0 ? (
                    <p className="text-muted-foreground col-span-full text-center py-10">
                        No universities found. Be the first to add one!
                    </p>
                ) : (
                    pages.map((page) => (
                        <Link key={page.id} href={`/wiki/${page.slug}`}>
                            <Card className="hover:bg-muted/50 transition-colors h-full">
                                <CardHeader>
                                    <CardTitle>{page.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {page.content || "No content yet."}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
