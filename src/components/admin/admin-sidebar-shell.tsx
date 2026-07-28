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
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
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

interface AdminSidebarShellProps {
  groups: TreeGroupItem[]
  currentKey: string
}

export function AdminSidebarShell({ groups, currentKey }: AdminSidebarShellProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setExpanded(!expanded)}
              tooltip="广场"
            >
              <Settings />
              <span className="flex items-center gap-1">
                广场
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    !expanded && "-rotate-90",
                  )}
                />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {!expanded ? (
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/" />} tooltip="心情">
                <Sparkles />
                <span>心情</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {expanded ? (
          groups
            .filter((group) => group.key !== "community")
            .map((group) => (
              <SidebarGroup key={group.key}>
                <SidebarGroupLabel className="text-[0.7rem]">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items
                      .filter((item) => item.key !== "users")
                      .map((item) => {
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
            ))
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          {expanded ? (
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/" />} tooltip="心情">
                <Sparkles />
                <span>心情</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/admin?tab=users" />} tooltip="用户管理">
              <Users />
              <span>用户管理</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />} tooltip="返回前台">
              <LayoutGrid />
              <span>返回前台</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
