"use client"

import { useState } from "react"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  MessageSquare,
  FolderKanban,
  FileText,
  Search,
  MoreHorizontal,
  Trash2,
  LogOut,
  Settings,
  Scale,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/store/authStore"

export type ChatHistoryItem = {
  id: string
  title: string
  dateGroup: "Today" | "Yesterday" | "Previous 7 Days"
  timestamp: string
}

const DEFAULT_HISTORY: ChatHistoryItem[] = [
  {
    id: "1",
    title: "Labour Tribunal Section 33(c) precedents",
    dateGroup: "Today",
    timestamp: "10:42 AM",
  },
  {
    id: "2",
    title: "Drafting employment non-compete clause",
    dateGroup: "Today",
    timestamp: "8:15 AM",
  },
  {
    id: "3",
    title: "Industrial Disputes Act summary & analysis",
    dateGroup: "Yesterday",
    timestamp: "Yesterday",
  },
  {
    id: "4",
    title: "Contract review for tech vendor SLA",
    dateGroup: "Yesterday",
    timestamp: "Yesterday",
  },
  {
    id: "5",
    title: "Arbitration clause enforcement precedents",
    dateGroup: "Previous 7 Days",
    timestamp: "3 days ago",
  },
]

interface ChatSidebarProps {
  activeChatId?: string
  onSelectChat?: (id: string) => void
  onNewChat?: () => void
}

