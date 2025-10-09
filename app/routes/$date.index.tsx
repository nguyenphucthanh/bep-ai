import type { Route } from "./+types/$date.index";
import { DATE_TIME_FORMAT } from "~/lib/datetime";
import { useRouteLoaderData } from "react-router";
import { parse } from "date-fns";
import { DateNavigator } from "~/components/shared/date-navigator";
import { MenuDetails } from "~/components/shared/menu-details";

export default function DateSummary({ params }: Route.ComponentProps) {
  const date = parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date());
  const loaderData = useRouteLoaderData("date");

  return (
    <div className="space-y-4">
      <DateNavigator date={date} />
      <MenuDetails
        emoji={loaderData.emoji}
        summary={loaderData.summary}
        content={loaderData.content}
        date={date}
      />
    </div>
  );
}
