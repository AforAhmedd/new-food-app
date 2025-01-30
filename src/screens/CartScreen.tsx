import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useCart } from '../hooks/useCart';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
interface Address {
  id: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

export function CartScreen({ navigation }: { navigation: any }) {
  const { cartItems, removeFromCart, clearCart, addToCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
      if (data && data.length > 0) {
        const defaultAddress = data.find(addr => addr.is_default) || data[0];
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      let deliveryAddress = selectedAddress;
      if (useNewAddress) {
        const { data: addressData, error: addressError } = await supabase
          .from('addresses')
          .insert([{ ...newAddress, user_id: user.id }])
          .select()
          .single();

        if (addressError) throw addressError;
        deliveryAddress = addressData;
      }

      if (!deliveryAddress) {
        Alert.alert('Error', 'Please select or add a delivery address');
        return;
      }

      // Group items by restaurant
      const restaurantOrders = cartItems.reduce((acc, item) => {
        if (!acc[item.restaurantId]) {
          acc[item.restaurantId] = {
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
            items: [],
            total: 0,
          };
        }
        acc[item.restaurantId].items.push({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });
        acc[item.restaurantId].total += item.price * item.quantity;
        return acc;
      }, {} as Record<string, any>);

      // Create order for each restaurant
      for (const restaurantId in restaurantOrders) {
        const order = restaurantOrders[restaurantId];
        const { error: orderError } = await supabase
          .from('orders')
          .insert([{
            user_id: user.id,
            restaurant_id: restaurantId,
            restaurant_name: order.restaurantName,
            items: order.items,
            total_amount: order.total,
            status: 'PENDING',
            address_id: deliveryAddress.id,
            created_at: new Date().toISOString(),
          }]);

        if (orderError) throw orderError;
      }

      clearCart();
      navigation.navigate('Orders');
      Alert.alert('Success', 'Orders placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error.stack);
      Alert.alert('Error', 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = {
        name: item.restaurantName,
        items: [],
      };
    }
    acc[item.restaurantId].items.push(item);
    return acc;
  }, {} as Record<string, { name: string; items: typeof cartItems }>);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B2B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {Object.entries(groupedItems).map(([restaurantId, { name, items }]) => (
          <View key={restaurantId} style={styles.restaurantSection}>
            <Text style={styles.restaurantName}>{name}</Text>
            {items.map((item) => (
              <View key={item.name} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.quantityContainer}>
                <TouchableOpacity
  style={styles.quantityButton}
  onPress={() => removeFromCart(item.id)}
>
  <Text style={styles.quantityButtonText}>-</Text>
</TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => {
                      const newItem = { ...item, quantity: 1 };
                      addToCart(newItem);
                    }}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          
          <TouchableOpacity
            style={styles.addressOption}
            onPress={() => {
              setUseNewAddress(false);
              navigation.navigate('Address');
            }}
          >
            <Ionicons name="location-outline" size={24} color="#FF4B2B" />
            <Text style={styles.addressOptionText}>Manage Saved Addresses</Text>
          </TouchableOpacity>

          {addresses.length > 0 && !useNewAddress && (
            <View style={styles.savedAddresses}>
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressCard,
                    selectedAddress?.id === address.id && styles.selectedAddress,
                  ]}
                  onPress={() => {
                    setSelectedAddress(address);
                    setUseNewAddress(false);
                  }}
                >
                  <Text style={styles.addressText}>
                    {address.address_line1}
                    {address.address_line2 ? `, ${address.address_line2}` : ''}
                  </Text>
                  <Text style={styles.addressText}>
                    {address.city}, {address.state} {address.postal_code}
                  </Text>
                  {address.is_default && (
                    <Text style={styles.defaultBadge}>Default</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.addressOption, useNewAddress && styles.selectedOption]}
            onPress={() => setUseNewAddress(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FF4B2B" />
            <Text style={styles.addressOptionText}>Add New Address</Text>
          </TouchableOpacity>

          {useNewAddress && (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                value={newAddress.address_line1}
                onChangeText={(text) => setNewAddress({ ...newAddress, address_line1: text })}
                placeholder="Address Line 1"
              />
              <TextInput
                style={styles.input}
                value={newAddress.address_line2}
                onChangeText={(text) => setNewAddress({ ...newAddress, address_line2: text })}
                placeholder="Address Line 2 (Optional)"
              />
              <TextInput
                style={styles.input}
                value={newAddress.city}
                onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
                placeholder="City"
              />
              <TextInput
                style={styles.input}
                value={newAddress.state}
                onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
                placeholder="State"
              />
              <TextInput
                style={styles.input}
                value={newAddress.postal_code}
                onChangeText={(text) => setNewAddress({ ...newAddress, postal_code: text })}
                placeholder="Postal Code"
                keyboardType="numeric"
              />
            </View>
          )}
        </View>
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            disabled={loading || (!selectedAddress && !useNewAddress)}
          >
            <Text style={styles.checkoutButtonText}>
              {loading ? 'Processing...' : 'Place Order'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#1F2937',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4B2B',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    padding: 8,
    width: 36,
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#FF4B2B',
    fontWeight: 'bold',
  },
  quantity: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  addressSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#FEE2E2',
  },
  addressOptionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  savedAddresses: {
    marginVertical: 12,
  },
  addressCard: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedAddress: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FF4B2B',
    borderWidth: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  defaultBadge: {
    color: '#FF4B2B',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  form: {
    gap: 12,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalText: {
    fontSize: 18,
    color: '#1F2937',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4B2B',
  },
  checkoutButton: {
    backgroundColor: '#FF4B2B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
