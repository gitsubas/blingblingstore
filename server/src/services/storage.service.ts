
import { supabase } from '../utils/supabase';

const BUCKET_NAME = 'products';

export const uploadImage = async (file: Express.Multer.File): Promise<string> => {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
};
