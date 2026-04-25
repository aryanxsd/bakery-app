"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction, type AuthFormState } from "@/actions/auth";
import { SubmitButton } from "@/components/submit-button";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative overflow-hidden rounded-[2.25rem] bg-[#241511] p-1 editorial-shadow">
        <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-[rgba(224,164,88,0.18)] blur-3xl" />
        <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-[rgba(191,92,55,0.14)] blur-3xl" />
        <div className="relative flex h-full flex-col justify-between rounded-[2rem] border border-white/8 bg-[linear-gradient(160deg,rgba(39,21,15,0.98),rgba(24,14,11,0.96))] p-8 text-white sm:p-10">
          <div>
            <p className="eyebrow !text-[#f1bd86]">Admin Sign In</p>
            <h1 className="display-font mt-4 text-5xl leading-tight font-semibold">
              Manage the bakery like it has its own studio.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-[#dcc3b6]">
              This side is reserved for the bakery owner. Sign in to add new products, update
              pricing, and keep the customer menu fresh.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#f1bd86]">Catalog tools</p>
              <p className="mt-2 text-sm text-[#f5e5d9]">Create, edit, and remove bakery items.</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#f1bd86]">Live orders</p>
              <p className="mt-2 text-sm text-[#f5e5d9]">Watch recent checkout activity instantly.</p>
            </div>
          </div>
        </div>
      </div>

      <form action={formAction} className="glass-card w-full rounded-[2.25rem] p-8 sm:p-10">
        <div className="space-y-2">
          <p className="eyebrow">Owner Access</p>
          <h2 className="display-font text-4xl font-semibold text-[#2f1f17] sm:text-5xl">
            Sign in to the control room
          </h2>
          <p className="muted max-w-xl text-sm leading-7">
            Use the seeded admin credentials below to enter the management dashboard.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[#5f4539]">Email</span>
            <input className="field" type="email" name="email" placeholder="admin@goldencrust.test" required />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[#5f4539]">Password</span>
            <input className="field" type="password" name="password" placeholder="admin1234" required />
          </label>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-[#f8e7d9] px-4 py-4 text-sm text-[#6b4e42]">
          Demo credentials: <span className="font-semibold">admin@goldencrust.test</span> /{" "}
          <span className="font-semibold">admin1234</span>
        </div>

        {state.error ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {state.error}
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          <SubmitButton
            label="Sign in as admin"
            pendingLabel="Signing in..."
            className="primary-button w-full"
          />
          <Link className="secondary-button w-full" href="/">
            Back to storefront
          </Link>
        </div>
      </form>
    </div>
  );
}
