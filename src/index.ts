import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import {
  createTransaction,
  getTransactions,
  getTransaction,
  validateTransaction,
  validateUpdatedTransaction,
  deleteTransaction,
  updateTransaction,
  getCategories,
  getCategory,
  getBudgets,
  getBudget,
  getAccounts,
  getAccount,
  getPaymentMethods,
  getPaymentMethod,
  getUsers,
  getUser,
} from './categories.db.js';
import auth from './auth.js';

dotenv.config();

//cloudinary í .env sókt
if (process.env.CLOUDINARY_URL) {
  const cloudinaryConfig = new URL(process.env.CLOUDINARY_URL);
  cloudinary.config({
    cloud_name: cloudinaryConfig.hostname,
    api_key: cloudinaryConfig.username,
    api_secret: cloudinaryConfig.password,
  });
}

const app = new Hono();

app.get('/', (c) => {
  const data = {
    name: 'Transactions API',
    description: 'API to manage transactions',
    _links: {
      self: {
        href: '/',
        method: 'GET',
      },
      transactions: {
        href: '/transactions',
        method: 'GET',
      },
      categories: {
        href: '/categories',
        method: 'GET',
      },
      budgets: {
        href: '/budgets',
        method: 'GET',
      },
      payment_methods: {
        href: '/payment_methods',
        method: 'GET',
      },
      users: {
        href: '/users',
        method: 'GET',
      },
      accounts: {
        href: '/accounts',
        method: 'GET',
      },
    },
  };
  return c.json(data);
});

// tenging við auth
app.route('/auth', auth);

// cloudinary
app.post('/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file'); // ehv file sent
  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }
  const arrayBuffer = await (file as Blob).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // Upload the file to Cloudinary
  return new Promise<Response>((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        return resolve(c.json({ error: error.message }, 500));
      }
      // On success, return the secure URL.
      resolve(c.json({ url: result?.secure_url }));
    });
    uploadStream.end(buffer);
  });
});



app.get('/transactions', async (c) => {
  const limit = Number(c.req.query('limit') || 10);
  const offset = Number(c.req.query('offset') || 0);
  const transactions = await getTransactions(); 
  const paginated = transactions.slice(offset, offset + limit);
  return c.json({
    data: paginated,
    pagination: { limit, offset, total: transactions.length },
  });
});

app.get('/users', async (c) => {
  const users = await getUsers();
  return c.json(users);
});

app.get('/users/:slug', async (c) => {
  const slug = c.req.param('slug');
  const user = await getUser(slug);
  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }
  return c.json(user);
});

app.get('/payment_methods', async (c) => {
  const paymentMethods = await getPaymentMethods();
  return c.json(paymentMethods);
});
app.get('/payment_methods/:slug', async (c) => {
  const slug = c.req.param('slug');
  const paymentMethod = await getPaymentMethod(slug);
  if (!paymentMethod) {
    return c.json({ message: 'Payment method not found' }, 404);
  }
  return c.json(paymentMethod);
});

app.get('/accounts', async (c) => {
  const accounts = await getAccounts();
  return c.json(accounts);
});
app.get('/accounts/:slug', async (c) => {
  const slug = c.req.param('slug');
  const account = await getAccount(slug);
  if (!account) {
    return c.json({ message: 'Account not found' }, 404);
  }
  return c.json(account);
});

app.get('/budgets', async (c) => {
  const budgets = await getBudgets();
  return c.json(budgets);
});
app.get('/budgets/:slug', async (c) => {
  const slug = c.req.param('slug');
  const budget = await getBudget(slug);
  if (!budget) {
    return c.json({ message: 'Budget not found' }, 404);
  }
  return c.json(budget);
});

app.get('/categories', async (c) => {
  const categories = await getCategories();
  return c.json(categories);
});

app.get('/categories/:slug', async (c) => {
  const slug = c.req.param('slug');
  const category = await getCategory(slug);
  if (!category) {
    return c.json({ message: 'Category not found' }, 404);
  }
  return c.json(category);
});

app.get('/transactions', async (c) => {
  const transactions = await getTransactions();
  return c.json(transactions);
});

app.get('/transactions/:slug', async (c) => {
  const slug = c.req.param('slug');

  // Validate á hámarkslengd á slug
  if (slug.length > 100) {
    return c.json({ message: 'Slug is too long' }, 400);
  }
  const transaction = await getTransaction(slug);
  if (!transaction) {
    return c.json({ message: 'Transaction not found' }, 404);
  }
  console.log('transaction :>> ', transaction);
  return c.json(transaction);
});
app.post('/transactions', async (c) => {
  let transactionToCreate: unknown;
  try {
    transactionToCreate = await c.req.json();
    console.log('Þetta er transaction', transactionToCreate);
    // eslint-disable-next-line
  } catch (error) {
    return c.json({ error: 'invalid json' }, 400);
  }
  const validTransaction = validateTransaction(transactionToCreate);
  if (!validTransaction.success) {
    return c.json(
      { error: 'invalid data', errors: validTransaction.error.flatten() },
      400
    );
  }
  const createdTransaction = await createTransaction(validTransaction.data);
  console.log('createdTransaction :>> ', createdTransaction);
  return c.json(createdTransaction, 201);
});
// Það sem ég gerði til að deletea transactions...
app.delete('/transactions/:slug', async (c) => {
  const slug = c.req.param('slug');
  console.log(slug);
  const transaction = await getTransaction(slug);
  console.log(transaction);
  if (!transaction) {
    return c.json({ error: 'Category not found' }, 404);
  }
  try {
    await deleteTransaction(transaction);
    return c.body(null, 204);
    // eslint-disable-next-line
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Það sem ég gerði til að updatea transactions...
app.patch('/transactions/:slug', async (c) => {
  const slug = c.req.param('slug');
  const transaction = await getTransaction(slug);
  if (!transaction) {
    return c.json({ error: 'Transaction not found' }, 404);
  }
  let transactionToUpdate: unknown;
  try {
    transactionToUpdate = await c.req.json();
    // eslint-disable-next-line
  } catch (error) {
    return c.json({ error: 'invalid json' }, 400);
  }
  const validTransaction = validateUpdatedTransaction(transactionToUpdate);
  console.log('validTransaction :>> ', validTransaction);
  if (!validTransaction.success) {
    return c.json(
      { error: 'invalid data', errors: validTransaction.error.flatten() },
      400
    );
  }
  console.log('Er kominn hérna');
  const updated = await updateTransaction(validTransaction.data, transaction);
  console.log('updated :>> ', updated);
  return c.json(updated, 200);
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT || 3000),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
