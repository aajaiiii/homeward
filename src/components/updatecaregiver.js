import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./sidebar";

export default function Updatecaregiver() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, user } =  location.state || {};  
  const caregiver = location.state?.caregiver;
  const [gender, setGender] = useState("");
  const [Relationship, setRelationship] = useState('');
  const [adminData, setAdminData] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [otherGender, setOtherGender] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherRelationship, setOtherRelationship] = useState("");
  const [formData, setFormData] = useState({
    ID_card_number: caregiver?. ID_card_number|| "",
    // user: caregiver?.user|| "",
   user: caregiver?.userRelationships?.[0]?.user || "",
    name: caregiver?.name || "",
    surname: caregiver?.surname || "",
    tel: caregiver?.tel || "",
    // Relationship: caregiver?.Relationship || "",
    Relationship: caregiver?.userRelationships?.[0]?.relationship || "",
  });
  const [telError, setTelError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [otherError, setOtherError] = useState("");
  const [RelationshiError, setRelationshipError] = useState("");
  const tokenExpiredAlertShown = useRef(false); 


  useEffect(() => {
    if (formData.Relationship && !["พ่อ", "แม่", "ลูก", "ภรรยา", "สามี"].includes(formData.Relationship)) {
      setShowOtherInput(true);
      setOtherRelationship(formData.Relationship);
    }
}, [formData.Relationship]);
  const formatIDCardNumber = (id) => {
    if (!id) return "";
    return id.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5");
  };
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return ""; 
    }
    return formattedDate.toISOString().split('T')[0];
  };

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
          body: JSON.stringify({ token: token }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setAdminData(data.data);
            if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
              tokenExpiredAlertShown.current = true; 
              alert("Token expired login again");
              window.localStorage.clear();
              window.location.href = "./";
            }
          });
      }
    }, [id]);
  
  const handleBreadcrumbClick = () => {
    navigate("/allinfo", { state: { id: id, user: user } });
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setGender(value);
    if (value === "อื่นๆ") {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setOtherGender("");
    }
  };

  const handleOtherGenderChange = (e) => {
    const value = e.target.value;
    setOtherGender(value);
    setGender(value); // Update gender to the value of otherGender
  };

//   const handleRelationshipChange = (e) => {
//     const value = e.target.value;
//     setRelationship(value);
//     if (value === "อื่นๆ") {
//       setShowOtherInput(true);
//     } else {
//       setShowOtherInput(false);
//       setOtherRelationship("");
//     }
//   };
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
  // const handleOtherRelationshipChange = (e) => {
  //   const value = e.target.value;
  //   setOtherRelationship(value);
  //   setFormData((prev) => ({ ...prev, Relationship: value })); 
  // };
  const handleOtherRelationshipChange = (e) => {
    const value = e.target.value;
    setOtherRelationship(value);

    // ตรวจสอบว่าเป็นตัวอักษรเท่านั้น
    if (/[^ก-๙a-zA-Z\s]/.test(value)) {
      setOtherError("กรุณากรอกเป็นตัวอักษรเท่านั้น");
    } else {
      setOtherError(""); // ลบข้อความผิดพลาดเมื่อกรอกถูกต้อง
    }

    setFormData((prev) => ({ ...prev, Relationship: value }));
  };

  
  
