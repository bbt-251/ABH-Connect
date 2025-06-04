"use client"

import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            animate
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            endMonth={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
            navLayout="around"
            classNames={{
                // months: "flex flex-col p-4 items-between space-y-4",
                // month: "space-y-4 flex items-center flex-col",
                // caption: "relative flex items-center justify-center px-8", // Center label with space
                // caption_label: "text-sm font-medium",
                // nav: "absolute left-0 right-0 flex justify-between px-2", // Position arrows on edges
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-center",
                day_range_end: "day-range-end",
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50 bg-black",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                PreviousMonthButton: ({ ...props }) => <button {...props}><ChevronLeft className="h-4 w-4" /></button>,
                NextMonthButton: ({ ...props }) => <button {...props}><ChevronRight className="h-4 w-4" /></button>,
            }}
            {...props}
        />
    )
}

Calendar.displayName = "Calendar"

export { Calendar };

