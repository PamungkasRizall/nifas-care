import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth";

interface LoginButtonProps {
  callbackUrl?: string;
}

export function LoginButton({ callbackUrl }: LoginButtonProps) {
  async function loginWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl || "/dashboard" });
  }

  return (
    <form action={loginWithGoogle} className="w-full">
      <Button
        type="submit"
        size="lg"
        variant="outline"
        className="w-full gap-2.5 border-border bg-card"
      >
        <GoogleIcon className="size-4" />
        Masuk / Daftar dengan Google
      </Button>
    </form>
  );
}
