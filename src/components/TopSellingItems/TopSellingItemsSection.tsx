"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Settings } from "lucide-react";
import TopSellingItemCard from "./TopSellingItemCard";
import { mockTopSellingItems } from "@/data/mockTopSellingItems";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function TopSellingItemsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const filteredItems = useMemo(() => {
    return mockTopSellingItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const DatePickerCalendar = ({
    date,
    setDate,
    placeholder,
    minDate,
    maxDate,
  }: {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    placeholder: string;
    minDate?: Date;
    maxDate?: Date;
  }) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
    const [currentMonth, setCurrentMonth] = useState<Date>(date || new Date());

    const daysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isDateDisabled = (currentDate: Date) => {
      if (minDate) {
        const minDateOnly = new Date(
          minDate.getFullYear(),
          minDate.getMonth(),
          minDate.getDate()
        );
        const currentDateOnly = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        );
        if (currentDateOnly < minDateOnly) return true;
      }
      if (maxDate) {
        const maxDateOnly = new Date(
          maxDate.getFullYear(),
          maxDate.getMonth(),
          maxDate.getDate()
        );
        const currentDateOnly = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        );
        if (currentDateOnly > maxDateOnly) return true;
      }
      return false;
    };

    const renderCalendar = () => {
      const days = daysInMonth(currentMonth);
      const firstDay = firstDayOfMonth(currentMonth);
      const weeks = [];
      let week = [];

      for (let i = 0; i < firstDay; i++) {
        week.push(<div key={`empty-${i}`} className="p-2" />);
      }

      for (let day = 1; day <= days; day++) {
        const currentDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          day
        );
        const isSelected =
          selectedDate &&
          currentDate.toDateString() === selectedDate.toDateString();
        const isDisabled = isDateDisabled(currentDate);

        week.push(
          <button
            key={day}
            type="button"
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) {
                setSelectedDate(currentDate);
                setDate(currentDate);
              }
            }}
            className={cn(
              "p-2 text-sm rounded-md hover:bg-accent transition-colors",
              isSelected && "bg-primary text-white hover:bg-primary/90",
              isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent"
            )}
          >
            {day}
          </button>
        );

        if (week.length === 7) {
          weeks.push(
            <div key={`week-${weeks.length}`} className="grid grid-cols-7">
              {week}
            </div>
          );
          week = [];
        }
      }

      if (week.length > 0) {
        weeks.push(
          <div key={`week-${weeks.length}`} className="grid grid-cols-7">
            {week}
          </div>
        );
      }

      return weeks;
    };

    const previousMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
      );
    };

    const nextMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
      );
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-40 h-12 justify-start text-left font-normal pl-3",
              !date && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-5 w-5" />
            {date ? format(date, "MM/dd/yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={previousMonth}
                className="p-1 hover:bg-accent rounded"
              >
                ←
              </button>
              <div className="font-semibold">
                {format(currentMonth, "MMMM yyyy")}
              </div>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 hover:bg-accent rounded"
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              <div className="p-2 font-semibold">Su</div>
              <div className="p-2 font-semibold">Mo</div>
              <div className="p-2 font-semibold">Tu</div>
              <div className="p-2 font-semibold">We</div>
              <div className="p-2 font-semibold">Th</div>
              <div className="p-2 font-semibold">Fr</div>
              <div className="p-2 font-semibold">Sa</div>
            </div>
            {renderCalendar()}
            {date && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSelectedDate(undefined);
                  setDate(undefined);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Top Selling Items
        </h2>
        <Button
          className="bg-primary hover:bg-primary/80 text-white rounded-lg px-4 py-2 flex items-center gap-2"
          size="sm"
        >
          <Settings className="w-5 h-5" />
          Filter
        </Button>
      </div>

      {/* Filters */}
      <div className="p-5 flex flex-col lg:flex-row gap-4 border-b border-border">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search Selling item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
          />
        </div>

        {/* Date Range */}
        <div className="flex gap-2 items-center">
          <DatePickerCalendar
            date={dateFrom}
            setDate={setDateFrom}
            placeholder="mm/dd/yyyy"
            maxDate={dateTo}
          />
          <span className="text-muted-foreground text-sm">To</span>
          <DatePickerCalendar
            date={dateTo}
            setDate={setDateTo}
            placeholder="mm/dd/yyyy"
            minDate={dateFrom}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="p-5 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No items found
          </div>
        ) : (
          filteredItems.map((item) => (
            <TopSellingItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              quantity={item.quantity}
              revenue={item.revenue}
            />
          ))
        )}
      </div>
    </div>
  );
}
