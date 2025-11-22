import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  IconButton,
  Tooltip,
  Alert,
  Box,
  TablePagination,
  TableSortLabel,
  Typography
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { useAuth } from "../context/AuthContext";
import type { Student } from '../Types/Student';
import { StudentDialog } from './StudentDialog';
import { createStudent, deleteStudent, deleteStudents, fetchStudents, updateStudent } from '../api/students';

interface HeadCell {
  id: keyof Student;
  label: string;
  sortable: boolean;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Name', sortable: true, numeric: false },
  { id: 'grade', label: 'Grade', sortable: true, numeric: true },
  { id: 'attendance', label: 'Attendance', sortable: true, numeric: true },
  { id: 'assignments', label: 'Assignments', sortable: true, numeric: true },
  { id: 'rating', label: 'Rating', sortable: true, numeric: true },
];

export default function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { isAdmin } = useAuth();

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Student>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to load students');
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSort = (property: keyof Student) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedStudents = React.useMemo(() => {
    return [...students].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, order, orderBy]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleStudents = React.useMemo(() => {
    return sortedStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedStudents, page, rowsPerPage]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = visibleStudents.map(student => student.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

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

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      setError('Only administrators can delete students');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await deleteStudent(id);
      await loadStudents();
      setSelected(selected.filter(selectedId => selectedId !== id));
      setSuccess('Student deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to delete student');
    }
  };

  const handleBulkDelete = async () => {
    if (!isAdmin) {
      setError('Only administrators can delete students');
      return;
    }

    if (selected.length === 0) {
      setError('No students selected');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selected.length} students?`)) {
      return;
    }

    try {
      await deleteStudents(selected);
      await loadStudents();
      setSelected([]);
      setSuccess(`${selected.length} students deleted successfully`);
      setTimeout(() => setSuccess(''), 3000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to delete students');
    }
  };

  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      await createStudent(studentData);
      await loadStudents();
      setOpenAddDialog(false);
      setSuccess('Student added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add student: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleEditStudent = (student: Student) => {
    if (!isAdmin) {
      setError('Only administrators can edit students');
      return;
    }
    setEditingStudent(student);
  };

  const handleSaveEdit = async (studentData: Omit<Student, 'id'>) => {
    if (!editingStudent) return;
    
    try {
      await updateStudent(editingStudent.id, studentData);
      await loadStudents();
      setEditingStudent(null);
      setSuccess('Student updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update student: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {isAdmin && (
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Tooltip title="Add Student">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
              sx={{ 
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#45a049' }
              }}
            >
              Add Student
            </Button>
          </Tooltip>
          
          <Tooltip title="Delete Selected">
            <span>
              <Button
                variant="outlined"
                startIcon={<Delete />}
                onClick={handleBulkDelete}
                disabled={selected.length === 0}
                color="error"
              >
                Delete Selected ({selected.length})
              </Button>
            </span>
          </Tooltip>

          <Typography sx={{ flex: 1 }} />
          
          <Typography variant="body2" color="text.secondary">
            Total: {students.length} students
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mx: 2, mt: 1 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mx: 2, mt: 1 }}>
          {success}
        </Alert>
      )}

      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <TableHead>
            <TableRow>
              {isAdmin && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < visibleStudents.length}
                    checked={visibleStudents.length > 0 && selected.length === visibleStudents.length}
                    onChange={handleSelectAll}
                    inputProps={{ 'aria-label': 'select all students' }}
                  />
                </TableCell>
              )}
              
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{ fontWeight: 'bold' }}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
              
              {isAdmin && (
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {visibleStudents.map((student, index) => {
              const isItemSelected = isSelected(student.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={student.id}
                  selected={isItemSelected}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  {isAdmin && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                        onChange={() => handleSelect(student.id)}
                      />
                    </TableCell>
                  )}
                  
                  <TableCell component="th" id={labelId} scope="row">
                    {student.name}
                  </TableCell>
                  <TableCell align="right">{student.grade}</TableCell>
                  <TableCell align="right">{student.attendance}</TableCell>
                  <TableCell align="right">{student.assignments}</TableCell>
                  <TableCell align="right">{student.rating}</TableCell>
                  
                  {isAdmin && (
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditStudent(student);
                            }}
                            color="primary"
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: 'primary.light',
                                transform: 'scale(1.1)' 
                              },
                              transition: 'all 0.2s'
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(student.id);
                            }}
                            color="error"
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: 'error.light',
                                transform: 'scale(1.1)' 
                              },
                              transition: 'all 0.2s'
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            
            {visibleStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 7 : 6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No students found
                  </Typography>
                </TableCell>
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
        onPageChange={(_, newPage) => handleChangePage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: 1, borderColor: 'divider' }}
      />

      <StudentDialog 
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSave={handleAddStudent}
      />
      
      <StudentDialog 
        open={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveEdit}
        student={editingStudent || undefined}
      />
    </Paper>
  );
}