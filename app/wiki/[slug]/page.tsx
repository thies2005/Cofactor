import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const uniPage = await prisma.uniPage.findUnique({
        where: { slug }
    })

    if (!uniPage) {
        return (
            <div className="container mx-auto py-10">
                <Card className="max-w-2xl mx-auto text-center p-10">
                    <CardTitle className="text-3xl mb-4">Page Not Found</CardTitle>
                    <p className="text-muted-foreground mb-6">
                        The page for <strong>{slug}</strong> does not exist yet.
                    </p>
                    <Link href={`/wiki/${slug}/edit`}>
                        <Button size="lg">Create {slug}</Button>
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">{uniPage.name}</h1>
                <Link href={`/wiki/${slug}/edit`}>
                    <Button variant="outline">Edit Page</Button>
                </Link>
            </div>

            <Card>
                <CardContent className="prose dark:prose-invert max-w-none pt-6">
                    {/* In a real app, use a markdown renderer here */}
                    <div className="whitespace-pre-wrap">{uniPage.content || "No content yet. Be the first to add some!"}</div>
                </CardContent>
            </Card>
        </div>
    )
}
