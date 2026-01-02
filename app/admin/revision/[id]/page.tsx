import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { approveRevision, rejectRevision } from '../../actions'
import { notFound } from 'next/navigation'

export default async function RevisionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const revision = await prisma.wikiRevision.findUnique({
        where: { id },
        include: { uniPage: true, author: true }
    })

    if (!revision) notFound()

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Review Edit: {revision.uniPage.name}</h1>
                <div className="flex gap-2">
                    <form action={approveRevision.bind(null, revision.id)}>
                        <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                    </form>
                    <form action={rejectRevision.bind(null, revision.id)}>
                        <Button variant="destructive">Reject</Button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle>Current Content</CardTitle></CardHeader>
                    <CardContent className="prose dark:prose-invert">
                        <pre className="whitespace-pre-wrap font-sans">{revision.uniPage.content}</pre>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Proposed Content</CardTitle></CardHeader>
                    <CardContent className="prose dark:prose-invert">
                        <pre className="whitespace-pre-wrap font-sans bg-muted/50 p-2 rounded">{revision.content}</pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
