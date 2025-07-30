import { NextResponse } from 'next/server'

const trafficSourceData = [
  { source: 'Organic', value: 38, color: '#3b82f6' },
  { source: 'Paid Social', value: 25, color: '#10b981' },
  { source: 'Email', value: 20, color: '#f59e0b' },
  { source: 'Direct', value: 17, color: '#ef4444' },
]

export async function GET() {
  return NextResponse.json(trafficSourceData)
}
