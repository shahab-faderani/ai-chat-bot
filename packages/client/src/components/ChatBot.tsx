import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Button } from './ui/button';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  role: 'user' | 'bot';
  content: string;
};

const ChatBot = () => {
  const { current } = useRef(crypto.randomUUID());
  const lastMessageRef = useRef<HTMLParagraphElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /*
   * @todo: log errors using sentry
   */
  const onSubmit = async ({ prompt }: FormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);

      setError('');
      reset({ prompt: '' });

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: current,
      });

      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsBotTyping(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(onSubmit)();
      e.preventDefault();
    }
  };

  const onCopy = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-6 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            onCopy={onCopy}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`px-3 py-1 rounded-xl ${
              message.role === 'user'
                ? 'bg-blue-600 text-white self-end'
                : 'bg-gray-100 text-black self-start'
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex gap-1 px-3 py-3 bg-gray-200 rounded-xl self-start">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (value) => value.trim().length > 0,
          })}
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything..."
          maxLength={1000}
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
