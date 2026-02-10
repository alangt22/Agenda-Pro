"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Prisma } from ".prisma/client/default.js";
import { ButtonPickerMonth } from "./button-date-month";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";

export type AppointmentWithService = Prisma.AppoitmentsGetPayload<{
  include: {
    service: true;
  };
}>;
export function ListHistory() {
  const seachParams = useSearchParams();
  const date = seachParams.get("date");

  const { data, isLoading } = useQuery({
    queryKey: ["get-month-appointments", date],
    enabled: !!date,
    queryFn: async () => {
      let activeDate = date;

      if (!activeDate) {
        const today = format(new Date(), "yyyy-MM");
        activeDate = today;
      }

      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/month-appointments?date=${activeDate}`;

      const response = await fetch(url);

      const json = (await response.json()) as AppointmentWithService[];

      console.log(json);

      if (!response.ok) {
        return [];
      }

      return json;
    },
    staleTime: 20000,
    refetchInterval: 60000,
  });

  const total = data?.reduce((acc, appointment) => { 
      return acc + appointment.service.price;
  }, 0);

  return (
    <div>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">
            Histórico de Agendamento
          </CardTitle>
          <ButtonPickerMonth />
        </CardHeader>

        <CardContent>
          <div className="mt-4">
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">
                      Data do agendamento
                    </th>
                    <th className="px-4 py-2 border-b text-left">
                      Nome do cliente
                    </th>
                    <th className="px-4 py-2 border-b text-right">Valor</th>
                  </tr>
                </thead>

                <tbody>
                  {data?.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="px-4 py-2 border-b">
                        {new Intl.DateTimeFormat("pt-BR", {
                          timeZone: "UTC",
                          year: "numeric",
                          month: "numeric",
                          day: "2-digit",
                        }).format(new Date(appointment.appointmentDate))}
                      </td>
                      <td className="px-4 py-2 border-b">{appointment.name}</td>
                      <td className="px-4 py-2 border-b text-right">
                        {formatCurrency(appointment.service.price / 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={2} className="px-4 py-2 border-b text-left font-bold">
                      Total
                    </td>
                    <td className="px-4 py-2 border-b text-right">
                      {formatCurrency((total || 0) / 100)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
