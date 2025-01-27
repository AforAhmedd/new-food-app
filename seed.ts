import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockRestaurants = [
  {
    name: "Burger House",
    chainName: "Burger Chain",
    address: "123 Main St, New York, NY 10001",
    latitude: 40.7128,
    longitude: -74.0060,
    cuisineType: "American",
    segment: "Casual Dining",
    city: "New York",
    area: "Manhattan",
    rating: 4.5,
    coverImage: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800",
    deliveryTime: "25-35",
    minimumOrder: "$15",
    menuItems: [
      {
        label: "Classic Burger",
        description: "100% Angus beef patty with lettuce, tomato, and special sauce",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        category: "Burgers"
      },
      {
        label: "Cheese Fries",
        description: "Crispy fries topped with melted cheddar",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500",
        category: "Sides"
      },
      {
        label: "Milkshake",
        description: "Creamy vanilla milkshake",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500",
        category: "Drinks"
      }
    ]
  },
  {
    name: "Thai Spice Garden",
    chainName: "Thai Spice",
    address: "567 Park Ave, New York, NY 10065",
    latitude: 40.7681,
    longitude: -73.9649,
    cuisineType: "Thai",
    segment: "Fine Dining",
    city: "New York",
    area: "Upper East Side",
    rating: 4.7,
    coverImage: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
    deliveryTime: "35-45",
    minimumOrder: "$25",
    menuItems: [
      {
        label: "Pad Thai",
        description: "Rice noodles with shrimp, tofu, eggs, and peanuts in tamarind sauce",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500",
        category: "Noodles"
      },
      {
        label: "Green Curry",
        description: "Coconut curry with bamboo shoots, eggplant, and choice of protein",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500",
        category: "Curries"
      },
      {
        label: "Spring Rolls",
        description: "Crispy vegetable spring rolls with sweet chili sauce",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1544601284-28e0606f6260?w=500",
        category: "Appetizers"
      },
      {
        label: "Mango Sticky Rice",
        description: "Sweet coconut sticky rice with fresh mango",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1621293954908-907159247fc8?w=500",
        category: "Desserts"
      },
      {
        label: "Thai Iced Tea",
        description: "Traditional sweet and creamy Thai tea",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=500",
        category: "Beverages"
      }
    ]
  },
  {
    name: "Mediterranean Mezze",
    chainName: "Mezze Group",
    address: "789 Columbus Ave, New York, NY 10025",
    latitude: 40.7891,
    longitude: -73.9667,
    cuisineType: "Mediterranean",
    segment: "Casual Dining",
    city: "New York",
    area: "Upper West Side",
    rating: 4.6,
    coverImage: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800",
    deliveryTime: "30-40",
    minimumOrder: "$20",
    menuItems: [
      {
        label: "Hummus Platter",
        description: "Creamy hummus with olive oil, paprika, and warm pita",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        category: "Appetizers"
      },
      {
        label: "Falafel Wrap",
        description: "Crispy falafel with tahini sauce and fresh vegetables",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        category: "Wraps"
      },
      {
        label: "Shawarma Plate",
        description: "Marinated chicken or lamb with rice and salad",
        price: 21.99,
        image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500",
        category: "Entrees"
      },
      {
        label: "Greek Salad",
        description: "Fresh vegetables with feta cheese and olives",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500",
        category: "Salads"
      },
      {
        label: "Baklava",
        description: "Sweet layered pastry with nuts and honey",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500",
        category: "Desserts"
      }
    ]
  },
  {
    name: "Indian Curry House",
    chainName: "Curry House Group",
    address: "234 Lexington Ave, New York, NY 10016",
    latitude: 40.7446,
    longitude: -73.9784,
    cuisineType: "Indian",
    segment: "Fine Dining",
    city: "New York",
    area: "Murray Hill",
    rating: 4.8,
    coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    deliveryTime: "40-50",
    minimumOrder: "$30",
    menuItems: [
      {
        label: "Butter Chicken",
        description: "Tender chicken in rich tomato-butter sauce",
        price: 22.99,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        category: "Main Course"
      },
      {
        label: "Vegetable Biryani",
        description: "Aromatic rice with mixed vegetables and spices",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500",
        category: "Rice"
      },
      {
        label: "Garlic Naan",
        description: "Fresh bread with garlic and butter",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        category: "Breads"
      },
      {
        label: "Samosa",
        description: "Crispy pastry filled with spiced potatoes and peas",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
        category: "Appetizers"
      },
      {
        label: "Mango Lassi",
        description: "Yogurt smoothie with mango and cardamom",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        category: "Beverages"
      }
    ]
  },
  {
    name: "Dim Sum Palace",
    chainName: "Palace Group",
    address: "345 Canal St, New York, NY 10013",
    latitude: 40.7196,
    longitude: -74.0044,
    cuisineType: "Chinese",
    segment: "Casual Dining",
    city: "New York",
    area: "Chinatown",
    rating: 4.5,
    coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    deliveryTime: "30-40",
    minimumOrder: "$25",
    menuItems: [
      {
        label: "Har Gow",
        description: "Shrimp dumplings in translucent wrapper",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500",
        category: "Dumplings"
      },
      {
        label: "Siu Mai",
        description: "Pork and shrimp dumplings",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500",
        category: "Dumplings"
      },
      {
        label: "BBQ Pork Buns",
        description: "Steamed buns filled with char siu pork",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500",
        category: "Buns"
      },
      {
        label: "Egg Tarts",
        description: "Flaky pastry with sweet egg custard",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500",
        category: "Desserts"
      },
      {
        label: "Jasmine Tea",
        description: "Premium Chinese jasmine tea",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500",
        category: "Beverages"
      }
    ]
  },
  {
    name: "Korean BBQ House",
    chainName: "K-BBQ Group",
    address: "456 32nd St, New York, NY 10001",
    latitude: 40.7484,
    longitude: -73.9857,
    cuisineType: "Korean",
    segment: "Casual Dining",
    city: "New York",
    area: "Koreatown",
    rating: 4.7,
    coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    deliveryTime: "35-45",
    minimumOrder: "$30",
    menuItems: [
      {
        label: "Bulgogi",
        description: "Marinated beef with rice and banchan",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        category: "BBQ"
      },
      {
        label: "Kimchi Stew",
        description: "Spicy stew with kimchi and pork",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        category: "Stews"
      },
      {
        label: "Bibimbap",
        description: "Rice bowl with vegetables and egg",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        category: "Rice Dishes"
      },
      {
        label: "Korean Fried Chicken",
        description: "Crispy chicken with sweet and spicy sauce",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        category: "Chicken"
      },
      {
        label: "Soju",
        description: "Traditional Korean rice liquor",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        category: "Beverages"
      }
    ]
  }
];

async function main() {
  console.log('Start seeding...');

  // Delete existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  for (const restaurantData of mockRestaurants) {
    const { menuItems, ...restaurantInfo } = restaurantData;
    
    const restaurant = await prisma.restaurant.create({
      data: {
        ...restaurantInfo,
        menuItems: {
          create: menuItems
        }
      }
    });
    
    console.log(`Created restaurant with id: ${restaurant.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
