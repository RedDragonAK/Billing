import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const items = [
  // Tea & Beverages
  {
    name: 'Tea',
    category: 'Beverages',
    price: 10,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    description: 'Hot tea'
  },
  {
    name: 'Coffee',
    category: 'Beverages',
    price: 15,
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop',
    description: 'Hot coffee'
  },
  
  // Snacks
  {
    name: 'Bajji',
    category: 'Snacks',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=400&fit=crop',
    description: 'Crispy bajji'
  },
  {
    name: 'Vada',
    category: 'Snacks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    description: 'Spicy vada'
  },
  {
    name: 'Puffs',
    category: 'Snacks',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d29b?w=400&h=400&fit=crop',
    description: 'Vegetable puffs'
  },
  {
    name: 'Roll',
    category: 'Snacks',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=400&fit=crop',
    description: 'Spring roll'
  },
  {
    name: 'Chips',
    category: 'Snacks',
    price: 15,
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=400&fit=crop',
    description: 'Crispy chips'
  },
  {
    name: 'Samosa',
    category: 'Snacks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop',
    description: 'Spicy samosa'
  },
  {
    name: 'Pakora',
    category: 'Snacks',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
    description: 'Mixed pakora'
  },
  
  // Food Items
  {
    name: 'Dosa',
    category: 'Food',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
    description: 'Plain dosa'
  },
  {
    name: 'Idli',
    category: 'Food',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
    description: 'Steamed idli'
  },
  {
    name: 'Puri',
    category: 'Food',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
    description: 'Fried puri'
  },
  {
    name: 'Biryani',
    category: 'Food',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
    description: 'Vegetable biryani'
  }
];

async function main() {
  console.log('Seeding database...');
  
  for (const item of items) {
    await prisma.item.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }
  
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


