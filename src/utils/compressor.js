import imageCompression from 'browser-image-compression';

async function compressImage(file, maxWidthOrHeight = 1920, maxSizeKB = 2048, quality = 0.9) {

  if (!file || !file.size) {
    return file;
  }

  if (file.size / 1024 <= maxSizeKB) {
    return file;
  }

  const options = {
    maxSizeMB: maxSizeKB / 1024,
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
    initialQuality: quality,
  };

  try {
    const compressedBlob = await imageCompression(file, options);

    return new File([compressedBlob], file.name, {
      type: compressedBlob.type || file.type,
      lastModified: Date.now(),
    });

  } catch (error) {
    console.error("圖片壓縮出錯，回傳原始檔案:", error);
    return file;
  }
}

export { 
  compressImage 
};