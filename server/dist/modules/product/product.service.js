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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.getCategories = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createProduct = (data, imageUrls) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, categoryId, variants } = data;
    // Convert price to float
    const parsedPrice = parseFloat(price);
    return yield prisma_1.default.product.create({
        data: {
            name,
            description,
            price: parsedPrice,
            categoryId,
            images: {
                create: imageUrls.map((url) => ({ url })),
            },
            variants: {
                create: variants ? JSON.parse(variants) : [],
            },
        },
        include: {
            images: true,
            variants: true,
            category: true,
        },
    });
});
exports.createProduct = createProduct;
const getProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, search, sort } = query;
    const where = {};
    if (category)
        where.categoryId = category;
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }
    const orderBy = {};
    if (sort === 'price_asc')
        orderBy.price = 'asc';
    if (sort === 'price_desc')
        orderBy.price = 'desc';
    if (sort === 'newest')
        orderBy.createdAt = 'desc';
    return yield prisma_1.default.product.findMany({
        where,
        orderBy,
        include: {
            images: true,
            category: true,
            variants: true, // simplified
        },
    });
});
exports.getProducts = getProducts;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.product.findUnique({
        where: { id },
        include: {
            images: true,
            variants: true,
            category: true,
            reviews: {
                include: { user: { select: { name: true } } },
            },
        },
    });
});
exports.getProductById = getProductById;
const updateProduct = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    // basic update
    return yield prisma_1.default.product.update({
        where: { id },
        data,
    });
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.product.delete({
        where: { id },
    });
});
exports.deleteProduct = deleteProduct;
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.category.findMany();
});
exports.getCategories = getCategories;
const createCategory = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.category.create({ data: { name } });
});
exports.createCategory = createCategory;
