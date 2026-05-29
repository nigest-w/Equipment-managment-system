import { useEffect, useState } from "react";
import Layout from "../components/layout";
import axios from "axios";

function Dashboard() {

  const [equipment, setEquipment] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [employees, setEmployees] = useState([]);

  const [stats, setStats] = useState({
  totalEquipment: 0,
  available: 0,
  assigned: 0,
  totalAssignments: 0
   });
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
  fetchEquipment();
  fetchAssignments();
  fetchStats();
  fetchEmployees();

}, []);

  // GET EQUIPMENT
  const fetchEquipment = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/equipment",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEquipment(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // GET assignment
  const fetchAssignments = async () => {

  try {

    const res = await axios.get(
      "http://localhost:5000/api/assignments",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setAssignments(res.data);

  } catch (error) {
    console.log(error);
  }
};

const fetchStats = async () => {
  try {
    const equipmentRes = await axios.get(
      "http://localhost:5000/api/equipment",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const assignmentRes = await axios.get(
      "http://localhost:5000/api/assignments",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const equipment = equipmentRes.data;
    const assignments = assignmentRes.data;

    setStats({
      totalEquipment: equipment.length,
      available: equipment.filter(e => e.status === "available").length,
      assigned: equipment.filter(e => e.status === "assigned").length,
      totalAssignments: assignments.length
    });

  } catch (error) {
    console.log(error);
  }
};
const fetchEmployees = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/users/employees",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setEmployees(res.data);

  } catch (error) {
    console.log(error);
  }
};

  // ADD EQUIPMENT
  
  const handleAddEquipment = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/equipment",
        {
          name,
          type,
          serial_number: serialNumber
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Equipment Added");
      

 // assignment 
 
      // CLEAR FORM
      setName("");
      setType("");
      setSerialNumber("");

      // REFRESH TABLE
      fetchEquipment();

    } catch (error) {

      console.log(error);

      alert("Only admin can add equipment");

    }
  };


const handleAssignEquipment = async (e) => {

  e.preventDefault();

  try {

    await axios.post(
      "http://localhost:5000/api/assignments",
      {
        equipment_id: selectedEquipment,
        user_id: userId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Equipment Assigned");

    setSelectedEquipment("");
    setUserId("");

    fetchAssignments();
    fetchEquipment();

  } catch (error) {

    console.log(error);

    alert("Assignment Failed");

  }
};

const handleReturnEquipment = async (
  assignmentId
) => {

  try {

    await axios.put(
      `http://localhost:5000/api/assignments/return/${assignmentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Equipment Returned");

    fetchAssignments();
    fetchEquipment();

  } catch (error) {

    console.log(error);

    alert("Return Failed");

  }
};

  
    return (
  <Layout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Equipment Dashboard
        </h1>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

{/* DASHBOARD CARDS */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

  <div className="bg-white p-4 rounded shadow">
    <h3 className="text-gray-500">Total Equipment</h3>
    <p className="text-2xl font-bold">{stats.totalEquipment}</p>
  </div>

  <div className="bg-green-100 p-4 rounded shadow">
    <h3 className="text-gray-600">Available</h3>
    <p className="text-2xl font-bold text-green-700">
      {stats.available}
    </p>
  </div>

  <div className="bg-yellow-100 p-4 rounded shadow">
    <h3 className="text-gray-600">Assigned</h3>
    <p className="text-2xl font-bold text-yellow-700">
      {stats.assigned}
    </p>
  </div>

  <div className="bg-blue-100 p-4 rounded shadow">
    <h3 className="text-gray-600">Assignments</h3>
    <p className="text-2xl font-bold text-blue-700">
      {stats.totalAssignments}
    </p>
  </div>

</div>

      {/* ADD EQUIPMENT FORM */}
{role === "admin" && (

  <div className="bg-white p-6 rounded shadow mb-6">

    <h2 className="text-xl font-bold mb-4">
      Add Equipment
    </h2>

    <form
      onSubmit={handleAddEquipment}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >

      <input
        type="text"
        placeholder="Equipment Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Serial Number"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        className="border p-2 rounded"
      />

      <button className="bg-blue-600 text-white p-2 rounded">
        Add Equipment
      </button>

    </form>

  </div>

)}

{/* ASSIGN EQUIPMENT */}
{role === "admin" && (

<div className="bg-white p-6 rounded shadow mb-6">

  <h2 className="text-xl font-bold mb-4">
    Assign Equipment
  </h2>

  <form
    onSubmit={handleAssignEquipment}
    className="grid grid-cols-1 md:grid-cols-3 gap-4"
  >

    <select
      value={selectedEquipment}
      onChange={(e) =>
        setSelectedEquipment(e.target.value)
      }
      className="border p-2 rounded"
    >

      <option value="">
        Select Equipment
      </option>

      {equipment
        .filter(
          (item) => item.status === "available"
        )
        .map((item) => (

          <option
            key={item.id}
            value={item.id}
          >
            {item.name}
          </option>

      ))}

    </select>

   <select
  value={userId}
  onChange={(e) => setUserId(e.target.value)}
  className="border p-2 rounded"
>
  <option value="">Select Employee</option>

  {employees.map(emp => (
    <option key={emp.id} value={emp.id}>
      {emp.name} ({emp.email})
    </option>
  ))}

</select>

    <button
      className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
    >
      Assign
    </button>

  </form>

</div>
)}
      {/* EQUIPMENT TABLE */}

      <div className="bg-white shadow rounded overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Serial</th>
              <th className="p-3">Status</th>
            </tr>

          </thead>

          <tbody>

            {equipment.map((item) => (

              <tr
                key={item.id}
                className="text-center border-t"
              >
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">
                  {item.serial_number}
                </td>
                <td className="p-3">
                  {item.status}
                </td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ASSIGNMENTS TABLE */}

<div className="bg-white shadow rounded overflow-hidden mt-6">

  <h2 className="text-xl font-bold p-4">
    Equipment Assignments
  </h2>

  <table className="w-full">

    <thead className="bg-green-600 text-white">

      <tr>
        <th className="p-3">ID</th>
        <th className="p-3">Equipment</th>
        <th className="p-3">User</th>
        <th className="p-3">Assigned Date</th>
        <th className="p-3">Action</th>
      </tr>

    </thead>

    <tbody>

      {assignments.map((item) => (

        <tr
          key={item.id}
          className="text-center border-t"
        >

          <td className="p-3">{item.id}</td>

          <td className="p-3">
            {item.equipment}
          </td>

          <td className="p-3">
            {item.user}
          </td>

          <td className="p-3">
            {new Date(
              item.assigned_date
            ).toLocaleDateString()}
          </td>

 <td className="p-3">
  {!item.returned ? (

    <button
      onClick={() =>
        handleReturnEquipment(item.id)
      }
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
    >
      Return
    </button>

  ) : (

    <span className="text-green-600 font-bold">
      Returned
    </span>

  )}

</td>
        </tr>

      ))}

    </tbody>

  </table>

</div>

 </Layout>
);
}

export default Dashboard;