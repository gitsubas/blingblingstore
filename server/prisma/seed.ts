
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
    {
        name: "Abstract Modern Sculpture",
        price: 129.99,
        category: "Decor",
        description: "A stunning hand-crafted abstract sculpture that adds a modern touch to any room. Made from sustainable materials.",
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
        images: [
            "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=800&q=80",
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
            "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80"
        ]
    },
    {
        name: "Ceramic Minimalist Vase",
        price: 45.50,
        category: "Vases",
        description: "Hand-thrown ceramic vase with a matte white finish. Ideal for dried flowers or standalone display.",
        images: []
    },
    {
        name: "Luxury Matte Lipstick",
        price: 24.00,
        category: "Cosmetics",
        description: "Long-lasting matte lipstick in a classic red shade. Enriched with Vitamin E for hydration.",
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
        images: []
    },
    {
        name: "Gold Plated Bangle Set",
        price: 89.99,
        category: "Jewelry",
        description: "Set of 3 gold-plated bangles with intricate detailing. Hypoallergenic and tarnish-resistant.",
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
        images: [
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
            "https://images.unsplash.com/photo-1564422167509-4f10d8370107?w=800&q=80"
        ]
    },
    {
        name: "Crystal Chandelier Earrings",
        price: 65.00,
        category: "Jewelry",
        description: "Statement chandelier earrings with sparkling crystals. Perfect for evening wear.",
        images: []
    }
];

async function main() {
    console.log('Start seeding ...');

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
                images: {
                    create: product.images.map(url => ({ url }))
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
