// Files are sent to the API as base64 inside a 10 MB JSON body, so keep the raw file under ~7 MB.
export const MAX_UPLOAD_BYTES = 7 * 1024 * 1024;

export const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });

export const formatFileSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

// Maps an uploaded file to the material "type" the library filters by.
export const detectMaterialType = (file) => {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (file.type === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('image/')) return 'image';
  return 'pdf';
};

export const downloadFile = (url, name) => {
  if (!url || url === '#') return false;
  const a = document.createElement('a');
  a.href = url;
  a.download = name || 'download';
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
};
