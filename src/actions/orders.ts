"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name."),
  customerEmail: z.string().trim().email("Please enter a valid email address."),
  address: z.string().trim().min(8, "Please enter a delivery address."),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Your cart is empty."),
});

export type CheckoutState = {
  success?: string;
  error?: string;
};

export async function placeOrderAction(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const rawItems = String(formData.get("items") || "[]");

  let parsedItems: unknown;

  try {
    parsedItems = JSON.parse(rawItems);
  } catch {
    return { error: "We could not read your cart. Please try again." };
  }

  const validated = orderSchema.safeParse({
    customerName: String(formData.get("customerName") || ""),
    customerEmail: String(formData.get("customerEmail") || ""),
    address: String(formData.get("address") || ""),
    items: parsedItems,
  });

  if (!validated.success) {
    return {
      error: validated.error.issues[0]?.message || "Please check your order details.",
    };
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: validated.data.items.map((item) => item.productId),
      },
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  const lineItems = [];

  for (const item of validated.data.items) {
    const product = productMap.get(item.productId);

    if (!product) {
      return { error: "One of the bakery items is no longer available." };
    }

    lineItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.priceCents,
      subtotal: product.priceCents * item.quantity,
    });
  }

  const totalCents = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

  await prisma.order.create({
    data: {
      customerName: validated.data.customerName,
      customerEmail: validated.data.customerEmail,
      address: validated.data.address,
      totalCents,
      items: {
        create: lineItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });

  revalidatePath("/");

  return {
    success: "Order placed. The bakery team has your request.",
  };
}
