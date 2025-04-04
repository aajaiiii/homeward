import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "../css/form.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./sidebar";
export default function AddEquip() {
  const navigate = useNavigate();
  const [equipment_name, setEquipName] = useState("");
  const [equipment_type, setEquipType] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState('');
  const [nameError, setNameError] = useState("");
  const [typeError, setTypeError] = useState("");
  const tokenExpiredAlertShown = useRef(false); 

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setToken(token);
    if (token) {
      fetch("https://backend-deploy-render-mxok.onrender.com/profile", {
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
          setAdminData(data.data);
          if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
            tokenExpiredAlertShown.current = true; 
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }
  }, []); //ส่งไปครั้งเดียว

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    // if (!equipment_name.trim() || !equipment_type) {
    //   console.log("Please fill in all fields");
    //   setValidationMessage("ชื่ออุปกรณ์และประเภทอุปกรณ์ไม่ควรเป็นค่าว่าง");
    //   return;
    // }
    if (!equipment_name.trim()) {
      setNameError("กรุณากรอกชื่ออุปกรณ์");
      hasError = true;
    } else {
      setNameError("");
    }
    if (!equipment_type.trim()) {
      setTypeError("กรุณาเลือกประเภทอุปกรณ์");
      hasError = true;
    } else {
      setTypeError("");
    }
    if (hasError) return; 
    fetch("https://backend-deploy-render-mxok.onrender.com/addequip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        equipment_name,
        equipment_type,
        // adminId: location.state._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          // Success notification
          toast.success("เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/allequip");
          }, 1000);
        } else if (data.error === "Equipment Exists") {
          // Display error message for duplicate equipment
          toast.error("ชื่ออุปกรณ์นี้มีอยู่แล้วในระบบ");
          // setValidationMessage("ชื่ออุปกรณ์นี้มีอยู่แล้วในระบบ");
        } else {
          // Generic error handling
          toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
          // setValidationMessage("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("เกิดข้อผิดพลาดทางเซิร์ฟเวอร์");
        setValidationMessage("เกิดข้อผิดพลาดทางเซิร์ฟเวอร์");
      });
  };

  const handleInputNameChange = (e) => {
    const input = e.target.value;
    if (!input.trim()) {
      setNameError("");
    } else {
      setNameError(""); 
    }
    setEquipName(input);
  };

  const handleInputTypeChange = (e) => {
    const input = e.target.value;
    if (!input.trim()) {
      setTypeError("");
    } else {
      setTypeError(""); 
    }
    setEquipType(input);
  };
  return (
    <main className="body">
      <ToastContainer/>
      <Sidebar />
      <div className="home_content">
      <div className="homeheader">
        <div className="header">จัดการอุปกรณ์ทางการแพทย์</div>
        <div className="profile_details">
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
            <li className="middle">
              <a href="allequip">
                จัดการอุปกรณ์ทางการแพทย์
              </a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="allequip">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มอุปกรณ์</a>
            </li>
          </ul>
        </div>
        
        <div className="adminall card mb-1">
        <p className="title-header">เพิ่มอุปกรณ์</p>
          <form onSubmit={handleSubmit}>

            <div className="mb-1">
              <label>ชื่ออุปกรณ์<span className="required">*</span></label>
              <input
                type="text"
                className={`form-control ${nameError ? "input-error" : ""}`}
                onChange={handleInputNameChange}              />
            {nameError && <span className="error-text">{nameError}</span>}

            </div>
            <div className="mb-1">
              <label>ประเภทอุปกรณ์<span className="required">*</span></label>
              <select
            className={`form-control ${typeError ? "input-error" : ""}`}
            onChange={handleInputTypeChange}              >
                <option value="">กรุณาเลือก</option>
                <option value="อุปกรณ์ติดตัว">อุปกรณ์ติดตัว</option>
                <option value="อุปกรณ์เสริม">อุปกรณ์เสริม</option>
                <option value="อุปกรณ์อื่นๆ">อุปกรณ์อื่น ๆ</option>
              </select>
              {typeError && <span className="error-text">{typeError}</span>}
              </div>
            {validationMessage && (
              <div style={{ color: "red" }}>{validationMessage}</div>
            )}
                        <div className="d-grid">
              <button type="submit"className="btn btn-outline py-2">
                บันทึก
              </button>
         </div>
          </form>
        </div>

      </div>
    </main>
  );
}
