
import { prisma } from "@/lib/db";

import { getUserSubscription } from "@/features/billings/server/subscription";
import { getUsageSummary } from "@/features/billings/server/usage";
import { UserSettings } from "../types";

export async function getUserSettings(userId: string): Promise<UserSettings> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    const subscription = await getUserSubscription(userId);
    const usage = await getUsageSummary(userId);
  
    return {
      profile: {
        name: user.name,
        email: user.email,
        image: user.image,
        memberSince: user.createdAt.toISOString(),
      },
      subscription,
      usage,
    };
  }