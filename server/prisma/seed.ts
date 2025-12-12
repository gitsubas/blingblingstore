
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
    {
        name: "Abstract Modern Sculpture",
        price: 129.99,
        category: "Decor",
        description: "A stunning hand-crafted abstract sculpture that adds a modern touch to any room. Made from sustainable materials.",
        stock: 15,
        featured: true,
        lowStockThreshold: 5,
        rating: 4.7,
        reviewCount: 23,
        images: [
            "https://images.unsplash.com/photo-1620163843593-44cc1d813a4e?w=800&q=80",
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"
        ]
    },
    {
        name: "Floral Oil Painting",
        price: 299.00,
        category: "Paintings",
        description: "Original oil painting featuring vibrant floral patterns. Perfect for living rooms or bedrooms.",
        stock: 8,
        featured: true,
        lowStockThreshold: 3,
        rating: 4.9,
        reviewCount: 45,
        images: [
            "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=800&q=80",
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
            "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80"
        ]
    },
    {
        name: "Classic Cotton T-Shirt",
        price: 19.99,
        category: "Clothing",
        description: "Comfortable everyday t-shirt made from 100% cotton",
        stock: 100, // This will be overridden by variant stock
        lowStockThreshold: 20,
        featured: false,
        rating: 4.3,
        reviewCount: 89,
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
        ],
        variants: [
            {
                attributes: { size: "S", color: "White" },
                price: 19.99,
                stock: 20
            },
            {
                attributes: { size: "M", color: "White" },
                price: 19.99,
                stock: 30
            },
            {
                attributes: { size: "L", color: "White" },
                price: 19.99,
                stock: 25
            },
            {
                attributes: { size: "M", color: "Black" },
                price: 21.99,
                stock: 15
            },
            {
                attributes: { size: "L", color: "Black" },
                price: 21.99,
                stock: 10
            }
        ]
    },
    {
        name: "Elegant Summer Dress",
        price: 59.99,
        category: "Clothing",
        description: "Flowing summer dress perfect for warm weather",
        stock: 45, // This will be overridden by variant stock
        lowStockThreshold: 10,
        featured: true,
        rating: 4.7,
        reviewCount: 156,
        images: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
        ],
        variants: [
            {
                attributes: { size: "XS", color: "Floral Blue" },
                price: 59.99,
                stock: 8
            },
            {
                attributes: { size: "S", color: "Floral Blue" },
                price: 59.99,
                stock: 12
            },
            {
                attributes: { size: "M", color: "Floral Blue" },
                price: 59.99,
                stock: 15
            },
            {
                attributes: { size: "S", color: "Solid Red" },
                price: 64.99,
                stock: 10
            }
        ]
    },
    {
        name: "Ceramic Minimalist Vase",
        price: 45.50,
        category: "Vases",
        description: "Hand-thrown ceramic vase with a matte white finish. Ideal for dried flowers or standalone display.",
        stock: 30,
        featured: false,
        lowStockThreshold: 10,
        rating: 4.5,
        reviewCount: 67,
        images: []
    },
    {
        name: "Luxury Matte Lipstick",
        price: 24.00,
        category: "Cosmetics",
        description: "Long-lasting matte lipstick in a classic red shade. Enriched with Vitamin E for hydration.",
        stock: 50,
        featured: true,
        lowStockThreshold: 15,
        rating: 4.6,
        reviewCount: 234,
        images: [
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
            "https://images.unsplash.com/photo-1631214524020-7e18db7a8f23?w=800&q=80"
        ]
    },
    {
        name: "Silk Floral Scarf",
        price: 55.00,
        category: "Apparel",
        description: "100% silk scarf with a delicate floral print. Soft, breathable, and elegant.",
        stock: 25,
        featured: true,
        lowStockThreshold: 8,
        rating: 4.8,
        reviewCount: 89,
        images: []
    },
    {
        name: "Gold Plated Bangle Set",
        price: 89.99,
        category: "Jewelry",
        description: "Set of 3 gold-plated bangles with intricate detailing. Hypoallergenic and tarnish-resistant.",
        stock: 20,
        featured: true,
        lowStockThreshold: 5,
        rating: 4.7,
        reviewCount: 156,
        images: [
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"
        ]
    },
    {
        name: "Leather Crossbody Bag",
        price: 149.50,
        category: "Bags",
        description: "Genuine leather crossbody bag with adjustable strap. Compact yet spacious enough for essentials.",
        stock: 18,
        featured: true,
        lowStockThreshold: 5,
        rating: 4.9,
        reviewCount: 201,
        images: [
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
            "https://images.unsplash.com/photo-1564422167509-4f10d8370107?w=800&q=80"
        ]
    },
    {
        name: "Crystal Chandelier Earrings",
        price: 65.00,
        category: "Earrings",
        description: "Statement chandelier earrings with sparkling crystals. Perfect for evening wear.",
        stock: 35,
        featured: true,
        lowStockThreshold: 10,
        rating: 4.8,
        reviewCount: 178,
        images: []
    }
];

async function main() {
    console.log('Start seeding ...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@blingbling.com' },
        update: {},
        create: {
            email: 'admin@blingbling.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });
    console.log(`Created admin user: ${admin.email}`);

    // Create demo customer user (already exists from earlier, but ensure it's there)
    const demoPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@test.com' },
        update: {},
        create: {
            email: 'demo@test.com',
            password: demoPassword,
            name: 'Demo User',
            role: 'CUSTOMER',
        },
    });
    console.log(`Created demo user: ${demoUser.email}`);

    // Clear existing products before seeding
    for (const product of products) {
        const category = await prisma.category.upsert({
            where: { name: product.category },
            update: {},
            create: { name: product.category },
        });

        const createdProduct = await prisma.product.create({
            data: {
                name: product.name,
                price: product.price,
                description: product.description,
                categoryId: category.id,
                stock: product.stock,
                featured: product.featured,
                lowStockThreshold: product.lowStockThreshold,
                rating: product.rating,
                reviewCount: product.reviewCount,
                images: {
                    create: product.images.map((url) => ({ url }))
                }
            },
        });

        console.log(`Created product with id: ${createdProduct.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
