import * as FileSystem from 'expo-file-system';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dtzci0qfk';
const UPLOAD_PRESET = 'unsigned_secondhand';

export async function uploadToCloudinary({ uri, type }) {
  try {
    const file = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64
    });

    const fileType = type === 'image' ? 'image/jpeg' : 'video/mp4';

    const formData = new FormData();
    formData.append('file', `data:${fileType};base64,${file}`);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('context', 'alt=secondhand');
    formData.append('folder', 'secondhand_items');

    // Optional: auto-delete after 35 days using Cloudinary's upload metadata (if your plan supports it)
    formData.append('metadata', JSON.stringify({
      ttl: 3024000  // 35 days in seconds
    }));

    const res = await fetch(`${CLOUDINARY_URL}/${type}/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!data.secure_url) throw new Error('Upload failed');
    return data.secure_url;

  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return null;
  }
}