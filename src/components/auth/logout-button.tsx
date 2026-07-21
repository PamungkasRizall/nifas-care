import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/actions";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps = {}) {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" className={className}>
        Logout
      </Button>
    </form>
  );
}
