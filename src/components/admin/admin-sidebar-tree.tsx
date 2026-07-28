"use client"

import Link from "next/link"
import { useState } from "react"
import {
  AppWindow,
  BookText,
  ChevronDown,
  Files,
  FileCode2,
  Flag,
  LayoutGrid,
  ListChecks,
  Logs,
  Mail,
  Megaphone,
  MessageSquare,
  Plug2,
  Settings,
  Settings2,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  overview: LayoutGrid,
  users: Users,
  posts: BookText,
  comments: MessageSquare,
  messages: Mail,
  structure: Settings2,
  levels: Sparkles,
  badges: Sparkles,
  verifications: ShieldAlert,
  announcements: Megaphone,
  "custom-pages": FileCode2,
  reports: Flag,
  attachments: Files,
  logs: Logs,
  security: ShieldAlert,
  apps: AppWindow,
  addons: Plug2,
  settings: Settings,
  tasks: ListChecks,
}

interface TreeGroupItem {
  key: string
  label: string
  items: Array<{
    key: string
    href: string
    label: string
    isActive: boolean
  }>
}

interface AdminSidebarTreeProps {
  groups: TreeGroupItem[]
  currentKey: string
}

export function AdminSidebarTree({ groups, currentKey }: AdminSidebarTreeProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className="cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex items-center gap-1">
          广场
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              !expanded && "-rotate-90",
            )}
          />
        </span>
      </SidebarGroupLabel>
      {expanded ? (
        <SidebarGroupContent>
          {groups.map((group) => (
            <SidebarGroup key={group.key} className="pl-2">
              <SidebarGroupLabel className="text-[0.7rem]">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const Icon = iconMap[item.key] ?? Settings
                    return (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={item.key === currentKey}
                          render={<Link href={item.href} />}
                        >
                          <Icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarGroupContent>
      ) : null}
    </SidebarGroup>
  )
}
