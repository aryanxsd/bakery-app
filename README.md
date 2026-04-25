# Golden Crust Bakery

A simple online bakery application built for the assignment requirements:

- Product catalog with bakery items, descriptions, prices, and images
- Shopping cart with add/remove quantity controls and running total
- Checkout flow with name, email, and delivery address
- Admin panel for adding, editing, and deleting products
- Admin authentication separate from the customer storefront
- Real database persistence with Prisma + Supabase Postgres

## Stack

- Next.js 16
- React 19
- TypeScript
- Prisma ORM
- Supabase Postgres

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local `.env` file from the example:

```bash
cp .env.example .env
```

3. Update `.env` with your Supabase session pooler connection string and auth secret:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-<region>.pooler.supabase.com:5432/postgres"
AUTH_SECRET="your-long-random-secret"
```

Use the `5432` session pooler URL for local development.

4. Push the schema and seed initial data:

```bash
npm run db:setup
```

5. Start the development server:

```bash
npm run dev
```

6. Open `http://localhost:3000`

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

## Deployment

Production is deployed on Vercel with Supabase Postgres.

Required Vercel environment variables:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-<region>.pooler.supabase.com:6543/postgres"
AUTH_SECRET="your-long-random-secret"
```

Use:

- `5432` session pooler URL for local development
- `6543` transaction pooler URL for Vercel/serverless deployment

Live app: [https://bakery-app-sigma.vercel.app](https://bakery-app-sigma.vercel.app)
