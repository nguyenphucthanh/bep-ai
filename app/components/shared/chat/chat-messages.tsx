import { useEffect, useRef, type FC } from "react";
import { ChatBaloon } from "./chat-baloon";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ChatMessagesProps = {
  messages: {
    role: string;
    content: string;
  }[];
  isResponding?: boolean;
};

export const ChatMessages: FC<ChatMessagesProps> = ({
  messages,
  isResponding,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      // scroll to bottom
      const inner = scrollRef.current.querySelector(
        '[data-slot="scroll-area-viewport"]'
      );
      if (inner) {
        inner.scrollTop = inner.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <ScrollArea className="h-full" ref={scrollRef} type="always">
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => (
          <ChatBaloon
            key={`${message.role}-${index}`}
            responseRole={message.role}
            content={message.content}
          />
        ))}
        {isResponding && (
          <ChatBaloon
            responseRole="assistant"
            content="Thinking..."
            isResponding
          />
        )}
      </div>
    </ScrollArea>
  );
};
