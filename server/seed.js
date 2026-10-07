const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Inventory = require('./models/Inventory');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✨ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();
    await Inventory.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin Lumière',
      email: 'admin@lumiere.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Admin created: admin@lumiere.com / admin123');

    // Create Staff
    await User.create([
      { name: 'Chef Antoine', email: 'chef@lumiere.com', phone: '9999999998', password: 'chef123', role: 'chef' },
      { name: 'Kitchen Staff', email: 'kitchen@lumiere.com', phone: '9999999997', password: 'kitchen123', role: 'kitchen_staff' },
      { name: 'Waiter Pierre', email: 'waiter@lumiere.com', phone: '9999999996', password: 'waiter123', role: 'waiter' },
      { name: 'Manager Sophie', email: 'manager@lumiere.com', phone: '9999999995', password: 'manager123', role: 'manager' },
    ]);
    console.log('👥 Staff created');

    // Create Categories
    const categories = await Category.create([
      { name: 'Starters', description: 'Elegant beginnings to your culinary journey', order: 1 },
      { name: 'Soups', description: 'Artisanal broths and bisques', order: 2 },
      { name: 'Main Course', description: 'Signature entrées crafted to perfection', order: 3 },
      { name: 'Indian Classics', description: 'Rich heritage flavors reimagined', order: 4 },
      { name: 'Continental', description: 'European gastronomy at its finest', order: 5 },
      { name: 'Asian Fusion', description: 'Eastern flavors meet western artistry', order: 6 },
      { name: 'Desserts', description: 'Sweet finales to remember', order: 7 },
      { name: 'Beverages', description: 'Crafted cocktails and refined refreshments', order: 8 },
      { name: 'Chef Specials', description: 'Exclusive creations by Chef Antoine', order: 9 },
    ]);
    console.log('📂 Categories created');

    const catMap = {};
    categories.forEach((c) => (catMap[c.name] = c._id));

    // Create Menu Items
    const menuItems = await MenuItem.create([
      // Starters
      {
        name: 'Truffle Mushroom Bruschetta',
        description: 'Crispy artisan bread topped with wild mushroom duxelles, truffle oil, and aged Parmesan shavings',
        price: 850,
        category: catMap['Starters'],
        image: { url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600' },
        ingredients: ['Wild Mushrooms', 'Truffle Oil', 'Parmesan', 'Artisan Bread'],
        calories: 320,
        isVeg: true,
        spiceLevel: 'mild',
        isBestseller: true,
        preparationTime: 15,
      },
      {
        name: 'Seared Scallops',
        description: 'Pan-seared Hokkaido scallops with citrus beurre blanc, micro herbs, and edible flowers',
        price: 1450,
        category: catMap['Starters'],
        image: { url: 'https://images.unsplash.com/photo-1599021456807-25db0f78e5c0?w=600' },
        ingredients: ['Hokkaido Scallops', 'Citrus Beurre Blanc', 'Micro Herbs'],
        calories: 280,
        isVeg: false,
        spiceLevel: 'mild',
        isBestseller: true,
        preparationTime: 20,
      },
      {
        name: 'Foie Gras Terrine',
        description: 'Classic French foie gras terrine with brioche toast, fig compote, and Sauternes jelly',
        price: 1950,
        category: catMap['Starters'],
        image: { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600' },
        ingredients: ['Foie Gras', 'Brioche', 'Fig Compote'],
        calories: 420,
        isVeg: false,
        spiceLevel: 'mild',
        preparationTime: 10,
      },
      // Soups
      {
        name: 'Lobster Bisque',
        description: 'Velvety lobster bisque finished with cognac cream and lobster claw garnish',
        price: 950,
        category: catMap['Soups'],
        image: { url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600' },
        ingredients: ['Lobster', 'Cognac', 'Cream', 'Herbs'],
        calories: 350,
        isVeg: false,
        spiceLevel: 'mild',
        isBestseller: true,
        preparationTime: 15,
      },
      {
        name: 'Roasted Tomato Soup',
        description: 'Slow-roasted heirloom tomatoes with basil oil, crème fraîche, and truffle grissini',
        price: 650,
        category: catMap['Soups'],
        image: { url: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600' },
        ingredients: ['Heirloom Tomatoes', 'Basil', 'Crème Fraîche'],
        calories: 220,
        isVeg: true,
        spiceLevel: 'mild',
        preparationTime: 12,
      },
      // Main Course
      {
        name: 'Wagyu Beef Tenderloin',
        description: 'A5 Wagyu beef with black truffle jus, potato gratin, and seasonal vegetables',
        price: 4500,
        category: catMap['Main Course'],
        image: { url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600' },
        ingredients: ['A5 Wagyu Beef', 'Black Truffle', 'Potato Gratin'],
        calories: 680,
        isVeg: false,
        spiceLevel: 'mild',
        isBestseller: true,
        preparationTime: 35,
      },
      {
        name: 'Pan-Roasted Chilean Sea Bass',
        description: 'Chilean sea bass with saffron risotto, asparagus, and champagne beurre blanc',
        price: 3200,
        category: catMap['Main Course'],
        image: { url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600' },
        ingredients: ['Sea Bass', 'Saffron Risotto', 'Asparagus'],
        calories: 520,
        isVeg: false,
        spiceLevel: 'mild',
        preparationTime: 30,
      },
      {
        name: 'Wild Mushroom Risotto',
        description: 'Creamy Arborio rice with porcini, chanterelle, and shiitake, finished with truffle oil',
        price: 1600,
        category: catMap['Main Course'],
        image: { url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600' },
        ingredients: ['Arborio Rice', 'Porcini', 'Chanterelle', 'Truffle Oil'],
        calories: 480,
        isVeg: true,
        spiceLevel: 'mild',
        isBestseller: true,
        preparationTime: 25,
      },
      // Indian
      {
        name: 'Dal Makhani Royale',
        description: 'Slow-cooked black lentils in rich tomato-cream sauce, 48-hour preparation',
        price: 850,
        category: catMap['Indian Classics'],
        image: { url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600' },
        ingredients: ['Black Lentils', 'Tomato', 'Cream', 'Butter'],
        calories: 380,
        isVeg: true,
        spiceLevel: 'medium',
        isBestseller: true,
        preparationTime: 20,
      },
      {
        name: 'Lamb Rogan Josh',
        description: 'Tender lamb shanks in aromatic Kashmiri spice gravy with saffron rice',
        price: 1450,
        category: catMap['Indian Classics'],
        image: { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600' },
        ingredients: ['Lamb', 'Kashmiri Spices', 'Saffron Rice'],
        calories: 550,
        isVeg: false,
        spiceLevel: 'hot',
        preparationTime: 30,
      },
      {
        name: 'Paneer Tikka Luxe',
        description: 'Cottage cheese marinated in saffron-infused yogurt, chargrilled to perfection',
        price: 750,
        category: catMap['Indian Classics'],
        image: { url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600' },
        ingredients: ['Paneer', 'Saffron Yogurt', 'Bell Peppers'],
        calories: 320,
        isVeg: true,
        spiceLevel: 'medium',
        preparationTime: 18,
      },
      // Continental
      {
        name: 'Duck Confit',
        description: 'Classic French duck leg confit with pomme sarladaises and orange reduction',
        price: 2200,
        category: catMap['Continental'],
        image: { url: 'https://images.unsplash.com/photo-1432139509613-5c4255a2b4b6?w=600' },
        ingredients: ['Duck Leg', 'Potatoes', 'Orange Reduction'],
        calories: 620,
        isVeg: false,
        spiceLevel: 'mild',
        preparationTime: 25,
      },
      // Asian
      {
        name: 'Miso-Glazed Black Cod',
        description: 'Japanese black cod in sweet white miso, pickled ginger, and wasabi tobiko',
        price: 2800,
        category: catMap['Asian Fusion'],
        image: { url: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600' },
        ingredients: ['Black Cod', 'White Miso', 'Pickled Ginger'],
        calories: 440,
        isVeg: false,
        spiceLevel: 'medium',
        isBestseller: true,
        preparationTime: 28,
      },
      {
        name: 'Thai Green Curry',
        description: 'Aromatic green curry with coconut milk, Thai basil, and jasmine rice',
        price: 1200,
        category: catMap['Asian Fusion'],
        image: { url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600' },
        ingredients: ['Coconut Milk', 'Thai Basil', 'Green Curry Paste'],
        calories: 480,
        isVeg: true,
        spiceLevel: 'hot',
        preparationTime: 22,
      },
      // Desserts
      {
        name: 'Valrhona Chocolate Fondant',
        description: 'Molten Valrhona dark chocolate with vanilla bean ice cream and gold leaf',
        price: 850,
        category: catMap['Desserts'],
        image: { url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600' },
        ingredients: ['Valrhona Chocolate', 'Vanilla Bean', 'Gold Leaf'],
        calories: 520,
        isVeg: true,
        spiceLevel: 'mild',
        isBestseller: true,
        preparationTime: 18,
      },
      {
        name: 'Crème Brûlée',
        description: 'Classic Madagascar vanilla crème brûlée with caramelized sugar crust',
        price: 650,
        category: catMap['Desserts'],
        image: { url: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600' },
        ingredients: ['Madagascar Vanilla', 'Cream', 'Caramel'],
        calories: 380,
        isVeg: true,
        spiceLevel: 'mild',
        preparationTime: 12,
      },
      // Beverages
      {
        name: 'Smoked Old Fashioned',
        description: 'Premium bourbon with smoked maple, Angostura bitters, and orange zest',
        price: 950,
        category: catMap['Beverages'],
        image: { url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600' },
        ingredients: ['Bourbon', 'Smoked Maple', 'Bitters'],
        calories: 180,
        isVeg: true,
        spiceLevel: 'mild',
        preparationTime: 8,
      },
      {
        name: 'Rose Petal Lemonade',
        description: 'Fresh lemonade infused with organic rose petals and elderflower',
        price: 450,
        category: catMap['Beverages'],
        image: { url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600' },
        ingredients: ['Rose Petals', 'Lemon', 'Elderflower'],
        calories: 120,
        isVeg: true,
        spiceLevel: 'mild',
        preparationTime: 5,
      },
      // Chef Specials
      {
        name: "Chef's Tasting Menu",
        description: 'Seven-course culinary journey curated by Chef Antoine — a symphony of seasonal flavors',
        price: 6500,
        category: catMap['Chef Specials'],
        image: { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
        ingredients: ['Seasonal Selection', 'Chef\'s Choice'],
        calories: 1200,
        isVeg: false,
        spiceLevel: 'medium',
        isBestseller: true,
        preparationTime: 90,
      },
    ]);
    console.log(`🍽️  ${menuItems.length} menu items created`);

    // Create Tables
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const tables = [];
    for (let i = 1; i <= 15; i++) {
      const capacity = i <= 4 ? 2 : i <= 10 ? 4 : i <= 13 ? 6 : 8;
      const location = i <= 6 ? 'indoor' : i <= 10 ? 'outdoor' : i <= 13 ? 'terrace' : 'private';
      const menuUrl = `${clientUrl}/menu/table/${i}`;
      const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#0B0B0B', light: '#F7F2E8' },
      });
      tables.push({
        tableNumber: i,
        capacity,
        location,
        status: 'available',
        qrCode: qrCodeDataUrl,
        qrUrl: menuUrl,
      });
    }
    await Table.create(tables);
    console.log('🪑 15 tables created with QR codes');

    // Create Inventory
    await Inventory.create([
      { ingredient: 'Wagyu Beef A5', quantity: 5, unit: 'kg', minimumStock: 2, costPerUnit: 8000, supplier: { name: 'Premium Meats Co.', contact: '9876543210' } },
      { ingredient: 'Black Truffle', quantity: 500, unit: 'g', minimumStock: 200, costPerUnit: 50, supplier: { name: 'Truffle Importers', contact: '9876543211' } },
      { ingredient: 'Saffron', quantity: 100, unit: 'g', minimumStock: 30, costPerUnit: 300, supplier: { name: 'Spice Estate', contact: '9876543212' } },
      { ingredient: 'Lobster', quantity: 8, unit: 'kg', minimumStock: 3, costPerUnit: 3500, supplier: { name: 'Coastal Seafood', contact: '9876543213' } },
      { ingredient: 'Paneer (Premium)', quantity: 10, unit: 'kg', minimumStock: 3, costPerUnit: 400, supplier: { name: 'Dairy Fresh', contact: '9876543214' } },
      { ingredient: 'Olive Oil (Extra Virgin)', quantity: 5, unit: 'l', minimumStock: 2, costPerUnit: 1200, supplier: { name: 'Mediterranean Imports', contact: '9876543215' } },
      { ingredient: 'Valrhona Chocolate', quantity: 3, unit: 'kg', minimumStock: 1, costPerUnit: 3000, supplier: { name: 'French Chocolate Co.', contact: '9876543216' } },
      { ingredient: 'Fresh Herbs Bundle', quantity: 20, unit: 'bunch', minimumStock: 5, costPerUnit: 150, supplier: { name: 'Herb Gardens', contact: '9876543217' } },
      { ingredient: 'Arborio Rice', quantity: 10, unit: 'kg', minimumStock: 3, costPerUnit: 350, supplier: { name: 'Italian Imports', contact: '9876543218' } },
      { ingredient: 'Cream (Heavy)', quantity: 15, unit: 'l', minimumStock: 5, costPerUnit: 250, supplier: { name: 'Dairy Fresh', contact: '9876543219' } },
    ]);
    console.log('📦 Inventory items created');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Login credentials:');
    console.log('  Admin:   admin@lumiere.com / admin123');
    console.log('  Chef:    chef@lumiere.com / chef123');
    console.log('  Kitchen: kitchen@lumiere.com / kitchen123');
    console.log('  Waiter:  waiter@lumiere.com / waiter123');
    console.log('  Manager: manager@lumiere.com / manager123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
