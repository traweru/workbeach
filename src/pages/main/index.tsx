import * as React from 'react';
import { Button } from "../../components/Buttons";
import StudentsTable from "../../components/StudentsTable";
import { useAuth } from "../../context/AuthContext";
import { createStudent } from '../../api/students';
import type { Student } from '../../Types/Student';
import { StudentDialog } from '../../components/StudentDialog';
export function MainPage(){
    const { isAdmin, user } = useAuth();
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
            <>
                <Button 
                    text="Add Student" 
                    color="#9a9c9aff" 
                    onClick={() => setAddDialogOpen(true)}
                />
                
                <StudentDialog 
                    open={isAddDialogOpen}
                    onClose={() => setAddDialogOpen(false)}
                    onSave={handleAddStudent}
                />
            </>
        )}
        
        
        {!isAdmin && (
            <div style={{ padding: '10px', background: '#fff3cd', marginTop: '20px' }}>
              <strong>Информация:</strong> Кнопки управления доступны только администраторам. 
              Ваши роли: {user?.roles}
            </div>
        )}
        </>
    )
}