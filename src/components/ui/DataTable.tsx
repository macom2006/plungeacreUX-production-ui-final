import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";
import { Checkbox } from "./Checkbox";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";
import "./DataDisplay.css";

export interface DataTableProps extends TableHTMLAttributes<HTMLTableElement> {
  emptyState?: ReactNode;
  errorState?: ReactNode;
  loading?: boolean;
  responsiveLabel?: string;
}

export function DataTable({
  children,
  className,
  emptyState,
  errorState,
  loading = false,
  responsiveLabel = "Data table",
  ...props
}: DataTableProps) {
  if (loading) {
    return <Skeleton type="table-row" />;
  }

  if (errorState) {
    return <div className="data-table__state">{errorState}</div>;
  }

  if (emptyState) {
    return <div className="data-table__state">{emptyState}</div>;
  }

  return (
    <div aria-label={responsiveLabel} className="data-table__wrapper" role="region" tabIndex={0}>
      <table className={cn("data-table", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function DataTableHeader({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>;
}

export function DataTableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export interface DataTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export function DataTableRow({ children, className, selected, ...props }: DataTableRowProps) {
  return (
    <tr aria-selected={selected || undefined} className={cn(selected && "data-table__row--selected", className)} {...props}>
      {children}
    </tr>
  );
}

export function DataTableCell({
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("data-table__cell", className)} {...props}>
      {children}
    </td>
  );
}

export interface SortableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  direction?: "ascending" | "descending" | "none";
  onSort?: () => void;
}

export function SortableHeader({
  children,
  className,
  direction = "none",
  onSort,
  ...props
}: SortableHeaderProps) {
  return (
    <th aria-sort={direction} className={cn("data-table__header", className)} scope="col" {...props}>
      {onSort ? (
        <button className="data-table__sort" onClick={onSort} type="button">
          {children}
          <span aria-hidden="true">{direction === "ascending" ? "↑" : direction === "descending" ? "↓" : "↕"}</span>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface SelectableRowCellProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

export function SelectableRowCell({ checked, label, onChange }: SelectableRowCellProps) {
  return (
    <DataTableCell>
      <Checkbox
        aria-label={label}
        checked={checked}
        label={<span className="sr-only">{label}</span>}
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
    </DataTableCell>
  );
}

export function DefaultTableEmptyState() {
  return (
    <EmptyState
      compact
      description="Adjust filters or search terms to find matching records."
      title="No records found"
    />
  );
}
