"use client";

import { Button } from "@/components/ui/button";
import { loginWithCredentialsAction } from "@/lib/auth/actions";
import { useState, useTransition } from "react";

interface LoginFormProps {
  callbackUrl?: string;
}

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (callbackUrl) {
      formData.set("callbackUrl", callbackUrl);
    }

    startTransition(async () => {
      const res = await loginWithCredentialsAction(formData);
      if (res && !res.success) {
        setError(res.error || "Gagal masuk.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-semibold text-foreground"
        >
          Alamat Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isPending}
          defaultValue="bidan@nifascare.com"
          placeholder="contoh@nifascare.com"
          className="w-full border border-input rounded-xl px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-xs font-semibold text-foreground"
        >
          Kata Sandi (Password)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          disabled={isPending}
          placeholder="••••••••"
          className="w-full border border-input rounded-xl px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}

      <Button
        id="btn-login-submit"
        type="submit"
        disabled={isPending}
        className="w-full font-semibold py-2.5"
      >
        {isPending ? "Masuk..." : "Masuk dengan Email"}
      </Button>
    </form>
  );
}
