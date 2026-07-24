import { cn } from "../../lib/cn";
import { Button } from "./Button";
import type { ReactNode } from "react";
import "./Navigation.css";

export interface PaginationProps {
  className?: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSizeSlot?: ReactNode;
  resultsSummary?: ReactNode;
  totalPages: number;
}

export function Pagination({
  className,
  currentPage,
  onPageChange,
  pageSizeSlot,
  resultsSummary,
  totalPages,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className={cn("pagination", className)}>
      {resultsSummary ? <div className="pagination__summary">{resultsSummary}</div> : null}
      <div className="pagination__controls">
        <Button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          variant="secondary"
        >
          Previous
        </Button>
        <ol>
          {pages.map((page) => (
            <li key={page}>
              <Button
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange(page)}
                size="icon"
                variant={page === currentPage ? "primary" : "ghost"}
              >
                {page}
              </Button>
            </li>
          ))}
        </ol>
        <Button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          variant="secondary"
        >
          Next
        </Button>
      </div>
      {pageSizeSlot ? <div className="pagination__page-size">{pageSizeSlot}</div> : null}
    </nav>
  );
}
