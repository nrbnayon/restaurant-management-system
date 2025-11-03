// src/Pages/Dashboard/Admin/Reports/OverallSalesReportPage.tsx
import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import StatCard from "@/components/Shared/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Printer } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import { Pagination } from "@/components/Shared/Pagination";
import type { SalesReport } from "@/types/reports";
import { mockOrders } from "@/data/mockOrders";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function OverallSalesReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Generate sales report from orders
  const salesReportFromOrders = useMemo((): SalesReport[] => {
    return mockOrders
      .filter((order) => order.status === "Ready" || order.status === "Served")
      .map((order) => ({
        id: order.id,
        date: order.date,
        type: order.orderType,
        amount: order.totalAmount,
        tax: order.tax,
        cost: order.subtotal * 0.6, // Assuming cost is 60% of subtotal
        discount: order.discount,
      }));
  }, []);

  const filteredSales = useMemo((): SalesReport[] => {
    return salesReportFromOrders.filter((sale) => {
      const matchesSearch = sale.id
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const saleDate = new Date(sale.date);
      const from = dateFrom ? new Date(dateFrom.setHours(0, 0, 0, 0)) : null;
      const to = dateTo ? new Date(dateTo.setHours(23, 59, 59, 999)) : null;

      const matchesDate =
        (!from || saleDate >= from) && (!to || saleDate <= to);

      return matchesSearch && matchesDate;
    });
  }, [searchQuery, dateFrom, dateTo, salesReportFromOrders]);

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = useMemo((): SalesReport[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSales, currentPage, itemsPerPage]);

  const totals = useMemo(() => {
    const totalSale = filteredSales.reduce((sum, s) => sum + s.amount, 0);
    const totalCost = filteredSales.reduce((sum, s) => sum + s.cost, 0);
    const totalDiscount = filteredSales.reduce((sum, s) => sum + s.discount, 0);
    const totalTax = filteredSales.reduce((sum, s) => sum + s.tax, 0);
    const totalProfit = totalSale - totalCost - totalDiscount - totalTax;

    return {
      totalSale,
      totalCost,
      totalDiscount,
      totalTax,
      totalProfit,
    };
  }, [filteredSales]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Overall Sales Report</title>
  <style>
    body { font-family: system-ui; padding: 20px; background: #f9f9f9; }
    .container { max-width: 900px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #f97316, #fb923c); color: white; padding: 24px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .content { padding: 32px; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat { background: #fff7ed; padding: 16px; border-radius: 8px; text-align: center; border-left: 4px solid #f97316; }
    .stat h3 { font-size: 14px; color: #f97316; margin-bottom: 8px; text-transform: uppercase; }
    .stat p { font-size: 20px; font-weight: 700; color: #1f2937; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px; }
    th { background: #f97316; color: white; padding: 14px; text-align: left; }
    td { padding: 14px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) td { background: #fff7ed; }
    .text-right { text-align: right; }
    @media print { body { background: white; } .container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Overall Sales Report</h1><p>Track Your Restaurant Sale Report</p></div>
    <div class="content">
      <div class="stats">
        <div class="stat"><h3>Total Sale</h3><p>$${totals.totalSale.toFixed(
          2
        )}</p></div>
        <div class="stat"><h3>Total Cost</h3><p>$${totals.totalCost.toFixed(
          2
        )}</p></div>
        <div class="stat"><h3>Total Discount</h3><p>$${totals.totalDiscount.toFixed(
          2
        )}</p></div>
        <div class="stat"><h3>Total Profit</h3><p>$${totals.totalProfit.toFixed(
          2
        )}</p></div>
        <div class="stat"><h3>Total Tax</h3><p>$${totals.totalTax.toFixed(
          2
        )}</p></div>
      </div>
      <table>
        <thead><tr>
          <th>Order ID</th><th>Date</th><th>Type</th><th class="text-right">Amount</th>
          <th class="text-right">Tax</th><th class="text-right">Cost</th><th class="text-right">Discount</th><th class="text-right">Profit</th>
        </tr></thead>
        <tbody>
          ${paginatedSales
            .map(
              (s) => `
          <tr>
            <td>${s.id}</td>
            <td>${s.date}</td>
            <td>${s.type}</td>
            <td class="text-right">$${s.amount.toFixed(2)}</td>
            <td class="text-right">$${s.tax.toFixed(2)}</td>
            <td class="text-right">$${s.cost.toFixed(2)}</td>
            <td class="text-right">$${s.discount.toFixed(2)}</td>
            <td class="text-right">$${(
              s.amount -
              s.cost -
              s.discount -
              s.tax
            ).toFixed(2)}</td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>
  <script>window.onload = () => setTimeout(() => window.print(), 500);</script>
</body>
</html>`;

    printWindow.document.write(printContent);
    printWindow.document.close();
    toast.success("Print preview opened");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calendar component for date selection
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
                setCurrentPage(1);
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
            {date ? format(date, "MMM dd, yyyy") : placeholder}
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
                className="w-full"
                onClick={() => {
                  setSelectedDate(undefined);
                  setDate(undefined);
                  setCurrentPage(1);
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
    <>
      <DashboardHeader
        title="Overall Sales Report"
        subtitle="Track Your Restaurant Sale Report"
      />

      <main className="p-3 md:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Sale Amount"
            value={`$${totals.totalSale.toFixed(2)}`}
          />
          <StatCard
            title="Total Cost Amount"
            value={`$${totals.totalCost.toFixed(2)}`}
          />
          <StatCard
            title="Total Discount Amount"
            value={`$${totals.totalDiscount.toFixed(2)}`}
          />
          <StatCard
            title="Total Profit Amount"
            value={`$${totals.totalProfit.toFixed(2)}`}
          />
          <StatCard
            title="Total Tax Amount"
            value={`$${totals.totalTax.toFixed(2)}`}
          />
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm pb-5">
          <div className="p-5 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Sales Report
            </h2>
            <Button
              onClick={handlePrint}
              className="bg-primary hover:bg-primary/80 text-white rounded-sm px-4 py-2 flex items-center gap-4"
            >
              <Printer className="w-5 h-5" />
              Print
            </Button>
          </div>

          <div className="p-5 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Sale..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
              />
            </div>

            <div className="flex gap-4 items-center">
              <DatePickerCalendar
                date={dateFrom}
                setDate={setDateFrom}
                placeholder="From Date"
                maxDate={dateTo}
              />
              <span className="text-muted-foreground">to</span>
              <DatePickerCalendar
                date={dateTo}
                setDate={setDateTo}
                placeholder="To Date"
                minDate={dateFrom}
              />
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin mx-5 border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left p-4 font-semibold">Order ID</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-right p-4 font-semibold">Amount</th>
                  <th className="text-right p-4 font-semibold">Tax</th>
                  <th className="text-right p-4 font-semibold">Cost</th>
                  <th className="text-right p-4 font-semibold">Discount</th>
                  <th className="text-right p-4 font-semibold">Profit</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton />
                ) : paginatedSales.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-5 text-center text-muted-foreground"
                    >
                      No sales found
                    </td>
                  </tr>
                ) : (
                  paginatedSales.map((sale, index) => (
                    <tr
                      key={sale.id}
                      className={`border-b border-border ${
                        index % 2 === 0 ? "bg-background" : "bg-card"
                      } hover:bg-accent/50 transition-colors`}
                    >
                      <td className="p-4">{sale.id}</td>
                      <td className="p-4">{sale.date}</td>
                      <td className="p-4">{sale.type}</td>
                      <td className="p-4 text-right">
                        ${sale.amount.toFixed(2)}
                      </td>
                      <td className="p-4 text-right">${sale.tax.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        ${sale.cost.toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        ${sale.discount.toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        $
                        {(
                          sale.amount -
                          sale.cost -
                          sale.discount -
                          sale.tax
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isLoading && paginatedSales.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
            showPrevNext={true}
            showIfSinglePage={false}
          />
        )}
      </main>
    </>
  );
}
