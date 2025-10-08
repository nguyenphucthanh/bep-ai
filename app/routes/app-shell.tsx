import { ChevronDown, CookingPot, LogOut } from "lucide-react";
import { Link, Outlet, useMatches, useRouteLoaderData } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppHandle } from "~/types/shared-types";
import type { clientLoader as authClientLoader } from "./auth";

export default function AppShell() {
  const { user } = useRouteLoaderData<typeof authClientLoader>("auth") ?? {};
  const match = useMatches();

  return (
    <div className="min-h-screen container mx-auto px-3 pb-5">
      <header className="flex items-center gap-3 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/"
                  className="inline-flex gap-2 items-center text-xl font-extrabold text-orange-500"
                >
                  <CookingPot /> Bếp.AI
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {match.map((m, index) => {
              const handle = m.handle as AppHandle;
              if (!handle?.breadcrumb?.label) {
                return null;
              }
              return (
                <>
                  <BreadcrumbSeparator key={`separator-${index.toString()}`} />
                  <BreadcrumbItem key={`item-${index.toString()}`}>
                    {handle?.breadcrumb?.href ? (
                      <BreadcrumbLink href={handle?.breadcrumb.href}>
                        {handle?.breadcrumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>
                        {handle?.breadcrumb.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto">
              {user?.displayName}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to={"/logout"}>
                <LogOut /> Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <Outlet />
    </div>
  );
}
