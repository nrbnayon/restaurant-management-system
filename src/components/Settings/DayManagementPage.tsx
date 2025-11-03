// src\components\Settings\DayManagementPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface DayStatus {
  isOpen: boolean;
  openingTime: string;
  openingDate: string;
  closingTime?: string;
  closingDate?: string;
}

export default function DayManagementPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
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

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/dashboard/settings");
  };

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

      toast.success("Day Closed Successfully", {
        description: `Day closed at ${time} on ${date}. Duration: ${durationHours.toFixed(
          1
        )} hours`,
      });

      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/dashboard/settings");
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

      toast.success("Day Opened Successfully", {
        description: `Day started at ${time} on ${date}`,
      });

      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/dashboard/settings");
      }, 1500);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("/");
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={showModal} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 space-y-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCloseModal}
              className="hover:bg-accent rounded-full p-1 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <DialogTitle className="text-xl font-semibold">
              Day Management
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Status:</span>
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
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
          >
            {dayStatus?.isOpen ? "Close Day" : "Open Day"}
          </Button>

          {/* Information Note */}
          <div className="bg-accent/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground text-center">
              {dayStatus?.isOpen
                ? "Closing the day will end the current business day session."
                : "Opening the day will start a new business day session. A business day runs from 9:00 AM to 8:59 AM the next day."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
