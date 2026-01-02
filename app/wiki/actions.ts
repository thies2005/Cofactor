'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function proposeEdit(formData: FormData) {
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const uniName = formData.get('uniName') as string

    // Mock User - in production, get from session
    let user = await prisma.user.findFirst()
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'student@cofactor.world',
                referralCode: 'STUDENT1',
                role: 'STUDENT'
            }
        })
    }

    // Find or Create UniPage Logic?
    // Actually, we should check if UniPage exists. 
    // If we are editing, we are proposing a revision.
    // If the page doesn't exist, we might be creating it?
    // Let's assume we find by slug.

    let uniPage = await prisma.uniPage.findUnique({
        where: { slug }
    })

    // If page doesn't exist, we are proposing the FIRST revision which will create the page upon approval?
    // But our schema says WikiRevision needs uniPageId.
    // So we must create the UniPage first, maybe with empty content or hidden status?
    // Or we just create it now.

    if (!uniPage) {
        if (!uniName) throw new Error("University Name required for new page")
        uniPage = await prisma.uniPage.create({
            data: {
                name: uniName,
                slug,
                content: '' // Empty initially, until revision approved? Or we can't show it.
            }
        })
    }

    await prisma.wikiRevision.create({
        data: {
            uniPageId: uniPage.id,
            authorId: user.id,
            content,
            status: 'PENDING'
        }
    })

    revalidatePath(`/wiki/${slug}`)
    redirect(`/wiki/${slug}/thank-you`)
}
