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
import { useAddress } from '../hooks/useAddress';
import { Ionicons } from '@expo/vector-icons';

interface Address {
  id: string;
  user_id: string;
  address_line1: string;
  address_line2?: string; //optional address
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

export function AddressScreen() {
  const {
    addresses,
    loading,
    fetchAddresses,
    addAddress,
    setDefaultAddress,
    deleteAddress,
  } = useAddress();
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    try {
      await addAddress(newAddress);
      setAddingAddress(false);
      setNewAddress({});
      Alert.alert('Success', 'Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'Failed to add address');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B2B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Addresses</Text>
        <TouchableOpacity onPress={() => setAddingAddress(!addingAddress)}>
          <Ionicons name="add-circle-outline" size={24} color="#FF4B2B" />
        </TouchableOpacity>
      </View>

      {addingAddress && (
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
          <TouchableOpacity style={styles.button} onPress={handleAddAddress}>
            <Text style={styles.buttonText}>Add Address</Text>
          </TouchableOpacity>
        </View>
      )}

      {addresses.map((address) => (
        <View key={address.id} style={styles.addressCard}>
          <View style={styles.addressInfo}>
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
          </View>
          <View style={styles.addressActions}>
            {!address.is_default && (
              <TouchableOpacity 
                onPress={() => setDefaultAddress(address.id)}
                style={styles.addressButton}
              >
                <Ionicons name="star-outline" size={20} color="#FF4B2B" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => deleteAddress(address.id)}
              style={styles.addressButton}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4B2B" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}


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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  form: {
    padding: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF4B2B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addressInfo: {
    flex: 1,
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
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addressButton: {
    padding: 8,
  },
});
