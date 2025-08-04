"use client"

import {
  SquareTerminal,
  Calendar,
  CheckSquare,
  Users,
  FolderOpen,
  BarChart3,
  Bot,
  Bell,
  Settings
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }) {
  const data = {
    user: {
      name: "John Doe",
      email: "john@company.com",
      avatar: "/avatars/john-doe.jpg",
    },
    teams: [
      {
        name: "Marketing Team",
        logo: SquareTerminal,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Projects",
        url: "/projects",
        icon: FolderOpen,
      },
      {
        title: "Tasks",
        url: "/tasks",
        icon: CheckSquare,
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
      },
      {
        title: "Team",
        url: "/team",
        icon: Users,
      },
      {
        title: "AI Assistant",
        url: "/ai",
        icon: Bot,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
        badge: "3",
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
