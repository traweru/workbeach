import * as React from 'react';
import { Button } from "../../components/Buttons";
import StudentsTable from "../../components/StudentsTable";
import { useAuth } from "../../context/AuthContext";
import { createStudent } from '../../api/students';
import type { Student } from '../../Types/Student';
import { StudentDialog } from '../../components/StudentDialog';

export function MainPage(){
    const { hasRole } = useAuth();
    const isAdmin = hasRole('ADMIN');
    const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);

    const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
        try {
            await createStudent(studentData);
            // Страница автоматически обновится через StudentsTable
            setAddDialogOpen(false);
        } catch (err) {
            console.error('Failed to add student:', err);
        }
    };

    return(
        <>
        <h1>Student List</h1>
        <div style={{ padding: '20px' }}>
            <StudentsTable/>
        </div>
        {isAdmin && (
            <>
                <Button 
                    text="Add Student" 
                    color="#4CAF50" 
                    onClick={() => setAddDialogOpen(true)}
                />
                
                {/* Диалог добавления студента */}
                <StudentDialog 
                    open={isAddDialogOpen}
                    onClose={() => setAddDialogOpen(false)}
                    onSave={handleAddStudent}
                />
            </>
        )}
        </>
    )
}