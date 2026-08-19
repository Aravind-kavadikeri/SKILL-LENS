'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { sendChatMessage } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';

const SUGGESTED_PROMPTS = [
  'What skills are most in demand?',
  'How do I transition to ML engineering?',
  "What's the average salary for a data scientist?",
  'Create a learning plan for cloud computing',
];

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content: `# Welcome to SkillLENS AI Assistant! 👋

I'm your personal career advisor. I can help you with:

- **Market Insights**: Current trends, in-demand skills, salary data
- **Career Transitions**: Paths between roles, skill gap analysis
- **Salary Analysis**: Compensation benchmarks and predictions
- **Learning Plans**: Personalized roadmaps for skill development

How can I help you today?`,
  timestamp: new Date().toISOString(),
};

export default function AiAssistantPage() {
  const { chatHistory, addChatMessage, clearChat } = useAppStore();
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (message: string) => sendChatMessage(message, conversationId),
    onSuccess: (data) => {
      setConversationId(data.conversation_id);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(botMsg);
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (chatHistory.length === 0) {
      addChatMessage(INITIAL_GREETING);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, scrollToBottom]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || mutation.isPending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput('');
    mutation.mutate(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    mutation.mutate(prompt);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Career Assistant"
        description="Your Personal Career Advisor"
        actions={
          <Button variant="outline" size="sm" onClick={clearChat}>
            Clear Chat
          </Button>
        }
      />

      <Card className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-3',
                    msg.role === 'user'
                      ? 'bg-primary text-background rounded-br-md'
                      : 'bg-surface/80 border border-gray-800/60 text-text-primary rounded-bl-md'
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {children}
                            </a>
                          ),
                          code: ({ className, children, ...props }) => {
                            const isInline = !className;
                            return isInline
                              ? <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>
                              : <code className="block bg-gray-800 p-3 rounded-lg text-sm my-2 overflow-x-auto" {...props}>{children}</code>;
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="h-4 w-4 text-secondary" />
                  </div>
                )}
              </div>
            ))}

            {mutation.isPending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-surface/80 border border-gray-800/60 rounded-bl-md">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <CardFooter className="flex-col gap-3 p-4 border-t border-gray-800/60">
          {chatHistory.length <= 1 && (
            <div className="flex flex-wrap gap-2 w-full">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  disabled={mutation.isPending}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-700 text-text-secondary hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="flex w-full gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your career..."
              disabled={mutation.isPending}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!input.trim() || mutation.isPending} size="icon">
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
