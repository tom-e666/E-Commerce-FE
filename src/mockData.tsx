export interface Product {
    id: string;
    name: string;
    brand: string;
    discountPrice?: number;
    description: string;
    specifications: {
        processor: string;
        ram: string;
        storage: string;
        graphicsCard?: string;
        display: string;
        battery: string;
        weight: string;
        operatingSystem: string;

    };
    images: string[];
    stock: number;
    category: string;
    ratings:
    {
        average: number;
        count: number;
    };
    reviews: {
        userId: string;
        comment: string;
        rating: number;
    }[];
    createdAt: string;
    updateAt: string;
}
export function getMockProducts(): Product[] {
    return [
        {
            id: "1",
            name: "Dell XPS 13",
            brand: "Dell",
            discountPrice: 999.99,
            description: "A high-performance ultrabook with a stunning display and premium build quality.",
            specifications: {
                processor: "Intel Core i7-1165G7",
                ram: "16GB",
                storage: "512GB SSD",
                graphicsCard: "Intel Iris Xe Graphics",
                display: "13.4-inch FHD+ (1920 x 1200)",
                battery: "52Wh, up to 12 hours",
                weight: "1.2kg",
                operatingSystem: "Windows 11 Home",
            },
            images: [
                "/images/dell-xps-13-1.jpg",
                "/images/dell-xps-13-2.jpg",
                "/images/dell-xps-13-3.jpg",
            ],
            stock: 10,
            category: "Ultrabook",
            ratings: {
                average: 4.7,
                count: 120,
            },
            reviews: [
                {
                    userId: "user1",
                    comment: "Amazing laptop with great performance!",
                    rating: 5,
                },
                {
                    userId: "user2",
                    comment: "Battery life could be better, but overall it's excellent.",
                    rating: 4,
                },
            ],
            createdAt: "2023-01-01T10:00:00Z",
            updateAt: "2023-03-01T12:00:00Z",
        },
        {
            id: "2",
            name: "MacBook Pro 14",
            brand: "Apple",
            discountPrice: 1999.99,
            description: "The ultimate laptop for professionals with the M1 Pro chip.",
            specifications: {
                processor: "Apple M1 Pro",
                ram: "16GB",
                storage: "1TB SSD",
                graphicsCard: "Integrated 16-core GPU",
                display: "14.2-inch Liquid Retina XDR (3024 x 1964)",
                battery: "70Wh, up to 17 hours",
                weight: "1.6kg",
                operatingSystem: "macOS Monterey",
            },
            images: [
                "/images/macbook-pro-14-1.jpg",
                "/images/macbook-pro-14-2.jpg",
                "/images/macbook-pro-14-3.jpg",
            ],
            stock: 5,
            category: "Professional",
            ratings: {
                average: 4.9,
                count: 200,
            },
            reviews: [
                {
                    userId: "user3",
                    comment: "The best laptop I've ever used. Perfect for video editing.",
                    rating: 5,
                },
                {
                    userId: "user4",
                    comment: "Expensive, but worth every penny.",
                    rating: 5,
                },
            ],
            createdAt: "2023-02-01T10:00:00Z",
            updateAt: "2023-03-05T12:00:00Z",
        },
        {
            id: "3",
            name: "ASUS ROG Zephyrus G14",
            brand: "ASUS",
            discountPrice: 1499.99,
            description: "A powerful gaming laptop with a sleek design and excellent performance.",
            specifications: {
                processor: "AMD Ryzen 9 5900HS",
                ram: "16GB",
                storage: "1TB SSD",
                graphicsCard: "NVIDIA GeForce RTX 3060",
                display: "14-inch QHD (2560 x 1440), 120Hz",
                battery: "76Wh, up to 10 hours",
                weight: "1.7kg",
                operatingSystem: "Windows 11 Home",
            },
            images: [
                "/images/asus-rog-zephyrus-g14-1.jpg",
                "/images/asus-rog-zephyrus-g14-2.jpg",
                "/images/asus-rog-zephyrus-g14-3.jpg",
            ],
            stock: 8,
            category: "Gaming",
            ratings: {
                average: 4.8,
                count: 150,
            },
            reviews: [
                {
                    userId: "user5",
                    comment: "Great gaming laptop with excellent performance.",
                    rating: 5,
                },
                {
                    userId: "user6",
                    comment: "The display is amazing, and the build quality is top-notch.",
                    rating: 5,
                },
            ],
            createdAt: "2023-01-15T10:00:00Z",
            updateAt: "2023-03-10T12:00:00Z",
        },
    ];
}