export function ChatSidebar({
  activeChatId = "1",
  onSelectChat,
  onNewChat,
}: ChatSidebarProps) {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [history, setHistory] = useState<ChatHistoryItem[]>(DEFAULT_HISTORY)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const userInitials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email[0].toUpperCase()
    : "JD"

  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const todayChats = filteredHistory.filter((i) => i.dateGroup === "Today")
  const yesterdayChats = filteredHistory.filter((i) => i.dateGroup === "Yesterday")
  const olderChats = filteredHistory.filter((i) => i.dateGroup === "Previous 7 Days")

  function handleLogout() {
    logout()
    router.push("/login")
  }

  function handleDeleteChat(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setHistory((prev) => prev.filter((item) => item.id !== id))
    setActiveMenuId(null)
  }

  return (
    <aside
      className={`relative flex flex-col h-screen bg-[#f0ede6] text-stone-700 border-r border-stone-200/80 transition-all duration-300 ease-in-out z-20 select-none ${
        isCollapsed ? "w-16" : "w-72"
      }`}
    >
      {/* Top Header Section */}
      <div className="flex items-center justify-between p-3 border-b border-stone-200/70">
        {!isCollapsed && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-2 py-1 rounded-lg hover:bg-stone-200/60 transition text-stone-900 font-semibold tracking-tight"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-[#121212] text-[#dcb86f] shadow-sm">
              <Scale className="size-4" />
            </span>
            <span className="font-semibold text-base text-stone-900 tracking-tight">JuriDesk</span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className={`p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition ${
            isCollapsed ? "mx-auto" : ""
          }`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          className={`flex items-center justify-center gap-2.5 w-full rounded-xl bg-[#121212] text-white font-medium text-sm transition shadow-sm hover:bg-[#222222] active:scale-[0.99] ${
            isCollapsed ? "p-2.5" : "px-3.5 py-2.5"
          }`}
          title="New Chat"
        >
          <Plus className="size-4.5 text-[#dcb86f]" />
          {!isCollapsed && <span>New Matter / Chat</span>}
        </button>
      </div>

      {/* Search Input (Expanded Only) */}
      {!isCollapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-white text-xs text-stone-800 placeholder-stone-400 rounded-lg pl-8 pr-3 py-1.5 border border-stone-200 focus:border-[#946b29] focus:outline-none transition shadow-2xs"
            />
          </div>
        </div>
      )}

      {/* Navigation Quick Links */}
      {/* {!isCollapsed && (
        <div className="px-3 py-1 space-y-0.5 border-b border-stone-200/70 mb-2">
          <button
            type="button"
            className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition"
          >
            <FolderKanban className="size-4 text-[#946b29]" />
            <span>Matters & Cases</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition"
          >
            <FileText className="size-4 text-[#946b29]" />
            <span>Legal Documents</span>
          </button>
        </div>
      )} */}

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 scrollbar-thin scrollbar-thumb-stone-300">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3 py-2">
            {history.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectChat?.(item.id)}
                className={`p-2.5 rounded-lg transition ${
                  activeChatId === item.id
                    ? "bg-[#121212] text-white"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"
                }`}
                title={item.title}
              >
                <MessageSquare className="size-4" />
              </button>
            ))}
          </div>
        ) : (
          <>
            {todayChats.length > 0 && (
              <ChatGroup
                title="Today"
                items={todayChats}
                activeChatId={activeChatId}
                activeMenuId={activeMenuId}
                onSelectChat={onSelectChat}
                onToggleMenu={(id) => setActiveMenuId(activeMenuId === id ? null : id)}
                onDeleteChat={handleDeleteChat}
              />
            )}

            {yesterdayChats.length > 0 && (
              <ChatGroup
                title="Yesterday"
                items={yesterdayChats}
                activeChatId={activeChatId}
                activeMenuId={activeMenuId}
                onSelectChat={onSelectChat}
                onToggleMenu={(id) => setActiveMenuId(activeMenuId === id ? null : id)}
                onDeleteChat={handleDeleteChat}
              />
            )}

            {olderChats.length > 0 && (
              <ChatGroup
                title="Previous 7 Days"
                items={olderChats}
                activeChatId={activeChatId}
                activeMenuId={activeMenuId}
                onSelectChat={onSelectChat}
                onToggleMenu={(id) => setActiveMenuId(activeMenuId === id ? null : id)}
                onDeleteChat={handleDeleteChat}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Profile Footer */}
      <div className="relative p-2 border-t border-stone-200/70 bg-[#e8e4db]/50">
        <button
          type="button"
          onClick={() => setShowProfileMenu((prev) => !prev)}
          className={`flex items-center gap-3 w-full p-2 rounded-xl transition hover:bg-stone-200/70 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <span className="grid size-8 place-items-center rounded-xl bg-[#121212] text-[#dcb86f] font-semibold text-xs shadow-sm flex-shrink-0">
            {userInitials}
          </span>
          {!isCollapsed && (
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-semibold text-stone-900 truncate">
                {user?.username || user?.email?.split("@")[0] || "Advocate"}
              </p>
              <p className="text-[11px] text-stone-500 truncate">{user?.email || "Free Plan"}</p>
            </div>
          )}
          {!isCollapsed && <ChevronUp className="size-3.5 text-stone-400" />}
        </button>

        {/* Profile Menu Popover */}
        {showProfileMenu && (
          <div
            className={`absolute bottom-16 bg-white border border-stone-200 rounded-xl shadow-xl py-1.5 z-30 ${
              isCollapsed ? "left-14 w-48" : "left-2 right-2"
            }`}
          >
            <div className="px-3 py-2 border-b border-stone-100">
              <p className="text-xs font-semibold text-stone-900">
                {user?.username || "Legal Workspace"}
              </p>
              <p className="text-[11px] text-stone-500 truncate">{user?.email || "user@firm.com"}</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-stone-700 hover:bg-stone-100 transition"
              onClick={() => setShowProfileMenu(false)}
            >
              <Settings className="size-3.5 text-stone-500" />
              <span>Settings & Preferences</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

function ChatGroup({
  title,
  items,
  activeChatId,
  activeMenuId,
  onSelectChat,
  onToggleMenu,
  onDeleteChat,
}: {
  title: string
  items: ChatHistoryItem[]
  activeChatId?: string
  activeMenuId: string | null
  onSelectChat?: (id: string) => void
  onToggleMenu: (id: string) => void
  onDeleteChat: (id: string, e: React.MouseEvent) => void
}) {
  return (
    <div className="space-y-1">
      <h3 className="px-2 text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
        {title}
      </h3>
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = activeChatId === item.id
          const isMenuOpen = activeMenuId === item.id

          return (
            <div key={item.id} className="relative group">
              <button
                type="button"
                onClick={() => onSelectChat?.(item.id)}
                className={`flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs text-left transition ${
                  isActive
                    ? "bg-[#121212] text-white font-medium shadow-xs"
                    : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                <span className="truncate pr-4">{item.title}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleMenu(item.id)
                  }}
                  className={`p-1 rounded text-stone-400 hover:text-stone-700 transition opacity-0 group-hover:opacity-100 ${
                    isMenuOpen ? "opacity-100 bg-stone-200" : ""
                  }`}
                  aria-label="Chat options"
                >
                  <MoreHorizontal className="size-3.5" />
                </button>
              </button>

              {isMenuOpen && (
                <div className="absolute right-2 top-8 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-30 w-32">
                  <button
                    type="button"
                    onClick={(e) => onDeleteChat(item.id, e)}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="size-3" />
                    <span>Delete chat</span>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
