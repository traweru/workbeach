import type { HeadCell, Student } from "../Student";

export type Order = 'asc' | 'desc';
export interface EnhancedTableHeadProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Student) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: readonly HeadCell[];
  isAdmin: boolean; 
}
export interface EnhancedTableToolbarProps {
  numSelected: number;
}
