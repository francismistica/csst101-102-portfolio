import { useState, useEffect, useRef } from "preact/hooks";

const placeholderPhrases = [
  "What are Francis's skills?",
  "What's his GitHub account?",
  "Tell me about his projects...",
  "How can I contact him?",
  "What did he study?",
  "Is he open to freelance work?",
  "What technologies does he use?",
  "Where is Francis based?",
  "Can you show me his resume?",
  "What is his latest project?",
  "Does he know React and Astro?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showTryMeBadge, setShowTryMeBadge] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  // Typing effect state
  const [placeholderText, setPlaceholderText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen || hasAsked) {
      if (hasAsked) setPlaceholderText("Type a message...");
      return;
    }

    const currentPhrase = placeholderPhrases[phraseIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && placeholderText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && placeholderText === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % placeholderPhrases.length);
    } else {
      const timeout = isDeleting ? 30 : 60;
      timer = setTimeout(() => {
        setPlaceholderText(
          currentPhrase.substring(
            0,
            placeholderText.length + (isDeleting ? -1 : 1),
          ),
        );
      }, timeout);
    }

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, phraseIndex, isOpen, hasAsked]);

  // Determine if badge should be shown based on dates
  useEffect(() => {
    const startDate = new Date("2026-03-22T00:00:00");
    const endDate = new Date("2026-04-17T23:59:59");
    const now = new Date();
    setShowTryMeBadge(now >= startDate && now <= endDate);
  }, []);

  // Handle body overflow when chat opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle scroll logic to un-stick widget before contact section
  useEffect(() => {
    const handleScroll = () => {
      const contactSection = document.getElementById("contact-section");
      if (widgetContainerRef.current && contactSection) {
        const contactRect = contactSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // If the contact section enters the viewport, push the widget up
        if (contactRect.top < windowHeight) {
          const offset = windowHeight - contactRect.top;
          widgetContainerRef.current.style.transform = `translateY(-${offset}px)`;
        } else {
          widgetContainerRef.current.style.transform = "translateY(0)";
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Trigger Button */}
      <div
        ref={widgetContainerRef}
        id="chat-widget-container"
        className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3 animate-fade-up transition-transform duration-75"
      >
        {showTryMeBadge && (
          <div className="relative bg-mint-500 dark:bg-mint-400 text-white dark:text-[#0E0E11] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
            Try Me
            <div className="absolute -bottom-1 right-5 w-2.5 h-2.5 bg-mint-500 dark:bg-mint-400 rotate-45"></div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-[#0E0E11] dark:bg-mint-50 text-white dark:text-[#0E0E11] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-mint-300/50 border-2 border-mint-500 dark:border-mint-400 overflow-hidden group p-2 cursor-pointer"
          aria-label="Open Chat"
        >
          <img
            src="/kaiko-bot-icon.png"
            alt="FM Chat Logo"
            className="w-full h-full object-contain dark:invert transition-transform group-hover:scale-105"
          />
        </button>
      </div>

      {/* Chat Sheet Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/20 dark:bg-black/60 z-[95] backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ display: isOpen ? "block" : "none" }}
      ></div>

      {/* Chat Sheet */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-[#0E0E11] z-[100] transform transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-2xl sm:border-l border-mint-500/20 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
      >
        {!hasAsked && (
          <div
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(13, 188, 130, 0.25) 1px, transparent 0)",
              backgroundSize: "14px 14px",
              maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            }}
          />
        )}

        {/* Header */}
        <div
          className={`flex items-center p-4 border-b border-gray-100 dark:border-white/10 relative z-10 bg-white dark:bg-[#0E0E11] ${hasAsked ? "justify-between" : "justify-end"}`}
        >
          {hasAsked && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-mint-300 to-mint-600 p-[2px]">
                <img
                  src="/kaiko-bot-icon.png"
                  className="w-full h-full rounded-full object-cover bg-white dark:bg-[#0E0E11] p-1"
                  alt="Assistant Avatar"
                />
              </div>
              <span className="font-bold text-lg text-blacktext dark:text-white font-montserrat">
                Assistant
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-400">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10 hover:text-blacktext dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 flex flex-col font-montserrat relative scroll-smooth overflow-x-hidden z-10">
          {!hasAsked ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade-up mt-24 relative z-10">
              <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-mint-400 to-mint-600 p-[2px] shadow-lg shadow-mint-500/20 rotate-3 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/glowing-kaiko-ai.png"
                  className="w-full h-full rounded-3xl object-contain bg-white dark:bg-[#0E0E11] p-3"
                  alt="FM Logo"
                />
              </div>
              <h3 className="text-2xl font-bold text-blacktext dark:text-white mb-3">
                Ask Francis's AI
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-[15px] max-w-[280px] leading-relaxed">
                Want to know more about Francis's projects, experience, or
                skills? Just ask below!
              </p>
            </div>
          ) : (
            <>
              {/* Bot Message */}
              <div className="flex flex-col gap-1 max-w-[85%] animate-fade-up">
                <div className="bg-gray-50 dark:bg-white/5 text-blacktext dark:text-gray-200 p-4 rounded-2xl rounded-tl-sm text-[15px] leading-relaxed border border-gray-100 dark:border-white/10 shadow-sm">
                  <p className="mb-4">Hey there!</p>
                  <p className="mb-4">
                    Need answers or help with your to-do list? I've got you
                    covered!
                  </p>
                  <p>
                    Just type what you need, and let's dive into making things
                    happen.
                  </p>
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-2 max-w-[90%] self-end group relative flex-row-reverse animate-fade-up">
                <div className="bg-mint-50 dark:bg-mint-900/30 text-blacktext dark:text-gray-200 p-4 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed border border-mint-100 dark:border-mint-800/50 shadow-sm">
                  Create me a CSV of the top 20 SaaS companies by revenue that
                  have raised capital in the last 12 months.
                </div>
                {/* Hover Actions */}
                <div className="absolute -bottom-5 right-4 bg-zinc-800 text-gray-300 rounded-lg shadow-md px-2 py-1.5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 border border-zinc-700">
                  <button className="hover:text-white" title="Improve">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </button>
                  <button className="hover:text-white" title="Edit">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button className="hover:text-white" title="Retry">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                  <button className="hover:text-white" title="Copy">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Bot Message - File */}
              <div className="flex flex-col gap-2 max-w-[85%] mt-6 animate-fade-up">
                <div className="bg-gray-50 dark:bg-white/5 text-blacktext dark:text-gray-200 p-4 rounded-2xl rounded-tl-sm text-[15px] border border-gray-100 dark:border-white/10 shadow-sm">
                  Easy! Here you go.
                </div>
                {/* Attachment */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between text-white shadow-md w-full hover:bg-zinc-800 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1e7b54] text-white text-[10px] tracking-wider font-bold rounded p-2 flex items-center justify-center">
                      CSV
                    </div>
                    <span className="text-sm font-medium truncate group-hover:underline">
                      Top_20_SaaS_Companies.csv
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-2 max-w-[90%] self-end flex-row-reverse mt-4 animate-fade-up">
                <div className="bg-mint-50 dark:bg-mint-900/30 text-blacktext dark:text-gray-200 p-4 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed border border-mint-100 dark:border-mint-800/50 shadow-sm">
                  Actually, filter by U.S. companies only and include details of
                  fundraising. Export into a new Google Sheet for me.
                </div>
              </div>

              {/* Typing Indicator */}
              <div className="flex gap-2 max-w-[85%] mt-2 animate-fade-up">
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center border border-gray-100 dark:border-white/10 shadow-sm h-12">
                  <div
                    className="w-1.5 h-1.5 bg-mint-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-mint-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-mint-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0E0E11] relative z-10">
          <form
            className="relative flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              setHasAsked(true);
            }}
          >
            <div className="absolute left-3 flex items-center justify-center p-1 rounded-full text-gray-400 hover:text-mint-500 cursor-pointer transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder={placeholderText + (isOpen && !hasAsked ? "|" : "")}
              className="w-full bg-transparent border-2 border-gray-200 dark:border-zinc-800 rounded-full py-3.5 pl-12 pr-12 text-[15px] font-montserrat focus:outline-none focus:border-mint-400 dark:focus:border-mint-500 focus:ring-0 text-blacktext dark:text-white transition-all placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="absolute right-2 w-10 h-10 bg-mint-500 hover:bg-mint-600 active:scale-90 text-white rounded-full transition-all duration-200 flex items-center justify-center shadow-md"
              aria-label="Send message"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19V5m0 0l-7 7m7-7l7 7"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
