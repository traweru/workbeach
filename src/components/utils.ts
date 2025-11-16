import type { HeadCell, Student } from "../Types/Student";
import type { Order } from "../Types/Table";


export function createData(
  id: number,
  name: string,
  grade: number,
  attendance: number,
  assignments: number,
  rating: number,
): Student {
  return {
    id,
    name,
    grade,
    attendance,
    assignments,
    rating,
  };
}

export const initialStudents = [
  createData(1, 'Иван Петров', 85, 92, 12, 4.3),
  createData(2, 'Мария Сидорова', 92, 88, 15, 4.9),
  createData(3, 'Алексей Козлов', 78, 95, 10, 3.9),
  createData(4, 'Елена Волкова', 91, 90, 14, 4.7),
  createData(5, 'Дмитрий Смирнов', 67, 85, 8, 3.5),
  createData(6, 'Ольга Новикова', 88, 93, 13, 4.4),
  createData(7, 'Сергей Иванов', 76, 87, 11, 3.8),
  createData(8, 'Анна Кузнецова', 94, 96, 16, 4.9),
  createData(9, 'Павел Белов', 82, 89, 12, 4.1),
  createData(10, 'Наталья Орлова', 89, 91, 14, 4.5),
  createData(11, 'Михаил Соколов', 71, 83, 9, 3.6),
  createData(12, 'Татьяна Морозова', 96, 97, 15, 4.8),
  createData(13, 'Андрей Павлов', 79, 86, 10, 3.9),
];

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
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
    label: 'Студент',
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