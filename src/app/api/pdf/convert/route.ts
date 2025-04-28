import { NextRequest, NextResponse } from 'next/server';
import { convertToPDF } from '@/lib/pdfUtils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const pdfBuffer = await convertToPDF(file);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error) {
    console.error('Error converting to PDF:', error);
    return NextResponse.json(
      { error: 'Failed to convert file to PDF' },
      { status: 500 }
    );
  }
} 