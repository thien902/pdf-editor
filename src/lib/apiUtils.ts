export async function processPDF(
  endpoint: string,
  file: File,
  additionalData?: Record<string, string>
): Promise<Blob> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const response = await fetch(`/api/pdf/${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to process PDF');
  }

  return await response.blob();
}

export async function processMultiplePDFs(
  endpoint: string,
  files: File[]
): Promise<Blob> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`/api/pdf/${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to process PDFs');
  }

  return await response.blob();
} 