import { useId, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select, type SelectOption } from "./Select";
import "./DataDisplay.css";

export interface FilterBarProps {
  activeFilterCount?: number;
  additionalFilters?: ReactNode;
  dateFilter?: ReactNode;
  layout?: "desktop" | "compact" | "drawer";
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
  layout = "desktop",
  onClearAll,
  onOpenFilters,
  onSearchChange,
  onStatusChange,
  searchLabel = "Search records",
  searchValue,
  statusOptions,
  statusValue,
}: FilterBarProps) {
  const searchId = useId();

  return (
    <div className={cn("filter-bar", `filter-bar--${layout}`)} role="search">
      <div className="filter-bar__search">
        <label className="sr-only" htmlFor={searchId}>{searchLabel}</label>
      <Input
        id={searchId}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        onClear={searchValue ? () => onSearchChange("") : undefined}
        placeholder={searchLabel}
        type="search"
        value={searchValue}
      />
      </div>
      {statusOptions && onStatusChange ? (
        <div className="filter-bar__control">
        <Select
          aria-label="Filter by status"
          onChange={(event) => onStatusChange(event.currentTarget.value)}
          options={statusOptions}
          value={statusValue}
        />
        </div>
      ) : null}
      {dateFilter ? <div className="filter-bar__control">{dateFilter}</div> : null}
      {additionalFilters ? <div className="filter-bar__control">{additionalFilters}</div> : null}
      <div className="filter-bar__actions">
        <Button onClick={onOpenFilters} variant="secondary">
          Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
        </Button>
        {onClearAll ? (
          <Button disabled={activeFilterCount === 0} onClick={onClearAll} variant="ghost">
            Clear all
          </Button>
        ) : null}
      </div>
    </div>
  );
}
