import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<string> {
  try {
    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary with user ID as public_id
    const result = await cloudinary.uploader.upload(dataURI, {
      public_id: `profile_${userId}`,
      folder: 'user_profiles',
      overwrite: true, // This will replace the existing image
      format: 'webp', // Convert to webp for better compression
      quality: 'auto:good',
      fetch_format: 'auto',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteProfileImage(userId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(`user_profiles/profile_${userId}`);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    // Don't throw error for delete operation as it's not critical
  }
}
