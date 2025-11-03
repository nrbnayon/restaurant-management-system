// src/components/Modals/DayManagementModal.tsx

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DayStatus {
  isOpen: boolean;
  openingTime: string;
  openingDate: string;
  closingTime?: string;
  closingDate?: string;
}

interface DayManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (status: DayStatus) => void;
}

export default function DayManagementModal({
  isOpen,
  onClose,
  onStatusUpdate,
}: DayManagementModalProps) {
  const [dayStatus, setDayStatus] = useState<DayStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load day status from localStorage
  useEffect(() => {
    const loadDayStatus = () => {
      const savedStatus = localStorage.getItem("dayStatus");
      if (savedStatus) {
        const status = JSON.parse(savedStatus);
        setDayStatus(status);
      } else {
        // Default: Day is closed
        setDayStatus({
          isOpen: false,
          openingTime: "",
          openingDate: "",
        });
      }
      setIsLoading(false);
    };

    loadDayStatus();
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const date = now.toLocaleDateString("en-GB").split("/").reverse().join("/");
    return { time, date, timestamp: now.getTime() };
  };

  const handleToggleDay = () => {
    const { time, date, timestamp } = getCurrentDateTime();

    if (dayStatus?.isOpen) {
      // Close the day
      const updatedStatus: DayStatus = {
        ...dayStatus,
        isOpen: false,
        closingTime: time,
        closingDate: date,
      };

      // Calculate day duration
      const openingTimestamp = new Date(
        `${dayStatus.openingDate.split("/").reverse().join("-")}T${
          dayStatus.openingTime
        }`
      ).getTime();
      const durationHours = (timestamp - openingTimestamp) / (1000 * 60 * 60);

      localStorage.setItem("dayStatus", JSON.stringify(updatedStatus));
      setDayStatus(updatedStatus);
      onStatusUpdate(updatedStatus);

      // Dispatch custom event for other components
      window.dispatchEvent(new Event("dayStatusUpdate"));

      toast.success("Day Closed Successfully", {
        description: `Day closed at ${time} on ${formatDate(
          date
        )}. Duration: ${durationHours.toFixed(1)} hours`,
      });

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      // Open the day
      const updatedStatus: DayStatus = {
        isOpen: true,
        openingTime: time,
        openingDate: date,
      };

      localStorage.setItem("dayStatus", JSON.stringify(updatedStatus));
      setDayStatus(updatedStatus);
      onStatusUpdate(updatedStatus);

      // Dispatch custom event for other components
      window.dispatchEvent(new Event("dayStatusUpdate"));

      toast.success("Day Opened Successfully", {
        description: `Day started at ${time} on ${formatDate(date)}`,
      });

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("/");
    return `${day}/${month}/${year}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-border animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Day Management
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-accent rounded-full p-1.5 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Status:
              </span>
              <span
                className={`text-sm font-semibold ${
                  dayStatus?.isOpen ? "text-green-600" : "text-orange-600"
                }`}
              >
                {dayStatus?.isOpen ? "Open" : "Closed"}
              </span>
            </div>

            {/* Opening Time */}
            {dayStatus?.isOpen && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Opening Time:
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {dayStatus.openingTime || "N/A"}
                  </span>
                </div>

                {/* Opening Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Opening Date:
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(dayStatus.openingDate) || "N/A"}
                  </span>
                </div>
              </>
            )}

            {/* Closing Info (when closed) */}
            {!dayStatus?.isOpen && dayStatus?.closingTime && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Last Closing Time:
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {dayStatus.closingTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Last Closing Date:
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(dayStatus.closingDate || "")}
                  </span>
                </div>
              </>
            )}

            {/* Action Button */}
            <Button
              onClick={handleToggleDay}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 mt-6"
            >
              {dayStatus?.isOpen ? "Close Day" : "Open Day"}
            </Button>

            {/* Information Note */}
            <div className="bg-accent/50 rounded-lg p-3 mt-4">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                {dayStatus?.isOpen
                  ? "Closing the day will end the current business day session."
                  : "Opening the day will start a new business day session. A business day runs from 9:00 AM to 8:59 AM the next day."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
