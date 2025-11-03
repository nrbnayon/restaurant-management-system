// EDIT MENU PAGE - src/Pages/Dashboard/Menu/EditMenuPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import MenuForm from "@/components/Menu/MenuForm";
import { mockMenuItems } from "@/data/mockMenu";
import type { MenuItem } from "@/types/menu";

export default function EditMenuPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMenuItem = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundItem = mockMenuItems.find((item) => item.id === id);

      if (foundItem) {
        // Transform the data to match MenuForm's expected structure
        const transformedItem = {
          ...foundItem,
          variants: foundItem.sizes?.map((size, index) => ({
            id: size.id || `variant-${index}`,
            name: size.size,
            cost: size.regularPrice,
            price: size.offerPrice,
            discount: parseFloat(
              (
                ((size.regularPrice - size.offerPrice) / size.regularPrice) *
                100
              ).toFixed(0)
            ),
            ingredients: foundItem.ingredients || [],
          })) || [
            {
              id: "variant-1",
              name: "",
              cost: 0,
              price: 0,
              discount: 0,
              ingredients: foundItem.ingredients || [],
            },
          ],
        };

        setMenuItem(transformedItem as MenuItem);
      } else {
        toast.error("Menu item not found");
        navigate("/dashboard/menu");
      }

      setIsLoading(false);
    };

    fetchMenuItem();
  }, [id, navigate]);

  const handleSubmit = async (formData: Partial<MenuItem>) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form data::", formData);
    toast.success("Menu item updated successfully!");
    setIsSubmitting(false);
    navigate("/dashboard/menu");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!menuItem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/menu")}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Edit Menu</h1>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <MenuForm
          initialData={menuItem}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Save"
        />
      </div>
    </div>
  );
}
