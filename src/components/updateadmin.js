import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Updateadmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setToken(token);
    if (token) {
      fetch("http://localhost:5000/profile", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          token: token,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          console.log(location);
          setAdminData(data.data);
        });
    }
  }, [location]);

  const Updateadmin = () => {
    console.log(password, newPassword, confirmNewPassword);

    fetch(`http://localhost:5000/updateadmin/${location.state._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: location.state._id,
        password: password,
        newPassword,
        confirmNewPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          toast.success("แก้ไขข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/profile");
          }, 1100);
          // window.location.href = "./profile";
        } else {
          // เมื่อเกิดข้อผิดพลาด
          // toast.error("ไม่สามารถแก้ไขผู้ใช้ได้:",data.error);

          setError(data.error); // กำหนดข้อความ error ให้กับ state
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // }
  };
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  return (
    <main className="body">
      <ToastContainer />
      <div className={`sidebar ${isActive ? 'active' : ''}`}>
        <div className="logo_content">
          <div className="logo">
            <div className="logo_name" >
              <img src={logow} className="logow" alt="logo" ></img>
            </div>
          </div>
          <i className='bi bi-list' id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul className="nav-list">
          <li>
            <a href="home">
              <i className="bi bi-book"></i>
              <span className="links_name" >จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i className="bi bi-person-plus"></i>
              <span className="links_name" >จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i className="bi bi-people"></i>
              <span className="links_name" >จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i className="bi bi-prescription2"></i>
              <span className="links_name" >จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
              <i className="bi bi-bandaid"></i>
              <span className="links_name" >จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="/alluserinsetting" >
            <i className="bi bi-bell"></i>              
            <span className="links_name" >ตั้งค่าการแจ้งเตือน</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i className="bi bi-person-gear"></i>
              <span className="links_name" >จัดการแอดมิน</span>
            </a>
          </li>
          <div className="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i className='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
                <span className="links_name" >ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
      <div className="homeheader">
        <div className="header">เปลี่ยนรหัสผ่าน</div>
        <div className="profile_details ">
        <ul className="nav-list">
          <li>
            <a href="profile" >
              <i className="bi bi-person"></i>
              <span className="links_name" >{adminData && adminData.username}</span>
            </a>
          </li>
          </ul>
        </div>
        </div>
        <div className="breadcrumbs">
          <ul>
            <li>
              <a href="home">
                <i className="bi bi-house-fill"></i>
              </a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li><a href="profile">โปรไฟล์</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li><a>เปลี่ยนรหัสผ่าน</a>
            </li>
          </ul>
        </div>
        {/* <h3>เปลี่ยนรหัสผ่าน</h3> */}
        <div className="formcontainerpf">
          <div className="auth-inner">
            รหัสผ่านเก่า
            <input
              className="form-control"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            รหัสผ่านใหม่
            <input
              className="form-control"
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <br />
            ยืนยันรหัสผ่านใหม่
            <input
              className="form-control"
              type="password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            {/* แสดงข้อความ error */}
            <p id="errormessage" className="errormessage">{error}</p>
          </div>
          <div className="d-grid">
            <button
              onClick={Updateadmin}
              className="btn btn-outline py-2"
            >
              บันทึก
            </button>
          </div>
        </div>
        {/* <button onClick={profile} className="btn btn-primary">
        Back
      </button> */}
      </div>
    </main>

  );
}

export default Updateadmin;
