import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut } from "lucide-react";

export const LoginButton = () => {
  const { user, signIn, logout, loading } = useAuth();

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="text-white hover:text-red-400 transition-colors"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={signIn}
      className="text-white hover:text-mysticViolet transition-colors"
    >
      <LogIn className="w-4 h-4 mr-2" />
      Sign In
    </Button>
  );
}; 