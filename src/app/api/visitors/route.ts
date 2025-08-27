import { NextRequest, NextResponse } from 'next/server';
import { getVisitorStats } from '@/lib/database';

export async function GET() {
  try {
    const stats = await getVisitorStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitor statistics' },
      { status: 500 }
    );
  }
}