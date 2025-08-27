import { NextRequest, NextResponse } from 'next/server';
import { registerVisit } from '@/lib/database';

async function getClientIP(request: NextRequest): Promise<string> {
  // Check various headers for the real IP address
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  if (xRealIp) {
    return xRealIp;
  }

  // Fallback to a default IP for development
  return '127.0.0.1';
}

async function getLocationData(ip: string) {
  try {
    // Use a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country_name: data.country || 'Not found',
        state: data.regionName || 'Not found', 
        city: data.city || 'Not found',
        postal: data.zip || 'Not found',
        longitude: data.lon || 0.0,
        latitude: data.lat || 0.0
      };
    }
  } catch (error) {
    console.error('Geolocation error:', error);
  }
  
  // Return default values if geolocation fails
  return {
    country_name: 'Not found',
    state: 'Not found',
    city: 'Not found', 
    postal: 'Not found',
    longitude: 0.0,
    latitude: 0.0
  };
}

export async function POST(request: NextRequest) {
  try {
    // Skip tracking if database credentials are not configured
    if (!process.env.DATABASE_HOSTNAME || !process.env.DATABASE_USERNAME || 
        !process.env.DATABASE_PASSWORD || !process.env.DATABASE_SCHEMA) {
      return NextResponse.json({ success: false, message: 'Database not configured' });
    }

    const ip = await getClientIP(request);
    const now = new Date();
    
    // Round to 5 minutes like the original implementation
    const mins = now.getMinutes() - (now.getMinutes() % 5);
    const roundedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), mins);
    
    // Format time like original: YYYY/MM/DD HH:MM[AM/PM]
    const timeString = roundedTime.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', '');

    const key = `${ip}-${timeString}`;
    
    // Get location data
    const locationData = await getLocationData(ip);
    
    // Register the visit
    await registerVisit(key, locationData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}