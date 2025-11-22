import * as React from 'react';
import StudentsTable from "../../components/StudentsTable";
import { useAuth } from "../../context/AuthContext";
import { createStudent } from '../../api/students';
import type { Student } from '../../Types/Student';
import { StudentDialog } from '../../components/StudentDialog';

export function MainPage(){
    const { isAdmin } = useAuth();
    const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);

    const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
        try {
            await createStudent(studentData);
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
            <StudentDialog 
                open={isAddDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onSave={handleAddStudent}
            />
        )}
        </>
    )
}