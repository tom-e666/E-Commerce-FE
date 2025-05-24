import cloudinary from './index';

/**
 * Upload a single image file to Cloudinary
 * @param {string} filePath - The path to the image file (local path)
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<any>} - The upload result including the secure URL
 */
export async function uploadImageToCloudinary(
  filePath: string,
  folder?: string
): Promise<any> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder || 'default_folder',
      // other options like public_id, tags, etc.
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Use this to delete an image by public_id
 * @param {string} publicId - The public_id of the uploaded image
 * @returns {Promise<any>}
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<any> {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}