import React, { useState, useEffect, useRef } from "react";

export default function ChatApp() {
  const initialGreetings = [
    "Hi — I'm Mara 🌸, here to listen. What's on your mind?",
    "Hello! I'm Mara, your AI friend. How are you feeling today?",
    "Hey! Let's talk. I'm ready to support you. What's up?"
  ];
  const initialGreeting = initialGreetings[Math.floor(Math.random() * initialGreetings.length)];

  const [messages, setMessages] = useState([
    { from: "bot", text: initialGreeting }
  ]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => "session_" + Math.random().toString(36).slice(2));
  const [journals, setJournals] = useState([]);
  const [history, setHistory] = useState([]);
  const [showMore, setShowMore] = useState(false); // Single toggle for journal/history
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef(); // Auto-focus input

  useEffect(() => {
    inputRef.current?.focus(); // ChatGPT-like: Ready to type
    fetch("/api/journal?session_id=" + sessionId)
      .then(r => r.json())
      .then(d => { if (d.ok) setJournals(d.entries); })
      .catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages(m => [...m, { from: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text })
      });
      const data = await res.json();
      if (data.ok) {
        setMessages(m => [...m, { from: "bot", text: data.reply, mood: data.mood || 'neutral' }]);
        if (data.crisis) {
          setMessages(m => [...m, { from: "bot", text: "If you're in danger, please call local emergency services now (Rwanda: 112)." }]);
        }
      } else {
        setMessages(m => [...m, { from: "bot", text: "Sorry, something went wrong. Try again?" }]);
      }
    } catch (e) {
      setMessages(m => [...m, { from: "bot", text: "Network error. Check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  // Quick Mood Chips (Compact, inline)
  const quickMoods = [
    { emoji: "😊", text: "I'm feeling happy!!" },
    { emoji: "😢", text: "I'm feeling sad." },
    { emoji: "😟", text: "I'm anxious." },
    { emoji: "😐", text: "I'm okay." }
  ];

  const setQuickMood = (text) => {
    setInput(text);
    setTimeout(sendMessage, 300); // Quick send
  };

  const quickJournal = async () => {
    const content = prompt("Quick journal note:");
    if (!content?.trim()) return;
    await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, content: content.trim() })
    });
    const res = await fetch("/api/journal?session_id=" + sessionId);
    const d = await res.json();
    if (d.ok) setJournals(d.entries);
  };

  const toggleMore = async () => {
    setShowMore(!showMore);
    if (!showMore) {
      const res = await fetch("/api/history?session_id=" + sessionId);
      const d = await res.json();
      if (d.ok) setHistory(d.entries);
    }
  };

  const getMoodClass = (mood) => {
    const classes = {
      happy: 'border-green-200 bg-green-50',
      sad: 'border-red-200 bg-red-50',
      neutral: 'border-yellow-200 bg-yellow-50'
    };
    return classes[mood] || 'border-gray-200 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg flex flex-col h-[90vh] overflow-hidden"> {/* Taller, slimmer container */}
        {/* Slim Header */}
        <header className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Mara 🌸</h1> {/* Minimal title */}
          <button onClick={toggleMore} className="text-gray-500 hover:text-gray-700 text-sm">More</button> {/* Single toggle */}
        </header>
        
        {/* Main Chat - 80% Space */}
        <main className="flex-1 overflow-y-auto p-4 space-y-6"> {/* More space-y for airy feel */}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
              <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${m.from === "user" ? "bg-indigo-600 text-white" : `bg-gradient-to-r from-gray-100 to-lavender-100 text-gray-800 ${getMoodClass(m.mood)}`}`}>
                <p className="leading-6">{m.text}</p> {/* Relaxed lines, no timestamp */}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </main>
        
        {/* Compact Footer */}
        <footer className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 mb-2"> {/* Inline moods */}
            {quickMoods.map((mood, i) => (
              <button key={i} onClick={() => setQuickMood(mood.text)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm transition-all">
                {mood.emoji}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
              placeholder="Share how you're feeling..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all">
              {loading ? "..." : "Send"}
            </button>
          </div>
          <button onClick={quickJournal} className="mt-2 text-indigo-600 text-sm hover:underline flex items-center gap-1 self-end">+ Quick Journal</button> {/* Floating + */}
        </footer>

        {/* Minimal More Section (Collapsible) */}
        {showMore && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-4 max-h-40 overflow-y-auto"> {/* Compact drawer */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Journals ({journals.length})</h4>
              {journals.length === 0 ? (
                <p className="text-gray-500 text-sm">No entries yet.</p>
              ) : (
                <ul className="space-y-1">
                  {journals.slice(-3).map(j => ( // Last 3 only
                    <li key={j.id} className="text-xs text-gray-600 truncate">{new Date(j.created_at).toLocaleDateString()} - {j.content.substring(0, 50)}...</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Recent Moods ({history.length})</h4>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No history yet.</p>
              ) : (
                <ul className="space-y-1">
                  {history.slice(-3).map(h => ( // Last 3 only
                    <li key={h.id} className="text-xs flex items-center gap-2">
                      <span className={`px-1 py-0.5 rounded-full text-xs ${getMoodClass(h.mood)}`}>{h.mood}</span>
                      {h.message.substring(0, 30)}...
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}