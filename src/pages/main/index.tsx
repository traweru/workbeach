import { Button } from "../../components/Buttons";
import StudentsTable from "../../components/StudentsTable";

export function MainPage(){
    return(
        <>
        <h1>
            Student List
        </h1>
        <div style={{ padding: '20px' }}>
            <StudentsTable/>
        </div>
        <Button text="add student" color="#6f00ff"/>
        </>
    )
}