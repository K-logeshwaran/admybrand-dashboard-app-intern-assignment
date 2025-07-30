import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; // Adjust this path based on your file structure

// Types for payload
interface CampaignCreatePayload {
  name: string;
  clicks: number;
  impressions: number;
  ctr: number;
  conversions: number;
  cost: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    // Search string (case-insensitive)
    const search = searchParams.get('search') || '';

    const where = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    const [totalCount, campaigns] = await Promise.all([
      prisma.campaign.count({ where }),
      prisma.campaign.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error('GET /api/campaigns error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CampaignCreatePayload = await request.json();

    // Validate input fields
    if (
      !body.name ||
      typeof body.clicks !== 'number' ||
      typeof body.impressions !== 'number' ||
      typeof body.ctr !== 'number' ||
      typeof body.conversions !== 'number' ||
      typeof body.cost !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    // Fetch user id by email in session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        clicks: body.clicks,
        impressions: body.impressions,
        ctr: body.ctr,
        conversions: body.conversions,
        cost: body.cost,
        userId: user.id,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('POST /api/campaigns error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
