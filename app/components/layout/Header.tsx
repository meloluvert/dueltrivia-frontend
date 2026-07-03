import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <Link href={'/'} className="text-xl font-bold">Duel (or single) Trivia</Link>
     
      
      <DropdownMenu>
  <DropdownMenuTrigger render={<Button  />}>
    <CircleUserRound color="white"/>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>João Silva</DropdownMenuLabel>
      <DropdownMenuItem>joaosilva@gmail.com</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
    
    </header>
  );
}