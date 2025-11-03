// src/Pages/Dashboard/Purchase/AddEditPurchasePage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Printer,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import {
  mockPurchases,
  mockIngredientOptions,
  mockSupplierOptions,
} from "@/data/mockPurchases";
import type { PurchaseItem } from "@/types/purchase";
import { RoleGuard } from "@/components/RoleGuard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function AddEditPurchasePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState<"kg" | "gm" | "piece" | "ML">(
    "kg"
  );
  const [newItemUnitPrice, setNewItemUnitPrice] = useState("");
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [supplier, setSupplier] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [date, setDate] = useState("");
  const [vat, setVat] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");
  const [supplierOpen, setSupplierOpen] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    newItemName?: string;
    newItemQuantity?: string;
    newItemUnitPrice?: string;
    items?: string;
    supplier?: string;
    paymentType?: string;
    date?: string;
  }>({});

  useEffect(() => {
    if (isEdit) {
      const fetchPurchase = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));

        const purchase = mockPurchases.find((p) => p.id === id);
        if (purchase) {
          setItems(purchase.items);
          setSupplier(purchase.supplier);
          setPaymentType(purchase.paymentType);
          setDate(purchase.createdAt);
          setVat(purchase.vat.toString());
          setDiscount(purchase.discount.toString());
          setPaidAmount(purchase.paidAmount.toString());
        } else {
          toast.error("Purchase not found");
          navigate("/dashboard/purchase");
        }

        setIsLoading(false);
      };
      fetchPurchase();
    }
  }, [id, isEdit, navigate]);

  const calculateItemTotal = () => {
    const qty = parseFloat(newItemQuantity) || 0;
    const price = parseFloat(newItemUnitPrice) || 0;
    return (qty * price).toFixed(2);
  };

  const validateNewItem = () => {
    const newErrors: typeof errors = {};

    if (!newItemName) newErrors.newItemName = "Item name is required";
    if (!newItemQuantity || parseFloat(newItemQuantity) <= 0)
      newErrors.newItemQuantity = "Valid quantity is required";
    if (!newItemUnitPrice || parseFloat(newItemUnitPrice) <= 0)
      newErrors.newItemUnitPrice = "Valid unit price is required";

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!validateNewItem()) {
      toast.error("Please fill all item fields correctly");
      return;
    }

    const newItem: PurchaseItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      quantity: parseFloat(newItemQuantity),
      unit: newItemUnit,
      unitPrice: parseFloat(newItemUnitPrice),
      totalPrice: parseFloat(calculateItemTotal()),
    };

    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemUnitPrice("");
    setNewItemUnit("kg");
    setErrors((prev) => ({
      ...prev,
      newItemName: undefined,
      newItemQuantity: undefined,
      newItemUnitPrice: undefined,
    }));
    toast.success("Item added");
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
    toast.success("Item removed");
  };

  const calculateTotals = () => {
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const vatAmount = parseFloat(vat) || 0;
    const discountAmount = parseFloat(discount) || 0;
    const totalAmount = totalPrice + vatAmount - discountAmount;
    const paidAmt = parseFloat(paidAmount) || 0;
    const dueAmount = totalAmount - paidAmt;

    return {
      totalPrice,
      vatAmount,
      discountAmount,
      totalAmount,
      paidAmt,
      dueAmount,
    };
  };

  const totals = calculateTotals();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (items.length === 0) newErrors.items = "At least one item is required";
    if (!supplier) newErrors.supplier = "Supplier is required";
    if (!paymentType) newErrors.paymentType = "Payment type is required";
    if (!date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(
      isEdit ? "Purchase updated successfully!" : "Purchase added successfully!"
    );
    setIsSubmitting(false);
    navigate("/dashboard/purchase");
  };

  // Fixed Print Functionality
  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Failed to open print window. Please allow popups.");
      return;
    }

    const invoiceNo = isEdit
      ? mockPurchases.find((p) => p.id === id)?.invoiceNo || "N/A"
      : `INV-${Date.now()}`;

    const formattedDate = date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";

    const printContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Purchase Invoice - ${invoiceNo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f9f9f9;
      color: #1f2937;
      padding: 20px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      padding: 24px;
      text-align: center;
    }
    .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .content { padding: 32px; }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
      font-size: 14px;
    }
    .info-card {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #6366f1;
    }
    .info-card h3 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6366f1;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .info-card p { color: #374151; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 14px;
    }
    th {
      background: #6366f1;
      color: white;
      padding: 14px 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 14px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:nth-child(even) td { background: #f9f9ff; }
    .text-right { text-align: right; }
    .totals {
      float: right;
      width: 350px;
      margin-top: 32px;
    }
    .totals table { font-size: 15px; }
    .totals td {
      padding: 10px 0;
      border: none;
    }
    .totals .label { font-weight: 600; color: #374151; }
    .totals .amount { text-align: right; font-weight: 600; }
    .totals .final {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      border-top: 2px solid #6366f1;
      padding-top: 12px;
    }
    .footer {
      text-align: center;
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px dashed #d1d5db;
      color: #6b7280;
      font-size: 13px;
    }
    @media print {
      body { background: white; padding: 0; }
      .invoice-container { box-shadow: none; }
      @page { margin: 0.5in; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>Purchase Invoice</h1>
      <p>Professional Purchase Receipt</p>
    </div>
    <div class="content">
      <div class="info-grid">
        <div class="info-card">
          <h3>Invoice No</h3>
          <p><strong>${invoiceNo}</strong></p>
        </div>
        <div class="info-card">
          <h3>Purchase Date</h3>
          <p><strong>${formattedDate}</strong></p>
        </div>
        <div class="info-card">
          <h3>Supplier</h3>
          <p><strong>${supplier}</strong></p>
        </div>
        <div class="info-card">
          <h3>Payment Method</h3>
          <p><strong>${paymentType}</strong></p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
          <tr>
            <td>${item.name}</td>
            <td class="text-right">${item.quantity} ${item.unit}</td>
            <td class="text-right">$${item.unitPrice.toFixed(2)}</td>
            <td class="text-right">$${item.totalPrice.toFixed(2)}</td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td class="label">Subtotal</td>
            <td class="amount">$${totals.totalPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="label">VAT</td>
            <td class="amount">$${totals.vatAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="label">Discount</td>
            <td class="amount">-$${totals.discountAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="label">Paid Amount</td>
            <td class="amount">$${totals.paidAmt.toFixed(2)}</td>
          </tr>
          <tr class="final">
            <td class="label">Due Amount</td>
            <td class="amount">$${totals.dueAmount.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div style="clear: both;"></div>

      <div class="footer">
        <p>Thank you for your purchase!</p>
        <p>This is a system-generated invoice.</p>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    toast.success("Print preview ready");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-4 md:p-5.5">
        <RoleGuard allowedRole="admin">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/purchase")}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {isEdit ? "Edit Purchase" : "Add Purchase"}
            </h1>
          </div>
        </RoleGuard>
      </div>

      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Items Section */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Items</h2>
            </div>

            {/* Add Item Form */}
            <div className="space-y-2 w-full mb-4">
              <Label className="text-sm flex items-center gap-1">
                Name <span className="text-red-500">*</span>
              </Label>
              <Select value={newItemName} onValueChange={setNewItemName}>
                <SelectTrigger
                  className={`h-12! w-full ${
                    errors.newItemName ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Name" />
                </SelectTrigger>
                <SelectContent>
                  {mockIngredientOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.newItemName && (
                <p className="text-sm text-red-500">{errors.newItemName}</p>
              )}
            </div>
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-1">
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(e.target.value)}
                      className={`h-12! rounded-md ${
                        errors.newItemQuantity ? "border-red-500" : ""
                      }`}
                      placeholder="Write QTY"
                    />
                    <Select
                      value={newItemUnit}
                      onValueChange={(value: "kg" | "gm" | "piece" | "ML") =>
                        setNewItemUnit(value)
                      }
                    >
                      <SelectTrigger className="h-12! w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="gm">gm</SelectItem>
                        <SelectItem value="ML">ML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.newItemQuantity && (
                    <p className="text-sm text-red-500">
                      {errors.newItemQuantity}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-1">
                    Unit Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={newItemUnitPrice}
                    onChange={(e) => setNewItemUnitPrice(e.target.value)}
                    className={`h-12! rounded-md ${
                      errors.newItemUnitPrice ? "border-red-500" : ""
                    }`}
                    placeholder="Write per unit price"
                  />
                  {errors.newItemUnitPrice && (
                    <p className="text-sm text-red-500">
                      {errors.newItemUnitPrice}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Total Price</Label>
                  <Input
                    type="text"
                    value={calculateItemTotal()}
                    className="h-12! rounded-md"
                    placeholder="Total price"
                    readOnly
                  />
                </div>
              </div>
              <div className="flex justify-end items-center">
                <Button
                  onClick={handleAddItem}
                  className="flex items-center gap-1 bg-primary hover:bg-primary/80 rounded-md px-4 py-2 text-white"
                >
                  {/* <Plus className="w-4 h-4" /> */}
                  Add Item
                </Button>
              </div>
            </div>

            {errors.items && (
              <p className="text-sm text-red-500 mt-2">{errors.items}</p>
            )}
          </div>

          {/* Items Table */}
          {items.length > 0 && (
            <div className="border border-border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="text-left p-4 font-semibold">Name</th>
                    <th className="text-center p-4 font-semibold">Quantity</th>
                    <th className="text-center p-4 font-semibold">
                      Unit Price
                    </th>
                    <th className="text-center p-4 font-semibold">
                      Total Price
                    </th>
                    <th className="text-center p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-border ${
                        index % 2 === 0 ? "bg-background" : "bg-card"
                      }`}
                    >
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-center">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="p-2 text-center">${item.unitPrice}</td>
                      <td className="p-2 text-center">${item.totalPrice}</td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          className="bg-red-100 hover:bg-red-200 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payment Details */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-1">
                  Supplier <span className="text-red-500">*</span>
                </Label>
                <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={supplierOpen}
                      className={`h-12 w-full justify-between bg-card shadow-none font-normal ${
                        errors.supplier ? "border-red-500" : ""
                      }`}
                    >
                      {supplier || "Select or type supplier..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start" side="bottom">
                    <Command>
                      <CommandInput
                        placeholder="Search or type supplier..."
                        value={supplier}
                        onValueChange={setSupplier}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="py-6 text-center text-sm">
                            Press Enter to add:{" "}
                            <strong className="text-primary">{supplier}</strong>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {mockSupplierOptions
                            .filter((option) =>
                              option
                                .toLowerCase()
                                .includes(supplier.toLowerCase())
                            )
                            .map((option) => (
                              <CommandItem
                                key={option}
                                value={option}
                                onSelect={(currentValue) => {
                                  setSupplier(currentValue);
                                  setSupplierOpen(false);
                                  setErrors((prev) => ({
                                    ...prev,
                                    supplier: undefined,
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    supplier === option
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {option}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.supplier && (
                  <p className="text-sm text-red-500">{errors.supplier}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Total Price</Label>
                <Input
                  type="text"
                  value={totals.totalPrice.toFixed(2)}
                  className="h-12! rounded-md"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Total Amount</Label>
                <Input
                  type="text"
                  value={totals.totalAmount.toFixed(2)}
                  className="h-12! rounded-md"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-1">
                  Payment Type <span className="text-red-500">*</span>
                </Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger
                    className={`h-12! w-full ${
                      errors.paymentType ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Bkash" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bkash">Bkash</SelectItem>
                    <SelectItem value="Nagad">Nagad</SelectItem>
                    <SelectItem value="Rocket">Rocket</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentType && (
                  <p className="text-sm text-red-500">{errors.paymentType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Vat</Label>
                <Input
                  type="number"
                  value={vat}
                  onChange={(e) => setVat(e.target.value)}
                  className="h-12! rounded-md"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Paid Amount</Label>
                <Input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="h-12! rounded-md"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-1">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`h-12! w-full rounded-md ${
                    errors.date ? "border-red-500" : ""
                  }`}
                  placeholder="mm/dd/yyyy"
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Discount</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="h-12! rounded-md"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Due Amount</Label>
                <Input
                  type="text"
                  value={totals.dueAmount.toFixed(2)}
                  className="h-12! rounded-md"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 h-12! rounded-md bg-primary hover:bg-primary/80"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {isEdit ? "Updating..." : "Adding..."}
                </>
              ) : isEdit ? (
                "Update Purchase"
              ) : (
                "Add Purchase"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="h-12! w-12 rounded-md"
            >
              <Printer className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
