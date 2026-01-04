import * as React from "react"
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Users,
  Plus,
  HelpCircle,
} from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import type { SharedPageProps } from "@/types"

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
import { TeacherLogo } from "@/components/logo"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth } = usePage<SharedPageProps>().props;
  const user = auth.user;

  const data = {
    user: {
      name: user?.name || "Teacher",
      email: user?.email || "teacher@mareef.test",
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
        url: route('writings.index'),
        icon: BookOpen,
      },
      {
        title: "My Quizzes",
        url: route('quizzes.index'),
        icon: ClipboardList,
      },
      {
        title: "Students",
        url: route('students.index'),
        icon: Users,
      },
      {
        title: "Create Task",
        url: route('writings.create'),
        icon: Plus,
        disableActive: true,
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
                <TeacherLogo size="xs" />
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
