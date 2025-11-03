// src/components/Menu/MenuForm.tsx
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ImageUp } from "lucide-react";
import {
  mockCategories,
  mockIngredients,
  mockExtraIngredients,
} from "@/data/mockMenu";
import type { MenuItem, ExtraIngredient, Ingredient } from "@/types/menu";

interface MenuFormProps {
  initialData: Partial<MenuItem>;
  onSubmit: (data: Partial<MenuItem>) => void;
  isSubmitting: boolean;
  submitButtonText: string;
}

interface Variant {
  id: string;
  name: string;
  cost: number;
  price: number;
  discount: number;
  ingredients: Ingredient[];
}

export default function MenuForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText,
}: MenuFormProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>(initialData);
  const [imagePreview, setImagePreview] = useState(initialData.image || "");
  const [airViewPreview, setAirViewPreview] = useState(
    initialData.airViewImage || ""
  );
  const [isHovering, setIsHovering] = useState(false);
  const [autoRotation, setAutoRotation] = useState({ x: 0, y: 0 });
  const [hasVariants, setHasVariants] = useState(true);

  // Initialize with a default variant that includes the first ingredient
  const getDefaultVariant = (): Variant => {
    const firstIngredient = mockIngredients[0];
    return {
      id: "variant-1",
      name: "",
      cost: 0,
      price: 0,
      discount: 0,
      ingredients: firstIngredient ? [{ ...firstIngredient }] : [],
    };
  };

  const [variants, setVariants] = useState<Variant[]>([getDefaultVariant()]);
  const [extraIngredients, setExtraIngredients] = useState<ExtraIngredient[]>(
    initialData.extraIngredients || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const imageInputRef = useRef<HTMLInputElement>(null);
  const airViewInputRef = useRef<HTMLInputElement>(null);
  const airViewContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const subCategories =
    mockCategories.find((cat) => cat.name === formData.category)
      ?.subCategories || [];

  // Initialize variants from initialData
  useEffect(() => {
    if (initialData.variants && initialData.variants.length > 0) {
      setVariants(initialData.variants);
    }
  }, [initialData.variants]);

  // Automatic 3D rotation effect
  useEffect(() => {
    if (!airViewPreview || isHovering) return;

    let angle = 0;
    const animate = () => {
      angle += 0.5; // Rotation speed
      const rotateY = Math.sin(angle * 0.02) * 15; // Oscillate between -15 and 15 degrees
      const rotateX = Math.cos(angle * 0.015) * 10; // Oscillate between -10 and 10 degrees

      setAutoRotation({ x: rotateX, y: rotateY });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [airViewPreview, isHovering]);

  // Apply rotation to image
  useEffect(() => {
    if (!airViewContainerRef.current || isHovering) return;

    const img = airViewContainerRef.current.querySelector(
      ".air-view-image"
    ) as HTMLElement;

    if (img) {
      img.style.transform = `perspective(1000px) rotateX(${autoRotation.x}deg) rotateY(${autoRotation.y}deg) scale3d(1, 1, 1)`;
    }
  }, [autoRotation, isHovering]);

  const handleInputChange = (
    field: keyof MenuItem,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "airView"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === "image") {
          setImagePreview(result);
          handleInputChange("image", result);
        } else {
          setAirViewPreview(result);
          handleInputChange("airViewImage", result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handle3DMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!airViewContainerRef.current) return;

    const container = airViewContainerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -20; // Increased range for more dramatic effect
    const rotateY = ((x - centerX) / centerX) * 20;

    const img = container.querySelector(".air-view-image") as HTMLElement;
    if (img) {
      img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }
  };

  const handle3DMouseEnter = () => {
    setIsHovering(true);
  };

  const handle3DMouseLeave = () => {
    setIsHovering(false);

    if (!airViewContainerRef.current) return;

    const img = airViewContainerRef.current.querySelector(
      ".air-view-image"
    ) as HTMLElement;

    if (img) {
      // Resume automatic rotation smoothly
      img.style.transition = "transform 0.5s ease-out";
      setTimeout(() => {
        if (img) {
          img.style.transition = "transform 0.1s ease-out";
        }
      }, 500);
    }
  };

  const handleAddIngredientToVariant = (
    variantIndex: number,
    ingredientId: string
  ) => {
    const ingredient = mockIngredients.find((ing) => ing.id === ingredientId);
    if (
      ingredient &&
      !variants[variantIndex].ingredients.some((i) => i.id === ingredientId)
    ) {
      setVariants((prev) =>
        prev.map((v, i) =>
          i === variantIndex
            ? {
                ...v,
                ingredients: [...v.ingredients, { ...ingredient }],
              }
            : v
        )
      );
    }
  };

  const handleRemoveIngredientFromVariant = (
    variantIndex: number,
    ingredientId: string
  ) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === variantIndex
          ? {
              ...v,
              ingredients: v.ingredients.filter(
                (ing) => ing.id !== ingredientId
              ),
            }
          : v
      )
    );
  };

  const handleIngredientConsumptionChange = (
    variantIndex: number,
    ingredientId: string,
    consumptionQty: number
  ) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === variantIndex
          ? {
              ...v,
              ingredients: v.ingredients.map((ing) =>
                ing.id === ingredientId ? { ...ing, consumptionQty } : ing
              ),
            }
          : v
      )
    );
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `variant-${Date.now()}`,
        name: "",
        cost: 0,
        price: 0,
        discount: 0,
        ingredients: [],
      },
    ]);
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleAddExtraIngredient = () => {
    setExtraIngredients((prev) => [
      ...prev,
      {
        id: `extra-${Date.now()}`,
        name: "",
        price: 0,
      },
    ]);
  };

  const handleRemoveExtraIngredient = (index: number) => {
    setExtraIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExtraIngredientChange = (
    index: number,
    field: keyof ExtraIngredient,
    value: string | number
  ) => {
    setExtraIngredients((prev) =>
      prev.map((extra, i) =>
        i === index ? { ...extra, [field]: value } : extra
      )
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.subCategory) {
      newErrors.subCategory = "Sub category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      extraIngredients,
      variants: hasVariants ? variants : undefined,
    };

    onSubmit(submitData);
  };

  const handleImageFile = (file: File, type: "image" | "airView") => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === "image") {
        setImagePreview(result);
        handleInputChange("image", result);
      } else {
        setAirViewPreview(result);
        handleInputChange("airViewImage", result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, type: "image" | "airView") => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageFile(file, type);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-card rounded-2xl border border-border p-6"
    >
      {/* Upload Images Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Image */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Upload Image</Label>
          <div
            onClick={() => imageInputRef.current?.click()}
            onDrop={(e) => handleDrop(e, "image")}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-background min-h-[200px]"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mb-3"
              />
            ) : (
              <>
                <ImageUp className="w-16 h-16 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground text-center">
                  Drag & drop or click to upload
                </p>
              </>
            )}
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "image")}
            className="hidden"
          />
        </div>

        {/* Upload 3D Air View with Interactive 3D Effect */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Upload 3D Image</Label>
          <div className="flex flex-col items-center gap-3">
            <div
              ref={airViewContainerRef}
              onMouseMove={handle3DMouseMove}
              onMouseEnter={handle3DMouseEnter}
              onMouseLeave={handle3DMouseLeave}
              onDrop={(e) => handleDrop(e, "airView")}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              className="w-52 h-52 rounded-full cursor-pointer relative group"
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
            >
              {airViewPreview ? (
                <div className="w-full h-full rounded-full overflow-hidden bg-linear-to-br from-blue-50 to-purple-100 border-4 border-white shadow-xl">
                  <img
                    src={airViewPreview}
                    alt="Air View Preview"
                    className="air-view-image w-full h-full object-cover transition-transform duration-100 ease-out"
                    style={{
                      transform:
                        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
                      transformStyle: "preserve-3d",
                      willChange: "transform",
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-linear-to-br from-blue-50 to-purple-100 border-4 border-white shadow-xl flex flex-col items-center justify-center text-center p-4">
                  <ImageUp className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500 font-medium">
                    Drag & drop or click to upload
                  </p>
                </div>
              )}
              {/* Hidden click trigger for file input */}
              <div
                onClick={() => airViewInputRef.current?.click()}
                className="absolute inset-0 rounded-full"
              />
            </div>
            <input
              ref={airViewInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "airView")}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Food Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Food Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">
              Item Name
            </Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter item name"
              className={`h-12 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cookingTime" className="text-sm">
              Cooking Time
            </Label>
            <Input
              id="cookingTime"
              value={formData.cookingTime || ""}
              onChange={(e) => handleInputChange("cookingTime", e.target.value)}
              placeholder="00 min"
              className="h-12"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">
              Category
            </Label>
            <Select
              value={formData.category || ""}
              onValueChange={(value) => {
                handleInputChange("category", value);
                handleInputChange("subCategory", "");
              }}
            >
              <SelectTrigger
                id="category"
                className={`h-12! w-full  ${
                  errors.category ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {mockCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCategory" className="text-sm">
              Sub Category
            </Label>
            <Select
              value={formData.subCategory || ""}
              onValueChange={(value) => handleInputChange("subCategory", value)}
              disabled={!formData.category}
            >
              <SelectTrigger
                id="subCategory"
                className={`h-12! w-full ${
                  errors.subCategory ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select Sub-Category" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.name}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subCategory && (
              <p className="text-xs text-red-500">{errors.subCategory}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Write description"
            rows={3}
            className="resize-none"
          />
        </div>
      </div>

      {/* Product has variants? */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Product has variants?</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {hasVariants ? "Enabled" : "Disabled"}
            </span>
            <Switch checked={hasVariants} onCheckedChange={setHasVariants} />
          </div>
        </div>

        {hasVariants && (
          <div className="space-y-6">
            {variants.map((variant, variantIndex) => (
              <div
                key={variant.id}
                className="space-y-4 p-4 border border-border rounded-lg bg-background"
              >
                {/* Ingredient Selection */}
                <div className="space-y-2">
                  <Select
                    value=""
                    onValueChange={(value) =>
                      handleAddIngredientToVariant(variantIndex, value)
                    }
                  >
                    <SelectTrigger className="h-12! w-full bg-card">
                      <SelectValue placeholder="Select an ingredient to include" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockIngredients
                        .filter(
                          (ing) =>
                            !variant.ingredients.some((i) => i.id === ing.id)
                        )
                        .map((ing) => (
                          <SelectItem key={ing.id} value={ing.id}>
                            {ing.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ingredients Table */}
                {variant.ingredients.length > 0 && (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full">
                      <thead className="bg-primary text-white">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium">
                            Name
                          </th>
                          <th className="text-center px-4 py-3 text-sm font-medium">
                            Available QTY
                          </th>
                          <th className="text-center px-4 py-3 text-sm font-medium">
                            Consumption QTY
                          </th>
                          <th className="text-center px-4 py-3 text-sm font-medium">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {variant.ingredients.map((ing) => (
                          <tr
                            key={ing.id}
                            className="border-t border-border bg-card"
                          >
                            <td className="px-4 py-3 text-sm">{ing.name}</td>
                            <td className="text-center px-4 py-3 text-sm">
                              {ing.availableQty} kg
                            </td>
                            <td className="text-center px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <Input
                                  type="number"
                                  value={ing.consumptionQty}
                                  onChange={(e) =>
                                    handleIngredientConsumptionChange(
                                      variantIndex,
                                      ing.id,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-20 h-9 text-center"
                                  min="0"
                                />
                                <Select defaultValue="kg">
                                  <SelectTrigger className="w-20 h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="kg">kg</SelectItem>
                                    <SelectItem value="g">g</SelectItem>
                                    <SelectItem value="lb">lb</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </td>
                            <td className="text-center px-4 py-3">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveIngredientFromVariant(
                                    variantIndex,
                                    ing.id
                                  )
                                }
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Variant Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Variant name</Label>
                    <Input
                      value={variant.name}
                      onChange={(e) =>
                        handleVariantChange(
                          variantIndex,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Enter variant name"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Cost</Label>
                    <Input
                      type="number"
                      value={variant.cost}
                      onChange={(e) =>
                        handleVariantChange(
                          variantIndex,
                          "cost",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="$10.99"
                      className="h-12"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Price</Label>
                    <Input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(
                          variantIndex,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="$9.99"
                      className="h-12"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Discount (%)</Label>
                    <Input
                      type="number"
                      value={variant.discount}
                      onChange={(e) =>
                        handleVariantChange(
                          variantIndex,
                          "discount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0%"
                      className="h-12"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={handleAddVariant}
              variant="outline"
              className="w-full h-12 gap-2 border-dashed bg-primary/50 hover:bg-primary/70 text-foreground"
            >
              <Plus className="w-4 h-4" />
              Add More Variants
            </Button>
          </div>
        )}
      </div>

      {/* Extra Ingredients */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Extra Ingredients</h3>
          <Button
            type="button"
            onClick={handleAddExtraIngredient}
            className="gap-2 h-10 bg-primary hover:bg-primary/80"
          >
            <Plus className="w-4 h-4" />
            Add Extra Ingredient
          </Button>
        </div>

        {extraIngredients.map((extra, index) => (
          <div key={extra.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={extra.name}
              onValueChange={(value) =>
                handleExtraIngredientChange(index, "name", value)
              }
            >
              <SelectTrigger className="h-12! w-full">
                <SelectValue placeholder="Cheese" />
              </SelectTrigger>
              <SelectContent>
                {mockExtraIngredients.map((ing) => (
                  <SelectItem key={ing.id} value={ing.name}>
                    {ing.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                type="number"
                value={extra.price}
                onChange={(e) =>
                  handleExtraIngredientChange(
                    index,
                    "price",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="$1"
                className="h-12"
                step="0.01"
                min="0"
              />
              {extraIngredients.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveExtraIngredient(index)}
                  className="h-12 w-11 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-border text-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className=" bg-primary hover:bg-primary/80 h-12 text-base font-semibold"
        >
          {isSubmitting ? "Saving..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
