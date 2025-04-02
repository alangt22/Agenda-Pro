"use client"

import {zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod'
import {useForm} from 'react-hook-form'

const formSchema = z.object({
    name: z.string().min(1, {message: "O nome do serviço é obrigatório"}),
    price: z.string().min(1, {message: "O preço do serviço é obrigatório"}),
    hours: z.string(),
    minutes: z.string()
})

export interface UseDialogServiceFormProps{
    initialValue?:{
        name: string;
        price: string;
        hours: string;
        minutes: string;
    }
}

export type DialogServiceFormData = z.infer<typeof formSchema>

export function useDialogServiceForm({initialValue}: UseDialogServiceFormProps) {
    return useForm<DialogServiceFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValue || {
            name: "",
            price: "",
            hours: "",
            minutes: ""
        }
    })
}