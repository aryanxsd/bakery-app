import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "Cinnamon Cloud Roll",
    description: "Soft laminated dough spiraled with cinnamon sugar and vanilla glaze.",
    priceCents: 650,
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Berry Shortcake Slice",
    description: "Light sponge cake layered with whipped cream and macerated berries.",
    priceCents: 780,
    imageUrl:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Butter Croissant",
    description: "A flaky bakery staple baked until deeply golden and crisp.",
    priceCents: 420,
    imageUrl:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Chocolate Ganache Tart",
    description: "Silky dark chocolate filling in a crisp cocoa pastry shell.",
    priceCents: 920,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
  },
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const passwordHash = await bcrypt.hash("admin1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@goldencrust.test" },
    update: {
      name: "Golden Crust Owner",
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      name: "Golden Crust Owner",
      email: "admin@goldencrust.test",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: slugify(product.name) },
      update: product,
      create: {
        ...product,
        slug: slugify(product.name),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
