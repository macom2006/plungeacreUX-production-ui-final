import type { ReactNode } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select, type SelectOption } from "./Select";
import "./DataDisplay.css";

export interface FilterBarProps {
  activeFilterCount?: number;
  additionalFilters?: ReactNode;
  dateFilter?: ReactNode;
  onClearAll?: () => void;
  onOpenFilters?: () => void;
  onSearchChange: (value: string) => void;
  onStatusChange?: (value: string) => void;
  searchLabel?: string;
  searchValue: string;
  statusOptions?: SelectOption[];
  statusValue?: string;
}

export function FilterBar({
  activeFilterCount = 0,
  additionalFilters,
  dateFilter,
  onClearAll,
  onOpenFilters,
  onSearchChange,
  onStatusChange,
  searchLabel = "Search records",
  searchValue,
  statusOptions,
  statusValue,
}: FilterBarProps) {
  return (
    <div className="filter-bar" role="search">
      <label className="sr-only" htmlFor="filter-bar-search">{searchLabel}</label>
      <Input
        id="filter-bar-search"
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        onClear={searchValue ? () => onSearchChange("") : undefined}
        placeholder={searchLabel}
        type="search"
        value={searchValue}
      />
      {statusOptions && onStatusChange ? (
        <Select
          aria-label="Filter by status"
          onChange={(event) => onStatusChange(event.currentTarget.value)}
          options={statusOptions}
          value={statusValue}
        />
      ) : null}
      {dateFilter}
      {additionalFilters}
      <Button onClick={onOpenFilters} variant="secondary">
        Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
      </Button>
      {onClearAll ? (
        <Button disabled={activeFilterCount === 0} onClick={onClearAll} variant="ghost">
          Clear all
        </Button>
      ) : null}
    </div>
  );
}
