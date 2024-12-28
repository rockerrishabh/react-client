import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ThemeToggleButton from "./ThemeToggleButton";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "@/hooks/use-toast";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, logout, logoutError, logoutSuccess, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (logoutSuccess) {
      toast({
        description: "Successfully Logged Out",
      });
      navigate({ to: "/" });
    }
    if (logoutError) {
      toast({
        description: "Error while Logging you Out",
        variant: "destructive",
      });
    }
  }, [logoutError, logoutSuccess, navigate]);

  return (
    <header className="sticky top-0 z-10 bg-background shadow shadow-slate-300 dark:shadow-slate-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              Logo
            </Link>
          </div>

          <nav className="hidden items-center space-x-4 md:flex">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="py-2 pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            </div>
            <Link
              to="/about"
              className="text-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
            <ThemeToggleButton />

            <section className="flex items-center justify-center">
              {loading ? (
                <div className="flex min-h-screen items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-cyan-500 border-t-transparent"></div>
                </div>
              ) : (
                <>
                  {auth ? (
                    <section className="flex items-center gap-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Avatar>
                            <AvatarImage src={auth.user.avatar} />
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Profile</DropdownMenuItem>
                          <DropdownMenuItem>Billing</DropdownMenuItem>
                          <DropdownMenuItem>Team</DropdownMenuItem>
                          <DropdownMenuItem onClick={logout}>
                            Logout
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button onClick={handleLogout} variant="ghost">
                        Logout
                      </Button>
                      <Button
                        asChild
                        variant="default"
                        className="w-32 bg-primary py-3 text-primary-foreground hover:bg-primary/90"
                      >
                        <Link to="/dashboard">Dashboard</Link>
                      </Button>
                    </section>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button
                        asChild
                        variant="ghost"
                        className="w-20 py-3 text-foreground hover:text-primary"
                      >
                        <Link to="/sign-in">Sign In</Link>
                      </Button>
                      <Button
                        asChild
                        variant="default"
                        className="w-20 bg-primary py-3 text-primary-foreground hover:bg-primary/90"
                      >
                        <Link to="/sign-up">Sign Up </Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </section>
          </nav>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <div className="relative mb-3">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full py-2 pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              </div>
              <Link
                to="/about"
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
              >
                Contact
              </Link>
              <div className="px-3 py-2">
                <ThemeToggleButton />
              </div>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full text-foreground hover:text-primary"
                >
                  <Link to="/sign-in" className="w-full">
                    Sign In
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="default"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link to="/sign-up" className="w-full">
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
