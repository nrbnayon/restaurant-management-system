// DUE BILLS SECTION - src/components/Supplier/DueBillsSection.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, CreditCard } from "lucide-react";
import ViewBillModal from "@/components/Supplier/ViewBillModal";
import MakePaymentModal from "@/components/Supplier/MakePaymentModal";
import type { Bill } from "@/types/supplier";

interface DueBillsSectionProps {
  bills: Bill[];
  isLoading: boolean;
}

export function DueBillsSection({ bills, isLoading }: DueBillsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleViewItems = (bill: Bill) => {
    setSelectedBill(bill);
    setIsViewModalOpen(true);
  };

  const handleMakePayment = (bill: Bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  const filteredBills = bills.filter(
    (bill) =>
      bill.billId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-card rounded-2xl border border-border shadow-sm pb-5">
        <div className="p-5 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">Due Bills</h2>
        </div>

        <div className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Bill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
            />
          </div>
        </div>

        <div className="space-y-4 px-5">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bills found
            </div>
          ) : (
            filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="bg-background border border-border rounded-xl p-5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground">
                      {bill.billId}
                    </h3>
                    <p className="text-sm text-muted-foreground">{bill.date}</p>
                    <p className="text-sm font-medium text-foreground">
                      {bill.supplier}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewItems(bill)}
                      className="h-9 px-3 rounded-lg border-border hover:bg-accent gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleMakePayment(bill)}
                      className="h-9 px-3 rounded-lg bg-primary hover:bg-primary/90 text-white gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-card rounded-lg border border-border">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Total Amount
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      ${bill.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Paid
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ${bill.paid.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Due
                    </p>
                    <p className="text-lg font-bold text-red-600">
                      ${bill.due.toFixed(2)}
                    </p>
                  </div>
                </div>

                {bill.paymentMethod && (
                  <div className="mt-3 flex items-center justify-end">
                    <span className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">
                      {bill.paymentMethod}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

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
