import React, { useState, useEffect } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddUser() {
  const [data, setData] = useState([]);
  const [HN, setHN] = useState("");
  const [AN, setAN] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [chief_complaint, setChief_complaint] = useState("");
  const [present_illness, setPresent_illness] = useState("");
  const [phychosocial_assessment, setPhychosocial_assessment] = useState("");
  const [management_plan, setManagement_plan] = useState("");
  const [date_Admit, setDate_Admit] = useState("");
  const [date_DC, setDate_DC] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [fileC, setFileC] = useState(null);
  const [fileP, setFileP] = useState(null);
  const [filePhy, setFilePhy] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const [selectedPersonnel, setSelectedPersonnel] = useState("");

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
          console.log(data);
          setAdminData(data.data);
        });
    }
    getAllMpersonnel();
  }, []); //ส่งไปครั้งเดียว

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/addmedicalinformation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        HN,
        AN,
        Date_Admit: date_Admit,
        Date_DC: date_DC,
        diagnosis,
        chief_complaint,
        present_illness,
        phychosocial_assessment,
        management_plan,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addmdinformation");
        if (data.status === "ok") {
          toast.success("เพิ่มข้อมูลสำเร็จ");
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
        toast.error("เกิดข้อผิดพลาดขณะเพิ่มข้อมูล");
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  const getAllMpersonnel = () => {
    fetch("http://localhost:5000/allMpersonnel", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllMpersonnel");
        setData(data.data);
      });
  };


  const onInputfileChange = (e) => {
    console.log(e.target.files[0]);
    setFileC(e.target.files[0]);

    setSelectedFileName(e.target.files[0].name);

    const pdfURL = URL.createObjectURL(e.target.files[0]);
    setFileC(pdfURL);
  };

  return (
    <main className="body">
      <ToastContainer />
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div class="logo_content">
          <div class="logo">
            <div class="logo_name">
              <img src={logow} className="logow" alt="logo"></img>
            </div>
          </div>
          <i class="bi bi-list" id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul class="nav-list">
          <li>
            <a href="home">
              <i class="bi bi-book"></i>
              <span class="links_name">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i class="bi bi-person-plus"></i>
              <span class="links_name">จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i class="bi bi-people"></i>
              <span class="links_name">จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i class="bi bi-prescription2"></i>
              <span class="links_name">จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i class="bi bi-person-gear"></i>
              <span class="links_name">จัดการแอดมิน</span>
            </a>
          </li>
          <div class="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i
                  class="bi bi-box-arrow-right"
                  id="log_out"
                  onClick={logOut}
                ></i>
                <span class="links_name">ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
        <div className="header">จัดการข้อมูลผู้ป่วย</div>
        <div class="profile_details ">
          <li>
            <a href="profile">
              <i class="bi bi-person"></i>
              <span class="links_name">{adminData && adminData.username}</span>
            </a>
          </li>
        </div>
        <hr></hr>
        <div className="breadcrumbs">
          <ul>
            <li>
              <a href="home">
                <i class="bi bi-house-fill"></i>
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="adduser">เพิ่มข้อมูลผู้ป่วยทั่วไป</a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มข้อมูลการเจ็บป่วย</a>
            </li>
          </ul>
        </div>
        <h3>เพิ่มข้อมูลการเจ็บป่วย</h3>
        <div className="adminall card mb-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>HN</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setHN(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>AN</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setAN(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>วันที่ Admit </label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setDate_Admit(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>วันที่ D/C</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setDate_DC(e.target.value)}
              />
            </div>

            {/* <div className="mb-3">
              <label>แพทย์ผู้ดูแล</label>
              <select
                className="form-select"
                value={selectedPersonnel}
                onChange={(e) => setSelectedPersonnel(e.target.value)}
              >
                {data.map((personnel) => (
                  <option value={personnel.name}>
                    {`${personnel.nametitle} ${personnel.name}`}
                  </option>
                ))}
              </select>
            </div> */}

            <div className="mb-3">
              <label>แพทย์ผู้ดูแล</label>
              <select
                className="form-select"
                value={selectedPersonnel}
                onChange={(e) => setSelectedPersonnel(e.target.value)}
              >
                {/* ตรวจสอบว่าข้อมูลแพทย์มีข้อมูลหรือไม่ก่อนที่จะแสดงผล */}
                {data.length > 0 ? (
                  data.map((personnel) => (
                    <option key={personnel._id} value={personnel.name}>
                      {`${personnel.nametitle} ${personnel.name}`}
                    </option>
                  ))
                ) : (
                  <option value="">ไม่มีข้อมูลแพทย์</option>
                )}
              </select>
            </div>

            <div className="mb-3">
              <label>Diagnosis</label>
              <textarea
                className="form-control"
                rows="3" // กำหนดจำนวนแถวเริ่มต้น
                style={{ resize: "vertical" }} // ให้ textarea สามารถปรับขนาดได้ในทิศทางดิสพล์เมนต์
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Chief complaint</label>
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={onInputfileChange}
              />
              <textarea
                className="form-control"
                rows="3" // กำหนดจำนวนแถวเริ่มต้น
                style={{ resize: "vertical" }}
                onChange={(e) => setChief_complaint(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Present illness</label>
            </div>
            <textarea
              className="form-control"
              rows="3" // กำหนดจำนวนแถวเริ่มต้น
              style={{ resize: "vertical" }}
              onChange={(e) => setPresent_illness(e.target.value)}
            />

            <div className="mb-3">
              <label>Management plan</label>
            </div>
            <textarea
              className="form-control"
              rows="3" // กำหนดจำนวนแถวเริ่มต้น
              style={{ resize: "vertical" }}
              onChange={(e) => setManagement_plan(e.target.value)}
            />

            <div className="mb-3">
              <label>Phychosocial assessment</label>
            </div>
            <textarea
              className="form-control"
              rows="3" // กำหนดจำนวนแถวเริ่มต้น
              style={{ resize: "vertical" }}
              onChange={(e) => setPhychosocial_assessment(e.target.value)}
            />
            <div className="d-grid">
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
        <div className="btn-group">
          <div className="btn-pre">
            <button
              onClick={() => navigate("/adduser")}
              className="btn btn-outline py-2"
            >
              ก่อนหน้า
            </button>
          </div>
          <div className="btn-next">
            <button
              onClick={() => navigate("/addequipment")}
              className="btn btn-outline py-2"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}