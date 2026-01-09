"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UserProfileFormProps {
  name: string | null;
  adress: string | null;
  phone: string | null;
  status: boolean;
  timeZone: string | null;
  name_professional?: string;
  workingDays: string[];
}

const profileSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  adress: z.string().optional(),
  phone: z.string().optional(),
  status: z.string(),
  timeZone: z.string().min(1, { message: "O time zone é obrigatório" }),
  name_professional: z.string().optional(),
  workingDays: z.array(z.string()),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({
  name,
  adress,
  phone,
  status,
  timeZone,
  name_professional,
  workingDays,
}: UserProfileFormProps) {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name || "",
      adress: adress || "",
      phone: phone || "",
      status: status ? "active" : "inactive",
      timeZone: timeZone || "",
      name_professional: name_professional || "",
      workingDays: workingDays ,
    },
  });
}
