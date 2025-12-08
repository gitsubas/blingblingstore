"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const supabase_1 = require("../utils/supabase");
const BUCKET_NAME = 'products';
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;
    const { data, error } = yield supabase_1.supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file.buffer, {
        contentType: file.mimetype,
    });
    if (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }
    const { data: publicUrlData } = supabase_1.supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
});
exports.uploadImage = uploadImage;
