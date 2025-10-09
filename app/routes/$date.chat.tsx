import { parse } from "date-fns";
import type { Route } from "./+types/$date.chat";
import { DATE_TIME_FORMAT, formatDateTime } from "~/lib/datetime";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChatWindow } from "~/components/shared/chat/chat-window";
import aiClient, { systemCookPrompt } from "~/lib/ai";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import Markdown from "react-markdown";
import { Check, Copy, Share } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { toast } from "sonner";
import {
  createMenuByDate,
  deleteMenuByDate,
  getMenuByDate,
  updateMenuByDate,
} from "~/lib/menu";
import { DateNavigator } from "~/components/shared/date-navigator";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const date = parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date());
  let menu = await getMenuByDate(date);
  if (!menu) {
    await createMenuByDate(date);
    menu = await getMenuByDate(date);
  }
  return menu;
}

export async function action({ request }: Route.ActionArgs) {
  // Server side
  const data = await request.json();
  const messages = data.messages ?? [];
  const response = await aiClient.responses.create({
    model: "gpt-5-mini",
    input: [{ role: "system", content: systemCookPrompt }, ...messages],
  });

  const aiResponse = {
    role: "assistant",
    content: response.output_text,
  };

  return [...messages, aiResponse];
}

export async function clientAction({
  serverAction,
  params,
  request,
}: Route.ClientActionArgs) {
  const requestMethod = request.method.toLowerCase();
  const date = parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date());
  if (requestMethod === "delete") {
    await deleteMenuByDate(date);
    return [];
  }
  const newMessages = await serverAction();
  await updateMenuByDate(date, {
    chatMessages: newMessages,
  });

  return newMessages;
}

export default function DatePage({
  params,
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const date = parse(params.date, DATE_TIME_FORMAT.ISO_DATE, new Date());
  const messages = actionData ?? loaderData?.chatMessages ?? [];
  const copyHandler = () => {
    navigator.clipboard.writeText(loaderData?.menu?.content ?? "");
    toast("Copied to clipboard");
  };
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
    <div>
      <DateNavigator date={date} pathSuffix="chat" />
      <div className="text-center my-4">
        {loaderData?.menu?.content && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="md:hidden">
                <Check />
                Xem thực đơn đã chốt
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-3xl">
                  {loaderData.menu.emoji}
                </DrawerTitle>
                <DrawerDescription className="text-xl font-extrabold text-neutral-700">
                  {loaderData.menu.summary}
                </DrawerDescription>
              </DrawerHeader>
              <div className="leading-loose p-4">
                <ScrollArea className="h-[30vh] text-left" type="always">
                  <div className="prose">
                    <Markdown>{loaderData.menu.content}</Markdown>
                  </div>
                </ScrollArea>
              </div>
              <DrawerFooter>
                <Button onClick={copyHandler} variant={"outline"}>
                  <Copy /> Copy
                </Button>
                <Button onClick={shareHandler} variant={"outline"}>
                  <Share /> Share
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost">Đóng</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-5 mt-4">
        <div className="md:col-span-3">
          <ChatWindow
            action={`/${formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE)}/chat`}
            messages={messages}
          />
        </div>
        <div className="md:col-span-2 hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Thực đơn</CardTitle>
              <CardDescription>
                {formatDateTime(date, DATE_TIME_FORMAT.DATE)}
              </CardDescription>
              {loaderData?.menu?.content && (
                <div className="flex items-center gap-2">
                  <Button variant={"outline"} onClick={copyHandler}>
                    <Copy /> Copy
                  </Button>
                  <Button variant={"outline"} onClick={shareHandler}>
                    <Share /> Share
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p>
                {loaderData?.menu?.summary ? (
                  <div className="space-y-4">
                    <div className="text-xl font-extrabold">
                      {loaderData.menu.emoji} {loaderData.menu.summary}
                    </div>
                    <ScrollArea className="h-[60vh]" type="always">
                      <div className="leading-loose prose">
                        <Markdown>{loaderData.menu.content}</Markdown>
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant={"icon"}>🧑‍🍳</EmptyMedia>
                      <EmptyTitle>Chưa chốt menu</EmptyTitle>
                    </EmptyHeader>
                    <EmptyContent>
                      <p>Chưa có menu cụ thể. Hãy chat để bắt đầu!</p>
                    </EmptyContent>
                  </Empty>
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
