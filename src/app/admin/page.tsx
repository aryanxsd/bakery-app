import { AdminPanel } from "@/components/admin-panel";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await requireAdmin();
  const [products, recentOrders] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
          },
        },
      },
    }),
  ]);

  return (
    <AdminPanel
      adminName={session.name}
      products={products}
      recentOrders={recentOrders}
    />
  );
}
