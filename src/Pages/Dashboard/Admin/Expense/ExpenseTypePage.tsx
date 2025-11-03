// src/Pages/Dashboard/ExpenseType/ExpenseTypePage.tsx
import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, SquarePen, SlidersHorizontal } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import DeactivateModal from "@/components/Modals/DeactivateModal";
import { Pagination } from "@/components/Shared/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { RoleGuard } from "@/components/RoleGuard";
import ExpenseTypeModal from "@/components/Expense/ExpenseTypeModal";

interface ExpenseType {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockExpenseTypes: ExpenseType[] = [
  {
    id: "1",
    name: "Furniture",
    isActive: true,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "2",
    name: "Kitchen Equipment",
    isActive: true,
    createdAt: "2025-01-02",
    updatedAt: "2025-01-02",
  },
  {
    id: "3",
    name: "Accessories",
    isActive: true,
    createdAt: "2025-01-03",
    updatedAt: "2025-01-03",
  },
  {
    id: "4",
    name: "Utilities",
    isActive: false,
    createdAt: "2025-01-04",
    updatedAt: "2025-01-04",
  },
  {
    id: "5",
    name: "Salary",
    isActive: true,
    createdAt: "2025-01-05",
    updatedAt: "2025-01-05",
  },
  {
    id: "6",
    name: "Maintenance",
    isActive: true,
    createdAt: "2025-01-06",
    updatedAt: "2025-01-06",
  },
  {
    id: "7",
    name: "Rent",
    isActive: false,
    createdAt: "2025-01-07",
    updatedAt: "2025-01-07",
  },
];

export default function ExpenseTypePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseTypes, setExpenseTypes] =
    useState<ExpenseType[]>(mockExpenseTypes);
  const [selectedExpenseType, setSelectedExpenseType] =
    useState<ExpenseType | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredExpenseTypes = useMemo(() => {
    return expenseTypes.filter((expenseType) => {
      const matchesSearch = expenseType.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && expenseType.isActive) ||
        (statusFilter === "deactivated" && !expenseType.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, expenseTypes, statusFilter]);

  const totalPages = Math.ceil(filteredExpenseTypes.length / itemsPerPage);
  const paginatedExpenseTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExpenseTypes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExpenseTypes, currentPage, itemsPerPage]);

  const handleStatusToggle = (expenseType: ExpenseType) => {
    setSelectedExpenseType(expenseType);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!selectedExpenseType) return;

    const willBeActive = !selectedExpenseType.isActive;

    setExpenseTypes((prev) =>
      prev.map((type) =>
        type.id === selectedExpenseType.id
          ? {
              ...type,
              isActive: willBeActive,
              updatedAt: new Date().toISOString(),
            }
          : type
      )
    );

    if (willBeActive) {
      toast.success("Expense type activated successfully", {
        description: `${selectedExpenseType.name} is now active`,
      });
    } else {
      toast.warning("Expense type deactivated", {
        description: `${selectedExpenseType.name} has been deactivated`,
      });
    }

    setIsDeactivateModalOpen(false);
    setSelectedExpenseType(null);
  };

  const handleEdit = (expenseType: ExpenseType) => {
    setSelectedExpenseType(expenseType);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedExpenseType(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleSave = (data: ExpenseType | string) => {
    if (modalMode === "add" && typeof data === "string") {
      const newExpenseType: ExpenseType = {
        id: `${Date.now()}`,
        name: data,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setExpenseTypes((prev) => [newExpenseType, ...prev]);
      toast.success("Expense type added successfully", {
        description: `${data} has been created`,
      });
    } else if (modalMode === "edit" && typeof data === "object") {
      setExpenseTypes((prev) =>
        prev.map((type) =>
          type.id === data.id
            ? { ...data, updatedAt: new Date().toISOString() }
            : type
        )
      );
      toast.success("Expense type updated successfully", {
        description: `${data.name} has been updated`,
      });
    }
    setIsModalOpen(false);
    setSelectedExpenseType(null);
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
        title="Expenses Type"
        subtitle="Create Your Restaurant Expense Type"
      />

      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        <div className="bg-card rounded-2xl border border-border shadow-sm pb-5">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">Expenses</h2>
            <RoleGuard allowedRole="admin">
              <Button
                onClick={handleAdd}
                className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/80 shadow-lg hover:shadow-xl rounded-md px-4 py-2.5 text-white transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Expense Type
              </Button>
            </RoleGuard>
          </div>

          <div className="p-5 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12! border-input">
                <SlidersHorizontal className="h-5 w-5" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="deactivated">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto scrollbar-thin mx-auto md:mx-5 border rounded-t-xl">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-center p-4 font-semibold">No</th>
                  <th className="text-center p-4 font-semibold">
                    Purchase Type Name
                  </th>
                  <th className="text-center p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton columns={3} />
                ) : paginatedExpenseTypes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-2 md:p-5 text-center">
                      <p className="text-muted-foreground">
                        No expense types found
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedExpenseTypes.map((expenseType, index) => (
                    <tr
                      key={expenseType.id}
                      className={`border-b border-border text-center ${
                        index % 2 === 0 ? "bg-background" : "bg-card"
                      } hover:bg-accent/50 transition-colors`}
                    >
                      <td className="p-2 text-sm text-foreground">
                        {String(
                          (currentPage - 1) * itemsPerPage + index + 1
                        ).padStart(2, "0")}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {expenseType.name}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent"
                            onClick={() => handleEdit(expenseType)}
                          >
                            <SquarePen className="h-5 w-5 text-foreground" />
                          </Button>
                          <Switch
                            checked={expenseType.isActive}
                            onCheckedChange={() =>
                              handleStatusToggle(expenseType)
                            }
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isLoading && paginatedExpenseTypes.length > 0 && (
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

      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setSelectedExpenseType(null);
        }}
        onConfirm={handleConfirmToggle}
        title={
          selectedExpenseType?.isActive
            ? `Are you sure you want to deactivate "${selectedExpenseType.name}"?`
            : `Are you sure you want to activate "${selectedExpenseType?.name}"?`
        }
        buttonText={selectedExpenseType?.isActive ? `Deactivate` : `Activate`}
      />

      <ExpenseTypeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpenseType(null);
        }}
        onSave={handleSave}
        expenseType={selectedExpenseType}
        mode={modalMode}
      />
    </>
  );
}
