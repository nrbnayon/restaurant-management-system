
// MOCK DATA - src/data/mockMenu.ts
import type { Category, MenuItem } from "@/types/menu";
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Main Course",
    subCategories: [
      { id: "sub-1", name: "Chowmein", categoryId: "cat-1" },
      { id: "sub-2", name: "Rice", categoryId: "cat-1" },
      { id: "sub-3", name: "Pasta", categoryId: "cat-1" },
    ],
  },
  {
    id: "cat-2",
    name: "Appetizers",
    subCategories: [
      { id: "sub-4", name: "Soup", categoryId: "cat-2" },
      { id: "sub-5", name: "Salad", categoryId: "cat-2" },
    ],
  },
  {
    id: "cat-3",
    name: "Desserts",
    subCategories: [
      { id: "sub-6", name: "Ice Cream", categoryId: "cat-3" },
      { id: "sub-7", name: "Cake", categoryId: "cat-3" },
    ],
  },
];

export const mockIngredients = [
  { id: "ing-1", name: "Tomato", availableQty: 544, consumptionQty: 2 },
  { id: "ing-2", name: "Potato", availableQty: 544, consumptionQty: 2 },
  { id: "ing-3", name: "Chicken", availableQty: 544, consumptionQty: 2 },
  { id: "ing-4", name: "Onion", availableQty: 300, consumptionQty: 1 },
  { id: "ing-5", name: "Garlic", availableQty: 200, consumptionQty: 1 },
];

export const mockExtraIngredients = [
  { id: "extra-1", name: "Cheese", price: 1 },
  { id: "extra-2", name: "Chicken", price: 1 },
  { id: "extra-3", name: "Mushroom", price: 0.5 },
  { id: "extra-4", name: "Olives", price: 0.75 },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: "menu-1",
    name: "Special Chowmein",
    category: "Main Course",
    subCategory: "Chowmein",
    description:
      "A savory chowmein tossed with special sauces and fresh ingredients.",
    image: "/foods/food1.png",
    cookingTime: "20 min",
    ingredients: [
      { id: "ing-1", name: "Tomato", availableQty: 544, consumptionQty: 2 },
      { id: "ing-2", name: "Potato", availableQty: 544, consumptionQty: 2 },
      { id: "ing-3", name: "Chicken", availableQty: 544, consumptionQty: 2 },
    ],
    extraIngredients: [
      { id: "extra-1", name: "Cheese", price: 1 },
      { id: "extra-2", name: "Chicken", price: 1 },
    ],
    sizes: [
      { id: "size-1", size: "Regular", regularPrice: 10.99, offerPrice: 9.99 },
    ],
    isActive: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
  },
  {
    id: "menu-2",
    name: "Chicken Pasta",
    category: "Main Course",
    subCategory: "Pasta",
    description: "Creamy pasta with grilled chicken and herbs.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    cookingTime: "25 min",
    ingredients: [
      { id: "ing-3", name: "Chicken", availableQty: 544, consumptionQty: 3 },
      { id: "ing-4", name: "Onion", availableQty: 300, consumptionQty: 1 },
    ],
    extraIngredients: [{ id: "extra-1", name: "Cheese", price: 1 }],
    sizes: [
      { id: "size-2", size: "Regular", regularPrice: 12.99, offerPrice: 11.99 },
      { id: "size-3", size: "Large", regularPrice: 16.99, offerPrice: 14.99 },
    ],
    isActive: true,
    createdAt: "2025-01-14",
    updatedAt: "2025-01-14",
  },
  {
    id: "menu-3",
    name: "Veggie Chowmein",
    category: "Main Course",
    subCategory: "Chowmein",
    description: "Healthy vegetable chowmein with mixed vegetables.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400",
    cookingTime: "15 min",
    ingredients: [
      { id: "ing-1", name: "Tomato", availableQty: 544, consumptionQty: 1 },
      { id: "ing-2", name: "Potato", availableQty: 544, consumptionQty: 1 },
      { id: "ing-4", name: "Onion", availableQty: 300, consumptionQty: 1 },
    ],
    extraIngredients: [],
    sizes: [
      { id: "size-4", size: "Regular", regularPrice: 8.99, offerPrice: 7.99 },
    ],
    isActive: false,
    createdAt: "2025-01-13",
    updatedAt: "2025-01-13",
  },
];
