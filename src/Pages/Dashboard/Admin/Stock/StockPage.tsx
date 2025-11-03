// src/Pages/Dashboard/Admin/Stock/StockPage.tsx
import { useState, useMemo } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Pagination } from "@/components/Shared/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StockItem {
  id: string;
  ingredient: string;
  quantity: number;
  unit: string;
  status: "sufficient" | "low" | "out-of-stock";
}

// Mock data - replace with actual API data
const mockStockData: StockItem[] = [
  {
    id: "1",
    ingredient: "Chicken",
    quantity: 110,
    unit: "kg",
    status: "sufficient",
  },
  {
    id: "2",
    ingredient: "Chicken",
    quantity: 10,
    unit: "kg",
    status: "low",
  },
  {
    id: "3",
    ingredient: "Potato",
    quantity: 0,
    unit: "kg",
    status: "out-of-stock",
  },
  {
    id: "4",
    ingredient: "Potato",
    quantity: 100,
    unit: "kg",
    status: "sufficient",
  },
  {
    id: "5",
    ingredient: "Tomato",
    quantity: 100,
    unit: "kg",
    status: "sufficient",
  },
  {
    id: "6",
    ingredient: "Tomato",
    quantity: 5,
    unit: "kg",
    status: "low",
  },
  {
    id: "7",
    ingredient: "Tomato",
    quantity: 0,
    unit: "kg",
    status: "out-of-stock",
  },
  {
    id: "8",
    ingredient: "Onion",
    quantity: 80,
    unit: "kg",
    status: "sufficient",
  },
  {
    id: "9",
    ingredient: "Garlic",
    quantity: 15,
    unit: "kg",
    status: "low",
  },
  {
    id: "10",
    ingredient: "Rice",
    quantity: 200,
    unit: "kg",
    status: "sufficient",
  },
  {
    id: "11",
    ingredient: "Beef",
    quantity: 0,
    unit: "kg",
    status: "out-of-stock",
  },
  {
    id: "12",
    ingredient: "Fish",
    quantity: 45,
    unit: "kg",
    status: "sufficient",
  },
  {
    id: "13",
    ingredient: "Cheese",
    quantity: 8,
    unit: "kg",
    status: "low",
  },
  {
    id: "14",
    ingredient: "Milk",
    quantity: 50,
    unit: "liter",
    status: "sufficient",
  },
  {
    id: "15",
    ingredient: "Eggs",
    quantity: 120,
    unit: "pieces",
    status: "sufficient",
  },
];

const ITEMS_PER_PAGE = 10;

export default function StockPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter stock items
  const filteredStockItems = useMemo(() => {
    return mockStockData.filter((item) => {
      const matchesSearch = item.ingredient
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStockItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredStockItems.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "sufficient":
        return "bg-green-500 text-white hover:bg-green-600";
      case "low":
        return "bg-yellow-600 text-white hover:bg-yellow-700";
      case "out-of-stock":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "sufficient":
        return "Sufficient";
      case "low":
        return "Low";
      case "out-of-stock":
        return "Out of stock";
      default:
        return status;
    }
  };

  return (
    <>
      <DashboardHeader title="Stock Management" subtitle="Track Your Stock" />

      <main className="p-3 md:p-8 space-y-6">
        {/* Search and Filter Section */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 md:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 md:gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Stock"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-stretch gap-3 md:gap-4">
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="h-10 md:h-12! border-input text-sm md:text-base w-full sm:w-auto sm:min-w-[180px]">
                  <SlidersHorizontal className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sufficient">Sufficient</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="text-left px-4 md:px-2 py-3 md:py-4 text-sm md:text-base font-semibold">
                    Ingredient
                  </th>
                  <th className="text-center px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold">
                    Quantity
                  </th>
                  <th className="text-center px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-8 md:py-12 text-muted-foreground"
                    >
                      No stock items found
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${
                        index !== paginatedItems.length - 1
                          ? "border-b border-border"
                          : ""
                      } hover:bg-accent/50 transition-colors`}
                    >
                      <td className="p-3 text-sm md:text-base text-foreground">
                        {item.ingredient}
                      </td>
                      <td className="text-center p-3 text-sm md:text-base text-foreground">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="text-center p-3">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center justify-center px-6 md:px-8 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-colors w-full max-w-[200px] ${getStatusStyles(
                              item.status
                            )}`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination */}
        {filteredStockItems.length > ITEMS_PER_PAGE && (
          <div className="pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              maxVisiblePages={5}
              showPrevNext={true}
              className="flex-wrap gap-2"
            />
          </div>
        )}
      </main>
    </>
  );
}
