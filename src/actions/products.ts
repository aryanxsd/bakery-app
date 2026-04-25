"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parsePriceToCents, uniqueSlug } from "@/lib/utils";

async function readProductForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const priceCents = parsePriceToCents(formData.get("price"));

  if (!name || !description || !imageUrl || priceCents === null) {
    throw new Error("Please complete every field with a valid price and image URL.");
  }

  return {
    name,
    description,
    imageUrl,
    priceCents,
  };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const product = await readProductForm(formData);

  await prisma.product.create({
    data: {
      ...product,
      slug: uniqueSlug(product.name),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();

  const productId = String(formData.get("productId") || "");
  const product = await readProductForm(formData);

  if (!productId) {
    throw new Error("Missing product id.");
  }

  await prisma.product.update({
    where: { id: productId },
    data: product,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const productId = String(formData.get("productId") || "");

  if (!productId) {
    throw new Error("Missing product id.");
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}
