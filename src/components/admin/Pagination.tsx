import { Button } from "@/components/ui/button";
import type { PaginationInfo } from "@/lib/admin";

type PaginationProps = {
  pagination: PaginationInfo;
  loading?: boolean;
  onPage: (page: number) => void;
};

export function Pagination({ pagination, loading, onPage }: PaginationProps) {
  if (pagination.totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-3"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page <= 1 || loading}
        onClick={() => onPage(pagination.page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page >= pagination.totalPages || loading}
        onClick={() => onPage(pagination.page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}