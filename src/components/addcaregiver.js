import React, { useState, useEffect } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate , useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import th from "date-fns/locale/th";
import "../css/adduser.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddCaregiver() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};  
  const userId = location.state?.userId;
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherRelationship, setOtherRelationship] = useState("");
  const [formData, setFormData] = useState({
    ID_card_number: "",
    user: userId || "",
    name: "",
    surname: "",
    tel: "",
    Relationship: "",
  });
  const [usernameError, setUsernameError] = useState("");
  const [telError, setTelError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false);  // เพิ่ม state เพื่อเก็บสถานะการดึงข้อมูล

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
    }, []);
  

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleSave = async (event) => {
    event.preventDefault();
    let hasError = false;
    const cleanedUsername = formData.ID_card_number.replace(/-/g, ""); // ลบเครื่องหมาย "-" หากมี
    if (!cleanedUsername.trim()) {
      setUsernameError("กรุณากรอกเลขประจำตัวบัตรประชาชน");
      hasError = true;
    } else if (cleanedUsername.length !== 13 || !/^\d+$/.test(cleanedUsername)) {
      setUsernameError("เลขประจำตัวบัตรประชาชนต้องเป็นตัวเลข 13 หลัก");
      hasError = true;
    } else {
      setUsernameError("");
    }
    // if (formData.tel.trim() && formData.tel.length !== 10) {
    //   setTelError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
    //   hasError = true;
    // } else {
    //   setTelError("");
    // }
    if (!formData.tel.trim()) {
      setTelError("กรุณากรอกเบอร์โทรศัพท์");
      hasError = true;
    } else if (formData.tel.length !== 10) {
      setTelError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
      hasError = true;
    } else {
      setTelError("");
    }
    if (!formData.name.trim()) {
      setNameError("กรุณากรอกชื่อ");
      hasError = true;
    } else {
      setNameError("");
    }
  
    if (!formData.surname.trim()) {
      setSurnameError("กรุณากรอกนามสกุล");
      hasError = true;
    } else {
      setSurnameError("");
    }
  
    if (hasError) return; 
    const updatedFormData = { ...formData, ID_card_number: cleanedUsername };

    try {
      const response = await fetch("http://localhost:5000/addcaregiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData), // ส่ง formData ที่อัปเดตแล้ว
      });

      const data = await response.json();
      if (data.status === "Ok") {
        toast.success("เพิ่มข้อมูลสำเร็จ");
        console.log("Navigating to /allinfo with ID:", userId);
        setTimeout(() => {
            navigate("/allinfo", { state: { id: id } });
          }, 1000);
    } else {
        // setError(data.error);
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error adding caregiver:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    }
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };
  const handleBreadcrumbClick = () => {
    navigate("/allinfo", { state: {id:id} });
  };
  const handleRelationshipChange = (e) => {
    const value = e.target.value;
    if (value === "อื่นๆ") {
      setShowOtherInput(true);
      setFormData((prev) => ({ ...prev, Relationship: otherRelationship })); // กรณี "อื่นๆ" ใช้ค่า otherRelationship
    } else {
      setShowOtherInput(false);
      setFormData((prev) => ({ ...prev, Relationship: value })); // อัปเดต Relationship ตามที่เลือก
    }
  };
  const handleOtherRelationshipChange = (e) => {
    const value = e.target.value;
    setOtherRelationship(value);
    setFormData((prev) => ({ ...prev, Relationship: value })); // อัปเดต Relationship ด้วยค่าอื่นๆ
  };

  const handleChange  = async (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({ ...prev, [name]: value }));
   
      // หากลบเลขบัตรออก ให้เคลียร์ข้อมูลที่ดึงมา
  if (name === "ID_card_number" && value === "") {
    setFormData((prev) => ({
      ...prev,
      name: "",
      surname: "",
      tel: "",
    }));
    setIsDataFetched(false); // ไม่ให้ดึงข้อมูลใหม่จนกว่าจะกรอกเลขบัตร
  }

    if (name === "tel") {
      // ตรวจสอบเบอร์โทรศัพท์
      if (/[^0-9]/.test(value)) {
        setTelError("เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น");
      } else {
        setTelError("");
      }
    } else if (name === "ID_card_number") {
      // ตรวจสอบเลขประจำตัวประชาชน
      let input = value.replace(/\D/g, "");
      if (input.length > 13) input = input.slice(0, 13);
      const formatted = input.replace(
        /^(\d{1})(\d{0,4})(\d{0,5})(\d{0,2})(\d{0,1})$/,
        (match, g1, g2, g3, g4, g5) => {
          let result = g1; // กลุ่มที่ 1
          if (g2) result += `-${g2}`; // กลุ่มที่ 2
          if (g3) result += `-${g3}`; // กลุ่มที่ 3
          if (g4) result += `-${g4}`; // กลุ่มที่ 4
          if (g5) result += `-${g5}`; // กลุ่มที่ 5
          return result;
        }
      );
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      setUsernameError(input.length === 13 ? "" : "เลขประจำตัวประชาชนไม่ครบ 13 หลัก");
    } else if (name === "name" || name === "surname") {
      // ตรวจสอบชื่อและนามสกุล
      if (/[^ก-๙\s]/.test(value)
) {
        if (name === "name") {
          setNameError("ชื่อควรเป็นตัวอักษรเท่านั้น");
        } else {
          setSurnameError("นามสกุลควรเป็นตัวอักษรเท่านั้น");
        }
      } else {
        if (name === "name") setNameError("");
        if (name === "surname") setSurnameError("");
      }
    }

    if (name === "ID_card_number" && (value.length === 17 || value.length === 13|| value.length === 16)) {
      try {
        const cleanedId = value.replace(/-/g, "");
        const response = await fetch(`http://localhost:5000/getCaregiverById/${cleanedId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        const data = await response.json();
        if (data.status === "Ok") {
          // หากเจอข้อมูล อัปเดตฟอร์มด้วยชื่อ-นามสกุลที่ได้
          setFormData((prev) => ({
            ...prev,
            name: data.caregiver.name || "",
            surname: data.caregiver.surname || "",
            tel: data.caregiver.tel || "", 
          }));
          setIsDataFetched(true); 
        } else {
          // toast.error("ไม่พบข้อมูลผู้ดูแลสำหรับเลขบัตรนี้");
          setFormData((prev) => ({
            ...prev,
            name: "",
            surname: "",
            tel:"",
          }));
          setIsDataFetched(false); 
        }
      } catch (error) {
        console.error("Error fetching caregiver data:", error);
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ดูแล");
      }
    }
  };
  
  return (
     <main className="body">
      <ToastContainer />
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
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
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
          <li>
            <a href="recover-patients">
              <i className="bi bi-trash"></i>
              <span className="links_name">จัดการข้อมูลผู้ป่วยที่ถูกลบ</span>
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
        <div className="header">จัดการข้อมูลผู้ป่วย</div>
        <div className="profile_details ">
        <ul className="nav-list">

          <li>
            <a href="profile">
              <i className="bi bi-person"></i>
              <span className="links_name">{adminData && adminData.username}</span>
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
            <li><a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a onClick={handleBreadcrumbClick} className="info">ข้อมูลการดูแลผู้ป่วย</a>
              {/* <a href="allinfo">ข้อมูลการดูแลผู้ป่วย</a> */}
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มข้อมูลผู้ดูแล</a>
            </li>
          </ul>
        </div>
      <h3>เพิ่มข้อมูลผู้ดูแล</h3>
      <div className="adminall card mb-1">

      <form>
      <div className="mb-1">
          <label>เลขประจําตัวประชาชน<span className="required"> *</span></label>
          <input
            type="text"
            className={`form-control ${usernameError ? "input-error" : ""}`}
            name="ID_card_number"
            value={formData.ID_card_number}
            onChange={handleChange }
            onPaste={(e) => handleChange(e)}
          />
          {usernameError && <span className="error-text">{usernameError}</span>}

        </div>
      <div className="mb-1">
          <label>ชื่อ<span className="required"> *</span></label>
          <input
            type="text"
            className={`form-control ${nameError ? "input-error" : ""}`}
            name="name"
            value={formData.name}
            disabled={isDataFetched}             
            onChange={handleChange}
          />
          {nameError && <span className="error-text">{nameError}</span>}

        </div>
        <div className="mb-1">
          <label>นามสกุล<span className="required"> *</span></label>
          <input
            type="text"
            className={`form-control ${surnameError ? "input-error" : ""}`}

            name="surname"
            value={formData.surname}
            disabled={isDataFetched}            
            onChange={handleChange}
          />
                         {surnameError && <span className="error-text">{surnameError}</span>}

        </div>
        <div className="mb-1">
        <label>ความสัมพันธ์</label>
        <div class="relationship-container">
        <div class="relationship-group">
            <div>
              <label>
                <input
                  type="radio"
                  value="พ่อ"
                  checked={formData.Relationship === "พ่อ"} 
                  onChange={handleRelationshipChange}
                />
                พ่อ
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="แม่"
                  checked={formData.Relationship=== "แม่"}
                  onChange={handleRelationshipChange}
                />
                แม่
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="ลูก"
                  checked={formData.Relationship === "ลูก"}
                  onChange={handleRelationshipChange}
                />
                ลูก
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="ภรรยา"
                  checked={formData.Relationship === "ภรรยา"}
                  onChange={handleRelationshipChange}
                />
                ภรรยา
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="สามี"
                  checked={formData.Relationship === "สามี"}
                  onChange={handleRelationshipChange}
                />
                สามี
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="อื่นๆ"
                  checked={showOtherInput}
                  onChange={handleRelationshipChange}
                />
                อื่นๆ
              </label>
              </div>
              </div>
              {showOtherInput && (
                <div className="mt-2">
                  <label>กรุณาระบุ:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={otherRelationship}
                    onChange={handleOtherRelationshipChange}
                  />
                </div>
              )}
            </div>
          </div>
        <div className="mb-1">
          <label>เบอร์โทรศัพท์<span className="required"> *</span></label>
          <input
            type="text"
            className={`form-control ${telError ? "input-error" : ""}`}
            name="tel"
            maxLength="10"
            value={formData.tel}
            disabled={isDataFetched}          
            onChange={handleChange}
          />
                        {telError && <span className="error-text">{telError}</span>}

        </div>
        {/* <p id="errormessage" className="errormessage">
              {error}
            </p> */}
        <div className="d-grid">
        <button type="submit"  className="btn btn-outline py-2"  onClick={handleSave}>
          บันทึก
        </button>
        </div>
        {/* <button type="button" onClick={() => navigate(-1)}>
          ยกเลิก
        </button> */}
      </form>
      </div>
      </div>
      
    </main>

  );
}