import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
//import { authOptions } from '../../auth/[...nextauth]/route'; // Adjust path if needed



type ParamsPromise = Promise<{ id: string }>;
interface CampaignUpdatePayload {
  name?: string;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  conversions?: number;
  cost?: number;
}

export async function PUT(
  request: Request,
  { params }: { params: ParamsPromise } // correctly typed second argument
) {
  const { id } = await params;

  try {
    // Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Load campaign and ensure ownership
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });
    if (!campaign || campaign.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not found or access denied' },
        { status: 404 }
      );
    }

    const body: CampaignUpdatePayload = await request.json();

    const updated = await prisma.campaign.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, 
{ params }: { params: ParamsPromise } // correctly typed second argument
) {
  const { id } = await params;

  try {
    // Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Load campaign and ensure ownership
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });
    if (!campaign || campaign.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
