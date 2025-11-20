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
        description: "A stunning hand-crafted abstract sculpture that adds a modern touch to any room. Made from sustainable materials.",
    },
    {
        id: "2",
        name: "Floral Oil Painting",
        price: 299.00,
        category: "Paintings",
        image: paintingImg,
        description: "Original oil painting featuring vibrant floral patterns. Perfect for living rooms or bedrooms.",
    },
    {
        id: "3",
        name: "Ceramic Minimalist Vase",
        price: 45.50,
        category: "Vases",
        image: vaseImg,
        description: "Hand-thrown ceramic vase with a matte white finish. Ideal for dried flowers or standalone display.",
    },
    {
        id: "4",
        name: "Luxury Matte Lipstick",
        price: 24.00,
        category: "Cosmetics",
        image: lipstickImg,
        description: "Long-lasting matte lipstick in a classic red shade. Enriched with Vitamin E for hydration.",
    },
    {
        id: "5",
        name: "Silk Floral Scarf",
        price: 55.00,
        category: "Apparel",
        image: scarfImg,
        description: "100% silk scarf with a delicate floral print. Soft, breathable, and elegant.",
    },
    {
        id: "6",
        name: "Gold Plated Bangle Set",
        price: 89.99,
        category: "Jewelry",
        image: banglesImg,
        description: "Set of 3 gold-plated bangles with intricate detailing. Hypoallergenic and tarnish-resistant.",
    },
    {
        id: "7",
        name: "Leather Crossbody Bag",
        price: 149.50,
        category: "Bags",
        image: bagImg,
        description: "Genuine leather crossbody bag with adjustable strap. Compact yet spacious enough for essentials.",
    },
    {
        id: "8",
        name: "Crystal Chandelier Earrings",
        price: 65.00,
        category: "Jewelry",
        image: earringsImg,
        description: "Statement chandelier earrings with sparkling crystals. Perfect for evening wear.",
    },
];
