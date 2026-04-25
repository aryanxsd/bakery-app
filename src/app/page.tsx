import { Storefront } from "@/components/storefront";
import { getProducts } from "@/lib/data";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const [products, session] = await Promise.all([getProducts(), getSession()]);

  return <Storefront products={products} isAdmin={session?.role === "ADMIN"} />;
}
