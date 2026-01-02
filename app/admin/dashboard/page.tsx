import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { approveRevision, rejectRevision } from '../actions'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const pendingRevisions = await prisma.wikiRevision.findMany({
        where: { status: 'PENDING' },
        include: {
            uniPage: true,
            author: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Revisions ({pendingRevisions.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pendingRevisions.length === 0 ? (
                            <p className="text-muted-foreground">No pending revisions.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingRevisions.map((rev) => (
                                    <div key={rev.id} className="flex justify-between items-start border p-4 rounded-lg">
                                        <div>
                                            <h3 className="font-bold text-lg">{rev.uniPage.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                By {rev.author.email} • {new Date(rev.createdAt).toLocaleDateString()}
                                            </p>
                                            <div className="mt-2 p-2 bg-muted rounded text-sm max-h-20 overflow-hidden text-ellipsis">
                                                {rev.content.substring(0, 100)}...
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <form action={approveRevision.bind(null, rev.id)}>
                                                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">Approve</Button>
                                            </form>
                                            <form action={rejectRevision.bind(null, rev.id)}>
                                                <Button size="sm" variant="destructive" className="w-full">Reject</Button>
                                            </form>
                                            <Link href={`/admin/revision/${rev.id}`}>
                                                <Button size="sm" variant="outline" className="w-full">View Diff</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
