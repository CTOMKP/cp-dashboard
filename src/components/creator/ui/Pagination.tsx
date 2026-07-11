"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-creator-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-creator-text-secondary">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="creator-btn-outline inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="creator-btn-outline inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
