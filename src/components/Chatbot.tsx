import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Msg { role: "user" | "assistant"; content: string }

// Security constants - must match server-side
const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES = 20;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your shopping assistant. How can I help?" }
  ]);
  const { toast } = useToast();

  const send = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    // Client-side validation
    if (trimmedInput.length > MAX_MESSAGE_LENGTH) {
      toast({
        title: "Message too long",
        description: `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
        variant: "destructive",
      });
      return;
    }
    
    // Limit conversation history
    const recentMessages = messages.slice(-MAX_MESSAGES + 1);
    const next = [...recentMessages, { role: "user", content: trimmedInput } as Msg];
    
    setMessages(next);
    setInput("");
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("chat", { body: { messages: next } });
      
      if (error) {
        // Handle rate limiting
        if (error.message?.includes("429") || error.message?.includes("Too many")) {
          toast({
            title: "Please slow down",
            description: "Too many messages. Please wait a moment before trying again.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }
      
      const reply = (data as { reply?: string })?.reply || "Sorry, I couldn't respond.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "There was an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {open ? (
        <div className="w-80 sm:w-96 bg-card border border-border rounded-xl shadow-strong overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "assistant" ? "text-sm" : "text-sm text-right"}>
                <div className={m.role === "assistant" ? "inline-block bg-muted px-3 py-2 rounded-lg" : "inline-block bg-primary text-primary-foreground px-3 py-2 rounded-lg"}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-xs text-muted-foreground">Thinking...</p>}
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about products, orders..." onKeyDown={(e) => e.key === 'Enter' && send()} />
            <Button onClick={send} disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setOpen(true)} className="rounded-full h-12 w-12 shadow-strong">
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
