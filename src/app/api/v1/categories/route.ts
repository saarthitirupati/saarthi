import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/db';
import { ApiResponse } from '@/types/api';
import { CategoryRecord } from '@/types/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'tirupati';
    const categories = await getCategories(city) as CategoryRecord[];
    
    const response: ApiResponse<CategoryRecord[]> = {
      success: true,
      data: categories
    };
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API Error (/api/v1/categories):', error);
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: 'Failed to fetch categories'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
