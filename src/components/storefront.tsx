/* eslint-disable @next/next/no-img-element */

"use client";

import { type Product } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { placeOrderAction, type CheckoutState } from "@/actions/orders";
import { SubmitButton } from "@/components/submit-button";
import { formatCurrency } from "@/lib/utils";

type StorefrontProps = {
  products: Product[];
  isAdmin: boolean;
};

type CartItem = {
  productId: string;
  quantity: number;
};

const initialCheckoutState: CheckoutState = {};

export function Storefront({ products, isAdmin }: StorefrontProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [state, setState] = useState<CheckoutState>(initialCheckoutState);
  const [, startTransition] = useTransition();
  const averagePrice =
    products.length > 0
      ? Math.round(
          products.reduce((sum, product) => sum + product.priceCents, 0) / products.length,
        )
      : 0;

  const cartDetails = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);

        if (!product) {
          return null;
        }

        return {
          ...item,
          product,
          subtotal: product.priceCents * item.quantity,
        };
      })
      .filter(
        (
          item,
        ): item is {
          productId: string;
          quantity: number;
          product: Product;
          subtotal: number;
        } => item !== null,
      );
  }, [cart, products]);

  const total = useMemo(
    () => cartDetails.reduce((sum, item) => sum + item.subtotal, 0),
    [cartDetails],
  );

  function addToCart(productId: string) {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);

      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { productId, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, nextQuantity: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, nextQuantity) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  async function handleCheckout(formData: FormData) {
    startTransition(async () => {
      const result = await placeOrderAction(initialCheckoutState, formData);
      setState(result);

      if (result.success) {
        setCart([]);
      }
    });
  }

  return (
    <main className="relative overflow-hidden pb-20">
      <section className="section-shell pt-6 sm:pt-8">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(86,50,30,0.12)] bg-[linear-gradient(135deg,rgba(255,248,241,0.94),rgba(251,233,217,0.84))] px-6 py-7 shadow-[0_28px_90px_rgba(56,29,16,0.12)] sm:px-8 lg:px-10 lg:py-10">
          <div className="absolute -top-16 right-10 h-44 w-44 rounded-full bg-[rgba(224,164,88,0.18)] blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[rgba(123,57,70,0.08)] blur-3xl" />

          <div className="relative flex flex-col gap-10 lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="float-in max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">Golden Crust Bakery</span>
                <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[#7b3946] uppercase">
                  Daily baked selection
                </span>
              </div>

              <h1 className="display-font mt-5 max-w-3xl text-5xl leading-[0.96] font-semibold text-[#2b1913] sm:text-6xl lg:text-7xl">
                Bakery ordering with a richer, more premium storefront feel.
              </h1>

              <p className="muted mt-6 max-w-2xl text-base leading-8 sm:text-lg">
                Explore curated pastries, build a cart from the live catalog, and check out
                in one polished flow. The same app still powers admin product management and
                customer orders, just with more presence.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {isAdmin ? (
                  <Link className="primary-button" href="/admin">
                    Open admin studio
                  </Link>
                ) : (
                  <Link className="primary-button" href="/login">
                    Admin login
                  </Link>
                )}
                <a className="secondary-button" href="#catalog">
                  Browse menu
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="soft-ring rounded-[1.4rem] bg-white/62 px-4 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b1603d]">
                    Menu Items
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[#2b1913]">{products.length}</p>
                </div>
                <div className="soft-ring rounded-[1.4rem] bg-white/62 px-4 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b1603d]">
                    Average Ticket
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[#2b1913]">
                    {formatCurrency(averagePrice)}
                  </p>
                </div>
                <div className="soft-ring rounded-[1.4rem] bg-white/62 px-4 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b1603d]">
                    Checkout Mode
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[#2b1913]">Live</p>
                </div>
              </div>
            </div>

            <div className="float-in-delay relative">
              <div className="editorial-shadow soft-ring rounded-[2rem] bg-[#241511] p-5 text-white">
                <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f1bd86]">
                        Signature Pick
                      </p>
                      <h2 className="display-font mt-3 text-3xl font-semibold">
                        {products[0]?.name ?? "Seasonal Bake"}
                      </h2>
                    </div>
                    <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-[#ffe2c7]">
                      {products[0] ? formatCurrency(products[0].priceCents) : "Fresh"}
                    </span>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[1.5rem]">
                    <img
                      src={
                        products[0]?.imageUrl ??
                        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={products[0]?.name ?? "Featured bakery item"}
                      className="h-64 w-full object-cover"
                    />
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#e9cfbf]">
                    {products[0]?.description ??
                      "Freshly styled bakery goods ready for a premium storefront presentation."}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3">
                      <p className="text-[#f1bd86]">Crafted menu</p>
                      <p className="mt-1 font-semibold">Editable by admin</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3">
                      <p className="text-[#f1bd86]">Order capture</p>
                      <p className="mt-1 font-semibold">Saved to database</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-10 grid gap-8 xl:grid-cols-[1.5fr_0.82fr]">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2 id="catalog" className="display-font mt-2 text-4xl font-semibold text-[#2b1913] sm:text-5xl">
                Designed like a bakery window, not a plain product grid.
              </h2>
            </div>
            <p className="muted max-w-sm text-sm leading-7">
              Bigger imagery, stronger hierarchy, and a more expressive palette make the same
              data feel far more premium.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product, index) => (
            <article
              key={product.id}
              className={`glass-card group overflow-hidden rounded-[2rem] border border-white/70 ${
                index === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div
                className={`relative overflow-hidden ${
                  index === 0 ? "aspect-[16/8]" : "aspect-[4/4.3]"
                }`}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(25,14,10,0.58)] via-[rgba(25,14,10,0.12)] to-transparent" />
                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/14 px-3 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white backdrop-blur-md">
                  {index === 0 ? "Chef feature" : "Fresh batch"}
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div className="max-w-xs">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ffd4ae]">
                      Golden Crust Select
                    </p>
                    <h3 className="display-font mt-2 text-3xl font-semibold text-white">
                      {product.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#8c472d]">
                    {formatCurrency(product.priceCents)}
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f9e5d7] px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#a15336]">
                    Hand-finished
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#6d5349]">
                    Database-backed
                  </span>
                </div>

                <p className="muted max-w-xl text-sm leading-7">{product.description}</p>

                <button
                  type="button"
                  className="primary-button w-full sm:w-auto"
                  onClick={() => addToCart(product.id)}
                >
                  Add to cart
                </button>
              </div>
            </article>
            ))}
          </div>
        </div>

        <aside className="sticky top-6 h-fit rounded-[2rem] bg-[#241511] p-1 editorial-shadow">
          <div className="rounded-[1.7rem] border border-white/8 bg-[linear-gradient(180deg,rgba(44,25,18,0.98),rgba(31,17,12,0.96))] p-6 text-white sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f1bd86]">
                  Shopping Cart
                </p>
                <h2 className="display-font mt-3 text-4xl font-semibold">Checkout</h2>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#d9c1b4]">
                  Your order summary and delivery details live in one side panel for a smoother
                  purchase flow.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-[#ffe1c3]">
                {cartDetails.length} item{cartDetails.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#f1bd86]">Cart total</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(total)}</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#f1bd86]">Items</p>
                <p className="mt-2 text-2xl font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#f1bd86]">Status</p>
                <p className="mt-2 text-2xl font-semibold">Ready</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {cartDetails.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/14 bg-white/5 px-4 py-5 text-sm text-[#dbc1b2]">
                  Your cart is empty. Add a few bakery favorites to start the order.
                </div>
              ) : (
                cartDetails.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{item.product.name}</p>
                        <p className="mt-1 text-sm text-[#d8c0b2]">
                          {formatCurrency(item.product.priceCents)} each
                        </p>
                      </div>
                      <p className="font-semibold text-[#ffd4ae]">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        className="secondary-button h-10 w-10 !rounded-full !border-white/12 !bg-white/8 !px-0 !text-white"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="secondary-button h-10 w-10 !rounded-full !border-white/12 !bg-white/8 !px-0 !text-white"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form action={handleCheckout} className="mt-6 space-y-4">
            <input
              type="hidden"
              name="items"
              value={JSON.stringify(
                cart.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                })),
              )}
            />
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#f4d3bc]">Name</span>
              <input className="field !border-white/10 !bg-white/92" type="text" name="customerName" required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#f4d3bc]">Email</span>
              <input className="field !border-white/10 !bg-white/92" type="email" name="customerEmail" required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#f4d3bc]">Delivery address</span>
              <textarea className="field min-h-28 resize-y !border-white/10 !bg-white/92" name="address" required />
            </label>

            {state.error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {state.error}
              </p>
            ) : null}
            {state.success ? (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {state.success}
              </p>
            ) : null}

            <SubmitButton
              label="Place order"
              pendingLabel="Sending order..."
              className="primary-button w-full"
            />
            </form>
          </div>
        </aside>
      </section>
    </main>
  );
}
