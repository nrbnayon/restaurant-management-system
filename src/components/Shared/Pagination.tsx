// src\components\Shared\Pagination.tsx
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  showPrevNext?: boolean;
  showIfSinglePage?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showPrevNext = true,
  showIfSinglePage = false,
  className = "",
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            onClick={() => onPageChange(i)}
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
      // Complex pagination with ellipsis
      pages.push(
        <Button
          key={1}
          onClick={() => onPageChange(1)}
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
          <span key="ellipsis1" className="text-muted-foreground px-2">
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
            onClick={() => onPageChange(i)}
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
          <span key="ellipsis2" className="text-muted-foreground px-2">
            ...
          </span>
        );
      }

      pages.push(
        <Button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
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

  // Don't show pagination if only 1 page (unless explicitly requested)
  if (totalPages <= 1 && !showIfSinglePage) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {showPrevNext && (
        <Button
          variant="outline"
          className="rounded-md bg-card shadow-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </Button>
      )}

      <div className="flex items-center gap-2">{renderPageNumbers()}</div>

      {showPrevNext && (
        <Button
          variant="outline"
          className="rounded-md bg-card shadow-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </Button>
      )}
    </div>
  );
}
