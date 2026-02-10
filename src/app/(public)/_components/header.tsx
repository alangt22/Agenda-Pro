"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogIn, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { handleRegister } from "../_actions/login";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export function Header() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // mover a page ate profissionais clicando no link
  const handleScroll = () => {
    const element = document.getElementById("profissionals");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItens = [{ href: "/", label: "Profissionais" }];

  async function handleLogin(provider: "google") {
    await handleRegister(provider);
    setIsLoginModalOpen(false);
  }

  function handleChange() {
    setIsLoginModalOpen(true);
    setIsOpen(false);
  }

  const NavLinks = () => (
    <>
      {navItens.map((item) => (
        <Button
          key={item.href}
          onClick={() => {
            setIsOpen(false);
            handleScroll();
          }}
          className="text-base text-black hover:text-green-500 bg-transparent hover:bg-transparent shadow-none"
        >
          Profissionais
        </Button>
      ))}

      {status === "loading" ? (
        <></>
      ) : session ? (
        <div className="flex flex-col md:flex-row items-center gap-4">
          {session.user?.image && (
            <div className="w-12 h-12 overflow-hidden rounded-full">
              <Image
                src={session.user.image}
                alt="Foto de Perfil"
                width={60}
                height={60}
                className="object-cover"
              />
            </div>
          )}
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-zinc-500 hover:bg-zinc-800 text-white py-1 rounded-md px-4"
          >
            Acessar Painel
          </Link>
        </div>
      ) : (
        <Button onClick={handleChange}>
          <LogIn />
          Portal da clinica
        </Button>
      )}
    </>
  );

  return (
    <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-zinc-900">
          Agenda<span className="text-[#42ff7c]">PRO</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              className="text-black hover:bg-transparent"
              variant="ghost"
              size="icon"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[240px] sm:w-[300px] z-[9999] py-10 px-7 gap-0"
          >
            <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
            <SheetHeader></SheetHeader>

            <SheetDescription>Veja nossos links</SheetDescription>

            <nav className="flex flex-col space-y-4 mt-6">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {isLoginModalOpen && (
        <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-center">
                Agenda<span className="text-[#42ff7c]">PRO</span>
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                Faça login ou crie sua conta com Google
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <Button
                onClick={() => handleLogin("google")}
                variant="outline"
                size="lg"
                className="w-full h-12 gap- bg-zinc-300 border-2 hover:bg-accent"
              >
                <FcGoogle className="w-5 h-5" />
                Continuar com Google
              </Button>

              <Button
                onClick={() => setIsLoginModalOpen(false)}
                variant="ghost"
                className="w-full bg-zinc-300"
              >
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
}
