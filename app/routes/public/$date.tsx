import type { Route } from "./+types/$date";
import { getMenuByDate } from "~/lib/menu";
import { DATE_TIME_FORMAT, formatDateTime } from "~/lib/datetime";
import { parse } from "date-fns";
import { DateNavigator } from "~/components/shared/date-navigator";
import { MenuDetails } from "~/components/shared/menu-details";

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
    {
      name: "og:image",
      content: `https://bep-ai-roan.vercel.app/images/bep-ai.png`,
    },
  ];
}

export default function DatePage({ params, loaderData }: Route.ComponentProps) {
  const date = parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date());

  return (
    <div className="space-y-4">
      <DateNavigator date={date} basePath="/menu" />
      <MenuDetails
        emoji={loaderData?.emoji ?? ""}
        summary={loaderData?.summary ?? ""}
        content={loaderData?.content ?? ""}
        date={date}
      />
    </div>
  );
}
