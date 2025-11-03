// src/Pages/Dashboard/Category/CategoryPage.tsx
import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, SlidersHorizontal, SquarePen } from "lucide-react";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import DeactivateModal from "@/components/Modals/DeactivateModal";
import AddCategoryModal from "@/components/Category/AddCategoryModal";
import EditCategoryModal from "@/components/Category/EditCategoryModal";
import AddSubCategoryModal from "@/components/Category/AddSubCategoryModal";
import EditSubCategoryModal from "@/components/Category/EditSubCategoryModal";
import {
  mockCategoriesData,
  mockSubCategoriesData,
} from "@/data/mockCategories";
import type { Category, SubCategory } from "@/types/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ViewMode = "category" | "subCategory";

export default function CategoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>(mockCategoriesData);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(
    mockSubCategoriesData
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivateType, setDeactivateType] = useState<
    "category" | "subCategory"
  >("category");
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] =
    useState(false);
  const [isEditSubCategoryModalOpen, setIsEditSubCategoryModalOpen] =
    useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("category");

  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.isActive) ||
        (statusFilter === "deactivate" && !category.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, categories, statusFilter]);

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((subCategory) => {
      const matchesSearch = subCategory.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && subCategory.isActive) ||
        (statusFilter === "deactivate" && !subCategory.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, subCategories, statusFilter]);

  const totalPages = Math.ceil(
    (viewMode === "category"
      ? filteredCategories.length
      : filteredSubCategories.length) / itemsPerPage
  );

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage]);

  const paginatedSubCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSubCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSubCategories, currentPage]);

  const handleCategoryStatusToggle = (category: Category) => {
    if (category.isActive) {
      setSelectedCategory(category);
      setDeactivateType("category");
      setIsDeactivateModalOpen(true);
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, isActive: true } : c))
      );
    }
  };

  const handleSubCategoryStatusToggle = (subCategory: SubCategory) => {
    if (subCategory.isActive) {
      setSelectedSubCategory(subCategory);
      setDeactivateType("subCategory");
      setIsDeactivateModalOpen(true);
    } else {
      setSubCategories((prev) =>
        prev.map((sc) =>
          sc.id === subCategory.id ? { ...sc, isActive: true } : sc
        )
      );
    }
  };

  const handleDeactivate = () => {
    if (deactivateType === "category" && selectedCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id ? { ...c, isActive: false } : c
        )
      );
    } else if (deactivateType === "subCategory" && selectedSubCategory) {
      setSubCategories((prev) =>
        prev.map((sc) =>
          sc.id === selectedSubCategory.id ? { ...sc, isActive: false } : sc
        )
      );
    }
    setIsDeactivateModalOpen(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditSubCategoryModalOpen(true);
  };

  const handleSaveAddCategory = (
    newCategory: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => {
    const category: Category = {
      ...newCategory,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories((prev) => [category, ...prev]);
    setIsAddCategoryModalOpen(false);
  };

  const handleSaveEditCategory = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    setIsEditCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveAddSubCategory = (
    newSubCategory: Omit<SubCategory, "id" | "createdAt" | "updatedAt">
  ) => {
    const subCategory: SubCategory = {
      ...newSubCategory,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSubCategories((prev) => [subCategory, ...prev]);

    // Update category subcategory count
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === newSubCategory.categoryId
          ? { ...cat, subCategoriesCount: cat.subCategoriesCount + 1 }
          : cat
      )
    );

    setIsAddSubCategoryModalOpen(false);
  };

  const handleSaveEditSubCategory = (updatedSubCategory: SubCategory) => {
    setSubCategories((prev) =>
      prev.map((subCategory) =>
        subCategory.id === updatedSubCategory.id
          ? updatedSubCategory
          : subCategory
      )
    );
    setIsEditSubCategoryModalOpen(false);
    setSelectedSubCategory(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-10 h-10 rounded-md ${
              currentPage === i
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-foreground hover:bg-accent"
            }`}
            variant={currentPage === i ? "default" : "ghost"}
          >
            {i}
          </Button>
        );
      }
    } else {
      pages.push(
        <Button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`w-10 h-10 rounded-md ${
            currentPage === 1
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground hover:bg-accent"
          }`}
          variant={currentPage === 1 ? "default" : "ghost"}
        >
          1
        </Button>
      );

      if (currentPage > 3) {
        pages.push(
          <span key="ellipsis1" className="text-muted-foreground">
            ...
          </span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <Button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-10 h-10 rounded-md ${
              currentPage === i
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-foreground hover:bg-accent"
            }`}
            variant={currentPage === i ? "default" : "ghost"}
          >
            {i}
          </Button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="ellipsis2" className="text-muted-foreground">
            ...
          </span>
        );
      }

      pages.push(
        <Button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`w-10 h-10 rounded-md ${
            currentPage === totalPages
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground hover:bg-accent"
          }`}
          variant={currentPage === totalPages ? "default" : "ghost"}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <>
      <DashboardHeader
        title="Categories"
        subtitle="Manage your restaurant categories and sub-categories"
      />

      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        {/* Category List Section */}
        <div className="bg-card rounded-2xl border border-border shadow-sm pb-5">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Category List
            </h2>
            <Button
              onClick={() =>
                viewMode === "category"
                  ? setIsAddCategoryModalOpen(true)
                  : setIsAddSubCategoryModalOpen(true)
              }
              className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/80 shadow-lg hover:shadow-xl rounded-md px-4 py-2.5 text-white transition-all"
            >
              <Plus className="w-5 h-5" />
              {viewMode === "category" ? "Add Category" : "Add Sub-Category"}
            </Button>
          </div>

          {/* View Mode Tabs and Search */}
          <div className="p-5 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setViewMode("category");
                  setCurrentPage(1);
                }}
                className={`flex-1 h-12 rounded-md font-semibold transition-colors ${
                  viewMode === "category"
                    ? "bg-primary text-white hover:bg-primary/80"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Category
              </Button>
              <Button
                onClick={() => {
                  setViewMode("subCategory");
                  setCurrentPage(1);
                }}
                className={`flex-1 h-12 rounded-md font-semibold transition-colors ${
                  viewMode === "subCategory"
                    ? "bg-primary text-white hover:bg-primary/80"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Sub-Category
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={`Search ${
                    viewMode === "category" ? "Category" : "Sub-Category"
                  }...`}
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
                  <SelectItem value="deactivate">Deactivate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Table */}
          {viewMode === "category" && (
            <div className="overflow-x-auto scrollbar-thin mx-auto md:mx-5 border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="text-left p-4 md:pl-20 font-semibold">
                      Name
                    </th>
                    <th className="text-left p-4 font-semibold">Number</th>
                    <th className="text-center p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <TableSkeleton columns={3} />
                  ) : paginatedCategories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-2 md:p-5 text-center">
                        <p className="text-muted-foreground">
                          No categories found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedCategories.map((category, index) => (
                      <tr
                        key={category.id}
                        className={`border-b border-border text-center ${
                          index % 2 === 0 ? "bg-background" : "bg-card"
                        } hover:bg-accent/50 transition-colors`}
                      >
                        <td className="p-2 md:pl-20">
                          <div className="flex items-center justify-left gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-orange-50 to-orange-100">
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://via.placeholder.com/48";
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {category.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 text-sm text-foreground text-left">
                          {category.number}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center justify-center gap-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-accent"
                              onClick={() => handleEditCategory(category)}
                            >
                              <SquarePen className="h-5 w-5 text-foreground" />
                            </Button>
                            <Switch
                              checked={category.isActive}
                              onCheckedChange={() =>
                                handleCategoryStatusToggle(category)
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
          )}

          {/* Sub-Category Table */}
          {viewMode === "subCategory" && (
            <div className="overflow-x-auto scrollbar-thin mx-auto md:mx-5 border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="text-center p-4 font-semibold">Name</th>
                    <th className="text-center p-4 font-semibold">Number</th>
                    <th className="text-center p-4 font-semibold">Category</th>
                    <th className="text-center p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <TableSkeleton columns={4} />
                  ) : paginatedSubCategories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-2 md:p-5 text-center">
                        <p className="text-muted-foreground">
                          No sub-categories found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedSubCategories.map((subCategory, index) => (
                      <tr
                        key={subCategory.id}
                        className={`border-b border-border text-center ${
                          index % 2 === 0 ? "bg-background" : "bg-card"
                        } hover:bg-accent/50 transition-colors`}
                      >
                        <td className="p-2 text-sm text-foreground">
                          {subCategory.name}
                        </td>
                        <td className="p-2 text-sm text-foreground">
                          {subCategory.number}
                        </td>
                        <td className="p-2 text-sm text-foreground">
                          {subCategory.categoryName}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center justify-center gap-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-accent"
                              onClick={() => handleEditSubCategory(subCategory)}
                            >
                              <SquarePen className="h-5 w-5 text-foreground" />
                            </Button>
                            <Switch
                              checked={subCategory.isActive}
                              onCheckedChange={() =>
                                handleSubCategoryStatusToggle(subCategory)
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
          )}
        </div>

        {/* Pagination */}
        {!isLoading &&
          ((viewMode === "category" && paginatedCategories.length > 0) ||
            (viewMode === "subCategory" &&
              paginatedSubCategories.length > 0)) && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                className="rounded-md bg-card shadow-sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </Button>
              <div className="flex items-center gap-2">
                {renderPageNumbers()}
              </div>
              <Button
                variant="outline"
                className="rounded-md bg-card shadow-sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </Button>
            </div>
          )}
      </main>

      {/* Modals */}
      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setSelectedCategory(null);
          setSelectedSubCategory(null);
        }}
        onConfirm={handleDeactivate}
        title={`Are you sure you want to deactivate this ${
          deactivateType === "category" ? "category" : "sub-category"
        }?`}
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSave={handleSaveAddCategory}
      />

      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => {
          setIsEditCategoryModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSave={handleSaveEditCategory}
      />

      <AddSubCategoryModal
        isOpen={isAddSubCategoryModalOpen}
        onClose={() => setIsAddSubCategoryModalOpen(false)}
        categories={categories}
        onSave={handleSaveAddSubCategory}
      />

      <EditSubCategoryModal
        isOpen={isEditSubCategoryModalOpen}
        onClose={() => {
          setIsEditSubCategoryModalOpen(false);
          setSelectedSubCategory(null);
        }}
        categories={categories}
        subCategory={selectedSubCategory}
        onSave={handleSaveEditSubCategory}
      />
    </>
  );
}
