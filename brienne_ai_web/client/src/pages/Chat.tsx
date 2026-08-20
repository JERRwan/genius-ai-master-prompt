import { AmbientField } from "@/components/AmbientField";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useBrowserVoice } from "@/hooks/useBrowserVoice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ExternalLink, Loader2, LogIn, MessageSquare, Mic, MicOff, Plus, Radar, ShieldCheck, Sparkles, Trash2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CHAT_ERROR_MESSAGE, SAFETY_NOTICE } from "./chatContent";

const ASSETS = {
  logo: "/manus-storage/brienne-orbital-shield-mark_eb6ea939.png",
};

const STARTER_MESSAGES: Message[] = [
  {
    role: "system",
    content: "You are BRIENNE, a precise and safety-first personal AI assistant.",
  },
];

export default function Chat() {
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const [messages, setMessages] = useState<Message[]>(STARTER_MESSAGES);
  const [webSearchUrl, setWebSearchUrl] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const voice = useBrowserVoice();
  const lastAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant")?.content ?? "";

  const historyQuery = trpc.history.list.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
  const activeConversationQuery = trpc.history.get.useQuery(
    { conversationId: activeConversationId ?? "00000000-0000-0000-0000-000000000000" },
    { enabled: isAuthenticated && Boolean(activeConversationId), refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (!activeConversationQuery.data) return;
    setMessages([
      ...STARTER_MESSAGES,
      ...activeConversationQuery.data.messages.map((message) => ({ role: message.role, content: message.content })),
    ]);
    setWebSearchUrl(null);
  }, [activeConversationQuery.data]);

  const deleteMutation = trpc.history.delete.useMutation({
    onSuccess: async (_, variables) => {
      if (variables.conversationId === activeConversationId) {
        setActiveConversationId(null);
        setMessages(STARTER_MESSAGES);
        setWebSearchUrl(null);
      }
      await utils.history.list.invalidate();
    },
  });

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: async (result) => {
      setMessages((current) => [...current, { role: "assistant", content: result.message }]);
      setWebSearchUrl(result.webSearchUrl ?? null);
      if (result.conversationId) setActiveConversationId(result.conversationId);
      if (isAuthenticated) await utils.history.list.invalidate();
    },
    onError: () => {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: CHAT_ERROR_MESSAGE,
        },
      ]);
    },
  });

  function handleSend(content: string) {
    const nextMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setWebSearchUrl(null);
    setDraft("");
    chatMutation.mutate({
      messages: nextMessages
        .filter((message) => message.role !== "system")
        .map((message) => ({ role: message.role as "user" | "assistant", content: message.content })),
      conversationId: activeConversationId ?? undefined,
    });
  }

  function startNewConversation() {
    setActiveConversationId(null);
    setMessages(STARTER_MESSAGES);
    setWebSearchUrl(null);
    setDraft("");
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#08101e] text-[#f4f1e9] selection:bg-[#ff6b3d] selection:text-[#08101e]">
      <AmbientField />
      <header className="relative z-20 border-b border-white/10 bg-[#08101e]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <Link href="/" className="group flex items-center gap-3" aria-label="Return to BRIENNE AI home">
            <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-[#ece8dc] ring-1 ring-white/15 transition-transform duration-200 group-hover:rotate-6">
              <img src={ASSETS.logo} alt="" className="size-9 object-contain" />
            </span>
            <span>
              <span className="block font-display text-[15px] font-semibold tracking-[0.18em] text-[#f6f4ef]">BRIENNE</span>
              <span className="block font-mono text-[9px] tracking-[0.19em] text-[#8ea1b8]">CONVERSATION CONSOLE</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="hidden border border-[#6ed7c3]/35 bg-[#6ed7c3]/10 px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.1em] text-[#86e6d2] hover:bg-[#6ed7c3]/10 sm:inline-flex">
              <span className="mr-1.5 size-1.5 rounded-full bg-[#6ed7c3] shadow-[0_0_12px_#6ed7c3]" /> AI RESPONSE READY
            </Badge>
            <Button asChild variant="outline" size="sm" className="rounded-full border-white/20 bg-white/[0.035] text-[#f4f1e9] hover:bg-white/10 hover:text-white">
              <Link href="/"><ArrowLeft className="mr-1.5 size-4" /> Landing page</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-[1440px] gap-8 px-5 py-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10 lg:py-12">
        <aside className="flex flex-col justify-between border border-white/10 bg-[#0d1728] p-6 lg:min-h-[690px] lg:p-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#91a3b7]">BRIENNE / 05.01</p>
            <h1 className="mt-5 max-w-md font-display text-5xl font-medium leading-[0.93] tracking-[-0.055em] text-[#f4f1e9] sm:text-6xl">Ask clearly. Keep the boundary visible.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#afbdcb]">A responsive ChatGPT-style conversation surface for research, drafting, explanation, and planning. BRIENNE answers in chat; it does not run your computer from this page.</p>

            <div className="mt-10 space-y-0 border-y border-white/10">
              {[
                [ShieldCheck, "Visible limits", "No hidden device access or automatic actions."],
                [Radar, "Current facts", "Questions about changing information include a web-search handoff."],
                [Sparkles, "Clear replies", "Ask naturally; BRIENNE responds with concise Markdown."],
              ].map(([Icon, label, copy]) => {
                const IconComponent = Icon as typeof ShieldCheck;
                return (
                  <div key={label as string} className="flex gap-4 border-b border-white/10 py-5 last:border-b-0">
                    <IconComponent className="mt-0.5 size-5 shrink-0 text-[#ff8060]" />
                    <div><p className="text-sm font-medium text-[#f4f1e9]">{label as string}</p><p className="mt-1 text-sm leading-6 text-[#92a4b8]">{copy as string}</p></div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#91a3b7]">Memory vault</p>
                  <p className="mt-1 text-sm text-[#c3ced9]">{isAuthenticated ? "Your history is stored in your account." : "Sign in to save conversations."}</p>
                </div>
                {isAuthenticated ? (
                  <Button type="button" variant="outline" size="sm" onClick={startNewConversation} className="shrink-0 rounded-full border-white/20 bg-white/[0.035] text-[#f4f1e9] hover:bg-white/10 hover:text-white">
                    <Plus className="mr-1.5 size-3.5" /> New
                  </Button>
                ) : (
                  <Button type="button" variant="outline" size="sm" onClick={() => startLogin()} disabled={loading} className="shrink-0 rounded-full border-white/20 bg-white/[0.035] text-[#f4f1e9] hover:bg-white/10 hover:text-white">
                    {loading ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <LogIn className="mr-1.5 size-3.5" />} Sign in
                  </Button>
                )}
              </div>

              {isAuthenticated && (
                <div className="mt-4 max-h-48 space-y-1 overflow-y-auto pr-1">
                  {historyQuery.isLoading ? (
                    <p className="flex items-center gap-2 py-3 text-sm text-[#8ea1b8]"><Loader2 className="size-3.5 animate-spin" /> Loading saved conversations</p>
                  ) : historyQuery.data?.length ? (
                    historyQuery.data.map((conversation) => (
                      <div key={conversation.id} className={`group flex items-center gap-1 border px-1 py-1 ${conversation.id === activeConversationId ? "border-[#6ed7c3]/35 bg-[#6ed7c3]/[0.08]" : "border-transparent hover:border-white/10 hover:bg-white/[0.035]"}`}>
                        <button type="button" onClick={() => setActiveConversationId(conversation.id)} className="min-w-0 flex-1 px-2 py-1.5 text-left">
                          <span className="flex items-center gap-2 text-sm text-[#e3e9ef]"><MessageSquare className="size-3.5 shrink-0 text-[#86e6d2]" /><span className="truncate">{conversation.title}</span></span>
                        </button>
                        <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${conversation.title}`} onClick={() => deleteMutation.mutate({ conversationId: conversation.id })} disabled={deleteMutation.isPending} className="size-7 text-[#8294a8] hover:bg-[#ff6b3d]/10 hover:text-[#ff9b7a]">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="py-3 text-sm leading-6 text-[#8ea1b8]">Saved conversations will appear here after you send your first signed-in message.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 border-l-2 border-[#ff6b3d] bg-[#ff6b3d]/[0.06] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#ff9b7a]">Human override stays on</p>
            <p className="mt-2 text-sm leading-6 text-[#c3ced9]">{SAFETY_NOTICE}</p>
          </div>
        </aside>

        <section className="relative overflow-hidden border border-white/10 bg-[#0a1423] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.26)] sm:p-5">
          <div className="pointer-events-none absolute inset-x-5 top-0 flex justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-white/15 sm:inset-x-7"><span>CHAT FRAME / C-01</span><span>PUBLIC CONVERSATION</span><span>APPROVAL: HUMAN</span></div>
          <div className="mb-5 mt-5 flex flex-col gap-4 border-b border-white/10 pb-5 sm:mt-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8ea1b8]">Live conversation</p>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-[#f4f1e9]">BRIENNE AI</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#8ea1b8]">For live, changing information, use the current-source handoff after the answer.</p>
          </div>

          <div className="mb-4 flex flex-col gap-3 border border-white/10 bg-[#08101e]/75 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="text-xs leading-5 text-[#9eb0c4]">{voice.status}</p>
            <div className="flex shrink-0 items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => voice.isListening ? voice.stopListening() : voice.startListening(setDraft)} disabled={!voice.isRecognitionSupported && !voice.isListening} className={`rounded-full border-white/20 bg-white/[0.035] text-[#f4f1e9] hover:bg-white/10 hover:text-white ${voice.isListening ? "border-[#ff6b3d]/60 text-[#ff9b7a]" : ""}`}>
                {voice.isListening ? <MicOff className="mr-1.5 size-3.5" /> : <Mic className="mr-1.5 size-3.5" />} {voice.isListening ? "Stop" : "Speak"}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => voice.isSpeaking ? voice.cancelSpeech() : voice.speak(lastAssistantMessage)} disabled={!voice.isSpeechSupported || (!voice.isSpeaking && !lastAssistantMessage)} className="rounded-full border-white/20 bg-white/[0.035] text-[#f4f1e9] hover:bg-white/10 hover:text-white">
                {voice.isSpeaking ? <VolumeX className="mr-1.5 size-3.5" /> : <Volume2 className="mr-1.5 size-3.5" />} {voice.isSpeaking ? "Stop audio" : "Read reply"}
              </Button>
            </div>
          </div>

          <AIChatBox
            messages={messages}
            onSendMessage={handleSend}
            isLoading={chatMutation.isPending}
            height="min(61vh, 620px)"
            className="rounded-none border-white/10 bg-[#0d1728] text-[#f4f1e9] shadow-none [&_textarea]:border-white/15 [&_textarea]:bg-[#08101e] [&_textarea]:text-[#f4f1e9] [&_textarea]:placeholder:text-[#71859a] [&_button[type=submit]]:bg-[#ff6b3d] [&_button[type=submit]]:text-[#08101e] [&_button[type=submit]]:hover:bg-[#ff8058]"
            emptyStateMessage="Ask BRIENNE to explain, research, plan, or draft."
            placeholder="Ask BRIENNE anything…"
            inputValue={draft}
            onInputValueChange={setDraft}
            suggestedPrompts={[
              "Explain a complex topic in plain language.",
              "Help me outline a research plan.",
              "Draft a concise professional email.",
              "What should I verify before making this decision?",
            ]}
          />

          {webSearchUrl && (
            <div className="mt-4 flex flex-col gap-3 border border-[#6ed7c3]/25 bg-[#6ed7c3]/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[#bfe7dc]">This question may depend on current information. Confirm details against live sources before relying on them.</p>
              <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full border-[#6ed7c3]/35 bg-transparent text-[#9be7d7] hover:bg-[#6ed7c3]/10 hover:text-white">
                <a href={webSearchUrl} target="_blank" rel="noreferrer">Search current web <ExternalLink className="ml-1.5 size-3.5" /></a>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
