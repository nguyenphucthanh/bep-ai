import type { FC } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ChefHat, CookingPot, Copy, Share } from "lucide-react";
import { toast } from "sonner";
import { DATE_TIME_FORMAT, formatDateTime } from "~/lib/datetime";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

export type MenuDetailProps = {
  emoji: string;
  summary: string;
  content?: string | null;
  date: Date;
};

export const MenuDetails: FC<MenuDetailProps> = ({
  date,
  emoji,
  summary,
  content,
}) => {
  const copyHandler = () => {
    navigator.clipboard.writeText(content ?? "");
    toast("Copied to clipboard!");
  };

  const shareHandler = () => {
    if (typeof navigator.share === "function") {
      navigator.share({
        title: "Thực đơn Bếp AI",
        text: `Thực đơn Bếp AI cho ngày ${formatDateTime(
          date,
          DATE_TIME_FORMAT.DATE
        )}`,
        url: `${location.origin}/menu/${formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE)}`,
      });
    } else {
      navigator.clipboard.writeText(
        `${location.origin}/menu/${formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE)}`
      );
    }
  };
  if (!content) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CookingPot />
          </EmptyMedia>
          <EmptyTitle>
            Chưa có thực đơn cho ngày{" "}
            {formatDateTime(date, DATE_TIME_FORMAT.DATE)}
          </EmptyTitle>
          <EmptyDescription>
            Bạn chưa có thực đơn cụ thể cho ngày này. Bắt đầu chat để tạo menu
            nhé!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link
              to={`/${formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE)}/chat`}
            >
              Bắt đầu chat
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }
  return (
    <div className="space-y-4">
      <h3 className="text-5xl text-center">{emoji}</h3>
      <h1 className="text-3xl font-extrabold text-center max-w-3xl mx-auto">
        {summary}
      </h1>
      <div className="leading-loose prose pb-10 mx-auto">
        <Markdown>{content}</Markdown>
      </div>
      <div className="text-center fixed z-10 bottom-0 left-0 right-0 p-2 bg-gradient-to-b from-white/0 to-white flex items-center gap-2 justify-center">
        <Button asChild className="shadow-xl" size={"lg"} variant={"outline"}>
          <Link to={`/${formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE)}/chat`}>
            <ChefHat /> Chat Bếp AI
          </Link>
        </Button>
        <Button
          className="shadow-xl"
          size={"lg"}
          onClick={copyHandler}
          variant={"outline"}
        >
          <Copy /> Copy
        </Button>
        <Button
          className="shadow-xl"
          size={"lg"}
          onClick={shareHandler}
          variant={"outline"}
        >
          <Share /> Chia sẻ
        </Button>
      </div>
    </div>
  );
};
