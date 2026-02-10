"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function ButtonPickerMonth() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM"),
  );

  function handleChangeDate(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedDate(event.target.value);
    const url = new URL(window.location.href);

    url.searchParams.set("date", event.target.value);

    router.push(url.toString());
  }

  useEffect(() => {
    const url = new URL(window.location.href);

    if (!url.searchParams.get("date")) {
      const currentMonth = format(new Date(), "yyyy-MM");
      url.searchParams.set("date", currentMonth);
      router.replace(url.toString());
    }
  }, [router]);

  return (
    <input
      type="month"
      id="start"
      className="border-2 px-2 py-1 rounded-md text-sm md:text-base"
      value={selectedDate}
      onChange={handleChangeDate}
    />
  );
}
