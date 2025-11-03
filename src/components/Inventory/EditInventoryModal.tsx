// EDIT INVENTORY MODAL - src/components/Inventory/EditInventoryModal.tsx
import { useState, useEffect } from "react";
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

interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onSave: (item: InventoryItem) => void;
  title?: string;
}

export default function EditInventoryModal({
  isOpen,
  onClose,
  item,
  onSave,
  title = "Ingredient",
}: EditInventoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sufficient: "",
    low: "",
    outOfStock: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        sufficient: item.sufficient,
        low: item.low,
        outOfStock: item.outOfStock,
      });
    }
  }, [item]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedItem: InventoryItem = {
      ...item,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedItem);
    toast.success(`${title} updated successfully!`);
    setIsSubmitting(false);
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 z-50 bg-dark/50 backdrop-blur-xs" />
      <DialogContent className="sm:max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Edit {title}
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
