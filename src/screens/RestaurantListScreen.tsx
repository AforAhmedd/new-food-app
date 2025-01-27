import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Restaurant, MenuItem } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../hooks/useCart';

export const RestaurantListScreen = ({ navigation }: { navigation: any }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();

  const fetchRestaurants = async () => {
    try {
      console.log('Fetching restaurants...');
      const { data, error } = await supabase
        .from('Restaurant')
        .select(`
          *,
          MenuItem (*)
        `)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching restaurants:', error.message);
        setError('Error fetching restaurants: ' + error.message);
        return;
      }

      console.log('Fetched restaurants:', data?.length || 0);
      if (data) {
        setRestaurants(data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error:', errorMessage);
      setError('Unexpected error: ' + errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRestaurants();
  }, []);

  const handleMenuItemPress = (restaurant: Restaurant, menuItem: MenuItem) => {
    addToCart({
      id: menuItem.id,
      restaurantId: restaurant.id,
      name: menuItem.label,
      price: menuItem.price,
      quantity: 1,
      restaurantName: restaurant.name
    });
  };

  const renderMenuItem = (restaurant: Restaurant, menuItem: MenuItem) => {
    const itemInCart = cartItems.find(item => item.id === menuItem.id);
    
    return (
      <View style={styles.menuItem} key={menuItem.id}>
        <Image 
          source={{ uri: menuItem.image }} 
          style={styles.menuItemImage}
          defaultSource={require('../../assets/placeholder.png')}
        />
        <View style={styles.menuItemInfo}>
          <Text style={styles.menuItemName}>{menuItem.label}</Text>
          <Text style={styles.menuItemDescription}>{menuItem.description}</Text>
          <Text style={styles.menuItemPrice}>${menuItem.price.toFixed(2)}</Text>
        </View>
        <View style={styles.menuItemActions}>
          {itemInCart ? (
            <View style={styles.quantityControl}>
              <TouchableOpacity 
                onPress={() => removeFromCart(menuItem.id)}
                style={styles.quantityButton}
              >
                <Ionicons name="remove" size={20} color="#FF4B2B" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{itemInCart.quantity}</Text>
              <TouchableOpacity 
                onPress={() => handleMenuItemPress(restaurant, menuItem)}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={20} color="#FF4B2B" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={() => handleMenuItemPress(restaurant, menuItem)}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <View style={styles.restaurantCard}>
      <Image
        source={{ uri: item.coverImage }}
        style={styles.restaurantImage}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.cuisineType}>
          {item.chainName} • {item.cuisineType}
        </Text>
        <View style={styles.restaurantMeta}>
          <Text style={styles.metaText}>⭐ {item.rating}</Text>
          <Text style={styles.metaText}>🕒 {item.deliveryTime}</Text>
          <Text style={styles.metaText}>💰 {item.minimumOrder}</Text>
        </View>
        <Text style={styles.address}>{item.address}</Text>
      </View>
      
      <View style={styles.menuItemsContainer}>
        <Text style={styles.menuTitle}>Menu</Text>
        {item.MenuItem?.map(menuItem => renderMenuItem(item, menuItem))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B2B" />
        <Text style={styles.loadingText}>Loading restaurants...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setError(null);
            setLoading(true);
            fetchRestaurants();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={restaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {cartItems.length > 0 && (
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Ionicons name="cart" size={24} color="#fff" />
          <Text style={styles.cartButtonText}>
            View Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
          </Text>
          <Text style={styles.cartButtonPrice}>
            ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4B2B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF4B2B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  cuisineType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#4B5563',
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  menuItemsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4B2B',
  },
  menuItemActions: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
  addButton: {
    backgroundColor: '#FF4B2B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF4B2B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cartButtonPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
