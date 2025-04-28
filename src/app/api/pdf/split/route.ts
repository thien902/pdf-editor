import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pageNumbers = formData.get('pageNumbers') as string;
    
    if (!file || !pageNumbers) {
      return NextResponse.json(
        { error: 'File and page numbers are required' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdfDoc = await PDFDocument.create();

    // Parse page numbers and ranges
    const pagesToExtract = new Set<number>();
    const ranges = pageNumbers.split(',').map(range => range.trim());

    for (const range of ranges) {
      if (range.includes('-')) {
        // Handle range (e.g., "1-3")
        const [start, end] = range.split('-').map(num => parseInt(num.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= pdfDoc.getPageCount()) {
              pagesToExtract.add(i - 1); // Convert to 0-based index
            }
          }
        }
      } else {
        // Handle single page
        const pageNum = parseInt(range);
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= pdfDoc.getPageCount()) {
          pagesToExtract.add(pageNum - 1); // Convert to 0-based index
        }
      }
    }

    // Copy selected pages to new document
    const pages = await newPdfDoc.copyPages(pdfDoc, Array.from(pagesToExtract));
    pages.forEach(page => newPdfDoc.addPage(page));

    const pdfBytes = await newPdfDoc.save();
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="split-pages.pdf"',
      },
    });
  } catch (error) {
    console.error('Error splitting PDF:', error);
    return NextResponse.json(
      { error: 'Failed to split PDF' },
      { status: 500 }
    );
  }
} 