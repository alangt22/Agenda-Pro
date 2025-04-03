"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logoImg from '../../../../public/logoAgendaPRO.png'
import { useState } from "react";
import { handleRegister } from "../_actions/login";
import { FcGoogle } from "react-icons/fc";

export function Hero() {

    const [isOpen, setIsOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    async function handleLogin(provider: "google") {
        await handleRegister(provider)
        setIsLoginModalOpen(false) // Fecha o modal após login
    }

    function handleChange(){
        setIsLoginModalOpen(true)
        setIsOpen(false)

    }


    return( 
        <section className="bg-white">
            <div className="container mx-auto px-4 pt-20 pb-4 sm:pb-0 sm:px-6 lg:px-8">
                <main className="flex items-center justify-center">
                    <article className="flex-[2] max-w-3xl space-y-8 flex flex-col justify-center">
                        <h1 className="text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight">
                            Encontre os melhores profissionais em um único local!
                        </h1>
                        <p className="text-base md:text-lg text-gray-600">
                        Somos uma plataforma dedicada a profissionais da área estética, barbearias e outros segmentos, com o objetivo de agilizar o atendimento de forma simples, organizada e eficiente.
                        </p>

                        <Button onClick={handleChange} className="bg-emerald-500 hover:bg-emerald-400 w-fit px-6 font-semibold">
                            Cadastre-se Agora
                        </Button>
                    </article>
                    {isLoginModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                            <div className="bg-white p-6 rounded-md text-center">
                                <h1 className="text-2xl font-bold mb-2">Odonto<span className="text-[#42ff7c]">PRO</span></h1>
                                <h3 className="text-lg font-semibold">Faça login ou Crie sua conta com Google</h3>
                                <div className="mt-4">
                                    <Button
                                        onClick={() => handleLogin("google")}
                                        className="w-full mb-4"
                                    >
                                        Login com Google
                                        <FcGoogle className="mr-2 w-5 h-5" />
                                    </Button>
                                </div>
                                <Button onClick={() => setIsLoginModalOpen(false)} variant="outline" className="w-full mt-4">
                                    Cancelar
                                </Button>
                            </div>
                        </div>
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
                        />
                    </div>
                </main>
            </div>
        </section>
    )
}