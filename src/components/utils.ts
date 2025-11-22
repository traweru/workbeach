import type { Student, HeadCell } from '../Types/Student';
import type { Order } from '../Types/Table';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof Student>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: Student[Key] },
  b: { [key in Key]: Student[Key] },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'ФИО студента',
  },
  {
    id: 'grade',
    numeric: true,
    disablePadding: false,
    label: 'Оценка',
  },
  {
    id: 'attendance',
    numeric: true,
    disablePadding: false,
    label: 'Посещаемость (%)',
  },
  {
    id: 'assignments',
    numeric: true,
    disablePadding: false,
    label: 'Выполнено заданий',
  },
  {
    id: 'rating',
    numeric: true,
    disablePadding: false,
    label: 'Рейтинг',
  },
];