import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";
import { Upload } from "lucide-react";

import { useIsMobile } from "../hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useAuth from "@/store/auth";

const Navbar = () => {
  const isMobile = useIsMobile();

  const { user } = useAuth();
  return (
    <nav className="w-full h-14 border-b bg-white px-5 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/">
        <h3 className="text-lg font-semibold">Video Streaming</h3>
      </Link>
      <NavigationMenu viewport={isMobile}>
        {user.loggedIn ? (
          <NavigationMenuList className="flex-wrap">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/v/upload">
                  <span className="flex items-center gap-2">
                    <Upload />
                    Upload Video
                  </span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/account">
                  <Avatar>
                    <AvatarImage
                      src={user?.data?.avatar}
                      alt={user?.data?.fullName}
                    />
                    <AvatarFallback>
                      {user?.data?.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        ) : (
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/login">Login</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        )}
      </NavigationMenu>
    </nav>
  );
};

export default Navbar;
