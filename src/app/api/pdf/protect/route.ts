import { NextRequest, NextResponse } from 'next/server';
import { protectPDF } from '@/lib/pdfUtils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const password = formData.get('password') as string;
    
    if (!file || !password) {
      return NextResponse.json(
        { error: 'File and password are required' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const protectedPDF = await protectPDF(new Uint8Array(buffer), password);

    return new NextResponse(protectedPDF, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="protected_${file.name}"`,
      },
    });
  } catch (error) {
    console.error('Error protecting PDF:', error);
    return NextResponse.json(
      { error: 'Failed to protect PDF' },
      { status: 500 }
    );
  }
} 