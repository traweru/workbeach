import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { HeadCell, Student } from '../Types/Student';
import type { Order } from '../Types/Table';
import { getComparator, headCells } from './utils';
import { EnhancedTableToolbar } from './EnhancedTableToolbar';
import { EnhancedTableHead } from './EnhancedTableHead';
import { deleteStudents, fetchStudents, updateStudent } from '../api/students';
import { useAuth } from '../context/AuthContext';
import { StudentDialog } from './StudentDialog';


export default function StudentsTable() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');
  
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Student>('grade');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);

  // Загрузка студентов с бэкенда
  React.useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Функция удаления выбранных студентов
  const handleDeleteSelected = async () => {
    if (!isAdmin || selected.length === 0) return;

    try {
      await deleteStudents(selected as number[]);
      // Обновляем список студентов после удаления
      const data = await fetchStudents();
      setStudents(data);
      setSelected([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete students');
    }
  };

  // Функция удаления одного студента
  const handleDeleteStudent = async (id: number) => {
    if (!isAdmin) return;

    try {
      await deleteStudents([id]);
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  // Функция редактирования студента
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setDialogOpen(true);
  };

  // Функция сохранения студента (создание и редактирование)
  const handleSaveStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      if (editingStudent) {
        // Редактирование существующего студента
        await updateStudent(editingStudent.id, studentData);
      }
      // Обновляем список студентов
      const data = await fetchStudents();
      setStudents(data);
      setDialogOpen(false);
      setEditingStudent(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save student');
    }
  };

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Student,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    
    if (event.target.checked) {
      const newSelected = students.map((n: Student) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    if (!isAdmin) return;
    
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Вычисление видимых строк ДО условных рендеров
  const emptyRows = React.useMemo(() =>
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - students.length) : 0,
    [page, rowsPerPage, students.length]
  );

  const visibleRows = React.useMemo(
    () =>
      [...students]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, students],
  );

  // Условный рендеринг ПОСЛЕ всех хуков
  if (loading) {
    return <div>Loading students...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          isAdmin={isAdmin}
          onDeleteSelected={handleDeleteSelected}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={students.length}
              headCells={headCells as HeadCell[]}
              isAdmin={isAdmin}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isAdmin && selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: isAdmin ? 'pointer' : 'default' }}
                  >
                    {isAdmin && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding={isAdmin ? "none" : "normal"}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.grade}</TableCell>
                    <TableCell align="right">{row.attendance}%</TableCell>
                    <TableCell align="right">{row.assignments}</TableCell>
                    <TableCell align="right">{row.rating}</TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStudent(row);
                          }}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStudent(row.id);
                          }}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={isAdmin ? 7 : 5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} из ${count}`
          }
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Компактный вид"
      />

      {/* Диалог редактирования */}
      <StudentDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
    </Box>
  );
}