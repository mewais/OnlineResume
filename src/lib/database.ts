import mysql from 'mysql2/promise';

export interface VisitorData {
  id: string;
  country: string;
  state: string;
  city: string;
  postal: string;
  longitude: number;
  latitude: number;
  visits: number;
}

let connection: mysql.Connection | null = null;

export async function getConnection() {
  if (!connection) {
    const config = {
      host: process.env.DATABASE_HOSTNAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_SCHEMA,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

    // Check if all required env vars are present
    if (!config.host || !config.user || !config.password || !config.database) {
      throw new Error('Missing required database environment variables');
    }

    connection = await mysql.createConnection(config);
  }
  return connection;
}

export async function registerVisit(key: string, data: {
  country_name?: string;
  state?: string;
  city?: string;
  postal?: string;
  longitude?: number | string;
  latitude?: number | string;
}) {
  try {
    const conn = await getConnection();
    
    // Check if visitor exists
    const [rows] = await conn.execute(
      'SELECT * FROM visitors WHERE id = ? LIMIT 1',
      [key]
    );

    const visitors = rows as VisitorData[];
    
    if (visitors.length > 0) {
      // Update visit count
      await conn.execute(
        'UPDATE visitors SET visits = visits + 1 WHERE id = ?',
        [key]
      );
    } else {
      // Insert new visitor
      const longitude = data.longitude === 'Not found' || !data.longitude ? 0.0 : Number(data.longitude);
      const latitude = data.latitude === 'Not found' || !data.latitude ? 0.0 : Number(data.latitude);
      const country = data.country_name || 'Not found';
      const state = data.state || 'Not found';
      const city = data.city || 'Not found';
      const postal = data.postal || 'Not found';

      await conn.execute(
        'INSERT INTO visitors(id, country, state, city, postal, longitude, latitude) VALUES(?, ?, ?, ?, ?, ?, ?)',
        [key, country, state, city, postal, longitude, latitude]
      );
    }
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function getVisitors(): Promise<VisitorData[]> {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM visitors');
    return rows as VisitorData[];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export async function getVisitorStats() {
  try {
    const visitors = await getVisitors();
    const totalVisits = visitors.reduce((sum, visitor) => sum + visitor.visits, 0);
    const uniqueVisitors = visitors.length;
    const countries = [...new Set(visitors.map(v => v.country).filter(c => c !== 'Not found'))].length;
    
    // Process visits by date (extract from ID which contains timestamp)
    const visitsByDate: { [date: string]: number } = {};
    
    visitors.forEach(visitor => {
      // Extract date from visitor ID (format: ip-timestamp)
      const datePart = visitor.id.split('-')[1];
      if (datePart) {
        const date = datePart.split(' ')[0]; // Get just the date part
        visitsByDate[date] = (visitsByDate[date] || 0) + visitor.visits;
      }
    });

    return {
      totalVisits,
      uniqueVisitors,
      countries,
      visitsByDate,
      visitors
    };
  } catch (error) {
    console.error('Stats error:', error);
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      countries: 0,
      visitsByDate: {},
      visitors: []
    };
  }
}