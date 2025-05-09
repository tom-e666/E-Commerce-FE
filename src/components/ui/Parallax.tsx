"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

function useParallax(value: MotionValue<number>, distance: number) {
    return useTransform(value, [0, 1], [-distance, distance])
}

interface ProductProps {
    id: string;
    image: string;
    title: string;
    price: number;
    index: number;
    description: string;
    onAddToCart: (id: string) => void;
}

export function ParallaxProduct({ id, image, title, price, description, index, onAddToCart }: ProductProps) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: ref })
    const y = useParallax(scrollYProgress, 100)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onAddToCart(id)
    }

    return (
        <div className="product-row">
            <motion.div
                className="product-index"
                style={{ y }}
            >
                {`#${String(index).padStart(3, '0')}`}
            </motion.div>

            <div ref={ref} className="product-card">
                <div className="product-content">
                    <div className="product-image-container">
                        <Image
                            src={image}
                            alt={title}
                            width={300}
                            height={300}
                            className="product-image"
                            onError={(e) => {
                                e.currentTarget.src = "/laptop.png"
                            }}
                        />
                    </div>

                    <div className="product-details">
                        <Link href={`/product/${id}`} className="product-link">
                            <h3 className="product-title">{title}</h3>
                        </Link>
                        <p className="product-price">{formatCurrency(price)}</p>
                        <p className="product-description">
                            {description}
                        </p>
                        <Button
                            onClick={handleAddToCart}
                            className="add-to-cart-button"
                            variant="default"
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ParallaxProductGrid({ products, onAddToCart }: {
    products: Array<{ id: string; image: string; title: string; price: number, description: string }>;
    onAddToCart: (id: string) => void;
}) {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    })

    return (
        <div className="parallax-container">
            <div className="products-list">
                {products.map((product, index) => (
                    <ParallaxProduct
                        key={product.id}
                        id={product.id}
                        image={product.image}
                        title={product.title}
                        price={product.price}
                        description={product.description}
                        index={index + 1}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>
            <motion.div className="progress-bar" style={{ scaleX }} />
            <style jsx global>{`
        .parallax-container {
          position: relative;
          width: 100%;
          padding: 2rem 0;
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          padding: 0 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .product-row {
          position: relative;
          display: flex;
          align-items: center;
          padding: 1rem;
        }

        .product-card {
          width: 100%;
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .product-content {
          display: flex;
          flex-direction: row;
        }

        .product-image-container {
          flex: 0 0 300px;
          height: 300px;
          position: relative;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-details {
          flex: 1;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
        }

        .product-link {
          text-decoration: none;
          color: inherit;
        }

        .product-title {
          margin: 0 0 0.75rem;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a202c;
          transition: color 0.2s ease;
        }

        .product-title:hover {
          color: #2563eb;
        }

        .product-price {
          margin: 0 0 1rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2563eb;
        }

        .product-description {
          margin: 0 0 1.5rem;
          font-size: 1rem;
          line-height: 1.6;
          color: #4a5568;
          flex-grow: 1;
        }

        .add-to-cart-button {
          align-self: flex-start;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
        }

        .product-index {
          position: absolute;
          left: -2rem;
          font-size: 8rem;
          font-weight: 900;
          color: rgba(37, 99, 235, 0.1);
          z-index: -1;
          line-height: 1;
        }

        .progress-bar {
          position: fixed;
          left: 0;
          right: 0;
          height: 3px;
          background: #2563eb;
          bottom: 0;
          transform-origin: 0%;
          z-index: 50;
        }

        @media (max-width: 768px) {
          .product-content {
            flex-direction: column;
          }
          
          .product-image-container {
            flex: none;
            width: 100%;
            height: 200px;
          }
          
          .product-index {
            font-size: 5rem;
            left: auto;
            right: 1rem;
            top: -1rem;
          }
          
          .add-to-cart-button {
            width: 100%;
          }
        }
      `}</style>
        </div>
    )
}

export default ParallaxProductGrid;