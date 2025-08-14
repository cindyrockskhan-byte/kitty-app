import * as FileSystem from 'expo-file-system';

export async function uploadToCloudinary(uri) {
  const cloudName = 'dtzic0qfk';
  const uploadPreset = 'unsigned_video'; // from your Cloudinary preset
  const folder = 'condition-videos'; // from your preset folder

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const fileType = 'video/mp4';
  const fileName = uri.split('/').pop();

  const data = {
    file: `data:${fileType};base64,${base64}`,
    upload_preset: uploadPreset,
    folder,
  };

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.secure_url) {
    console.error('Cloudinary upload failed:', result);
    throw new Error(result.error?.message || 'Upload failed');
  }

  return {
    url: result.secure_url,
    public_id: result.public_id,
    delete_token: result.delete_token,
  };
}