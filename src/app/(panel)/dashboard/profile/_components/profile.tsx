"use client";
import { useState } from "react";
import { ProfileFormData, useProfileForm } from "./profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Loader } from "lucide-react";

import imgTest from "../../../../../../public/foto1.png";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { updateProfile } from "../_actions/update-profile";
import { toast } from "sonner";
import { formatPhone } from "@/utils/formatPhone";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AvatarProfile } from "./profile-avatar";
import { DaysSelector } from "./day-selector";
import { BlockedDatesSelector } from "./blocked-dates-selector";

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
  };
}>;

interface ProfileContentProps {
  user: UserWithSubscription;
}

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();
  const [selectedHours, setSelectedHours] = useState<string[]>(
    user.times ?? []
  );
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    user.workingDays ?? []
  );
  const [blockedDates, setBlockedDates] = useState<string[]>(
    (user.blockedDates ?? []).map((d) => {
      return d.toISOString().slice(0, 10);
    })
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const { update } = useSession();

  const form = useProfileForm({
    name: user.name,
    adress: user.adress,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone,
    name_professional: user.name_professional || "",
    workingDays: user.workingDays,
  });

  function generateTimesSlots(): string[] {
    const hours: string[] = [];
    for (let i = 8; i <= 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0");
        const minute = (j * 30).toString().padStart(2, "0");
        hours.push(`${hour}:${minute}`);
      }
    }
    return hours;
  }

  const hours = generateTimesSlots();

  function toggleHour(hour: string) {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    );
  }

  const timeZone = Intl.supportedValuesOf("timeZone").filter(
    (zone) =>
      zone.startsWith("America/Sao_Paulo") ||
      zone.startsWith("America/Fortaleza") ||
      zone.startsWith("America/Recife") ||
      zone.startsWith("America/Bahia") ||
      zone.startsWith("America/Belem") ||
      zone.startsWith("America/Manaus") ||
      zone.startsWith("America/Cuiaba") ||
      zone.startsWith("America/Boa_Vista")
  );

  const handleDaysChange = (days: string[]) => {
    setSelectedDays(days);
    form.setValue("workingDays", days);
  };

  async function onSubmit(values: ProfileFormData) {
    setIsLoading(true);

    const response = await updateProfile({
      name: values.name,
      adress: values.adress,
      phone: values.phone,
      status: values.status === "active" ? true : false,
      timeZone: values.timeZone,
      times: selectedHours || [],
      name_professional: values.name_professional || "",
      workingDays: selectedDays,
      blockedDates,
    });

    if (response.error) {
      toast.error(response.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    toast.success(response.data);
  }

  async function handleLogout() {
    setIsLogoutLoading(true);
    await signOut();
    await update();
    router.replace("/");
    setIsLogoutLoading(false);
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <AvatarProfile avatarUrl={user.image} userId={user.id} />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Nome da clinica
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome da clinica..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name_professional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        Nome do profissional
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome do profissional..."
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Endereço completo:
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o endereço da clinica..."
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
                    <FormItem>
                      <FormLabel className="font-semibold">Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="(11) 91234-5678"
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={
                            field.value /* ? "active" : "inactive" */
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status da clinica" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              ATIVO (aberto)
                            </SelectItem>
                            <SelectItem value="inactive">
                              INATIVO (fechado)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label className="font-semibold">Configurar horários</Label>
                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger asChild>
                      <Button
                        value="outline"
                        className="w-full justify-between"
                      >
                        Clique aqui para selecionar horários
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Horários</DialogTitle>
                        <DialogDescription>
                          Selecione abaixo os horários de funcionamentos
                        </DialogDescription>
                      </DialogHeader>
                      <section className="py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Clique nos horáios abaixo para marcar ou desmarcar:
                        </p>

                        <div className="grid grid-cols-5 gap-2">
                          {hours.map((hour) => (
                            <Button
                              key={hour}
                              variant="outline"
                              className={cn(
                                "h-10",
                                selectedHours.includes(hour) &&
                                  "border-2 border-emerald-500 text-primary"
                              )}
                              onClick={() => toggleHour(hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </section>
                      <Button
                        className="w-full"
                        onClick={() => setDialogIsOpen(false)}
                      >
                        Fechar modal
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Dias de Funcionamento */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Dias de Funcionamento
                  </Label>
                  <div className="rounded-lg border bg-card p-5">
                    <DaysSelector
                      selectedDays={selectedDays}
                      onChange={handleDaysChange}
                    />
                  </div>
                </div>

                {/* Datas Bloqueadas */}
                <div className="space-y-3">
                  <BlockedDatesSelector
                    initialDates={blockedDates}
                    onChange={setBlockedDates}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Selecione o fuso horário
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o seu fuso horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeZone.map((zone) => (
                              <SelectItem key={zone} value={zone}>
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="w-44 flex items-center justify-center">
                      <Loader className="animate-spin" />
                    </span>
                  ) : (
                    "Salvar alterações"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <section className="mt-4">
        <Button
          className="bg-red-500 hover:bg-red-300"
          onClick={handleLogout}
          disabled={isLogoutLoading}
        >
          {isLogoutLoading ? (
            <span className="w-24 flex items-center justify-center">
              <Loader className="animate-spin" />
            </span>
          ) : (
            "Sair da conta"
          )}
        </Button>
      </section>
    </div>
  );
}
