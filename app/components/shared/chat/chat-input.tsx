import { ArrowUpIcon } from "lucide-react";
import { useState, type FC } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
  InputGroupText,
} from "~/components/ui/input-group";

export type ChatInputProps = {
  onSubmit: (content: string) => Promise<void>;
  isLoading: boolean;
};

export const ChatInput: FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState("");
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(content);
    setContent("");
  };
  const keyDownHandler = (e: React.KeyboardEvent) => {
    // if user hit enter without shift/control/etc... then submit form
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      onSubmit(content);
      setContent("");
    }
  };
  return (
    <form onSubmit={submitHandler}>
      <InputGroup>
        <InputGroupTextarea
          placeholder="Chat với Bếp AI 🧑‍🍳"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          name="content"
          onKeyDown={keyDownHandler}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="ml-auto">Gửi</InputGroupText>
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
            disabled={isLoading || content.trim() === ""}
            type="submit"
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};
