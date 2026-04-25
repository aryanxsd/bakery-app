# Golden Crust Bakery

A simple online bakery application built for the assignment requirements:

- Product catalog with bakery items, descriptions, prices, and images
- Shopping cart with add/remove quantity controls and running total
- Checkout flow with name, email, and delivery address
- Admin panel for adding, editing, and deleting products
- Admin authentication separate from the customer storefront
- Real database persistence with Prisma + SQLite

## Stack

- Next.js 16
- React 19
- TypeScript
- Prisma ORM
- SQLite

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create the database and seed initial data:

```bash
npm run db:setup
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Admin Login

- Email: `admin@goldencrust.test`
- Password: `admin1234`

## Useful Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:push
npm run db:seed
npm run db:setup
```

## Project Notes

- Customer cart state is handled in the client UI, while products and orders persist in the database.
- Product images are stored as URLs so the admin can manage them without a file upload pipeline.
- Orders are saved with item snapshots so deleting a product later does not break order history.

## Deployment Note

This project uses SQLite for a simple real database setup. For a live deployment you can:

- Deploy to Render or Railway with a persistent disk and keep SQLite
- Switch Prisma to Postgres or Supabase if you want a serverless-friendly production database
