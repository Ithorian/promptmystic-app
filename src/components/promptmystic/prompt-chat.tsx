'use client';

import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { IoCopyOutline, IoSparkles } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ChatMessage, MAX_MESSAGE_LENGTH } from '@/features/promptmystic/types';
import { cn } from '@/utils/cn';

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    "Hi, I'm PromptMystic. ✨ Tell me in your own words what you'd like help with, and I'll turn it into a powerful, ready-to-use prompt. What are you trying to do?",
};

/** Extracts the first fenced code block from a message, for the Copy Prompt action. */
function extractPrompt(content: string): string | null {
  const match = content.match(/```(?:[a-zA-Z]*)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

export function PromptChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(event: SyntheticEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      toast({
        variant: 'destructive',
        description: `Please shorten your message to ${MAX_MESSAGE_LENGTH.toLocaleString()} characters or fewer.`,
      });
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setIsStreaming(true);

    // Only real user/assistant turns are sent to the model (skip the client-only welcome line).
    const payloadMessages = nextMessages.filter((m, i) => !(i === 0 && m === WELCOME_MESSAGE));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Something went wrong. Please try again.');
      }

      if (!response.body) throw new Error('No response received.');

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
      // Roll back the failed user turn so they can retry cleanly.
      setMessages((prev) => {
        const trimmedPrev = [...prev];
        const last = trimmedPrev[trimmedPrev.length - 1];
        if (last?.role === 'assistant' && last.content === '') trimmedPrev.pop();
        return trimmedPrev;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  async function copyPrompt(prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({ description: 'Prompt copied to your clipboard. 🌟' });
    } catch {
      toast({ variant: 'destructive', description: 'Could not copy. Please select and copy manually.' });
    }
  }

  return (
    <div className='m-auto flex h-full w-full max-w-3xl flex-col gap-4'>
      <div ref={scrollRef} className='flex flex-1 flex-col gap-4 overflow-y-auto rounded-lg bg-black p-4'>
        {messages.map((message, index) => {
          const prompt = message.role === 'assistant' ? extractPrompt(message.content) : null;
          return (
            <div
              key={index}
              className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  message.role === 'user' ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-900 text-zinc-200'
                )}
              >
                {message.content || <span className='text-zinc-500'>…</span>}
                {prompt && (
                  <div className='mt-3'>
                    <Button size='sm' variant='secondary' onClick={() => copyPrompt(prompt)}>
                      <IoCopyOutline className='mr-2' size={16} />
                      Copy Prompt
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} className='flex flex-col gap-2 rounded-lg bg-black p-4'>
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              sendMessage(event);
            }
          }}
          placeholder='Describe what you want in plain words…'
          aria-label='Describe what you want in plain words'
          disabled={isStreaming}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={2}
        />
        <div className='flex items-center justify-end gap-3'>
          {input.length > MAX_MESSAGE_LENGTH - 1000 && (
            <span className='text-xs text-neutral-500'>
              {input.length.toLocaleString()}/{MAX_MESSAGE_LENGTH.toLocaleString()}
            </span>
          )}
          <Button type='submit' variant='sexy' disabled={isStreaming || !input.trim()}>
            <IoSparkles className='mr-2' size={16} />
            {isStreaming ? 'Working…' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
}
