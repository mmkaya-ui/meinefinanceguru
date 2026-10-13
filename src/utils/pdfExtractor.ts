export async function extractTextFromPdf(file: File) {
  const pdfjsLib = await import("pdfjs-dist");
  // We load from a reliable unpkg or locally if needed. For now we keep a reliable cdn or bundle it.
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  try {
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      text += strings.join(" ") + "\n";
    }
    return text;
  } finally {
    await (pdf as any).destroy();
  }
}
