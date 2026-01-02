'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { revalidatePath } from 'next/cache'
import { recalculatePowerScore } from '@/app/admin/actions'

/**
 * Save social media username/URL and simulate fetching follower count
 * In production, this would call real APIs (Instagram Graph API, TikTok API, LinkedIn API)
 */
export async function saveSocialApiKeys(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return

    const platform = formData.get('platform') as string
    const username = formData.get('username') as string

    if (!platform || !username) return

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) return

    // Get existing stats
    const existingStats = (user.socialStats as any) || {}

    // Save username/URL - follower count is entered by user or left blank for admin verification
    const followerCount = parseInt(formData.get('followers') as string) || 0
    let updatedStats = { ...existingStats }

    switch (platform) {
        case 'instagram':
            updatedStats.instagramUsername = username
            updatedStats.instagram = followerCount
            break
        case 'tiktok':
            updatedStats.tiktokUsername = username
            updatedStats.tiktok = followerCount
            break
        case 'linkedin':
            updatedStats.linkedinUrl = username
            updatedStats.linkedin = followerCount
            break
    }

    // Update user's social stats
    await prisma.user.update({
        where: { id: user.id },
        data: {
            socialStats: updatedStats
        }
    })

    // Recalculate power score with new social data
    await recalculatePowerScore(user.id)

    revalidatePath('/profile')
    revalidatePath('/profile/connect')
    revalidatePath('/leaderboard')
}
