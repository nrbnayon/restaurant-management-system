// SUPPLIER PAGE - src/Pages/Dashboard/Supplier/SupplierPage.tsx
import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import StatCard from "@/components/Shared/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Eye, CreditCard } from "lucide-react";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import AddSupplierModal from "@/components/Supplier/AddSupplierModal";
import ViewBillModal from "@/components/Supplier/ViewBillModal";
import MakePaymentModal from "@/components/Supplier/MakePaymentModal";
import { mockSuppliers, mockBills } from "@/data/mockSuppliers";
import type { Supplier, SupplierStats, Bill } from "@/types/supplier";
import { DueBillsSection } from "@/components/Supplier/DueBillsSection";
import { Pagination } from "@/components/Shared/Pagination";

export default function SupplierPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [activeTab, setActiveTab] = useState<"suppliers" | "due">("suppliers");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const stats: SupplierStats = useMemo(() => {
    const totalSuppliers = suppliers.length;
    const totalBills = mockBills.length;
    const totalPurchases = mockBills.reduce(
      (sum, bill) => sum + bill.totalAmount,
      0
    );
    const totalAmount = mockBills.reduce(
      (sum, bill) => sum + bill.totalAmount,
      0
    );
    const totalPaid = mockBills.reduce((sum, bill) => sum + bill.paid, 0);
    const totalDue = mockBills.reduce((sum, bill) => sum + bill.due, 0);

    return {
      totalSuppliers,
      totalBills,
      totalPurchases,
      totalAmount,
      totalPaid,
      totalDue,
    };
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery, suppliers]);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSuppliers, currentPage]);

  const handleAddSupplier = (
    supplierData: Omit<Supplier, "id" | "createdAt" | "updatedAt">
  ) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    // Find a bill for this supplier
    const supplierBill = mockBills.find(
      (bill) => bill.supplierId === supplier.id
    );
    if (supplierBill) {
      setSelectedBill(supplierBill);
      setIsViewModalOpen(true);
    }
  };

  const handleMakePayment = (supplier: Supplier) => {
    // Find a bill with due amount for this supplier
    const supplierBill = mockBills.find(
      (bill) => bill.supplierId === supplier.id && bill.due > 0
    );
    if (supplierBill) {
      setSelectedBill(supplierBill);
      setIsPaymentModalOpen(true);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <>
      <DashboardHeader
        title="Supplier Management"
        subtitle="Manage suppliers, purchases, and payments"
      />

      <main className="p-3 md:p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Suppliers"
            value={stats.totalSuppliers.toString()}
          />
          <StatCard title="Total Bills" value={stats.totalBills.toString()} />
          <StatCard
            title="Total Purchases"
            value={`$${stats.totalPurchases.toFixed(2)}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Amount"
            value={`$${stats.totalAmount.toFixed(2)}`}
          />
          <StatCard
            title="Total Paid"
            value={`$${stats.totalPaid.toFixed(2)}`}
          />
          <StatCard title="Total Due" value={`$${stats.totalDue.toFixed(2)}`} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab("suppliers")}
            className={`flex-1 h-12 rounded-sm ${
              activeTab === "suppliers"
                ? "bg-primary text-white"
                : "bg-card text-muted-foreground border border-border"
            }`}
            variant="ghost"
          >
            Suppliers
          </Button>
          <Button
            onClick={() => setActiveTab("due")}
            className={`flex-1 h-12 rounded-sm ${
              activeTab === "due"
                ? "bg-primary text-white"
                : "bg-card text-muted-foreground border border-border"
            }`}
            variant="ghost"
          >
            Due Bill
          </Button>
        </div>

        {/* Suppliers Section */}
        {activeTab === "suppliers" && (
          <div className="bg-card rounded-2xl border border-border shadow-sm pb-5">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">
                Supplier
              </h2>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 bg-primary hover:bg-primary/80 rounded-sm px-4 py-2.5 text-white"
              >
                <Plus className="w-5 h-5" />
                Add Supplier
              </Button>
            </div>

            <div className="p-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search Supplier..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
                />
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-thin mx-5 border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="text-left p-4 font-semibold">Name</th>
                    <th className="text-left p-4 font-semibold">Number</th>
                    <th className="text-left p-4 font-semibold">Email</th>
                    <th className="text-left p-4 font-semibold">Location</th>
                    <th className="text-right p-4 font-semibold">Total</th>
                    <th className="text-right p-4 font-semibold">Paid</th>
                    <th className="text-right p-4 font-semibold">Due</th>
                    <th className="text-center p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <TableSkeleton columns={8} />
                  ) : paginatedSuppliers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-5 text-center text-muted-foreground"
                      >
                        No suppliers found
                      </td>
                    </tr>
                  ) : (
                    paginatedSuppliers.map((supplier, index) => (
                      <tr
                        key={supplier.id}
                        className={`border-b border-border ${
                          index % 2 === 0 ? "bg-background" : "bg-card"
                        } hover:bg-accent/50 transition-colors`}
                      >
                        <td className="p-3 text-sm font-medium">
                          {supplier.name}
                        </td>
                        <td className="p-3 text-sm">{supplier.number}</td>
                        <td className="p-3 text-sm">{supplier.email}</td>
                        <td className="p-3 text-sm">{supplier.location}</td>
                        <td className="p-3 text-sm text-right font-semibold">
                          ${supplier.total.toFixed(2)}
                        </td>
                        <td className="p-3 text-sm text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            ${supplier.paid.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-right">
                          {supplier.due > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              ${supplier.due.toFixed(2)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                              $0.00
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewSupplier(supplier)}
                              className="h-8 w-8 hover:bg-blue-100"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            {supplier.due > 0 ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMakePayment(supplier)}
                                className="h-8 w-8 hover:bg-orange-100"
                                title="Make Payment"
                              >
                                <CreditCard className="h-4 w-4 text-primary" />
                              </Button>
                            ) : (
                              <div className="h-4 w-7 text-transparent"></div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Due Bills Section */}
        {activeTab === "due" && (
          <DueBillsSection bills={mockBills} isLoading={isLoading} />
        )}

        {/* Pagination */}
        {!isLoading &&
          (activeTab === "suppliers"
            ? paginatedSuppliers.length > 0
            : mockBills.length > 0) && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
      </main>

      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSupplier}
      />

      <ViewBillModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedBill(null);
        }}
        bill={selectedBill}
      />

      <MakePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedBill(null);
        }}
        bill={selectedBill}
      />
    </>
  );
}
