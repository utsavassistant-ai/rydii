"use client";
import { useActionState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { signupAction } from "@/app/auth/actions";

export function SignupForm() {
  const [state, dispatch, isPending] = useActionState(signupAction, null);

  // ── Success: email confirmation screen ──────────────────────────────
  if (state && "success" in state) {
    return (
      <div className="text-center py-4">
        <div className="w-20 h-20 rounded-full bg-primary-container mx-auto flex items-center justify-center">
          <Icon name="mark_email_read" className="!text-[48px] text-on-primary-fixed" fill />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tighter mt-8">Check your inbox</h2>
        <p className="text-secondary mt-3 leading-relaxed">
          We sent a confirmation link to{" "}
          <span className="font-bold text-on-surface">{state.email}</span>.
          <br />
          Click the link to activate your account, then log in.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="w-full text-center cta-gradient text-on-primary-fixed rounded-full py-4 font-bold hover:opacity-95 active:scale-95 transition"
          >
            Go to login →
          </Link>
          <p className="text-xs text-secondary">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="underline font-semibold"
            >
              try again
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────
  const errorMsg = state && "error" in state ? state.error : null;

  return (
    <>
      <h1 className="text-4xl font-extrabold tracking-tighter text-center">
        Create account
      </h1>
      <p className="text-secondary text-center mt-2 mb-10">
        Start renting scootys in under 60 seconds.
      </p>

      {errorMsg && (
        <div className="bg-error-container text-on-error-container rounded-lg p-4 mb-6 text-sm font-semibold flex items-center gap-2">
          <Icon name="error" className="!text-[18px]" />
          {errorMsg}
        </div>
      )}

      <form action={dispatch} className="space-y-4">
        <label className="block bg-surface-container-low rounded-lg p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
            Full name
          </div>
          <input
            name="full_name"
            type="text"
            required
            disabled={isPending}
            placeholder="Karan Sharma"
            className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50 disabled:opacity-50"
          />
        </label>
        <label className="block bg-surface-container-low rounded-lg p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
            Email
          </div>
          <input
            name="email"
            type="email"
            required
            disabled={isPending}
            placeholder="you@example.com"
            className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50 disabled:opacity-50"
          />
        </label>
        <label className="block bg-surface-container-low rounded-lg p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
            Password
          </div>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            disabled={isPending}
            placeholder="Min 6 characters"
            className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50 disabled:opacity-50"
          />
        </label>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">
            I want to
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="rider"
                defaultChecked
                disabled={isPending}
                className="accent-primary-container"
              />
              <div>
                <div className="font-bold">Rent</div>
                <div className="text-xs text-secondary">Book scootys</div>
              </div>
            </label>
            <label className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="vendor"
                disabled={isPending}
                className="accent-primary-container"
              />
              <div>
                <div className="font-bold">List</div>
                <div className="text-xs text-secondary">Earn money</div>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full cta-gradient text-on-primary-fixed rounded-full py-4 font-bold text-lg hover:opacity-95 active:scale-95 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-secondary mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-bold text-primary">
          Log in
        </Link>
      </p>
    </>
  );
}
