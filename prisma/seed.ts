import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Delete data in the proper order (dependent tables first)
  await prisma.transactions.deleteMany();
  await prisma.budgets.deleteMany();
  await prisma.accounts.deleteMany();
  await prisma.payment_methods.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.users.deleteMany();

  // Create users individually to capture their IDs
  const adminUser = await prisma.users.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 10),
      admin: true,
    },
  });

  const jonasUser = await prisma.users.create({
    data: {
      username: 'jonas',
      email: 'jonas@example.com',
      password: await bcrypt.hash('laungis123', 10),
      admin: false,
    },
  });

  const katrinUser = await prisma.users.create({
    data: {
      username: 'katrin',
      email: 'katrin@example.com',
      password: await bcrypt.hash('draumur456', 10),
      admin: false,
    },
  });

  // Create accounts individually to capture their IDs
  const adminAccount = await prisma.accounts.create({
    data: {
      user_id: adminUser.id,
      account_name: 'Aðalreikningur',
      balance: 5000.00,
    },
  });

  const jonasAccount = await prisma.accounts.create({
    data: {
      user_id: jonasUser.id,
      account_name: 'Jónas reikningur',
      balance: 2500.00,
    },
  });

  const katrinAccount = await prisma.accounts.create({
    data: {
      user_id: katrinUser.id,
      account_name: 'Katríns reikningur',
      balance: 3000.00,
    },
  });

  // Create categories (6 categories)
  await prisma.categories.createMany({
    data: [
      { name: 'matur' },
      { name: 'íbúð' },
      { name: 'samgöngur' },
      { name: 'afþreying' },
      { name: 'laun' },
      { name: 'annar' },
    ],
  });

  // Create payment methods individually so we capture their IDs
  const paymentMethod1 = await prisma.payment_methods.create({
    data: { name: 'reiðufé' },
  });
  const paymentMethod2 = await prisma.payment_methods.create({
    data: { name: 'kreditkort' },
  });
  const paymentMethod3 = await prisma.payment_methods.create({
    data: { name: 'bankamillifærsla' },
  });

  // Create transactions for admin (using adminAccount.id)
  await prisma.transactions.createMany({
    data: [
      { account_id: adminAccount.id, user_id: adminUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'income', category: 'laun', amount: 6000.00, description: 'Laun fyrir mánuðinn' },
      { account_id: adminAccount.id, user_id: adminUser.id, payment_method_id: paymentMethod2.id, transaction_type: 'expense', category: 'matur', amount: 150.00, description: 'Morgunmatur' },
      { account_id: adminAccount.id, user_id: adminUser.id, payment_method_id: paymentMethod3.id, transaction_type: 'expense', category: 'samgöngur', amount: 50.00, description: 'Strætó miða' },
      { account_id: adminAccount.id, user_id: adminUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'expense', category: 'íbúð', amount: 1200.00, description: 'Leiga' },
      { account_id: adminAccount.id, user_id: adminUser.id, payment_method_id: paymentMethod2.id, transaction_type: 'expense', category: 'afþreying', amount: 200.00, description: 'Kvöldbíó' },
      { account_id: adminAccount.id, user_id: adminUser.id, payment_method_id: paymentMethod3.id, transaction_type: 'expense', category: 'annar', amount: 100.00, description: 'Óvænt útgjöld' },
      { account_id: adminAccount.id, user_id: adminUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'income', category: 'laun', amount: 300.00, description: 'Bonus' },
      { account_id: adminAccount.id, user_id: adminUser.id, payment_method_id: paymentMethod2.id, transaction_type: 'expense', category: 'matur', amount: 100.00, description: 'Næturmatur' },
      { account_id: adminAccount.id, user_id: adminUser.id, payment_method_id: paymentMethod3.id, transaction_type: 'expense', category: 'samgöngur', amount: 75.00, description: 'Taksi' },
      { account_id: adminAccount.id, user_id: adminUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'expense', category: 'íbúð', amount: 1150.00, description: 'Heildar leiga' },
    ],
  });

  // Create transactions for Jonas (using jonasAccount.id)
  await prisma.transactions.createMany({
    data: [
      { account_id: jonasAccount.id, user_id: jonasUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'income', category: 'laun', amount: 4000.00, description: 'Laun' },
      { account_id: jonasAccount.id, user_id: jonasUser.id, payment_method_id: paymentMethod2.id, transaction_type: 'expense', category: 'matur', amount: 120.00, description: 'Frokostur' },
      { account_id: jonasAccount.id, user_id: jonasUser.id, payment_method_id: paymentMethod3.id, transaction_type: 'expense', category: 'samgöngur', amount: 40.00, description: 'Taksi' },
      { account_id: jonasAccount.id, user_id: jonasUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'expense', category: 'íbúð', amount: 900.00, description: 'Leiga' },
      { account_id: jonasAccount.id, user_id: jonasUser.id, payment_method_id: paymentMethod2.id, transaction_type: 'expense', category: 'afþreying', amount: 180.00, description: 'Veisla' },
      { account_id: jonasAccount.id, user_id: jonasUser.id, payment_method_id: paymentMethod3.id, transaction_type: 'expense', category: 'annar', amount: 80.00, description: 'Annað' },
      { account_id: jonasAccount.id, user_id: jonasUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'income', category: 'laun', amount: 200.00, description: 'Viðbót' },
      { account_id: jonasAccount.id, user_id: jonasUser.id, payment_method_id: paymentMethod2.id, transaction_type: 'expense', category: 'matur', amount: 90.00, description: 'Kvöldmatur' },
      { account_id: jonasAccount.id, user_id: jonasUser.id, payment_method_id: paymentMethod3.id, transaction_type: 'expense', category: 'samgöngur', amount: 55.00, description: 'Strætó' },
      { account_id: jonasAccount.id, user_id: jonasUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'expense', category: 'íbúð', amount: 950.00, description: 'Leiga' },
    ],
  });

  // Create transactions for Katrin (using katrinAccount.id)
  await prisma.transactions.createMany({
    data: [
      { account_id: katrinAccount.id, user_id: katrinUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'income', category: 'laun', amount: 5000.00, description: 'Laun' },
      { account_id: katrinAccount.id, user_id: katrinUser.id, payment_method_id: paymentMethod2.id, transaction_type: 'expense', category: 'matur', amount: 130.00, description: 'Morgunmatur' },
      { account_id: katrinAccount.id, user_id: katrinUser.id, payment_method_id: paymentMethod3.id, transaction_type: 'expense', category: 'samgöngur', amount: 60.00, description: 'Strætó' },
      { account_id: katrinAccount.id, user_id: katrinUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'expense', category: 'íbúð', amount: 1100.00, description: 'Leiga' },
      { account_id: katrinAccount.id, user_id: katrinUser.id, payment_method_id: paymentMethod2.id, transaction_type: 'expense', category: 'afþreying', amount: 150.00, description: 'Kvöldforrit' },
      { account_id: katrinAccount.id, user_id: katrinUser.id, payment_method_id: paymentMethod3.id, transaction_type: 'expense', category: 'annar', amount: 70.00, description: 'Annað' },
      { account_id: katrinAccount.id, user_id: katrinUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'income', category: 'laun', amount: 250.00, description: 'Viðbót' },
      { account_id: katrinAccount.id, user_id: katrinUser.id, payment_method_id: paymentMethod2.id, transaction_type: 'expense', category: 'matur', amount: 95.00, description: 'Hádegismatur' },
      { account_id: katrinAccount.id, user_id: katrinUser.id, payment_method_id: paymentMethod3.id, transaction_type: 'expense', category: 'samgöngur', amount: 45.00, description: 'Taksi' },
      { account_id: katrinAccount.id, user_id: katrinUser.id, payment_method_id: paymentMethod1.id, transaction_type: 'expense', category: 'íbúð', amount: 1050.00, description: 'Leiga' },
    ],
  });

  // Create budgets (6 entries)
  await prisma.budgets.createMany({
    data: [
      { user_id: adminUser.id, category: 'matur', monthly_limit: 400.00 },
      { user_id: adminUser.id, category: 'íbúð', monthly_limit: 1300.00 },
      { user_id: jonasUser.id, category: 'matur', monthly_limit: 350.00 },
      { user_id: jonasUser.id, category: 'samgöngur', monthly_limit: 150.00 },
      { user_id: katrinUser.id, category: 'matur', monthly_limit: 450.00 },
      { user_id: katrinUser.id, category: 'íbúð', monthly_limit: 1200.00 },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });