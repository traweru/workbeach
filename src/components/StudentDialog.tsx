// components/StudentDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import type { Student } from '../Types/Student';

interface StudentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (studentData: Omit<Student, 'id'>) => void;
  student?: Student;
}

export const StudentDialog: React.FC<StudentDialogProps> = ({
  open,
  onClose,
  onSave,
  student
}) => {
  const [formData, setFormData] = useState({
    name: '',
    grade: 0,
    attendance: 0,
    assignments: 0,
    rating: 0
  });

  
  useEffect(() => {
    if (open) {
      if (student) {
        
        setFormData({
          name: student.name,
          grade: student.grade,
          attendance: student.attendance,
          assignments: student.assignments,
          rating: student.rating
        });
      } else {
        
        setFormData({
          name: '',
          grade: 0,
          attendance: 0,
          assignments: 0,
          rating: 0
        });
      }
    }
  }, [open, student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  const handleSave = () => {
    // Валидация
    if (!formData.name.trim()) {
      alert('Please enter student name');
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {student ? 'Edit Student' : 'Add New Student'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="name"
            label="Student Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="grade"
            label="Grade"
            type="number"
            value={formData.grade}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            name="attendance"
            label="Attendance (%)"
            type="number"
            value={formData.attendance}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            name="assignments"
            label="Assignments Completed"
            type="number"
            value={formData.assignments}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
          />
          <TextField
            name="rating"
            label="Rating"
            type="number"
            value={formData.rating}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, max: 10, step: 0.1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {student ? 'Update' : 'Add'} Student
        </Button>
      </DialogActions>
    </Dialog>
  );
};