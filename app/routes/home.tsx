import { addDays } from "date-fns";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "~/components/ui/item";
import { DATE_TIME_FORMAT, formatDateTime } from "~/lib/datetime";
import { ChefHat, ChevronRight } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

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
  const dates = Array.from({ length: 7 }, (_, i) => {
    return addDays(today, i);
  });
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };
  const getMenu = (date: string) => {
    return loaderData.find((data) => data.dateString === date);
  };
  const todayMenu = loaderData.find(
    (menu) =>
      menu.dateString === formatDateTime(today, DATE_TIME_FORMAT.ISO_DATE)
  );

  return (
    <div>
      <h1 className="text-3xl font-medium">Hôm nay</h1>
      <h2 className="text-xl">
        {formatDateTime(today, DATE_TIME_FORMAT.DATE)}
      </h2>
      <Alert className="mt-4">
        <ChefHat />
        {todayMenu?.menu?.content ? (
          <>
            <AlertTitle>
              Thực đơn ngày hôm nay là{" "}
              <strong className="font-bold">{todayMenu?.menu?.summary}</strong>
            </AlertTitle>
            <AlertDescription>
              <Button asChild variant={"link"}>
                <Link to={`/${todayMenu.dateString}`}>
                  Xem thực đơn <ChevronRight />
                </Link>
              </Button>
            </AlertDescription>
          </>
        ) : (
          <>
            <AlertTitle>Hôm nay chưa có thực đơn</AlertTitle>
            <AlertDescription>
              <Button asChild>
                <Link
                  to={`/${formatDateTime(today, DATE_TIME_FORMAT.ISO_DATE)}`}
                >
                  Vào chat với Bếp AI
                </Link>
              </Button>
            </AlertDescription>
          </>
        )}
      </Alert>
      <h3 className="text-2xl mt-4">Lịch 7 ngày</h3>
      <div className="space-y-4 mt-4">
        {dates.map((date) => {
          const menu = getMenu(formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE));
          return (
            <Item
              key={date.getTime()}
              variant={menu?.menu?.summary ? "outline" : "muted"}
              asChild
            >
              <Link
                to={`/${formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE)}${menu?.menu?.content ? "" : "/chat"}`}
              >
                <ItemContent>
                  <ItemTitle className="font-medium text-lg">
                    {formatDateTime(date, DATE_TIME_FORMAT.DATE)}
                    {isToday(date) && <Badge>Hôm nay</Badge>}
                  </ItemTitle>
                  <ItemDescription>
                    {menu?.menu?.emoji ? (
                      <span className="mr-2">{menu?.menu?.emoji}</span>
                    ) : (
                      ""
                    )}
                    {menu?.menu?.summary ?? "Chưa có thực đơn"}
                  </ItemDescription>
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
