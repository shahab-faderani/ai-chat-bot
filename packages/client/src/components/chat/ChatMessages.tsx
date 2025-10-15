import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
  role: 'user' | 'bot';
  content: string;
};

type Props = {
  messages: Message[];
};

const onCopy = (e: React.ClipboardEvent) => {
  const selection = window.getSelection()?.toString().trim();
  if (selection) {
    e.preventDefault();
    e.clipboardData.setData('text/plain', selection);
  }
};

const ChatMessages = ({ messages }: Props) => {
  const lastMessageRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      <h2>
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
      </h2>
    </div>
  );
};

export default ChatMessages;
