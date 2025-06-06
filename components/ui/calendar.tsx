"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { cn } from "@/lib/utils";
import { useState } from "react";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(Number(event.target.value));
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(event.target.value));
    };

    const selectedDate = new Date(selectedYear, selectedMonth);

    return (
        <div className="relative">
            {/* Month and Year Select Dropdowns */}
            <div className="flex justify-center space-x-4 mt-3">
                <div className="relative">
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="border rounded-md p-2 appearance-none bg-white"
                    >
                        {Array.from({ length: 12 }, (_, index) => (
                            <option key={index} value={index}>
                                {new Date(0, index).toLocaleString("default", { month: "long" })}
                            </option>
                        ))}
                    </select>

                    {/* Custom Icon */}
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </span>
                </div>
                <div className="relative">
                    <select
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="border rounded-md p-2 pr-8 appearance-none bg-white"
                    >
                        {Array.from({ length: 50 }, (_, index) => (
                            <option key={index} value={2025 - index}>
                                {2025 - index}
                            </option>
                        ))}
                    </select>

                    {/* Custom Icon */}
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </span>
                </div>
            </div>

            {/* DayPicker Component */}
            <DayPicker
                animate
                showOutsideDays={showOutsideDays}
                month={selectedDate} // Set the selected month and year
                className={cn("p-3", className)}
                navLayout="around"
                classNames={{
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
                    PreviousMonthButton: ({ ...props }) => (
                        <button {...props}>
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    ),
                    NextMonthButton: ({ ...props }) => (
                        <button {...props}>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    ),
                }}
                {...props}
            />
        </div>
    );
}

Calendar.displayName = "Calendar";

export { Calendar };

