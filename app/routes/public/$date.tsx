import type { Route } from "./+types/$date";
import { getMenuByDate } from "~/lib/menu";
import { DATE_TIME_FORMAT, formatDateTime } from "~/lib/datetime";
import { parse } from "date-fns";
import { DateNavigator } from "~/components/shared/date-navigator";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Link } from "react-router";
import { ChefHat, CookingPot, Share } from "lucide-react";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const menu = await getMenuByDate(
    parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date())
  );

  return menu?.menu;
}

export function meta({ params, loaderData }: Route.MetaArgs) {
  const date = parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date());

  return [
    {
      title: `Thực đơn Bếp AI cho ngày ${formatDateTime(date, DATE_TIME_FORMAT.DATE)}`,
    },
    {
      name: "title",
      content: `Thực đơn Bếp AI cho ngày ${formatDateTime(date, DATE_TIME_FORMAT.DATE)}`,
    },
    {
      name: "description",
      content: `${loaderData?.emoji ?? ""} ${loaderData?.summary ?? ""}`,
    },
  ];
}

export default function DatePage({ params, loaderData }: Route.ComponentProps) {
  const date = parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date());

  const shareHandler = () => {
    if (typeof navigator.share === "function") {
      navigator.share({
        title: "Thực đơn Bếp AI",
        text: `Thực đơn Bếp AI cho ngày ${formatDateTime(
          date,
          DATE_TIME_FORMAT.DATE
        )}`,
        url: `${location.origin}/menu/${params.date}`,
      });
    } else {
      navigator.clipboard.writeText(`${location.origin}/menu/${params.date}`);
    }
  };

  return (
    <div className="space-y-4">
      <DateNavigator date={date} basePath="/menu" />
      {loaderData?.content ? (
        <>
          <h3 className="text-5xl text-center">{loaderData?.emoji}</h3>
          <h1 className="text-3xl font-extrabold text-center">
            {loaderData.summary}
          </h1>
          <div className="leading-loose prose pb-10">
            <Markdown>{loaderData.content}</Markdown>
          </div>
          <div className="text-center fixed z-10 bottom-0 left-0 right-0 p-2 bg-gradient-to-b from-white/0 to-white flex items-center gap-2 justify-center">
            <Button
              asChild
              className="shadow-xl"
              size={"lg"}
              variant={"outline"}
            >
              <Link to={`/${params.date}/chat`}>
                <ChefHat /> Chat Bếp AI
              </Link>
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
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CookingPot />
            </EmptyMedia>
            <EmptyTitle>
              Chưa có thực đơn cho ngày{" "}
              {formatDateTime(new Date(params.date), DATE_TIME_FORMAT.DATE)}
            </EmptyTitle>
            <EmptyDescription>
              Bạn chưa có thực đơn cụ thể cho ngày này. Bắt đầu chat để tạo menu
              nhé!
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to={`/${params.date}/chat`}>Bắt đầu chat</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
