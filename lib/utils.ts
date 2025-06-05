import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"

import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat);

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatMyDate(date: Date | dayjs.Dayjs | string, format: string = "MMMM DD, YYYY"): string {
    if (typeof date === "string") {
        date = dayjs(date);
    } else if (!dayjs.isDayjs(date)) {
        date = dayjs(date);
    }

    return date.format(format);
}