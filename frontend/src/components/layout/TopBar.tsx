import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Topbar() {
  return (
    <header className="h-16 border-b px-6 bg-background flex items-center justify-between">
      <h1 className="text-lg font-semibold">Welcome</h1>
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </header>
  );
}
