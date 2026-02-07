"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logoImg from "../../../../public/logoAgendaPRO.png";
import { useState } from "react";
import { handleRegister } from "../_actions/login";
import { FcGoogle } from "react-icons/fc";
import { Loader } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(provider: "google") {
    await handleRegister(provider);
    setIsLoginModalOpen(false);
  }

  function handleChange() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoginModalOpen(true);
      setIsOpen(false);
    }, 500);
  }

  return (
    <section className="bg-zinc-200 h-[500px]">
      <div className="container mx-auto px-4 mt-16 pt-15 pb-4 sm:pb-0 sm:px-6 lg:px-8">
        <main className="flex items-center justify-center">
          <article className="flex-[2] max-w-3xl space-y-8 flex flex-col justify-center">
            <h1
              className="text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight"
              data-aos="fade-right"
            >
              Encontre os melhores profissionais em um único local!
            </h1>
            <p
              className="text-base md:text-lg text-gray-600"
              data-aos="fade-left"
            >
              Somos uma plataforma dedicada a diversos segmentos, com o objetivo
              de agilizar o atendimento de forma simples, organizada e
              eficiente.
            </p>

            <Button
              onClick={handleChange}
              className="bg-emerald-500 hover:bg-emerald-400 w-44 px-6 font-semibold"
              data-aos="zoom-in"
            >
              {isLoading ? (
                <span className="w-44 flex items-center justify-center">
                  <Loader className="animate-spin" />
                </span>
              ) : (
                "Cadastre-se agora"
              )}
            </Button>
          </article>
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

          <div className="hidden lg:block">
            <Image
              src={logoImg}
              alt="Foto ilustrativa de um profissional da saúde"
              width={340}
              height={400}
              className="object-contain mb-4"
              quality={100}
              priority
              data-aos="flip-left"
              data-aos-easing="ease-out-cubic"
              data-aos-duration="2000"
            />
          </div>
        </main>
      </div>
    </section>
  );
}
