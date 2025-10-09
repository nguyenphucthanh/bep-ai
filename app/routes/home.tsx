import { addDays, isBefore } from "date-fns";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemMedia,
} from "~/components/ui/item";
import { DATE_TIME_FORMAT, formatDateTime } from "~/lib/datetime";
import { ChefHat, ChevronRight, Eye, EyeClosed, Sparkle } from "lucide-react";
import { Link } from "react-router";
import {
  and,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "~/firebase";
import type { MenuByDate } from "~/types/data";
import type { Route } from "./+types/home";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cx } from "class-variance-authority";
import { useState } from "react";

export function meta() {
  return [
    { title: "Bếp AI" },
    { name: "description", content: "Welcome to Bếp AI!" },
  ];
}

export async function clientLoader() {
  const today = new Date();
  const sevenDaysAgo = addDays(today, -7);
  const sevenDaysLater = addDays(today, 7);
  const collectionRef = collection(db, "menus");
  const data = query(
    collectionRef,
    and(
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(sevenDaysLater))
    )
  );
  const snapshot = await getDocs(data);

  return snapshot.docs.map((doc) => doc.data() as unknown as MenuByDate);
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    return addDays(today, -7 + i);
  });
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };
  const isPast = (date: Date) => {
    return isBefore(date, today);
  };
  const getMenu = (date: string) => {
    return loaderData.find((data) => data.dateString === date);
  };
  const todayMenu = loaderData.find(
    (menu) =>
      menu.dateString === formatDateTime(today, DATE_TIME_FORMAT.ISO_DATE)
  );
  const [showPast, setShowPast] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-medium">Hôm nay</h1>
      <h2 className="text-xl">
        {formatDateTime(today, DATE_TIME_FORMAT.DATE)}
      </h2>
      <Item className="mt-4 shadow-lg" variant={"outline"}>
        <ItemMedia>
          <ChefHat />
        </ItemMedia>
        {todayMenu?.menu?.content ? (
          <>
            <ItemContent>
              <ItemTitle>
                <strong className="font-bold">
                  {todayMenu?.menu?.summary}
                </strong>
              </ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button asChild variant={"link"}>
                <Link to={`/${todayMenu.dateString}`}>
                  <ChevronRight />
                </Link>
              </Button>
            </ItemActions>
          </>
        ) : (
          <>
            <ItemContent>
              <ItemTitle>Hôm nay chưa có thực đơn</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button asChild title="Chat với Bếp AI">
                <Link
                  to={`/${formatDateTime(today, DATE_TIME_FORMAT.ISO_DATE)}/chat`}
                >
                  <Sparkle />
                </Link>
              </Button>
            </ItemActions>
          </>
        )}
      </Item>
      <h3 className="text-2xl mt-4 flex items-center gap-4 justify-between">
        Lịch 7 ngày
        <Button variant={"ghost"} onClick={() => setShowPast((prev) => !prev)}>
          {!showPast ? <EyeClosed /> : <Eye />} Xem 7 ngày trước
        </Button>
      </h3>
      <div className="space-y-4 mt-4">
        {dates.map((date) => {
          const menu = getMenu(formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE));
          return (
            <Item
              key={date.getTime()}
              variant={isPast(date) ? "muted" : "outline"}
              asChild
              className={cx({
                hidden: isPast(date) && !showPast,
              })}
            >
              <Link
                to={`/${formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE)}${menu?.menu?.content ? "" : "/chat"}`}
              >
                <ItemMedia className="w-20">
                  <div
                    className={cx("flex flex-col items-center gap-2", {
                      "text-red-500": date.getDay() === 0,
                      "text-blue-500": date.getDay() === 6,
                    })}
                  >
                    <div>{formatDateTime(date, "eee")}</div>
                    <div className="text-xl font-medium">
                      {formatDateTime(date, "d/M")}
                    </div>
                    {isToday(date) && <Badge>Hôm nay</Badge>}
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="font-medium">
                    {menu?.menu?.emoji ? <>{menu?.menu?.emoji} </> : ""}
                    {menu?.menu?.summary ?? "Chưa có thực đơn"}
                  </ItemTitle>
                  <ItemDescription></ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ChevronRight />
                </ItemActions>
              </Link>
            </Item>
          );
        })}
      </div>
    </div>
  );
}
