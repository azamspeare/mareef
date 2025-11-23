import * as React from "react"
import {
  BookOpen,
  LayoutDashboard,
  Users,
  Plus,
  HelpCircle,
} from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { PageProps } from "@/types"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = usePage<PageProps>().props.auth.user;

  const data = {
    user: {
      name: user?.name || "Teacher",
      email: user?.email || "teacher@mareff.test",
      avatar: user?.avatar || "",
    },
    navMain: [
      {
        title: "Dashboard",
        url: route('dashboard'),
        icon: LayoutDashboard,
      },
      {
        title: "My Writings",
        url: "#",
        icon: BookOpen,
      },
      {
        title: "Students",
        url: "#",
        icon: Users,
      },
      {
        title: "Create Task",
        url: "#",
        icon: Plus,
      },
    ],
    navSecondary: [
      {
        title: "Help",
        url: import.meta.env.VITE_APP_HELP || "#",
        icon: HelpCircle,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={route('dashboard')}>
                <div className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-md">
                    <span className="font-bold text-xs">M</span>
                </div>
                <span className="text-base font-semibold">Mareff</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
