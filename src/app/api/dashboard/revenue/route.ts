import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

interface RevenueDataItem {
  month: string;
  revenue: bigint | string | number; // depending on Prisma/raw response
}

export async function GET() {
  try {
    // Aggregate revenue by month from campaigns
    const revenueData: [] = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') as month,
        SUM(cost) as revenue
      FROM campaigns 
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    `;
    // Convert BigInt in revenue field to number (or string if needed)
    const safeRevenueData = revenueData.map((item: RevenueDataItem) => ({
      month: item.month,
      revenue: Number(item.revenue), // convert BigInt to Number
    }));
    console.log(safeRevenueData);

    return NextResponse.json(safeRevenueData);
  } catch (error: unknown) {
    console.error('Revenue fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}
