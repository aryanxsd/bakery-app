/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { Order, Product } from "@prisma/client";

import { createProductAction, deleteProductAction, updateProductAction } from "@/actions/products";
import { logoutAction } from "@/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { formatCurrency } from "@/lib/utils";

type AdminPanelProps = {
  adminName: string;
  products: Product[];
  recentOrders: (Order & {
    items: {
      id: string;
      productName: string;
      quantity: number;
    }[];
  })[];
};

export function AdminPanel({ adminName, products, recentOrders }: AdminPanelProps) {
  const totalRevenue = recentOrders.reduce((sum, order) => sum + order.totalCents, 0);

  return (
    <main className="section-shell py-6 sm:py-8">
      <div className="relative overflow-hidden rounded-[2.25rem] bg-[#241511] p-1 editorial-shadow">
        <div className="absolute -right-8 top-0 h-48 w-48 rounded-full bg-[rgba(224,164,88,0.15)] blur-3xl" />
        <div className="absolute left-12 top-10 h-24 w-24 rounded-full bg-[rgba(191,92,55,0.18)] blur-3xl" />

        <div className="relative rounded-[2rem] border border-white/8 bg-[linear-gradient(160deg,rgba(39,21,15,0.98),rgba(24,14,11,0.96))] p-6 text-white sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow !text-[#f1bd86]">Admin Studio</p>
              <h1 className="display-font mt-4 text-5xl font-semibold leading-tight sm:text-6xl">
                Welcome back, {adminName}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#dcc3b6] sm:text-lg">
                This control room manages the live bakery catalog, keeps pricing current, and
                lets you track the latest checkout activity without leaving the brand experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="secondary-button !border-white/10 !bg-white/8 !text-white" href="/">
                View storefront
              </Link>
              <form action={logoutAction}>
                <SubmitButton label="Sign out" pendingLabel="Signing out..." className="primary-button" />
              </form>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#f1bd86]">Active products</p>
              <p className="mt-2 text-4xl font-semibold">{products.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#f1bd86]">Recent orders</p>
              <p className="mt-2 text-4xl font-semibold">{recentOrders.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#f1bd86]">Recent revenue</p>
              <p className="mt-2 text-4xl font-semibold">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-8">
          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <div className="mb-6">
              <p className="eyebrow">Add Product</p>
              <h2 className="display-font mt-3 text-4xl font-semibold text-[#2b1913]">
                Create a new bakery item
              </h2>
              <p className="muted mt-3 max-w-2xl text-sm leading-7">
                Add imagery, pricing, and description in one pass. New items appear immediately in
                the customer storefront after save.
              </p>
            </div>

            <form action={createProductAction} className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2 md:col-span-1">
                <span className="text-sm font-semibold text-[#5f4539]">Name</span>
                <input className="field" type="text" name="name" required />
              </label>
              <label className="block space-y-2 md:col-span-1">
                <span className="text-sm font-semibold text-[#5f4539]">Price</span>
                <input className="field" type="text" name="price" placeholder="6.50" required />
              </label>
              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-[#5f4539]">Image URL</span>
                <input className="field" type="url" name="imageUrl" required />
              </label>
              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-[#5f4539]">Description</span>
                <textarea className="field min-h-28 resize-y" name="description" required />
              </label>
              <div className="md:col-span-2">
                <SubmitButton
                  label="Add product"
                  pendingLabel="Saving..."
                  className="primary-button"
                />
              </div>
            </form>
          </div>

          <div className="space-y-5">
            {products.map((product) => (
              <article key={product.id} className="glass-card overflow-hidden rounded-[2rem] p-0">
                <div className="grid gap-0 lg:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-72 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,15,10,0.58)] via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#8c472d]">
                        {formatCurrency(product.priceCents)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="display-font text-3xl font-semibold text-[#2f1f17]">
                          {product.name}
                        </h3>
                        <p className="muted mt-2 max-w-xl text-sm leading-7">
                          Update the customer-facing details below.
                        </p>
                      </div>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="productId" value={product.id} />
                    <SubmitButton
                      label="Delete"
                      pendingLabel="Deleting..."
                      className="secondary-button text-[#8d4129]"
                    />
                      </form>
                    </div>

                    <form action={updateProductAction} className="grid gap-4 md:grid-cols-2">
                      <input type="hidden" name="productId" value={product.id} />
                      <label className="block space-y-2">
                        <span className="text-sm font-semibold text-[#5f4539]">Name</span>
                        <input className="field" type="text" name="name" defaultValue={product.name} required />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-sm font-semibold text-[#5f4539]">Price</span>
                        <input
                          className="field"
                          type="text"
                          name="price"
                          defaultValue={(product.priceCents / 100).toFixed(2)}
                          required
                        />
                      </label>
                      <label className="block space-y-2 md:col-span-2">
                        <span className="text-sm font-semibold text-[#5f4539]">Image URL</span>
                        <input className="field" type="url" name="imageUrl" defaultValue={product.imageUrl} required />
                      </label>
                      <label className="block space-y-2 md:col-span-2">
                        <span className="text-sm font-semibold text-[#5f4539]">Description</span>
                        <textarea
                          className="field min-h-28 resize-y"
                          name="description"
                          defaultValue={product.description}
                          required
                        />
                      </label>
                      <div className="md:col-span-2">
                        <SubmitButton
                          label="Save changes"
                          pendingLabel="Updating..."
                          className="primary-button"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-card h-fit rounded-[2rem] p-6 sm:p-8">
          <div>
            <p className="eyebrow">Recent Orders</p>
            <h2 className="display-font mt-3 text-4xl font-semibold text-[#2b1913]">
              Latest checkout activity
            </h2>
            <p className="muted mt-3 text-sm leading-7">
              Recent customer submissions land here so the bakery owner can spot new demand fast.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {recentOrders.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-[#d7c2b4] bg-white/60 px-4 py-5 text-sm text-[#70584e]">
                No orders yet. Customer checkouts will appear here.
              </div>
            ) : (
              recentOrders.map((order) => (
                <article key={order.id} className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#2f1f17]">{order.customerName}</p>
                      <p className="muted text-sm">{order.customerEmail}</p>
                    </div>
                    <p className="font-semibold text-[#8d4129]">{formatCurrency(order.totalCents)}</p>
                  </div>
                  <p className="muted mt-3 text-sm leading-6">{order.address}</p>
                  <p className="mt-3 text-sm text-[#5f4539]">
                    {order.items.map((item) => `${item.quantity}x ${item.productName}`).join(", ")}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
