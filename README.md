# PDF Editor

A modern web application for PDF manipulation with features like conversion, merging, splitting, and compression.

## Features

- 🔄 Convert various file types to PDF (images, text, Word documents)
- ✂️ Split PDFs into individual pages
- 🔗 Merge multiple PDFs into one
- 📦 Compress PDFs to reduce file size
- 🎨 Modern, user-friendly interface
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thien902/pdf-editor.git
```

2. Navigate to the project directory:
```bash
cd pdf-editor
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit:
```
http://localhost:3000
```

## Usage

1. **Convert to PDF**
   - Upload any supported file (images, text, Word documents)
   - Click "Process" to convert to PDF
   - Download the converted file

2. **Split PDF**
   - Upload a PDF file
   - Enter page numbers (e.g., 1-3,5,7-9)
   - Click "Process" to split
   - Download the extracted pages

3. **Merge PDFs**
   - Upload multiple PDF files
   - Click "Process" to merge
   - Download the merged PDF

4. **Compress PDF**
   - Upload a PDF file
   - Click "Process" to compress
   - Download the compressed file

## Supported File Types

- PDF (.pdf)
- Images (.jpg, .jpeg, .png, .gif)
- Text (.txt)
- Word Documents (.doc, .docx)

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- PDF-lib
- React Dropzone

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.