import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import Sidebar from "./sidebar";

export default function UpdateOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isActive, setIsActive] = useState(window.innerWidth > 967);
  const navigate = useNavigate();
  const location = useLocation();
  const { username, email, oldEmail } = location.state || {};
  const adminData = location.state?.adminData;
  const [timer, setTimer] = useState(300); // นับถอยหลัง 5 นาที (300 วินาที)
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && otp[index] === "") {
      if (event.target.previousSibling) {
        event.target.previousSibling.focus();
      }
    }
  };

  const handleChange = (element, index) => {
    if (!isNaN(element.value)) {
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);
      setErrorMessage("");
      // เลื่อนไปยังช่องถัดไปอัตโนมัติ
      if (element.nextSibling && element.value) {
        element.nextSibling.focus();
      }
    }
  };
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
    return () => clearInterval(countdown);
  }, [timer]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOtpExpired) {
      setErrorMessage("OTP หมดอายุ");
      setSuccessMessage("");
      return;
    }
    const otpValue = otp.join("");
    console.log("Submitted OTP:", otpValue);

    fetch("https://backend-deploy-render-mxok.onrender.com/verify-otp1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, otp: otpValue, newEmail: email }), // ส่ง username, otp และ newEmail
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage("ยืนยันอีเมลสำเร็จ");
          setErrorMessage("");
          setTimeout(() => {
            navigate("/profile"); // เปลี่ยนเส้นทางไปยังโปรไฟล์หลังจากยืนยัน
          }, 1000);
        } else {
          setErrorMessage("OTP ไม่ถูกต้องหรือหมดอายุ");
          setSuccessMessage("");
        }
      })
      .catch((error) => {
        setErrorMessage("เกิดข้อผิดพลาด: " + error.message);
        console.error("Error:", error);
      });
  };

  const handleRequestNewOtp = () => {
    setIsOtpExpired(false);
    setErrorMessage("");
    setSuccessMessage("");
    fetch("https://backend-deploy-render-mxok.onrender.com/send-otp1", {
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
          setTimer(300);
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

  const handleBreadcrumbClick = () => {
    navigate("/updateemail", { state: { adminData } });
  };

  return (
    <main className="body">
      <Sidebar />
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
            <li className="middle">
              <a href="profile">โปรไฟล์</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="profile">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="middle">
              <a className="info" onClick={handleBreadcrumbClick}>
                เปลี่ยนอีเมล
              </a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a className="info" onClick={handleBreadcrumbClick}>
                ...
              </a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>กรอกรหัสยืนยัน</a>
            </li>
          </ul>
        </div>

        <div className="formcontainerpf card mb-3">
          <p className="title-header">กรอกรหัสยืนยัน</p>
          <div className="label-container">
            <p className="label-inline">คุณจะได้รับรหัสยืนยันตัวตนที่อีเมล</p>
            <p className="email-text">{email}</p>
          </div>
          <div className="otp-input-container">
            <label>กรอก OTP ที่ได้รับ</label>
            <div className="otp-inputs">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="otp-input"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
          </div>
          {timer > 0 && (
            <p className="otp-instructions">
              กรุณากรอก OTP ภายในเวลา {formatTime(timer)}
            </p>
          )}

          {isOtpExpired ? (
            <div className="message-container">
              <p className="error-messageotp">{errorMessage}</p>
              <a className="resend-link" onClick={handleRequestNewOtp}>
                ขอ OTP ใหม่
              </a>
            </div>
          ) : (
            <div className="message-container">
              {errorMessage && !isOtpExpired && (
                <p className="error-messageotp">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}
            </div>
          )}

          <div className="d-grid">
            <button
              onClick={handleSubmit}
              disabled={otp.includes("") || isOtpExpired}
              className="btn btn-outline py-2"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
