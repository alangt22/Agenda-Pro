"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import imgTeste from "../../../../../../public/foto1.png";
import { Calendar, Clock, Loader, MapPin, Phone, User, User2 } from "lucide-react";
import { Prisma } from "@prisma/client";
import { useAppoitmentForm, AppointmentFormData } from "./schedule-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatPhone } from "@/utils/formatPhone";
import { DateTimePicker } from "./date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScheduleTimeList } from "./schedule-time-list";
import { createNewAppointment } from "../_actions/create-appointments";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaWhatsapp } from "react-icons/fa";

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
    services: true;
  };
}>;

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppoitmentForm();
  const { watch } = form;

  const selectedDAte = watch("date");
  const selectedServiceId = watch("serviceId");
 const [isDialogOpen, setIsDialogOpen] = useState(false)
 const [appointmentData, setAppointmentData] = useState<any>(null)
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // quais os horarios bloqueados
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // funçao que buscsa os horarios bloqueados (via Fetch HTTP)
  const fetchBlockedTimes = useCallback(
    async (date: Date): Promise<string[]> => {
      setLoadingSlots(true);
      try {
        const dateString = date.toISOString().split("T")[0];
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`
        );

        const json = await response.json();
        setLoadingSlots(false);

        return json; // retorna um array com os horarios ja preenchidos do dia e da clinica especifica
      } catch (error) {
        setLoadingSlots(false);
        return [];
      }
    },
    [clinic.id]
  );

  useEffect(() => {
    if (selectedDAte) {
      fetchBlockedTimes(selectedDAte).then((blocked) => {
        setBlockedTimes(blocked);

        const times = clinic.times || [];

        const finalSlot = times.map((time) => ({
          time: time,
          available: !blocked.includes(time),
        }));

        setAvailableTimeSlots(finalSlot);

        const stillAvailable = finalSlot.find(
          (slot) => slot.time === selectedTime && slot.available
        );
        if (!stillAvailable) {
          setSelectedTime("");
        }
      });
    }
  }, [selectedDAte, clinic.times, fetchBlockedTimes, selectedTime]);

  async function handleRegisterAppointment(formData: AppointmentFormData) {
    setIsLoading(true);
    if (!selectedTime) {
      return;
    }

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: selectedTime,
      date: formData.date,
      serviceId: formData.serviceId,
      clinicId: clinic.id,
      name_professional: clinic.name_professional ?? "",
    });
    if (response.error) {
      toast.error(response.error);
      return;
    }
        // 👉 Salva os dados para exibir no dialog
    setAppointmentData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: selectedTime,
      date: formData.date,
      service: clinic.services.find((s) => s.id === formData.serviceId)?.name,
      name_professional: clinic.name_professional ?? "",
      clinicName: clinic.name,
    })

    // 👉 Abre o modal
    setIsDialogOpen(true)

   /*  toast.success(
      <div>
        <a
          target="_blank"
          href={`https://wa.me/+55${clinic.phone?.replace(
            /\D/g,
            ""
          )}?text=Olá!%0A%0ADesejo confirmar o meu agendamento.`}
        >
          Confirme seu agendamento aqui
        </a>
      </div>,
      {
        duration: Infinity,
        closeButton: true,
        position: "top-right",
      }
    );
 */
    toast.success("Agendamento realizado com sucesso!",
      { duration: 5000, position: "top-right", style:{
        background: '#22c55e',
        color: 'white',
      } }
    );
    form.reset();
    setSelectedTime("");
    setIsLoading(false);
  }

  // dias bloqueados
  const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const allowedDays = clinic.workingDays.map(
    (day) => dayMap[day.toLowerCase()]
  );

    const clinicBlockedDatesForPicker: (string | Date)[] = (clinic as any).blockedDates
    ? (clinic as any).blockedDates.map((d: Date | string) => (typeof d === "string" ? d : d.toISOString()))
    : []
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-emerald-500" />

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
              <MapPin className="w-5 h-5" />
              <span>
                {clinic.adress ? clinic.adress : "Endereço não informado"}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <User2 className="w-5 h-5" />
              <span>{clinic.name_professional}</span>
            </div>
          </article>
        </div>
      </section>

      <section className="max-w-2xl mx-auto w-full mt-6 mb-16">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterAppointment)}
            className="mx-2 space-y-6 bg-zinc-100 p-6 border rounded-md shadow-sm"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Nome completo:
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Digite seu nome completo..."
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Email:</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="Digite seu email..."
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Telefone:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="phone"
                      placeholder="(XX) XXXXX-XXXX"
                      className="bg-white"
                      onChange={(e) => {
                        const formatedValue = formatPhone(e.target.value);
                        field.onChange(formatedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-1">
                  <FormLabel className="font-semibold">
                    Data do agendamento:
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker
                      initialDate={new Date()}
                      className="w-full rounded border p-2"
                      allowedDays={allowedDays}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date);
                          setSelectedTime("");
                        }
                      }}
                      blockedDates={clinicBlockedDatesForPicker}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="font-semibold">
                    Selecione o serviço:
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTime("");
                      }}
                      
                    >
                      
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.services.map((service) => (
                          <SelectItem key={service.id} value={service.id} className="bg-white">
                            {service.name} ( {Math.floor(service.duration / 60)}
                            h {service.duration % 60}min )
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedServiceId && (
              <div className="space-y-2">
                <Label className="font-semibold">Horários disponíveis:</Label>
                <div className="flex gap-5">
                  <div>
                    <div className="border-red-600 border h-8 w-12 rounded-md bg-zinc-100 mt-8"></div>
                    <span className="text-[12px] font-bold">Ocupado</span>
                  </div>
                  <div>
                    <div className="border-zinc-200 border h-8 w-12 rounded-md bg-white mt-8"></div>
                    <span className="text-[12px] font-bold">Disponivel</span>
                  </div>
                  <div>
                    <div className="border-green-600 border h-8 w-12 rounded-md bg-white mt-8"></div>
                    <span className="text-[12px] font-bold">Selecionado</span>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  {loadingSlots ? (
                    <p>Carregando horários...</p>
                  ) : availableTimeSlots.length === 0 ? (
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
                        clinic.services.find(
                          (servive) => servive.id === selectedServiceId
                        )
                          ? Math.ceil(
                              clinic.services.find(
                                (service) => service.id === selectedServiceId
                              )!.duration / 30
                            )
                          : 1
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
                disabled={
                  (isLoading && !watch("name")) ||
                  !watch("email") ||
                  !watch("phone") ||
                  !watch("date") ||
                  !selectedTime
                }
              >
                {isLoading ? (
                  <span className="w-24 flex items-center justify-center">
                    <Loader className="animate-spin" />
                  </span>
                ) : (
                  "Realizar agendamento"
                )}
              </Button>
            ) : (
              <p className="bg-red-500 text-white text-center px-4 py-2 rounded-md">
                A clinica esta fechada nesse momento
              </p>
            )}
          </form>
        </Form>
      </section>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-500/10 rounded-full">
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl">Agendamento Confirmado!</DialogTitle>
            <DialogDescription className="text-center">Confira os detalhes do seu agendamento</DialogDescription>
          </DialogHeader>

          {appointmentData && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Nome</p>
                    <p className="text-sm font-medium truncate">{appointmentData.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Local</p>
                    <p className="text-sm font-medium">{appointmentData.clinicName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Serviço</p>
                    <p className="text-sm font-medium">{appointmentData.service}</p>
                  </div>
                </div>

                {appointmentData.barber && (
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">Barbeiro</p>
                      <p className="text-sm font-medium">{appointmentData.barber}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Data</p>
                      <p className="text-sm font-medium">{appointmentData.date.toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Horário</p>
                      <p className="text-sm font-medium">{appointmentData.time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Phone className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Contato</p>
                    <p className="text-sm font-medium">{clinic.phone}</p>
                  </div>
                </div>
              </div>

              <a
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://wa.me/+55${clinic.phone?.replace(
                  /\D/g,
                  "",
                )}?text=Olá ${clinic.name_professional}!%0A%0ADesejo confirmar o meu agendamento.`}
              >
                <FaWhatsapp className="w-5 h-5" />
                Confirmar via WhatsApp
              </a>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="w-full">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
