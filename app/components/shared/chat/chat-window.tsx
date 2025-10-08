import { useEffect, useRef, useState, type FC } from "react";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";

export type ChatWindowProps = {
  messages: {
    role: string;
    content: string;
  }[];
  action: string;
};

const suggestion = [
  {
    label: "Gợi ý từ nguyên liệu có sẵn 💫",
    prompt:
      "Tôi có sẵn một số nguyên liệu cơ bản, bạn hãy gợi ý cho tôi một vài món nhé!",
  },
  { label: "Menu cơ bản 🍽️", prompt: "Hãy gợi ý cho tôi một menu cơ bản nhé!" },
  {
    label: "Tôi đang bí 😖",
    prompt:
      "Hãy gợi ý cho tôi một món ăn ngon miệng nhé! Tôi không có ý tưởng nào mới cả!",
  },
];

export const ChatWindow: FC<ChatWindowProps> = ({ messages, action }) => {
  const chatWindow = useRef<HTMLDivElement>(null);
  const fetcher = useFetcher();
  const [displayedMessages, setDisplayedMessages] = useState(messages);

  const submitHandler = async (content: string) => {
    setDisplayedMessages([
      ...displayedMessages,
      {
        role: "user",
        content,
      },
    ]);
    fetcher.submit(
      {
        messages: [
          ...messages,
          {
            role: "user",
            content,
          },
        ],
      },
      { method: "post", encType: "application/json", action }
    );
  };

  useEffect(() => {
    if (chatWindow.current) {
      // scroll into view
      chatWindow.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    setDisplayedMessages(messages);
  }, [messages]);

  return (
    <div
      className="relative h-[calc(100vh_-_180px)] grid grid-cols-1 grid-rows-1 gap-4"
      ref={chatWindow}
    >
      <div>
        <ChatMessages
          messages={displayedMessages}
          isResponding={fetcher.state === "submitting"}
        />
      </div>
      <div className="bg-white">
        {fetcher.state === "idle" && !messages.length && (
          <div className="grid md:grid-cols-3 gap-4 my-4">
            {suggestion.map((item, index) => (
              <Button
                key={index.toString()}
                variant={"outline"}
                className="p-4 border-b border-r"
                onClick={() => submitHandler(item.prompt)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        )}
        <ChatInput
          onSubmit={submitHandler}
          isLoading={fetcher.state !== "idle"}
        />
      </div>
    </div>
  );
};
