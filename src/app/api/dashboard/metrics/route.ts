import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get real metrics from database
    const [totalRevenue, activeUsers, totalConversions, campaigns] =
      await Promise.all([
        prisma.campaign.aggregate({
          _sum: { cost: true },
        }),
        prisma.user.count(),
        prisma.campaign.aggregate({
          _sum: { conversions: true },
        }),
        prisma.campaign.count(),
      ]);

    // Calculate growth rate (mock for now, you'd compare with previous period)
    const growthRate = 18.2;

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.cost || 0,
      activeUsers,
      conversions: totalConversions._sum.conversions || 0,
      growthRate,
      totalCampaigns: campaigns,
    });
  } catch (error) {
    console.error('Metrics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
