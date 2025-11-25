// This service uses the 'docx' library, which is loaded from a CDN in index.html.
import { waitForLibrary } from './utils';

// This function creates a download link for the generated file blob.
const saveAs = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


export const generateDocxFromText = async (markdownText: string) => {
  try {
    const docxLib = await waitForLibrary<any>('docx');
    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docxLib;
    
    const lines = markdownText.split('\n').filter(line => line.trim() !== '');
    const children = [];
  
    for (const line of lines) {
      if (line.startsWith('## ')) {
        children.push(new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        }));
      } else if (line.startsWith('- ')) {
        children.push(new Paragraph({
          text: line.substring(2),
          bullet: {
            level: 0
          },
          indent: { left: 720 },
          spacing: { after: 100 }
        }));
      } else {
         children.push(new Paragraph({
          children: [new TextRun(line)]
        }));
      }
    }
  
    const doc = new Document({
      sections: [{
        properties: {},
        children,
      }],
    });
  
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Enhanced_Resume.docx");

  } catch (error) {
    console.error("Error generating DOCX file:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred while generating the DOCX file.";
    alert(message);
  }
};
