import { addDays } from "date-fns";
import type { FC } from "react";
import { formatDateTime, DATE_TIME_FORMAT } from "~/lib/datetime";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
export type DateNavigatorProps = {
  basePath?: string;
  pathSuffix?: string;
  date: Date;
};

export const DateNavigator: FC<DateNavigatorProps> = ({
  basePath = "",
  pathSuffix = "",
  date,
}) => {
  const previewDate = addDays(date, -1);
  const nextDate = addDays(date, 1);
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center gap-4">
      <Button asChild variant={"outline"}>
        <Link
          to={`${basePath}/${formatDateTime(previewDate, DATE_TIME_FORMAT.ISO_DATE)}/${pathSuffix ?? ""}`}
        >
          <ChevronLeft />
        </Link>
      </Button>
      <div className="">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-2 text-xl md:text-3xl font-medium">
              <CalendarIcon />
              {formatDateTime(date, DATE_TIME_FORMAT.DATE)}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  navigate(
                    `${basePath}/${formatDateTime(selectedDate, DATE_TIME_FORMAT.ISO_DATE)}/${pathSuffix ?? ""}`
                  );
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button asChild variant={"outline"}>
        <Link
          to={`${basePath}/${formatDateTime(nextDate, DATE_TIME_FORMAT.ISO_DATE)}/${pathSuffix ?? ""}`}
        >
          <ChevronRight />
        </Link>
      </Button>
    </div>
  );
};
