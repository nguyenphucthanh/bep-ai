import type { Route } from "./+types/$date.index";
import { DATE_TIME_FORMAT, formatDateTime } from "~/lib/datetime";
import Markdown from "react-markdown";
import { ChefHat, CookingPot } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Link, useRouteLoaderData } from "react-router";
import { parse } from "date-fns";
import { DateNavigator } from "~/components/shared/date-navigator";

export default function DateSummary({ params }: Route.ComponentProps) {
  const date = parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date());
  const loaderData = useRouteLoaderData("date");

  return (
    <div className="space-y-4">
      <DateNavigator date={date} />
      {loaderData?.content ? (
        <>
          <h3 className="text-5xl text-center">{loaderData?.emoji}</h3>
          <h1 className="text-3xl font-extrabold text-center">
            {loaderData.summary}
          </h1>
          <div className="leading-loose pb-10">
            <Markdown>{loaderData.content}</Markdown>
          </div>
          <div className="text-center fixed z-10 bottom-0 left-0 right-0 p-2 bg-gradient-to-b from-white/0 to-white">
            <Button asChild className="shadow-xl" size={"lg"}>
              <Link to={`/${params.date}/chat`}>
                <ChefHat /> Chat Bếp AI
              </Link>
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
