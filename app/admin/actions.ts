'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function approveRevision(revisionId: string) {
    const revision = await prisma.wikiRevision.findUnique({
        where: { id: revisionId },
        include: { author: true }
    })

    if (!revision) throw new Error("Revision not found")

    // Update Revision Status
    await prisma.wikiRevision.update({
        where: { id: revisionId },
        data: { status: 'APPROVED' }
    })

    // Update UniPage Content
    await prisma.uniPage.update({
        where: { id: revision.uniPageId },
        data: { content: revision.content }
    })

    // Recalculate Power Score
    await updatePowerScore(revision.authorId)

    revalidatePath('/admin/dashboard')
}

export async function rejectRevision(revisionId: string) {
    await prisma.wikiRevision.update({
        where: { id: revisionId },
        data: { status: 'REJECTED' }
    })
    revalidatePath('/admin/dashboard')
}

async function updatePowerScore(userId: string) {
    // PowerScore = (Referrals * 50) + (ApprovedWikiEdits * 20) + (SocialReach / 100)

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            _count: {
                select: {
                    referralsMade: true,
                    revisions: { where: { status: 'APPROVED' } }
                }
            }
        }
    })

    if (!user) return

    const referals = user._count.referralsMade
    const approvedEdits = user._count.revisions // Filtered in include query? No, Prisma _count doesn't support complex filters in top level include easily sometimes, let's check.
    // Actually, correct prisma syntax for count with where:
    const approvedEditsCount = await prisma.wikiRevision.count({
        where: {
            authorId: userId,
            status: 'APPROVED'
        }
    })

    // Social Reach
    // Mock social stats structure: { instagram: { followers: 1000 }, ... }
    // Logic: "Mock an API integration... fetch followerCount"
    // Let's assume user.socialStats has a total follower count or we sum it.
    let socialReach = 0
    if (user.socialStats && typeof user.socialStats === 'object') {
        // rudimentary parsing of Json
        const stats = user.socialStats as any
        socialReach = (stats.instagram || 0) + (stats.tiktok || 0) + (stats.linkedin || 0)
    }

    const powerScore = (referals * 50) + (approvedEditsCount * 20) + Math.floor(socialReach / 100)

    await prisma.user.update({
        where: { id: userId },
        data: { powerScore }
    })
}
