import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import Task from "@/components/web/task";

export default function BoardPage() {
  return (
    <div className="flex h-full w-full flex-row justify-between gap-5 p-5">
      <Item variant={"outline"} className="flex flex-1 flex-col items-start gap-2.5 p-3">
        <ItemTitle>Открыто</ItemTitle>
        <ItemContent className="w-full gap-2.5">
          <Task></Task>
          <Task></Task>
          <Task></Task>
        </ItemContent>
      </Item>

      <Item variant={"outline"} className="flex flex-1 flex-col items-start gap-2.5 p-3">
        <ItemTitle>В работе</ItemTitle>
        <ItemContent className="w-full gap-2.5">
          <Task></Task>
          <Task></Task>
          <Task></Task>
        </ItemContent>
      </Item>

      <Item variant={"outline"} className="flex flex-1 flex-col items-start gap-2.5 p-3">
        <ItemTitle>Закрыто</ItemTitle>
        <ItemContent className="w-full gap-2.5">
          <Task></Task>
          <Task></Task>
          <Task></Task>
        </ItemContent>
      </Item>
    </div>
  );
}