//   const handleOtherRelationshipChange = (e) => {
//     const value = e.target.value;
//     setOtherRelationship(value);
//     setRelationship(value); 
//   };
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({ ...prev, [name]: value }));

  if (name === "tel") {
    if (/[^0-9]/.test(value)) {
      setTelError("เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น");
    } else {
      setTelError("");
    }
  } 
   else if (name === "name" || name === "surname") {
    if (/[^ก-๙a-zA-Z\s]/.test(value)) {
      if (name === "name") {
        setNameError("ชื่อต้องเป็นตัวอักษรเท่านั้น");
      } else {
        setSurnameError("นามสกุลต้องเป็นตัวอักษรเท่านั้น");
      }
    } else {
      if (name === "name") setNameError("");
      if (name === "surname") setSurnameError("");
    }
  }
};


  const validateForm = () => {
    let isValid = true;
    const textRegex = /^[ก-๙a-zA-Z\s]+$/;

    if (!formData.name.trim() ) {
      setNameError("กรุณากรอกชื่อ");
      isValid = false;
    } else if (!textRegex.test(formData.name)) {
      setNameError("ชื่อต้องเป็นตัวอักษรเท่านั้น");
      isValid = false;    
    } else {
      setNameError("");
    }
  
    if (!formData.surname.trim()) {
      setSurnameError("กรุณากรอกนามสกุล");
      isValid = false;
    } else if (!textRegex.test(formData.surname)) {
      setSurnameError("นามสกุลต้องเป็นตัวอักษรเท่านั้น");
      isValid = false;
    } else {
      setSurnameError("");
    }

    if (!formData.tel.trim()) {
      setTelError("กรุณากรอกเบอร์โทรศัพท์");
      isValid = false;
    } else if (formData.tel.length !== 10) {
      setTelError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
      isValid = false;
    } else if (!/^\d+$/.test(formData.tel)) {
      setTelError("เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น");
      isValid = false;
    } else {
      setTelError("");
    }
    
    if (!showOtherInput && !formData.Relationship.trim()) {
      setRelationshipError("กรุณาเลือกความสัมพันธ์");
      isValid = false;
    } else {
      setRelationshipError("");
    }

    if (showOtherInput) { 
      if (!otherRelationship.trim()) {
        setOtherError("กรุณาระบุความสัมพันธ์");
        isValid = false;
      } else if (!textRegex.test(otherRelationship)) {
        setOtherError("ความสัมพันธ์ต้องเป็นตัวอักษรเท่านั้น");
        isValid = false;
      } else {
        setOtherError("");
      }
    } else {
      setOtherError(""); // ล้าง error ถ้าไม่ได้เลือก "อื่นๆ"
    }
    return isValid;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      console.log("Validation Failed", formData);
      return; 
    }
    console.log("Submitting Data", formData);
    try {
      const response = await fetch("https://backend-deploy-render-mxok.onrender.com/updatecaregiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: caregiver._id, ...formData }),
      });

      const data = await response.json();
        if (data.status === "Ok") {
              toast.success("แก้ไขข้อมูลสำเร็จ");
              setTimeout(() => {
                  navigate("/allinfo", { state: { id: id } });
                }, 1000);
          } else {
              // setError(data.error);
              toast.error(data.error);
            }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <main className="body">
      <ToastContainer/>
      <Sidebar />
      <div className="home_content">
        <div className="homeheader">
          <div className="header">จัดการข้อมูลผู้ป่วย</div>
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
            <li className="middle">
              <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="alluser">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>

            <li className="middle">
              <a onClick={handleBreadcrumbClick} className="info">
                ข้อมูลการดูแลผู้ป่วย
              </a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a onClick={handleBreadcrumbClick} className="info">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขข้อมูลผู้ดูแล</a>
            </li>
          </ul>
        </div>
        
        <div className="adminall card mb-3">
        <p className="title-header">แก้ไขข้อมูลผู้ดูแล</p>
        <form>
        <div className="mb-2">
            <label>เลขประจําตัวประชาชน</label>
            <input
              type="text"
              readOnly
              className="form-control gray-background"              
              name="ID_card_number"
              value={formatIDCardNumber(formData.ID_card_number)}
              onChange={handleChange}
            />
          </div>
           <div className="mb-2">
            <label>ชื่อ</label>
            <input
              type="text"
              className={`form-control ${nameError ? "input-error" : ""}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {nameError && <span className="error-text">{nameError}</span>}
            </div>
          <div className="mb-2">
            <label>นามสกุล</label>
            <input
              type="text"
              name="surname"
              className={`form-control ${surnameError ? "input-error" : ""}`}
              value={formData.surname}
              onChange={handleChange}
            />
            {surnameError && <span className="error-text">{surnameError}</span>}

          </div>
          <div className="mb-2">
            <label>ความสัมพันธ์กับผู้ป่วย</label>
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
              {RelationshiError && (
                    <span className="error-text">{RelationshiError}</span>
                  )}
              </div>
              {showOtherInput && (
                <div className="mt-2">
                  <label>ระบุความสัมพันธ์อื่นๆ</label>
                  <input
                    type="text"
                    name="other"
                    className={`form-control ${otherError ? "input-error" : ""}`}
                    value={otherRelationship}
                    onChange={handleOtherRelationshipChange}
                  />
                   {otherError && <span className="error-text">{otherError}</span>}

                </div>
              )}
            </div>
            
         
          <div className="mb-2">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              name="tel"
              className={`form-control ${telError ? "input-error" : ""}`}
              value={formData.tel}
               maxLength="10"
              onChange={handleChange}
            />
            {telError && <span className="error-text">{telError}</span>}

          </div>
      
          <div className="d-grid">
            <button
              onClick={handleSave}
              className="btn btn-outline py-2"
            >
              บันทึก
            </button>
          </div>
          </form>
        </div>
      </div>
    </main>
  );
}