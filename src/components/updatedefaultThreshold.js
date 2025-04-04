import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/setnoti.css";
import "../css/form.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";

function UpdateDefault() {
  const navigate = useNavigate();
  const [defaultThreshold, setDefaultThreshold] = useState(null);
  const [adminData, setAdminData] = useState("");
  const [min, setMin] = useState({
    SBP: "",
    DBP: "",
    PulseRate: "",
    Temperature: "",
    DTX: "",
    Respiration: "",
  });
  const [max, setMax] = useState({
    SBP: "",
    DBP: "",
    PulseRate: "",
    Temperature: "",
    DTX: "",
    Respiration: "",
  });
  const [painscore, setPainscore] = useState("");
  const tokenExpiredAlertShown = useRef(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      fetch("https://backend-deploy-render-mxok.onrender.com/profile", {
        method: "POST",
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
          if (
            data.data === "token expired" &&
            !tokenExpiredAlertShown.current
          ) {
            tokenExpiredAlertShown.current = true;
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }
  }, []);

  useEffect(() => {
    fetch(
      "https://backend-deploy-render-mxok.onrender.com/get-default-threshold"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setDefaultThreshold(data.data);
          setMax({
            SBP: data.data.SBP?.max || "",
            DBP: data.data.DBP?.max || "",
            PulseRate: data.data.PulseRate?.max || "",
            Temperature: data.data.Temperature?.max || "",
            DTX: data.data.DTX?.max || "",
            Respiration: data.data.Respiration?.max || "",
          });
          setMin({
            SBP: data.data.SBP?.min || "",
            DBP: data.data.DBP?.min || "",
            PulseRate: data.data.PulseRate?.min || "",
            Temperature: data.data.Temperature?.min || "",
            DTX: data.data.DTX?.min || "",
            Respiration: data.data.Respiration?.min || "",
          });
          setPainscore(data.data.Painscore);
        } else {
          console.error("ไม่สามารถดึงข้อมูล Default Threshold ได้");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !min.SBP ||
      !max.SBP ||
      !min.DBP ||
      !max.DBP ||
      !min.PulseRate ||
      !max.PulseRate ||
      !min.Respiration ||
      !max.Respiration ||
      !min.Temperature ||
      !max.Temperature ||
      !min.DTX ||
      !max.DTX ||
      !painscore
    ) {
      toast.error("กรุณากรอกข้อมูลทุกช่อง");
      return;
    }
    try {
      const response = await fetch(
        "https://backend-deploy-render-mxok.onrender.com/update-default-threshold",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            min,
            max,
            painscore,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        toast.success("บันทึกข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/alluserinsetting");
        }, 1100);
      } else {
        toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };
  if (!defaultThreshold) {
    return <div>Loading...</div>; // กรณีที่ยังไม่ดึงข้อมูลมาแสดง
  }

  return (
    <main className="body">
      <ToastContainer />
      <Sidebar />
      <div className="home_content">
        <div className="homeheader">
          <div className="header">ตั้งค่าการแจ้งเตือน</div>
          <div className="profile_details ">
            <ul className="nav-list">
              <li>
                <a href="profile">
                  <i className="bi bi-person"></i>
                  <span className="links_name">
                    {adminData && adminData.username}
                  </span>
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
              <a href="alluserinsetting">รายชื่อผู้ป่วย</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="alluserinsetting">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>ตั้งค่าการแจ้งเตือนสัญญาณชีพเริ่มต้น</a>
            </li>
          </ul>
        </div>
        <div className="formsetnoti">
          <form onSubmit={handleSubmit}>
            {[
              { label: "อุณหภูมิ", key: "Temperature", unit: "(°C)" },
              { label: "ความดันตัวบน", key: "SBP", unit: "(mmHg)" },
              { label: "ความดันตัวล่าง", key: "DBP", unit: "(mmHg)" },
              { label: "ชีพจร", key: "PulseRate", unit: "(ครั้ง/นาที)" },
              { label: "การหายใจ", key: "Respiration", unit: "(ครั้ง/นาที)" },
              { label: "ระดับน้ำตาลในเลือด", key: "DTX", unit: "(mg/dL)" },
            ].map(({ label, key, unit }) => (
              <div className="input-group" key={key}>
                <label className="titlenoti">
                  {label}&nbsp;<span className="unit-label">{unit}</span>
                </label>
                <div className="input-wrapper">
                  <div className="input-box">
                    <span className="input-prefix">Min</span>
                    <input
                      type="number"
                      value={min[key]}
                      onChange={(e) =>
                        setMin({ ...min, [key]: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="input-prefix">Max</span>
                    <input
                      type="number"
                      value={max[key]}
                      onChange={(e) =>
                        setMax({ ...max, [key]: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="input-group">
              <label className="titlenoti">ระดับความเจ็บปวด</label>
              <div className="input-wrapper">
                <div className="input-box">
                  <span className="input-prefix">Med</span>
                  <input
                    type="number"
                    value={painscore}
                    onChange={(e) => setPainscore(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default UpdateDefault;
