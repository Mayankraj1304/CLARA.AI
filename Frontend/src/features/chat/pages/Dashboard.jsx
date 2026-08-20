import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hook/useChat";
import ReactMarkdown from "react-markdown";

export const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };
  const openChat = (chatId) => {
    chat.handleOpenChat(chatId);
  };

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#0b1220] bg-[radial-gradient(circle_at_top_left,rgba(86,214,192,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(107,145,214,0.1),transparent_38%)] text-white">
      <section className="flex h-full w-full overflow-hidden bg-black/10 shadow-2xl shadow-[#07101d]/60 backdrop-blur-sm">
        <aside className="hidden h-full w-72 shrink-0 border-y-0 border-l-0 border-r border-white/10 bg-linear-to-b from-[#122235]/95 via-[#0e1a2b]/95 to-[#0b1422]/95 p-5 shadow-xl shadow-[#07101d]/30 md:flex md:flex-col">
          <h1 className="mb-2 bg-linear-to-r from-teal-200 via-cyan-300 to-blue-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
            CLARA.AI
          </h1>
          <p className="mb-6 text-xs uppercase tracking-[0.28em] text-white/35">
            Your intelligent workspace
          </p>

          <div className="space-y-2">
            {Object.values(chats).map((chat) => (
              <button
                onClick={() => {
                  openChat(chat.id);
                }}
                key={chat.id}
                type="button"
                className={`w-full cursor-pointer rounded-xl border px-3 py-3 text-left text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:border-teal-300/60 hover:bg-teal-300/10 hover:text-white ${
                  currentChatId === chat.id
                    ? "border-teal-300/60 bg-teal-300/15 text-teal-100 shadow-lg shadow-teal-950/20"
                    : "border-white/10 bg-white/3 text-white/65"
                }`}
              >
                <span className="block truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-linear-to-br from-white/6 via-transparent to-[#6b91d6]/8">
          <div className="messages no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-3 pb-5 pt-4 md:px-8 md:pb-6 md:pt-6">
            {chats[currentChatId]?.messages.map((message) => (
              <div
                key={message.id}
                className={`w-fit max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg md:text-base ${
                  message.role === "user"
                    ? "ml-auto rounded-br-sm border border-amber-200/20 bg-linear-to-br from-amber-300 via-orange-400 to-rose-500 text-slate-950 shadow-orange-950/25"
                    : "mr-auto rounded-bl-sm border border-cyan-200/15 bg-linear-to-br from-[#102b35] via-[#13233a] to-[#17204a] text-cyan-50 shadow-blue-950/30"
                }`}
              >
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-2 list-disc pl-5">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-2 list-decimal pl-5">{children}</ol>
                      ),
                      code: ({ children }) => (
                        <code className="rounded bg-white/10 px-1 py-0.5">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="mb-2 overflow-x-auto rounded-xl bg-black/30 p-3">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>

          <footer className="w-full shrink-0 border-t border-white/10 bg-linear-to-r from-[#101d2d]/95 via-[#111e31]/95 to-[#14233a]/95 p-3 shadow-2xl shadow-[#07101d]/40 backdrop-blur-xl md:p-4">
            <form
              onSubmit={handleSubmitMessage}
              className="flex flex-col gap-3 md:flex-row"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Type your message..."
                className="w-full cursor-text rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-lg text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/70 focus:bg-black/30"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="cursor-pointer rounded-2xl border border-cyan-200/30 bg-linear-to-r from-teal-400 to-blue-500 px-6 py-3 text-lg font-semibold text-slate-950 shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:from-teal-300 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  );
};
