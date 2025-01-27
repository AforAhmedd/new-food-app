import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Restaurant, MenuItem } from '../lib/supabase';
import { useCart } from '../hooks/useCart';

type RouteParams = {
  restaurant: Restaurant;
};

export function RestaurantScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurant } = route.params as RouteParams;
  const { addToCart, cartItems, removeFromCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    restaurant.menuItems[0]?.category || ''
  );

  const categories = [...new Set(restaurant.menuItems.map(item => item.category))];
  const menuItemsByCategory = restaurant.menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const getItemQuantity = (item: MenuItem) => {
    return cartItems.find(cartItem => 
      cartItem.restaurantId === restaurant.id && 
      cartItem.item.label === item.label
    )?.quantity || 0;
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      restaurantId: restaurant.id!,
      restaurantName: restaurant.name,
      item,
      quantity: 1,
    });
  };

  const handleRemoveFromCart = (item: MenuItem) => {
    removeFromCart({
      restaurantId: restaurant.id!,
      restaurantName: restaurant.name,
      item,
      quantity: 1,
    });
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Image */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={restaurant.coverImage ? { uri: restaurant.coverImage } : { uri: restaurant.coverImage   }}
            style={styles.coverImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantCuisine}>
            {restaurant.cuisineType} • {restaurant.segment}
          </Text>
          <View style={styles.restaurantMeta}>
            <Text style={styles.metaItem}>⭐ {restaurant.rating}</Text>
            <Text style={styles.metaItem}>🕒 {restaurant.deliveryTime} min</Text>
            <Text style={styles.metaItem}>Min. {restaurant.minimumOrder}</Text>
          </View>
        </View>

        {/* Menu Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItemsByCategory[selectedCategory]?.map((item) => (
            <View key={item.label} style={styles.menuItem}>
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.label}</Text>
                <Text style={styles.menuItemDescription}>
                  {item.description}
                </Text>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.menuItemImage}
                />
              )}
              <View style={styles.quantityContainer}>
                {getItemQuantity(item) > 0 && (
                  <>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleRemoveFromCart(item)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{getItemQuantity(item)}</Text>
                  </>
                )}
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Cart Button */}
      {totalCartItems > 0 && (
        <Pressable
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>
            View Cart ({totalCartItems} items)
          </Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  restaurantCuisine: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  restaurantMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  metaItem: {
    fontSize: 14,
    color: '#4B5563',
    marginRight: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  selectedCategory: {
    backgroundColor: '#FF4B2B',
  },
  categoryText: {
    fontSize: 14,
    color: '#4B5563',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4B2B',
    marginTop: 8,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF4B2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  cartButton: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: '#FF4B2B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
