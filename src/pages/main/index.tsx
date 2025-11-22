import { Button } from "../../components/Buttons";
import StudentsTable from "../../components/StudentsTable";
import { useAuth } from "../../context/AuthContext";

export function MainPage(){
    const { hasRole } = useAuth();
    const isAdmin = hasRole('ADMIN');

    const handleAddStudent = () => {
        // TODO: Реализовать добавление студента
        console.log('Add student');
    };

    const handleEditStudents = () => {
        // TODO: Реализовать редактирование студентов
        console.log('Edit students');
    };

    return(
        <>
        <h1>
            Student List
        </h1>
        <div style={{ padding: '20px' }}>
            <StudentsTable/>
        </div>
        {isAdmin && (
            <>
                <Button text="add student" color="#a7a2a2" onClick={handleAddStudent}/>
                <Button text="redact" color="#da1010ff" onClick={handleEditStudents}/>
            </>
        )}
        </>
    )
}