import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
    getCartItems, 
    addToCart as addToCartAPI, 
    removeFromCart as removeFromCartAPI,
    updateCartItemQuantity as updateCartItemQuantityAPI
} from '@/services/cart/endpoint';

interface Product {
    image: string;
    name: string;
    price: number;
    product_id: string;
    status: string;
    stock: number;
}

interface CartItem {
    id: string;
    quantity: number;
    product: Product;
}

export const useCart = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const getCart = async () => {
        setLoading(true);
        try {
            const response = await getCartItems();
            if(!response.data)
            {
                throw new Error("Không thể lấy giỏ hàng");
            }
            const { code, cart_items } = response.data.getCartItems;
            if (code === 200) {
                if(cart_items)
                    setCartItems(cart_items);
                else
                    setCartItems([]);
                return "Lấy giỏ hàng thành công";
            } else {
                throw new Error("Không thể lấy giỏ hàng");
            }
        } catch {
            throw new Error("Không thể lấy giỏ hàng");
        } finally {
            setLoading(false);
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async (productId: string, quantity: number = 1) => {
        setLoading(true);
        try {
            const response = await addToCartAPI(productId, quantity);
            if(response.data===undefined)
                throw new Error("Không thể thêm sản phẩm vào giỏ hàng");

            const { code} = response.data.addCartItem;
            
            if (code === 200) {
                return "Đã thêm sản phẩm vào giỏ hàng";
            } else {
                throw new Error("Không thể thêm sản phẩm vào giỏ hàng");
            }
        } catch {
            throw new Error("Không thể thêm sản phẩm vào giỏ hàng");
            
        } finally {
            setLoading(false);
        }
    };
    const handleRemoveFromCart = async (productId: string) => {
        setLoading(true);
        try {
            const response = await removeFromCartAPI(productId);
            if (response.data===undefined)
            {
                throw new Error("Không thể xóa sản phẩm khỏi giỏ hàng");
            }
            const { code } = response.data.removeCartItem;
            if (code === 200) {
                setCartItems(prev => prev.filter(item => item.product.product_id !== productId));
                return "Đã xóa sản phẩm khỏi giỏ hàng";
            } else {
                throw new Error("Không thể xóa sản phẩm khỏi giỏ hàng");
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        setLoading(true);
        try {
            if (quantity <= 0) {
                return handleRemoveFromCart(productId);
            }
            
            const response = await updateCartItemQuantityAPI(productId, quantity);
            if(response.data===undefined)
                throw new Error("Không thể cập nhật số lượng sản phẩm");
            const { code } = response.data.addCartItem; 
            if (code === 200) {
                setCartItems(prev => 
                    prev.map(item => 
                        item.product.product_id === productId 
                            ? { ...item, quantity } 
                            : item
                    )
                );
                return "Đã cập nhật số lượng sản phẩm";
            } else {
                throw new Error("Không thể cập nhật số lượng sản phẩm");
            }
        } catch {
            throw new Error("Không thể cập nhật số lượng sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handleClearCart = async () => {
        setLoading(true);
        try {
            const deletePromises = cartItems.map(item => 
                removeFromCartAPI(item.product.product_id)
            );
            
            await Promise.all(deletePromises);
            
            setCartItems([]);
            return "Đã xóa toàn bộ giỏ hàng";
        } catch{
            throw new Error ("Không thể xóa toàn bộ giỏ hàng")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        toast.promise(getCart(), {
            loading: "Đang tải giỏ hàng...",
            success: (message) => message,
            error: (error) => error.message
        });
    }, []);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    const totalPrice = cartItems.reduce((total, item) => 
        total + (item.product.price * item.quantity), 0
    );
    return {
        loading,
        cartItems,
        cartCount,
        totalPrice,
        getCart,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        updateQuantity: handleUpdateQuantity,
        clearCart: handleClearCart
    };
};

export default useCart;