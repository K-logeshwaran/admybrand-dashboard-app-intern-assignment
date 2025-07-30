import { NextResponse } from 'next/server';

const userAcquisitionData = [
  { channel: 'Organic', users: 6000 },
  { channel: 'Paid Social', users: 3000 },
  { channel: 'Email', users: 2000 },
  { channel: 'Direct', users: 1847 },
];

export async function GET() {
  return NextResponse.json(userAcquisitionData);
}
