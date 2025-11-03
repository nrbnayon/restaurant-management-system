import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Plus, Eye, SquarePen } from "lucide-react";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import ViewExpenseModal from "@/components/Expense/ViewExpenseModal";
import { mockExpenses } from "@/data/mockExpenses";
import type { Expense } from "@/types/expense";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/Shared/Pagination";

export default function ExpensesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expenses] = useState<Expense[]>(mockExpenses);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Get unique expense types dynamically
  const uniqueExpenseTypes = useMemo(() => {
    const types = expenses.map((expense) => expense.expenseType);
    return Array.from(new Set(types)).sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.expenseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.expenseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        expense.expenseType.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, expenses, filterType]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExpenses, currentPage, itemsPerPage]);

  const handleView = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleEdit = (expenseId: string) => {
    navigate(`/dashboard/expenses/${expenseId}`);
  };

  const handleAdd = () => {
    navigate("/dashboard/expenses/add");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <>
      <DashboardHeader
        title="Expenses"
        subtitle="Create Your Restaurant Expense"
      />

      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        <div className="bg-card rounded-2xl border border-border shadow-sm pb-5">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Recent Expenses
            </h2>
            <Button
              onClick={handleAdd}
              className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/80 shadow-lg hover:shadow-xl rounded-md px-4 py-2.5 text-white transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </Button>
          </div>

          <div className="p-5 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Order..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 px-4 border-input hover:bg-accent"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All
                </DropdownMenuItem>
                {uniqueExpenseTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setFilterType(type.toLowerCase())}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="overflow-x-auto scrollbar-thin mx-auto md:mx-5 border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-center p-4 font-semibold">Expense ID</th>
                  <th className="text-center p-4 font-semibold">Type</th>
                  <th className="text-center p-4 font-semibold">Price</th>
                  <th className="text-center p-4 font-semibold">Date</th>
                  <th className="text-center p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton columns={5} />
                ) : paginatedExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-2 md:p-5 text-center">
                      <p className="text-muted-foreground">No expenses found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedExpenses.map((expense, index) => (
                    <tr
                      key={expense.id}
                      className={`border-b border-border text-center ${
                        index % 2 === 0 ? "bg-background" : "bg-card"
                      } hover:bg-accent/50 transition-colors`}
                    >
                      <td className="p-2 text-sm text-foreground">
                        {expense.expenseId}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {expense.expenseType}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        ${expense.totalPrice}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {expense.date}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent"
                            onClick={() => handleView(expense)}
                          >
                            <Eye className="h-5 w-5 text-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent"
                            onClick={() => handleEdit(expense.id)}
                          >
                            <SquarePen className="h-5 w-5 text-primary" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isLoading && paginatedExpenses.length > 0 && (
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

      <ViewExpenseModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />
    </>
  );
}
