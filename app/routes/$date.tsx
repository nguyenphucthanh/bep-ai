import { Outlet } from "react-router";
import * as z from "zod";
import type { Route } from "./+types/$date";
import { getMenuByDate, updateMenuByDate } from "~/lib/menu";
import { DATE_TIME_FORMAT } from "~/lib/datetime";
import { parse } from "date-fns";
import aiClient, { summaryPrompt } from "~/lib/ai";

const menuSchema = z.object({
  emoji: z.string().optional().nullable(),
  summary: z.string().min(1),
  content: z.string().optional().nullable(),
});

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const menu = await getMenuByDate(
    parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date())
  );

  return menu?.menu;
}

export async function action({ request }: Route.ActionArgs) {
  const data = await request.json();
  const content = data.content;
  if (!content) {
    return null;
  }

  const response = await aiClient.responses.create({
    model: "gpt-3.5-turbo",
    input: summaryPrompt(content),
  });

  const parsedData = menuSchema.safeParse(JSON.parse(response.output_text));
  if (!parsedData.success) {
    throw new Error("Invalid menu data");
  }

  return { ...parsedData.data, content };
}

export async function clientAction({
  params,
  serverAction,
}: Route.ClientActionArgs) {
  const parsedMenu = await serverAction();

  if (!parsedMenu) {
    throw new Error("Invalid menu data");
  }

  const date = parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date());
  await updateMenuByDate(date, {
    menu: parsedMenu,
  });

  return parsedMenu;
}

export default function DatePage() {
  return <Outlet />;
}
