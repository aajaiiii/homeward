import React, {useEffect, useState } from "react";
import "../css/alladmin.css"
import deleteimg from "../img/delete.png";

export default function AllMpersonnel({}) {
  const [data, setData] = useState([]);
  // const [adminId, setAdminId] = useState('');

  useEffect(() => {
    getAllMpersonnel();
  }, []);
  
  const getAllMpersonnel = () => {
    fetch("http://localhost:5000/allMpersonnel", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllMpersonnel");
        setData(data.data);
      });
  };



  const home = () => {
    window.location.href = "./home";
  };
  const add = () => {
    window.location.href = "./addmpersonnel";
  };

  const deleteMPersonnel = async (id, nametitle, name) => {
    if (window.confirm( `คุณต้องการลบ ${nametitle} ${name} หรือไม่ ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteMPersonnel/${id} `, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.data);
          getAllMpersonnel();
        } else {
          console.error('Error during deletion:', data.data);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }
  };

 
  return (
    <div>
        <h3>จัดการข้อมูลบุคลากร</h3>
      <button onClick={home} className="btn">
        home
      </button> <br/>
      <span></span>
      <button onClick={add} className="add btn btn-outline-secondary py-1 px-4">
        เพิ่มบุคคลากร
      </button>
      <p className="countadmin">จำนวน : {data.length} คน</p>
      <table className="table">
        <thead>
          <tr>
            <th>คำนำหน้าชื่อ</th>
            <th>ชื่อ-สกุล</th>
            <th>คำสั่ง</th>
          </tr>
          </thead>
          <tbody>
           
            {data.map((i, index) => {
               return (
               <tr key={index}>
              <td>{i.nametitle}</td>
              <td>{i.name}</td>
              <td><img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={() => deleteMPersonnel(i._id, i.nametitle, i.name)}></img></td>
              </tr>
               );
            })}
          </tbody>
      </table>
    </div>
  );
}