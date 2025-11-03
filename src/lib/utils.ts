import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "receive":
      return "bg-blue-100 hover:bg-blue-200 text-center text-blue-800 border border-blue-200";
    case "ready":
      return "bg-green-100 hover:bg-green-200 text-green-800 border border-green-200";
    case "preparing":
      return "bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200";
    case "served":
      return "bg-teal-100 hover:bg-teal-200 text-teal-800 border border-teal-200";
    case "pending":
      return "bg-lime-100 hover:bg-lime-200 text-lime-800 border border-lime-200";
    default:
      return "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200";
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

// Get today's date in YYYY-MM-DD format for min attribute
export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Convert date from input format to display format
export const convertToDisplayDate = (dateStr: string) => {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    }
  } catch {
    return dateStr;
  }
  return dateStr;
};
