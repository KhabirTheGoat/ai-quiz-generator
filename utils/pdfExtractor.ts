// This script assumes pdfjsLib is loaded globally from a CDN.
declare const pdfjsLib: any;

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const extractTextFromPdf = async (file: File): Promise<string> => {
    if (file.size === 0) {
        throw new Error("The PDF file is empty. Please select a file with content.");
    }
    
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
        fileReader.onload = async (event) => {
            if (!event.target?.result) {
                return reject(new Error("Failed to read file."));
            }
            try {
                const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedArray).promise;
                let fullText = '';

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(' ');
                    fullText += pageText + '\n\n';
                }
                resolve(fullText);
            } catch (error) {
                console.error("Error processing PDF:", error);
                reject(new Error("Could not process PDF file. It might be corrupted or in an unsupported format."));
            }
        };

        fileReader.onerror = () => {
            reject(new Error("Error reading file."));
        };

        fileReader.readAsArrayBuffer(file);
    });
};