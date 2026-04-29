import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeRemaining(dateStr: string, timeStr?: string): string {
  if (!dateStr) return "";

  const now = new Date();
  const targetDate = new Date(dateStr);

  if (timeStr) {
    const [time, period] = timeStr.trim().split(/\s+/);
    if (time && period) {
      const parts = time.split(":").map(Number);
      let hours = parts[0];
      const minutes = parts[1];
      if (period === "م" || period === "PM") {
        if (hours !== 12) hours += 12;
      } else if (period === "ص" || period === "AM") {
        if (hours === 12) hours = 0;
      }
      targetDate.setHours(hours, minutes || 0, 0, 0);
    }
  }

  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) return "انتهت الجلسة";

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `باقي ${diffDays} يوم`;
  if (diffHours > 0) return `باقي ${diffHours} ساعة`;
  return `باقي ${diffMins} دقيقة`;
}

export const formatArabicMonthYear = (memberSince: string): string => {
  const parsedDate = new Date(memberSince);
  if (Number.isNaN(parsedDate.getTime())) return memberSince;
  return new Intl.DateTimeFormat("ar-EG-u-ca-gregory", {
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};




export const getMonthYearInArabic = (date: string) => {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat("ar-Eg", {
    month: "long",
    year: "numeric",
  }).format(dateObj);
}