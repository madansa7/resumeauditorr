// This service uses the 'jspdf' library, which is loaded from a CDN in index.html.
import { waitForLibrary } from './utils';

export const generatePdfFromText = async (markdownText: string) => {
  try {
    const jspdfLib = await waitForLibrary<any>('jspdf');

    if (typeof jspdfLib.jsPDF === 'undefined') {
      throw new Error("The 'jspdf' library loaded, but is not in the expected format.");
    }
    const { jsPDF } = jspdfLib;
  
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });
  
    const lines = markdownText.split('\n');
    let cursorY = 20; // Start position in mm
    const margin = 15;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  
    lines.forEach(line => {
      // Auto page break
      if (cursorY > 280) { 
        doc.addPage();
        cursorY = 20;
      }
      
      if (line.startsWith('## ')) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        const text = line.substring(3);
        const splitText = doc.splitTextToSize(text, maxWidth);
        doc.text(splitText, margin, cursorY);
        cursorY += (splitText.length * 7) + 3; // Add extra space after heading
      } else if (line.startsWith('- ')) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const text = line.substring(2);
        const splitText = doc.splitTextToSize(text, maxWidth - 5); // Indent for bullet
        doc.text('•', margin, cursorY, { baseline: 'top' });
        doc.text(splitText, margin + 5, cursorY, { baseline: 'top' });
        cursorY += (splitText.length * 5) + 1;
      } else if (line.trim() !== '') {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(line, maxWidth);
        doc.text(splitText, margin, cursorY, { baseline: 'top' });
        cursorY += (splitText.length * 5) + 1;
      } else {
          cursorY += 4; // Space for empty lines
      }
    });
  
    doc.save('Enhanced_Resume.pdf');
  } catch (error) {
    console.error("Error generating PDF file:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred while generating the PDF file.";
    alert(message);
  }
};
