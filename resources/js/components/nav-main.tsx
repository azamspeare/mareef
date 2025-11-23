import { PlusCircle, Mail, type LucideIcon } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    disableActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <PlusCircle />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <Mail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const page = usePage();

            // Simple check: if item.url matches current url (handling full url vs path)
            // A better way might be to pass 'active' prop from parent, but let's try to infer it.
            // Since we use route() which returns full URL, and page.url is path.
            let active = false;
            if (!item.disableActive) {
                try {
                    const itemPath = new URL(item.url).pathname;
                    active = page.url === itemPath || (page.url.startsWith(itemPath) && itemPath !== '/');
                } catch (e) {
                    active = page.url === item.url;
                }
            }

            return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={active}
                className="data-[active=true]:bg-zinc-200 dark:data-[active=true]:bg-zinc-800"
              >
                <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )})}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
