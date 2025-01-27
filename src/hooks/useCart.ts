import { create } from 'zustand';

interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  cartItems: [],
  
  addToCart: (newItem) => {
    set((state) => {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.cartItems];
        updatedItems[existingItemIndex].quantity += 1;
        return { cartItems: updatedItems };
      }

      return { cartItems: [...state.cartItems, newItem] };
    });
  },

  removeFromCart: (itemId) => {
    set((state) => {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === itemId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.cartItems];
        if (updatedItems[existingItemIndex].quantity > 1) {
          updatedItems[existingItemIndex].quantity -= 1;
          return { cartItems: updatedItems };
        } else {
          return {
            cartItems: state.cartItems.filter(item => item.id !== itemId)
          };
        }
      }

      return state;
    });
  },

  clearCart: () => {
    set({ cartItems: [] });
  },

  getTotal: () => {
    const state = get();
    return state.cartItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  },

  getItemCount: () => {
    const state = get();
    return state.cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
  },
}));
