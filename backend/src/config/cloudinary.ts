
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';



    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Missing Cloudinary environment variables');
      }
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    // Set up Multer storage
    const storage = new CloudinaryStorage({
       cloudinary:cloudinary,
      params: ()=>({
        folder: 'avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { width: 300, height: 300, crop: 'limit', quality: 'auto:good' },
        ],
      }),
    });
    
    const documentStorage = new CloudinaryStorage({
      cloudinary,
      params: () => ({
        folder: 'documents',
        resource_type: 'raw', 
        allowed_formats: ['pdf'],
      }),
    });

export { cloudinary, storage,documentStorage };