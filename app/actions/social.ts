'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min
}

export async function syncSocials(formData: FormData) {
    // Mock Logic
    // In reality, we'd use oauth tokens stored in DB to fetch from Instagram/TikTok/LinkedIn API

    // Update the First User (current session mock)
    const user = await prisma.user.findFirst()
    if (!user) return

    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newStats = {
        instagram: getRandomInt(500, 5000),
        tiktok: getRandomInt(1000, 10000),
        linkedin: getRandomInt(200, 1500)
    }

    const socialReach = newStats.instagram + newStats.tiktok + newStats.linkedin

    // PowerScore update logic for social part
    // Recalculate full score to be safe
    const approvedEditsCount = await prisma.wikiRevision.count({
        where: { authorId: user.id, status: 'APPROVED' }
    })

    const referralsCount = await prisma.referral.count({
        where: { referrerId: user.id }
    })

    const powerScore = (referralsCount * 50) + (approvedEditsCount * 20) + Math.floor(socialReach / 100)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            socialStats: newStats,
            powerScore
        }
    })

    revalidatePath('/profile')
    revalidatePath('/leaderboard')
}
