import { PDFDocument } from 'pdf-lib';

export async function compressPDF(pdfBytes: Uint8Array): Promise<Uint8Array> {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes, {
      updateMetadata: false,
    });

    // Save with compression settings
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 20,
    });

    // Verify the compressed PDF is valid by loading it again
    await PDFDocument.load(compressedBytes);
    
    return compressedBytes;
  } catch (error) {
    console.error('Error during PDF compression:', error);
    throw new Error('Failed to compress PDF while maintaining validity');
  }
}

export async function mergePDFs(pdfBytesArray: Uint8Array[]): Promise<Uint8Array> {
  try {
    const mergedPdf = await PDFDocument.create();
    
    for (const pdfBytes of pdfBytesArray) {
      try {
        const pdf = await PDFDocument.load(pdfBytes, {
          ignoreEncryption: true, // This will ignore encryption if present
        });
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      } catch (error) {
        console.error('Error processing PDF:', error);
        throw new Error('Failed to process one or more PDFs. Please ensure they are not password protected.');
      }
    }
    
    return await mergedPdf.save();
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw new Error('Failed to merge PDFs. Please ensure all files are valid PDFs and not password protected.');
  }
}

export async function splitPDF(pdfBytes: Uint8Array, pageNumbers: number[]): Promise<Uint8Array[]> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const splitPdfs: Uint8Array[] = [];
  
  for (const pageNumber of pageNumbers) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNumber - 1]);
    newPdf.addPage(copiedPage);
    splitPdfs.push(await newPdf.save());
  }
  
  return splitPdfs;
}

export async function protectPDF(pdfBytes: Uint8Array, password: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  // Implement password protection logic here
  return await pdfDoc.save();
}

export async function convertToPDF(file: File): Promise<Uint8Array> {
  const fileType = file.type;
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

  // Handle different file types
  switch (fileType) {
    case 'application/pdf':
      return uint8Array;
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
      // Convert image to PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const image = await pdfDoc.embedJpg(uint8Array);
      const { width, height } = page.getSize();
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });
      return await pdfDoc.save();
    case 'text/plain':
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      // Convert text/Word to PDF
      const textPdfDoc = await PDFDocument.create();
      const textPage = textPdfDoc.addPage();
      const text = await file.text();
      textPage.drawText(text, {
        x: 50,
        y: textPage.getHeight() - 50,
        size: 12,
      });
      return await textPdfDoc.save();
    default:
      throw new Error('Unsupported file type for conversion');
  }
} 