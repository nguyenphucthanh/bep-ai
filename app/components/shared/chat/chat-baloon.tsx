import { cx } from "class-variance-authority";
import { Copy, Save } from "lucide-react";
import { type FC } from "react";
import Markdown from "react-markdown";
import { useFetcher, useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

export type ChatBaloonProps = {
  responseRole: "user" | "assistant" | string;
  content: string;
  isResponding?: boolean;
};

export const ChatBaloon: FC<ChatBaloonProps> = ({
  responseRole,
  content,
  isResponding,
}) => {
  const params = useParams();
  const fetcher = useFetcher();
  const copyHandler = () => {
    navigator.clipboard.writeText(content ?? "");
    toast("Copied to clipboard");
  };

  const saveMenuHandler = async (content: string) => {
    await fetcher.submit(
      {
        content,
      },
      {
        method: "post",
        encType: "application/json",
        action: `/${params.date}`,
      }
    );
  };

  return (
    <div
      className={cx(
        "flex items-center text-sm md:text-base",
        responseRole === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cx(
          "p-4 py-2 rounded-lg group",
          responseRole === "user"
            ? "bg-blue-500 text-white  max-w-[70%]"
            : "bg-neutral-50  w-full"
        )}
      >
        {isResponding ? (
          <div className="flex flex-col gap-2">
            <div className="text-sm text-neutral-500">Thinking...</div>
            <div className="bg-gray-100 animate-pulse h-4 w-24"></div>
            <div className="bg-gray-100 animate-pulse h-4 w-16"></div>
          </div>
        ) : (
          <>
            <div className="leading-loose">
              {responseRole === "user" ? (
                <pre className="font-sans whitespace-break-spaces max-w-full">
                  {content}
                </pre>
              ) : (
                <div className="prose">
                  <Markdown>{content}</Markdown>
                </div>
              )}
            </div>
            {responseRole === "assistant" && (
              <div className="flex gap-2 justify-end mt-4 opacity-50 group-hover:opacity-100">
                <Button
                  variant={"default"}
                  onClick={() => saveMenuHandler(content)}
                  disabled={fetcher.state === "submitting"}
                  size={"sm"}
                >
                  {fetcher.state === "submitting" ? <Spinner /> : <Save />}
                  Save
                </Button>
                <Button variant={"outline"} onClick={copyHandler} size={"sm"}>
                  <Copy /> Copy
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
