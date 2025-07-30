import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
//import { authOptions } from '../../auth/[...nextauth]/route';


import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import { authOptions } from '../../auth/[...nextauth]/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true },
  });
  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, email, oldPassword, newPassword } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // If changing password, verify old password
  if (newPassword) {
    if (!oldPassword) {
      return NextResponse.json(
        { error: 'Current password required to change password' },
        { status: 400 }
      );
    }
    const valid = await bcrypt.compare(oldPassword, user.password || '');
    if (!valid)
      return NextResponse.json(
        { error: 'Incorrect current password' },
        { status: 403 }
      );
  }

  // Update user in DB
  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name,
      email,
      password: newPassword ? await bcrypt.hash(newPassword, 12) : undefined,
    },
  });

  return NextResponse.json({
    message: 'User updated successfully',
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
}
