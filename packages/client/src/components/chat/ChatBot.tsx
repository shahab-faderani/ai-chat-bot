import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';

import { Button } from '../ui/button';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  const { current } = useRef(crypto.randomUUID());

  const [messages, setMessages] = useState<Message[]>([]);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-6 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndicator />}
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
