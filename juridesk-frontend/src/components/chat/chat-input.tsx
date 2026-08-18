"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Mic, ArrowUp, ChevronDown, Sparkles } from "lucide-react"

interface ChatInputProps {
  onSubmit?: (prompt: string) => void
  placeholder?: string
}

const MODELS = [
  { id: "v1-medium", name: "JuriDesk Legal AI", badge: "Pro", desc: "Fast & precise legal research & reasoning" },
  { id: "v1-pro", name: "JuriDesk Senior Counsel", badge: "Deep", desc: "Complex case law analysis & clause drafting" },
]

export function ChatInput({
  onSubmit,
  placeholder = "How can I help with your legal research today?",
}: ChatInputProps) {
  const [prompt, setPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState(MODELS[0])
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [prompt])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSend() {
    if (!prompt.trim()) return
    onSubmit?.(prompt.trim())
    setPrompt("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Model Dropdown Popover */}
      {showModelDropdown && (
        <div className="absolute bottom-full mb-2 left-4 bg-white border border-stone-200 rounded-2xl shadow-xl p-1.5 z-30 w-72">
          {MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => {
                setSelectedModel(model)
                setShowModelDropdown(false)
              }}
              className={`flex items-start justify-between w-full p-2.5 rounded-xl text-left transition ${
                selectedModel.id === model.id
                  ? "bg-[#f4f2ec] text-stone-900 font-medium"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                  <Sparkles className="size-3.5 text-[#946b29]" />
                  <span>{model.name}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">{model.desc}</p>
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                {model.badge}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Input Box */}
      <div className="relative rounded-2xl bg-white border border-stone-200 shadow-[0_10px_35px_-12px_rgba(45,36,22,0.12)] focus-within:border-[#946b29] focus-within:ring-1 focus-within:ring-[#946b29] transition-all">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-transparent text-stone-900 placeholder-stone-400 text-sm p-4 pt-4 pb-2 focus:outline-none resize-none min-h-[56px] max-h-[200px] leading-relaxed"
        />

        {/* Inner Controls Bar */}
        <div className="flex items-center justify-end px-3 pb-3 pt-1">
          {/* Right Controls */}
          <div className="flex items-center gap-1.5">

            <button
              type="button"
              onClick={handleSend}
              disabled={!prompt.trim()}
              className={`p-2 rounded-xl transition shadow-xs ${
                prompt.trim()
                  ? "bg-[#121212] text-white hover:bg-[#222222] active:scale-[0.98]"
                  : "bg-stone-100 text-stone-300 cursor-not-allowed"
              }`}
              title="Send prompt"
            >
              <ArrowUp className="size-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
