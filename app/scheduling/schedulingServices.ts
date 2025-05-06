import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firebaseDb } from "../config/firebaseConfig";
import { Employee, Shift } from "./schedulingModels";

export async function fetchEmployees(): Promise<
  { id: string; name: string }[]
> {
  try {
    const employeesCollection = collection(firebaseDb, "employees");
    const snapshot = await getDocs(employeesCollection);
    return snapshot.docs.map((doc) => new Employee(doc.id, doc.data().name));
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}

export async function saveShift(shift: Shift): Promise<void> {
  try {
    const shiftsCollection = collection(firebaseDb, "department_coordination");
    const employeeRef = doc(firebaseDb, "employees", shift.employee.id);

    await addDoc(shiftsCollection, {
      employee: employeeRef,
      shiftStart: shift.shiftStart,
      shiftEnd: shift.shiftEnd,
      isOvertime: shift.isOvertime,
    });
  } catch (error) {
    console.error("Error saving shift:", error);
    throw error;
  }
}

export async function fetchSchedules(): Promise<Shift[]> {
  try {
    const schedulesCollection = collection(
      firebaseDb,
      "department_coordination",
    );
    const snapshot = await getDocs(schedulesCollection);

    return await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const employeeDoc = await getDoc(data.employee);
        return new Shift(
          doc.id,
          (employeeDoc.data() as Employee) || new Employee("", ""),
          data.shiftStart,
          data.shiftEnd,
          data.isOvertime,
        );
      }),
    );
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
}
