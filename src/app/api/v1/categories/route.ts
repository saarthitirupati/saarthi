import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/db';
import { ApiResponse } from '@/types/api';
import { CategoryRecord } from '@/types/database';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: Request) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/categories`, {
      next: { revalidate: 60 }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return NextResponse.json({
          success: true,
          data: json.data
        });
      }
    }
    
    throw new Error('Backend failed');
  } catch (error: any) {
    console.warn('FastAPI backend failed for categories, falling back to database/static:', error.message || error);
    try {
      const { searchParams } = new URL(request.url);
      const city = searchParams.get('city') || 'tirupati';
      const categories = await getCategories(city) as CategoryRecord[];
      
      return NextResponse.json({
        success: true,
        data: categories
      });
    } catch (fallbackError: any) {
      console.error('Fallback failed:', fallbackError);
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Failed to fetch categories'
      }, { status: 500 });
    }
  }
}
