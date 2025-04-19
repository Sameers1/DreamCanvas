import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Anchor, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/LoginButton";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-white text-xl font-bold hover:text-mysticViolet transition-colors">
            DreamCanvas
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/gallery">
              <Button variant="ghost" size="sm" className="text-white hover:text-mysticViolet transition-colors">
                <Sparkles className="w-4 h-4 mr-2" />
                Gallery
              </Button>
            </Link>
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-mysticViolet text-white">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm hidden md:block">
                    {user.email}
                  </span>
                </div>
                <LoginButton />
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
