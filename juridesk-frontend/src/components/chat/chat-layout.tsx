"use client"

import { useState } from "react"
import Link from "next/link"
import { Scale, Sparkles, User as UserIcon } from "lucide-react"

import { useAuthStore } from "@/store/authStore"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatInput } from "@/components/chat/chat-input"

export function ChatLayout() {
  const user = useAuthStore((state) => state.user)
  const [activeChatId, setActiveChatId] = useState("1")
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    const name = user?.username ? user.username.split(" ")[0] : "Advocate"

    if (hour >= 22 || hour < 5) return `Up late, ${name}?`
    if (hour >= 5 && hour < 12) return `Good morning, ${name}`
    if (hour >= 12 && hour < 17) return `Good afternoon, ${name}`
    return `Good evening, ${name}`
  }

  function handleSendPrompt(prompt: string) {
    setMessages((prev) => [...prev, { role: "user", content: prompt }])
    // Simulate assistant response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I am researching precedents and analyzing your query: "${prompt}". Let me know if you would like me to draft a summary, cite relevant acts, or prepare court arguments.`,
        },
      ])
    }, 900)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f6f4ef] text-stone-900 font-sans">
      {/* Left Sidebar Component */}
      <ChatSidebar
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          setActiveChatId(id)
          setMessages([])
        }}
        onNewChat={() => {
          setActiveChatId("")
          setMessages([])
        }}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#f6f4ef]">
        
                {/* Workspace Content */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          {/* Messages or Welcome View */}
          {messages.length === 0 ? (
            <div className="my-auto text-center space-y-7 animate-fade-in py-8">
              {/* JuriDesk Brand Badge Greeting */}
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(45,36,22,0.08)]">
                <Scale className="size-7 text-[#946b29]" />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                  {getGreeting()}
                </h1>
                <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                  Research case law, analyze agreements, and draft legal documents with clarity and focus.
                </p>
              </div>

              {/* Central Floating Prompt Input */}
              <div className="pt-2">
                <ChatInput onSubmit={handleSendPrompt} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-6 pb-28 pt-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-4 max-w-2xl ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`grid size-8 place-items-center rounded-xl text-xs font-semibold flex-shrink-0 shadow-2xs ${
                      msg.role === "user"
                        ? "bg-[#121212] text-white"
                        : "bg-[#c69542] text-[#121212]"
                    }`}
                  >
                    {msg.role === "user" ? "You" : <Sparkles className="size-4" />}
                  </div>

                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-white text-stone-900 border border-stone-200 shadow-2xs"
                        : "bg-[#e8e4db]/50 text-stone-800 border border-stone-200/80"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              <div className="mt-auto pt-4">
                <ChatInput onSubmit={handleSendPrompt} />
              </div>
            </div>
          )}

          {/* Footer note */}
          <footer className="text-center text-[11px] text-stone-400 py-3 mt-4">
            JuriDesk AI provides legal research assistance. Always verify citations and case facts.
          </footer>
        </main>
      </div>
    </div>
  )
}
