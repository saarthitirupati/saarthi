import { NextResponse } from 'next/server';
import { submitFeedback } from '@/lib/db';
import { ApiResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { placeId, isHelpful, comment } = body;

    if (!placeId || typeof isHelpful !== 'boolean') {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: 'Missing required fields: placeId, isHelpful'
      };
      return NextResponse.json(response, { status: 400 });
    }

    await submitFeedback(placeId, isHelpful, comment);

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Feedback submitted successfully'
    };
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API Error (/api/v1/feedback):', error);
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: 'Failed to submit feedback'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
