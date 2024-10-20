import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";

export default function UpdateOTP() {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { username, email } = location.state || {};
  const adminData = location.state?.adminData;
  const [timer, setTimer] = useState(300); // นับถอยหลัง 5 นาที (300 วินาที)
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  // useEffect(() => {
  //   if (adminData) {
  //     setEmail(adminData.email);
  //     setUsername(adminData.username);
  //   }
  // }, [adminData]);
  useEffect(() => {
    // ตั้งค่าการนับถอยหลัง
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      // เมื่อหมดเวลา
      setIsOtpExpired(true);
      setErrorMessage("OTP หมดอายุ");
      setSuccessMessage("");
    }
    return () => clearInterval(countdown); // ล้าง interval เมื่อ component unmount หรือ timer เปลี่ยน
  }, [timer]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOtpExpired) {
      setErrorMessage("OTP หมดอายุ");
      return;
    }
    fetch("http://localhost:5000/verify-otp1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, otp, newEmail: email }), // ส่ง username, otp และ newEmail
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage("ยืนยันอีเมลสำเร็จ");
          setTimeout(() => {
            navigate("/profile"); // เปลี่ยนเส้นทางไปยังโปรไฟล์หลังจากยืนยัน
          }, 1000);
        } else {
          setErrorMessage("OTP ไม่ถูกต้องหรือหมดอายุ");
        }
      })
      .catch((error) => {
        setErrorMessage("เกิดข้อผิดพลาด: " + error.message);
        console.error("Error:", error);
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    navigate("/");
  };
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  const handleRequestNewOtp = () => {
    fetch("http://localhost:5000/send-otp1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email }), // ส่ง username และ newEmail
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage("ส่ง OTP ใหม่เรียบร้อย");
          setTimer(300); // รีเซ็ต timer
          setIsOtpExpired(false);
        } else {
          setErrorMessage("เกิดข้อผิดพลาดในการส่ง OTP ใหม่");
        }
      })
      .catch((error) => {
        setErrorMessage("เกิดข้อผิดพลาด: " + error.message);
        console.error("Error:", error);
      });
  };

  // ฟังก์ชันสำหรับจัดรูปแบบเวลา
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <main className="body">
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div className="logo_content">
          <div className="logo">
            <div className="logo_name">
              <img src={logow} className="logow" alt="logo"></img>
            </div>
          </div>
          <i className="bi bi-list" id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul className="nav-list">
          <li>
            <a href="home">
              <i className="bi bi-book"></i>
              <span className="links_name">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i className="bi bi-person-plus"></i>
              <span className="links_name">จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i className="bi bi-people"></i>
              <span className="links_name">จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i className="bi bi-prescription2"></i>
              <span className="links_name">จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="allsymptom">
              <i className="bi bi-bandaid"></i>
              <span className="links_name">จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="/alluserinsetting">
              <i className="bi bi-bell"></i>
              <span className="links_name">ตั้งค่าการแจ้งเตือน</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i className="bi bi-person-gear"></i>
              <span className="links_name">จัดการแอดมิน</span>
            </a>
          </li>
          <div className="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i
                  className="bi bi-box-arrow-right"
                  id="log_out"
                  onClick={logOut}
                ></i>
                <span className="links_name">ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
        <div className="homeheader">
          <div className="header">โปรไฟล์</div>
          <div className="profile_details ">
            <ul className="nav-list">
              <li>
                <a href="profile">
                  <i className="bi bi-person"></i>
                  <span className="links_name">{username}</span>
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
            <li>
              <a href="profile">โปรไฟล์</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="updateemail">เปลี่ยนอีเมล</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>กรอกรหัสยืนยัน</a>
            </li>
          </ul>
        </div>

        <h3>กรอกรหัสยืนยัน</h3>
        <div className="formcontainerpf card mb-3">
          <div className="mb-3">
            <label>คุณจะได้รับรหัสยืนยันตัวตนที่</label>
            <h5>{email}</h5>
          </div>
          <div className="mb-3">
            <label>กรอกรหัส OTP</label>
            <input
              type="text"
              className="form-control"
              placeholder="กรอกรหัส OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {timer > 0 && (
            <p className="timer">กรุณากรอก OTP ภายในเวลา {formatTime(timer)}</p>
          )}
          {isOtpExpired && (
            <div className="message-container">
              <p className="error-messageotp">{errorMessage}</p>
              <a className="newotp" onClick={handleRequestNewOtp}>
                ขอ OTP ใหม่
              </a>
            </div>
          )}

          {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          <div className="d-grid">
            <button
              onClick={handleSubmit}
              disabled={isOtpExpired}
              className="btn btn-outline py-2"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
      {/* <button onClick={logOut} className="btn btn-primary">
        Log Out
      </button> */}
    </main>
  );
}
