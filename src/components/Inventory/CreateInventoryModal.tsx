// CREATE INVENTORY MODAL - src/components/Inventory/CreateInventoryModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import type { InventoryItem } from "@/types/inventory";

interface CreateInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => void;
  title?: string;
}

export default function CreateInventoryModal({
  isOpen,
  onClose,
  onSave,
  title = "Ingredient",
}: CreateInventoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sufficient: "",
    low: "",
    outOfStock: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newItem: Omit<InventoryItem, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      isActive: true,
    };

    onSave(newItem);
    toast.success(`${title} created successfully!`);
    setIsSubmitting(false);

    // Reset form
    setFormData({
      name: "",
      sufficient: "",
      low: "",
      outOfStock: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 z-50 bg-dark/50 backdrop-blur-xs" />
      <DialogContent className="sm:max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Create {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {title} Name
            </Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="h-12 bg-card"
              placeholder={`Enter ${title.toLowerCase()} name`}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Sufficient
              </Label>
              <Input
                type="text"
                value={formData.sufficient}
                onChange={(e) =>
                  handleInputChange("sufficient", e.target.value)
                }
                className="h-12 bg-card"
                placeholder="e.g., 100 kg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Low</Label>
              <Input
                type="text"
                value={formData.low}
                onChange={(e) => handleInputChange("low", e.target.value)}
                className="h-12 bg-card"
                placeholder="e.g., 10 kg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Out of Stock
              </Label>
              <Input
                type="text"
                value={formData.outOfStock}
                onChange={(e) =>
                  handleInputChange("outOfStock", e.target.value)
                }
                className="h-12 bg-card"
                placeholder="e.g., 0 kg"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-md bg-primary hover:bg-primary/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                `Create ${title}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
