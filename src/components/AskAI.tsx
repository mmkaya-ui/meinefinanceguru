import { useState, useRef, useEffect } from "react";
import { t } from '../utils/i18n';
import { Send, Bot, User, ShieldCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Deep sanitization to ensure no PII is accidentally sent to the AI
function sanitizeDataForAI(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeDataForAI);
  }

  const sanitized: any = {};
  const forbiddenKeys = ["name", "iban", "account", "address", "card", "order", "id", "street", "city", "phone", "email"];

  for (const key in obj) {
    const lowerKey = key.toLowerCase();
    const isForbidden = forbiddenKeys.some(fk => {
      // Match exact word bounded by boundaries or exact match
      // We can just use exact match or endsWith to be safe. "id" -> exact match
      return lowerKey === fk || lowerKey.endsWith(`_${fk}`) || lowerKey.endsWith(`-${fk}`);
    });

    if (!isForbidden) {
      sanitized[key] = sanitizeDataForAI(obj[key]);
    }
  }

  return sanitized;
}

import { useApp } from "../context/AppContext";

export default function AskAI() {
  const { data, lang, apiSecret: apiKey } = useApp();
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
    
  // Hardcoded to the official, stable "latest" model aliases as requested
  const availableModels = [
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-pro-latest"
  ];
  const [selectedModel, setSelectedModel] = useState(availableModels[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || cooldown) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);
    setCooldown(true);
    if (cooldownRef.current) clearTimeout(cooldownRef.current);
    cooldownRef.current = setTimeout(() => {
      if (isMounted.current) setCooldown(false);
    }, 3000);

    try {
      const safeData = sanitizeDataForAI(data);

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          message: userMessage,
          dataContext: safeData,
          lang,
          model: selectedModel
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch AI response');
      }

      if (isMounted.current) {
        setMessages(prev => [...prev, { role: "ai", content: result.content }]);
      }
    } catch (err: any) {
      // Suppressed log
      if (isMounted.current) {
        setMessages(prev => [...prev, { role: "ai", content: `Error: ${err.message || 'Unknown error'}` }]);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  // API key is now managed server-side, no longer need to check apiKey prop

  return (
    <div className="flex flex-col h-[calc(100dvh-200px)] glass-panel rounded-3xl overflow-hidden relative">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 bg-slate-800/20 flex items-center justify-between z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-400" />
            {t("Financial AI Assistant", lang)}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 md:mt-2 leading-tight">{t("Ask questions about your financial data, debts, and trends.", lang)}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] md:text-xs font-medium text-emerald-400 hidden sm:inline-block">{t("Strict Data Anonymization Active", lang)}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <Bot className="w-16 h-16 text-emerald-400 mb-4" />
            <p className="text-slate-300 max-w-sm">
              {t("I am your personal AI financial advisor. All data sent to me is strictly anonymized. Ask me about your spending trends, debt payoff date, or cashflow!", lang)}
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "user" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700/50 text-sky-400"
            }`}>
              {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`p-4 rounded-2xl max-w-[80%] break-words ${
              msg.role === "user" 
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-50 rounded-tr-none" 
                : "bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-tl-none prose prose-invert prose-emerald max-w-none"
            }`}>
              {msg.role === "user" ? (
                msg.content
              ) : (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-700/50 text-sky-400 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-6 border-t border-slate-700/50 bg-slate-800/20 z-10">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-4 flex-wrap sm:flex-nowrap">
            {availableModels.length > 0 && (
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
              >
                {availableModels.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("Ask about your finances... (e.g., 'When will I be debt free?')", lang)}
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading || cooldown}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            {cooldown ? "Wait..." : t("Send", lang)}
          </button>
        </form>
      </div>
    </div>
  );
}
