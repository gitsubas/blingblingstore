import { Product } from "../context/CartContext";
import sculptureImg from "../assets/products/sculpture.jpg";
import paintingImg from "../assets/products/painting.jpg";
import vaseImg from "../assets/products/vase.jpg";
import lipstickImg from "../assets/products/lipstick.jpg";
import scarfImg from "../assets/products/scarf.jpg";
import banglesImg from "../assets/products/bangles.jpg";
import bagImg from "../assets/products/bag.jpg";
import earringsImg from "../assets/products/earrings.jpg";

export const products: Product[] = [
    {
        id: "1",
        name: "Abstract Modern Sculpture",
        price: 129.99,
        category: "Decor",
        image: sculptureImg,
        images: [
            sculptureImg,
            "https://images.unsplash.com/photo-1620163843593-44cc1d813a4e?w=800&q=80",
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"
        ],
        description: "A stunning hand-crafted abstract sculpture that adds a modern touch to any room. Made from sustainable materials.",
        rating: 4.8,
        reviews: 12,
        stock: 10,
        lowStockThreshold: 5,
    },
    {
        id: "2",
        name: "Floral Oil Painting",
        price: 299.00,
        category: "Paintings",
        image: paintingImg,
        images: [
            paintingImg,
            "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=800&q=80",
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
            "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80"
        ],
        description: "Original oil painting featuring vibrant floral patterns. Perfect for living rooms or bedrooms.",
        rating: 4.5,
        reviews: 8,
        stock: 10,
        lowStockThreshold: 5,
    },
    {
        id: "3",
        name: "Ceramic Minimalist Vase",
        price: 45.50,
        category: "Vases",
        image: vaseImg,
        images: [vaseImg],
        description: "Hand-thrown ceramic vase with a matte white finish. Ideal for dried flowers or standalone display.",
        rating: 4.2,
        reviews: 25,
        stock: 50,
        lowStockThreshold: 5,
    },
    {
        id: "4",
        name: "Luxury Matte Lipstick",
        price: 24.00,
        category: "Cosmetics",
        image: lipstickImg,
        images: [
            lipstickImg,
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
            "https://images.unsplash.com/photo-1631214524020-7e18db7a8f23?w=800&q=80"
        ],
        description: "Long-lasting matte lipstick in a classic red shade. Enriched with Vitamin E for hydration.",
        rating: 4.9,
        reviews: 150,
        stock: 100,
        lowStockThreshold: 5,
    },
    {
        id: "5",
        name: "Silk Floral Scarf",
        price: 55.00,
        category: "Apparel",
        image: scarfImg,
        description: "100% silk scarf with a delicate floral print. Soft, breathable, and elegant.",
        rating: 4.6,
        reviews: 32,
        stock: 50,
        lowStockThreshold: 5,
    },
    {
        id: "6",
        name: "Gold Plated Bangle Set",
        price: 89.99,
        category: "Jewelry",
        image: banglesImg,
        images: [
            banglesImg,
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"
        ],
        description: "Set of 3 gold-plated bangles with intricate detailing. Hypoallergenic and tarnish-resistant.",
        rating: 4.7,
        reviews: 45,
        stock: 50,
        lowStockThreshold: 5,
    },
    {
        id: "7",
        name: "Leather Crossbody Bag",
        price: 149.50,
        category: "Bags",
        image: bagImg,
        images: [
            bagImg,
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
            "https://images.unsplash.com/photo-1564422167509-4f10d8370107?w=800&q=80"
        ],
        description: "Genuine leather crossbody bag with adjustable strap. Compact yet spacious enough for essentials.",
        rating: 4.4,
        reviews: 67,
        stock: 50,
        lowStockThreshold: 5,
    },
    {
        id: "8",
        name: "Crystal Chandelier Earrings",
        price: 65.00,
        category: "Jewelry",
        image: earringsImg,
        description: "Statement chandelier earrings with sparkling crystals. Perfect for evening wear.",
        rating: 4.3,
        reviews: 18,
        stock: 50,
        lowStockThreshold: 5,
    },
];

