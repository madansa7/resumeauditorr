import { waitForLibrary } from './utils';

// Add declarations for window objects from CDNs
declare const pdfjsLib: any;

export const readFileAsText = async (file: File): Promise<string> => {
  if (file.size === 0) {
    throw new Error("Cannot read an empty file. Please select a valid file.");
  }
  
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return file.text();
  }

  // Use the modern file.arrayBuffer() which is simpler and more reliable.
  const arrayBuffer = await file.arrayBuffer();

  if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const mammoth = await waitForLibrary<{
        extractRawText: (options: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string; messages: any[] }>;
    }>('mammoth');

    try {
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error("Error parsing .docx file:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      // Provide a more user-friendly error message that hints at file corruption.
      if (message.includes("central directory")) {
          throw new Error("Could not read the .docx file. It may be corrupted or in an unsupported format. Please try re-saving the file and uploading again.");
      }
      throw new Error(`Error parsing .docx file: ${message}`);
    }
  }

  if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
    const pdfjsLib = await waitForLibrary<any>('pdfjsLib');

    // Lazily set workerSrc to avoid race conditions on initial load
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js';
    }
    try {
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      let textContent = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map((s: { str: string }) => s.str).join(' ') + '\n';
      }
      return textContent;
    } catch (error) {
      console.error("Error parsing .pdf file:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
       if (message.includes("Invalid PDF structure")) {
          throw new Error("Could not read the .pdf file. It may be corrupted or invalid. Please try a different file.");
      }
      throw new Error(`Error parsing .pdf file: ${message}`);
    }
  }

  throw new Error(`Unsupported file type: ${file.type || 'unknown'}. Please upload a .txt, .pdf, or .docx file.`);
};
