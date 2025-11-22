import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button
} from '@mui/material';
import type { Student } from '../Types/Student';

interface StudentDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (student: Omit<Student, 'id'>) => void;
    student?: Student | null;
}

export function StudentDialog({ open, onClose, onSave, student }: StudentDialogProps) {
    const [formData, setFormData] = React.useState({
        name: '',
        grade: 0,
        attendance: 0,
        assignments: 0,
        rating: 0
    });

    
    React.useEffect(() => {
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
    }, [student, open]);

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {student ? 'Редактировать студента' : 'Добавить нового студента'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Полное имя"
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <TextField
                    margin="dense"
                    label="Оценка"
                    type="number"
                    fullWidth
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: Number(e.target.value)})}
                />
                <TextField
                    margin="dense"
                    label="Посещаемость %"
                    type="number"
                    fullWidth
                    value={formData.attendance}
                    onChange={(e) => setFormData({...formData, attendance: Number(e.target.value)})}
                />
                <TextField
                    margin="dense"
                    label="Выполненные задания"
                    type="number"
                    fullWidth
                    value={formData.assignments}
                    onChange={(e) => setFormData({...formData, assignments: Number(e.target.value)})}
                />
                <TextField
                    margin="dense"
                    label="Рейтинг"
                    type="number"
                    fullWidth
                    inputProps={{ step: "0.1" }} 
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSave} variant="contained">
                    {student ? 'Сохранить' : 'Добавить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}