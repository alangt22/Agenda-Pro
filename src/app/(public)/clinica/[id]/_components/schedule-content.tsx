"use client"
import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import imgTeste from '../../../../../../public/foto1.png'
import { MapPin } from "lucide-react"
import { Prisma } from "@prisma/client"
import {useAppoitmentForm, AppointmentFormData} from './schedule-form'
import { Button } from "@/components/ui/button"
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {formatPhone} from '@/utils/formatPhone'
import { DateTimePicker } from "./date-picker"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
 } from "@/components/ui/select"
import { ScheduleTimeList } from "./schedule-time-list"
import { createNewAppointment } from "../_actions/create-appointments"
import { toast } from "sonner"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true,
        services: true
    }
}>

interface ScheduleContentProps{
    clinic: UserWithServiceAndSubscription
}

export interface TimeSlot{
    time: string;
    available: boolean;
}

export function ScheduleContent({clinic}: ScheduleContentProps) {

    const form = useAppoitmentForm()
    const { watch } = form

    const selectedDAte = watch("date")
    const selectedServiceId = watch("serviceId")

    const [selectedTime, setSelectedTime] = useState("")
    const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    // quais os horarios bloqueados
    const [blockedTimes, setBlockedTimes] = useState<string[]>([])


    // funçao que buscsa os horarios bloqueados (via Fetch HTTP)
    const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
        setLoadingSlots(true)
        try {
            const dateString = date.toISOString().split("T")[0]
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`)

            const json = await response.json()
            setLoadingSlots(false)

            return json // retorna um array com os horarios ja preenchidos do dia e da clinica especifica

            
        } catch (error) {
            console.log(error)
            setLoadingSlots(false)
            return []
        }
    }, [clinic.id])

    useEffect(() => {
        if(selectedDAte){
            fetchBlockedTimes(selectedDAte).then((blocked) => {
                setBlockedTimes(blocked)

                const times = clinic.times || []

                const finalSlot = times.map((time) => ({
                    time: time,
                    available: !blocked.includes(time)
                }))

                setAvailableTimeSlots(finalSlot)

                const stillAvailable = finalSlot.find(
                    (slot) => slot.time === selectedTime && slot.available
                )
                if(!stillAvailable){
                    setSelectedTime("")
                }
            })
        }

    }, [selectedDAte, clinic.times, fetchBlockedTimes, selectedTime])

    async function handleRegisterAppointment(formData: AppointmentFormData) {
        if(!selectedTime){
            return
        }

        const response = await createNewAppointment({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            time: selectedTime,
            date: formData.date,
            serviceId: formData.serviceId,
            clinicId: clinic.id 
        })
        if(response.error){
            toast.error(response.error)
            return
        }

        toast.success(
            <div>
                <a target='_blank' href={`https://wa.me/55${clinic?.phone?.replace(/\D/g, '')}?text=Olá!%0A%0ADesejo confirmar o meu agendamento.`}>
                Confirme seu agendamento aqui
                </a>

            </div>,
            {
              duration: Infinity, // Impede que o toast desapareça automaticamente
              closeButton: true, // Adiciona um botão de fechamento
              position: 'top-right', // Define a posição do toast
            }
          );
          
          
          
          
        form.reset()
        setSelectedTime("")
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-32 bg-emerald-500"/>

            <section className="container mx-auto px-4 -mt-16">
                <div className="max-w-2xl mx-auto">
                    <article className="flex flex-col items-center">
                            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8">
                                <Image
                                    src={clinic.image ? clinic.image : imgTeste}
                                    alt="Foto da clinica"
                                    className="object-cover"
                                    fill
                                />
                            </div>

                            <h1 className="text-2xl font-bold mb-2">{clinic.name}</h1>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-5 h-5"/>
                                <span>{clinic.adress ? clinic.adress : "Endereço não informado"}</span>
                            </div>
                    </article>
                </div>
            </section>

        <section className="max-w-2xl mx-auto w-full mt-6 mb-16">
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(handleRegisterAppointment)}
                    className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={ ({field}) => (
                            <FormItem className="my-2">
                                <FormLabel className="font-semibold">Nome completo:</FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder="Digite seu nome completo..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={ ({field}) => (
                            <FormItem className="my-2">
                                <FormLabel className="font-semibold">Email:</FormLabel>
                                <FormControl>
                                    <Input
                                        id="email"
                                        placeholder="Digite seu email..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={ ({field}) => (
                            <FormItem className="my-2">
                                <FormLabel className="font-semibold">Telefone:</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="phone"
                                        placeholder="(XX) XXXXX-XXXX"
                                        onChange={(e) => {
                                            const formatedValue = formatPhone(e.target.value)
                                            field.onChange(formatedValue)
                                        }}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={ ({field}) => (
                            <FormItem className="flex items-center gap-2 space-y-1">
                                <FormLabel className="font-semibold">Data do agendamento:</FormLabel>
                                <FormControl>   
                                    <DateTimePicker 
                                        initialDate={new Date()}
                                        className="w-full rounded border p-2"
                                        onChange={(date) => {
                                            if(date) {
                                                field.onChange(date)
                                                setSelectedTime("")
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="serviceId"
                        render={ ({field}) => (
                            <FormItem className="">
                                <FormLabel className="font-semibold">Selecione o serviço:</FormLabel>
                                <FormControl>   
                                    <Select onValueChange={(value) => {
                                        field.onChange(value)
                                        setSelectedTime("")
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um serviço"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clinic.services.map((service) => (
                                                <SelectItem key={service.id} value={service.id}>
                                                    {service.name} ( {Math.floor(service.duration / 60)}h {service.duration % 60}min )
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {selectedServiceId && (
                        <div className="space-y-2">
                            <Label className="font-semibold">Horários disponíveis:</Label>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                {loadingSlots ? (
                                    <p>Carregando horários...</p>
                                ): availableTimeSlots.length === 0 ? (
                                    <p>Nenhum horário disponivel</p>
                                ) : (
                                    <ScheduleTimeList 
                                        onSelectTime={(time) => setSelectedTime(time)}
                                        clinicTimes={clinic.times}
                                        blockedTimes={blockedTimes}
                                        availableTimeSlots={availableTimeSlots}
                                        selectedTime={selectedTime}
                                        selecedDate={selectedDAte}
                                        requiredSlots={
                                            clinic.services.find(servive => servive.id === selectedServiceId) ? Math.ceil(clinic.services.find(service =>
                                            service.id === selectedServiceId)!.duration / 30) : 1
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {clinic.status ? (
                        <Button
                            type="submit"
                            className=" w-full bg-emerald-500 hover:bg-emerald-400"
                            disabled={!watch("name") || !watch("email") || !watch("phone") || !watch("date")}
                        >
                            Realizar agendamento
                        </Button>
                    ) : (
                        <p className="bg-red-500 text-white text-center px-4 py-2 rounded-md">
                            A clinica esta fechada nesse momento
                        </p>
                    )}
                </form>
            </Form>
        </section>
            
        </div>
    )
}