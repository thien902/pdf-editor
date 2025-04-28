import { NextRequest, NextResponse } from 'next/server';
import { mergePDFs } from '@/lib/pdfUtils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length < 2) {
      return NextResponse.json(
        { error: 'At least two PDF files are required' },
        { status: 400 }
      );
    }

    const pdfBuffers = await Promise.all(
      files.map(file => file.arrayBuffer().then(buffer => new Uint8Array(buffer)))
    );

    const mergedPDF = await mergePDFs(pdfBuffers);

    return new NextResponse(mergedPDF, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      },
    });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    return NextResponse.json(
      { error: 'Failed to merge PDFs' },
      { status: 500 }
    );
  }
} 