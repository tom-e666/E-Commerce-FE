"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion"
import { ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart(id)
  }

  const navigateToProduct = () => {
    router.push(`/product/${id}`)
  }

  // Create a trimmed description with ellipsis if too long
  const trimmedDescription = description.length > 300
    ? `${description.substring(0, 300)}...`
    : description;

  return (
    <div className="product-row relative">
      <motion.div
        className="product-index"
        style={{ y }}
      >
        {`#${String(index).padStart(3, '0')}`}
      </motion.div>

      <motion.div
        ref={ref}
        className="product-card"
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={navigateToProduct}
      >
        <div className="product-content">
          <div className="product-image-container">
            <Image
              src={image}
              alt={title}
              width={300}
              height={300}
              className="product-image"
              objectFit="contain"
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

            <motion.div
              className="product-description-container"
              animate={{ opacity: isHovered ? 0.6 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="product-description">
                {trimmedDescription}
              </p>
            </motion.div>

            <div className="product-actions">
              <Button
                onClick={handleAddToCart}
                className="add-to-cart-button"
                variant="default"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Thêm vào giỏ hàng
              </Button>

              <Button
                onClick={navigateToProduct}
                className="view-details-button"
                variant="outline"
              >
                Chi tiết
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
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
          cursor: pointer;
        }

        .product-content {
          display: flex;
          flex-direction: row;
        }

        .product-image-container {
          flex: 0 0 300px;
          height: 300px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
        }

        .product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain !important;
          padding: 1rem;
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
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
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

        .product-description-container {
          flex-grow: 1;
          position: relative;
          overflow: hidden;
        }

        .product-description {
          margin: 0 0 1.5rem;
          font-size: 1rem;
          line-height: 1.6;
          color: #4a5568;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: auto;
        }

        .add-to-cart-button {
          flex-grow: 1;
          padding: 0.75rem 1rem;
          font-weight: 600;
        }

        .view-details-button {
          padding: 0.75rem 1rem;
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
          
          .product-actions {
            flex-direction: column;
          }
          
          .add-to-cart-button,
          .view-details-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default ParallaxProductGrid;