'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { POWER_SCORE } from '@/lib/types'
import DOMPurify from 'isomorphic-dompurify'

export async function proposeEdit(formData: FormData) {
    const slug = formData.get('slug') as string
    const rawContent = formData.get('content') as string
    const uniName = formData.get('uniName') as string

    // Sanitize Content
    const content = DOMPurify.sanitize(rawContent)

    // 1. Get authenticated user
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        redirect('/api/auth/signin')
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        throw new Error("User not found")
    }

    const isAdminOrStaff = user.role === 'ADMIN' || user.role === 'STAFF'

    // 2. Find or Create UniPage
    let uniPage = await prisma.uniPage.findUnique({
        where: { slug }
    })

    if (!uniPage) {
        if (!uniName) throw new Error("University Name required for new page")
        uniPage = await prisma.uniPage.create({
            data: {
                name: uniName,
                slug,
                // Only publish immediately if Admin/Staff created it?
                // Plan says: Initial pages hidden until approved.
                // But if admin creates it, it should be published?
                // Let's assume Admin edits = visible content = published?
                // We will handle published flag in admin approval logic mostly.
                // For direct Admin edits here, if they are auto-approved, we should probably ensure it's published?
                content: isAdminOrStaff ? content : '',
                published: isAdminOrStaff ? true : false
            }
        })
    } else if (isAdminOrStaff) {
        // If page exists and user is admin, update usage content directly
        await prisma.uniPage.update({
            where: { id: uniPage.id },
            data: {
                content,
                published: true // If admin edits, ensure it's published accessible
            }
        })
    }

    // 3. Create Revision Record
    // If Admin/Staff -> Status APPROVED
    // If Student -> Status PENDING
    const status = isAdminOrStaff ? 'APPROVED' : 'PENDING'

    await prisma.wikiRevision.create({
        data: {
            uniPageId: uniPage.id,
            authorId: user.id,
            content,
            status
        }
    })

    // 4. Increment Power Score
    // Usually yes, even admins get points (or we ignore it for them).
    // Let's give points to incentivize or track activity.
    if (status === 'APPROVED') {
        await prisma.user.update({
            where: { id: user.id },
            data: { powerScore: { increment: POWER_SCORE.WIKI_APPROVAL_POINTS } }
        })
    }

    // revalidatePath only works if we don't redirect inside it?
    // standard pattern: revalidate then redirect.
    revalidatePath(`/wiki/${slug}`)

    if (status === 'APPROVED') {
        // If approved instantly, go back to page
        redirect(`/wiki/${slug}`)
    } else {
        // If pending, go to thank you
        redirect(`/wiki/${slug}/thank-you`)
    }
}
