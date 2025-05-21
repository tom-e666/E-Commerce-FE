"use client"

import { useRef, useState, useEffect, useCallback } from "react" // Added useEffect and useCallback
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion"
import { ShoppingCart, ArrowRight, Loader2 } from "lucide-react" // Added Loader2 for loading indicator
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

const PRODUCTS_PER_PAGE = 20;

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

  const trimmedDescription = description.length > 300
    ? `${description.substring(0, 300)}...`
    : description;

  return (
    <div className="product-row re">
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
              style={{ objectFit: 'contain' }} // Fixed: Replace legacy objectFit prop with style
              onError={(e) => {
                e.currentTarget.src = "/laptop.png" // Fallback image
              }}
            />
          </div>

          <div className="product-details">
            <Link href={`/product/${id}`} className="product-link" onClick={(e) => e.stopPropagation()}>
              <h3 className="product-title">{title}</h3>
            </Link>
            <p className="product-price">{formatCurrency(price)}</p>

            <motion.div
              className="product-description-container"
              animate={{ opacity: isHovered ? 0.6 : 1 }} // This opacity might hide the text too much, consider changing
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
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click when clicking this button
                  navigateToProduct();
                }}
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
  const { scrollYProgress } = useScroll() // This scrollYProgress is for the whole window
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const [displayedProducts, setDisplayedProducts] = useState(products.slice(0, PRODUCTS_PER_PAGE));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(products.length > PRODUCTS_PER_PAGE);

  const loadMoreRef = useRef<HTMLDivElement | null>(null); // Ref for the loader element

  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;
    const newProducts = products.slice(page * PRODUCTS_PER_PAGE, nextPage * PRODUCTS_PER_PAGE);

    // Simulate network delay for demonstration
    setTimeout(() => {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore(products.length > nextPage * PRODUCTS_PER_PAGE);
      setLoading(false);
    }, 500); // Adjust delay as needed
  }, [products, page, loading, hasMore]);


  useEffect(() => {
    // Reset when products prop changes
    setDisplayedProducts(products.slice(0, PRODUCTS_PER_PAGE));
    setPage(1);
    setHasMore(products.length > PRODUCTS_PER_PAGE);
  }, [products]);


  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          // Scroll down slightly when loading more products to provide visual feedback
          window.scrollBy({ top: 50, behavior: 'smooth' });
          loadMoreProducts();
        }
      },
      {
        // Trigger when element is 200px within viewport, not when fully visible
        rootMargin: '200px 0px',
        threshold: 0.1 // Only need 10% of the element to be visible
      }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [loadMoreProducts, loading, hasMore]);


  return (
    <div className="parallax-container">
      <div className="products-list">
        {displayedProducts.map((product, index) => (
          <ParallaxProduct
            key={`${product.id}-${index}`} // Ensure key is unique if ids can repeat in different loads (though unlikely here)
            id={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            description={product.description}
            index={index + 1} // Keep index based on displayed order
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Loader Element with more padding to make it more visible */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="load-more-trigger"
          style={{
            height: '80px',  // Increased height for better visibility
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30px',  // Added margin to create space
            marginBottom: '30px'
          }}
        >
          {loading && (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
              <span className="text-blue-600">Đang tải thêm sản phẩm...</span>
            </div>
          )}
          {!loading && (
            <div className="h-8 w-full opacity-0">
              {/* Invisible spacer to maintain height when not loading */}
            </div>
          )}
        </div>
      )}

      {!hasMore && displayedProducts.length > 0 && (
        <p className="text-center p-8 text-gray-500 mt-4 border-t border-gray-200">
          Đã tải tất cả sản phẩm
        </p>
      )}


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
          gap: 3rem; /* Spacing between product cards */
          padding: 0 2rem; /* Horizontal padding for the list */
          max-width: 1200px;
          margin: 0 auto;
        }

        .product-row {
          position: relative; /* For product index positioning */
          display: flex;
          align-items: center;
          padding: 1rem; /* Padding around each product row for the index to sit in */
        }

        /* Rest of your existing styles */
        .product-card {
          width: 100%;
          background: white;
          border-radius: 0.75rem; /* 12px */
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .product-content {
          display: flex;
          flex-direction: row; /* Default: image left, details right */
        }

        .product-image-container {
          flex: 0 0 300px; /* Fixed width for image container */
          height: 300px;   /* Fixed height for image container */
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa; /* Light background for image area */
        }

        .product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain !important; /* Ensure image fits well */
          padding: 1rem; /* Padding within the image container */
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-details {
          flex: 1; /* Take remaining space */
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
          font-size: 1.75rem; /* 28px */
          font-weight: 700;
          color: #1a202c; /* Dark gray */
          transition: color 0.2s ease;
          /* For multi-line ellipsis */
          display: -webkit-box;
          -webkit-line-clamp: 2; /* Show max 2 lines */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          min-height: calc(1.75rem * 1.2 * 2); /* Approximate height for 2 lines to prevent layout shift */
        }

        .product-title:hover {
          color: #2563eb; /* Blue-600 */
        }

        .product-price {
          margin: 0 0 1rem;
          font-size: 1.5rem; /* 24px */
          font-weight: 700;
          color: #2563eb; /* Blue-600 */
        }

        .product-description-container {
            flex-grow: 1; /* Allow description to take available vertical space */
            position: relative; /* For potential future absolute positioning inside */
            overflow: hidden; /* Ensure content doesn't overflow designated space */
            min-height: calc(1rem * 1.6 * 3); /* Approximate height for 3 lines to prevent layout shift */
        }

        .product-description {
          margin: 0 0 1.5rem;
          font-size: 1rem; /* 16px */
          line-height: 1.6;
          color: #4a5568; /* Gray-700 */
          display: -webkit-box;
          -webkit-line-clamp: 3; /* Show max 3 lines */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-actions {
          display: flex;
          flex-wrap: wrap; /* Allow buttons to wrap on smaller screens if necessary */
          gap: 0.5rem; /* 8px gap between buttons */
          margin-top: auto; /* Push actions to the bottom of the card */
        }

        .add-to-cart-button {
          flex-grow: 1; /* Allow add to cart button to grow */
          padding: 0.75rem 1rem;
          font-weight: 600;
        }

        .view-details-button {
          padding: 0.75rem 1rem;
          font-weight: 600;
        }

        .product-index {
          position: absolute;
          left: -2rem; /* Position to the left of the card, adjust as needed */
          font-size: 8rem; /* Large text size */
          font-weight: 900; /* Boldest */
          color: rgba(37, 99, 235, 0.1); /* Light, transparent blue */
          z-index: -1; /* Behind the card */
          line-height: 1; /* Tighten line height */
          user-select: none; /* Non-selectable text */
        }

        .progress-bar {
          position: fixed;
          left: 0;
          right: 0;
          height: 3px;
          background: #2563eb; /* Blue-600 */
          bottom: 0;
          transform-origin: 0%;
          z-index: 50;
        }

        @media (max-width: 768px) {
          .products-list {
            padding: 0 1rem; /* Reduce padding on smaller screens */
          }
          .product-row {
            padding: 0.5rem;
          }
          .product-content {
            flex-direction: column; /* Stack image and details vertically */
          }
          
          .product-image-container {
            flex: none; /* Reset flex behavior */
            width: 100%; /* Full width for image container */
            height: 200px; /* Adjust height for mobile */
          }
          
          .product-index {
            font-size: 5rem; /* Smaller index text */
            left: auto; /* Reset left positioning */
            right: 1rem; /* Position to the right */
            top: -1rem;  /* Position slightly above the card */
          }
          
          .product-details {
            padding: 1rem 1.5rem; /* Adjust padding for mobile */
          }

          .product-title {
            font-size: 1.5rem; /* Adjust title size */
            min-height: calc(1.5rem * 1.2 * 2); 
          }

          .product-price {
            font-size: 1.25rem; /* Adjust price size */
          }
           .product-description-container {
             min-height: calc(1rem * 1.6 * 3);
           }
          .product-actions {
            flex-direction: column; /* Stack buttons vertically */
          }
          
          .add-to-cart-button,
          .view-details-button {
            width: 100%; /* Make buttons full width */
          }
        }
      `}</style>
    </div>
  )
}

export default ParallaxProductGrid;