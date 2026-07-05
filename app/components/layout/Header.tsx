"use client";
import { CircleUserRound, Trash, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Header() {
  const { user, signOut, deleteUser } = useAuth();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <header className="bg-blue-800 text-white p-4 flex items-center justify-between">
      <Link href={'/'} className="text-2xl font-bold">Duel (or single) Trivia</Link>

      {user ? (
        <>

          <DropdownMenu>
            <DropdownMenuTrigger className="text-white hover:bg-blue-700" >
              <CircleUserRound />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>

                <DropdownMenuItem
                  className=" bg-red-500 "
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Excluir conta
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Coloquei separado, pois quando abria o modal de confirmação estava  */}
          <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja excluir sua conta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação é permanente. Todos os seus dados serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={async () => {
                    try {
                      await deleteUser()
                      toast.success("Conta excluída com sucesso!")
                    } catch (error) {
                      toast.error("Erro ao excluir conta")
                    }
                  }
                  }
                >
                  Excluir conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <Link href="/login" className="text-white hover:text-gray-400">Login</Link>
      )}
    </header>
  );
}