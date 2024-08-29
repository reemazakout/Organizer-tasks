import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

const Dropdown = ({ triggerComponent, items }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {/* asChild...  لجعل المستخدم يبعث أي عنصر (رابط، زر، نص) */}
        {triggerComponent && triggerComponent()}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-48 rounded-lg bg-white shadow will-change-[opacity,transform]"
          sideOffset={32}
        >
          {items &&
            Object.keys(items).map((item) => (
              <DropdownMenu.Item
                className={clsx(
                  "group cursor-pointer p-4 text-body-l leading-none outline-none data-[highlighted]:bg-light-grey",
                  {
                    "text-red": items[item].label.includes("Delete"),
                  }
                )}
                key={items[item].label}
                onClick={() => {
                  console.log(`${items[item].label} clicked`); // طباعة الرسالة في الكونسول
                  items[item].onClick();
                }}
              >
                {items[item].label}
              </DropdownMenu.Item>
            ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
