
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
  Box
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { useAuth } from "../context/AuthContext";

import type { Student } from '../Types/Student';
import { deleteStudent, deleteStudents, fetchStudents } from '../api/students';

export default function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  
  
  const { isAdmin, user } = useAuth();

  console.log('Current user:', user); 
  console.log(' Is admin:', isAdmin);

  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students');
      console.error('Error loading students:', err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = students.map(student => student.id);
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
    } catch (err) {
      setError('Failed to delete student');
      console.error('Error deleting student:', err);
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
    } catch (err) {
      setError('Failed to delete students');
      console.error('Error deleting students:', err);
    }
  };

  const handleAddStudent = () => {
    if (!isAdmin) {
      setError('Only administrators can add students');
      return;
    }
    
    console.log('Open add student dialog');
  };

  const handleEditStudent = (student: Student) => {
    if (!isAdmin) {
      setError('Only administrators can edit students');
      return;
    }
    
    console.log('Open edit student dialog for:', student);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      
      {isAdmin && (
        <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Add Student">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddStudent}
              color="primary"
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
        </Box>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              
              {isAdmin && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < students.length}
                    checked={students.length > 0 && selected.length === students.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              
              <TableCell>Name</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Attendance</TableCell>
              <TableCell>Assignments</TableCell>
              <TableCell>Rating</TableCell>
              
              
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {students.map((student) => (
              <TableRow hover key={student.id}>
                
                {isAdmin && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.indexOf(student.id) !== -1}
                      onChange={() => handleSelect(student.id)}
                    />
                  </TableCell>
                )}
                
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.attendance}</TableCell>
                <TableCell>{student.assignments}</TableCell>
                <TableCell>{student.rating}</TableCell>
                
                
                {isAdmin && (
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditStudent(student)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(student.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {students.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          No students found
        </Box>
      )}
    </Paper>
  );
}