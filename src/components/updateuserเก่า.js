import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateUser() {
  const location = useLocation();
  const { id, user } = location.state;
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [ID_card_number, setIDCardNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [Address, setAddress] = useState("");
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverSurname, setCaregiverSurname] = useState('');
  const [Relationship, setRelationship] = useState('');
  const [caregiverTel, setCaregiverTel] = useState('');
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [otherGender, setOtherGender] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherRelationship, setOtherRelationship] = useState("");

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    // ตรวจสอบว่า date เป็น NaN หรือไม่
    if (isNaN(formattedDate.getTime())) {
      return ""; // ถ้าเป็น NaN ให้ส่งค่าว่างกลับไป
    }
    return formattedDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getuser/${id}`);
        const data = await response.json();
        setUsername(data.username);
        setName(data.name);
        setSurname(data.surname);
        setEmail(data.email);
        setPassword(data.password);
        setTel(data.tel);
        setGender(data.gender);
        setBirthday(data.birthday);
        setIDCardNumber(data.ID_card_number);
        setNationality(data.nationality);
        setAddress(data.Address);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchCaregiverData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getcaregiver/${id}`);
        const caregiverData = await response.json();
        if (caregiverData.status === 'ok') {
          setCaregiverName(caregiverData.data.name);
          setCaregiverSurname(caregiverData.data.surname);
          setCaregiverTel(caregiverData.data.tel);
          setRelationship(caregiverData.data.Relationship);
        }
      } catch (error) {
        console.error("Error fetching caregiver data:", error);
      }
    };

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
        body: JSON.stringify({ token: token }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAdminData(data.data);
        });
    }
    fetchData();
    fetchCaregiverData();
  }, [id]);

  const UpdateUser = async () => {
    try {
      const userData = {
        username,
        name,
        surname,
        email,
        password,
        tel,
        gender,
        birthday,
        ID_card_number,
        nationality,
        Address,
        user: id, // เชื่อมโยงกับผู้ใช้
        caregivername: caregiverName, // เปลี่ยนเป็น lowercase ตาม Backend
        caregiversurname: caregiverSurname,
        caregivertel: caregiverTel,
        Relationship
      };

      const response = await fetch(`http://localhost:5000/updateuserinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log("แก้ไขผู้ใช้แล้ว:", updatedUser);
        toast.success("แก้ไขข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/allinfo", { state: { id: id, user: user } });
        }, 1100);
      } else {
        toast.error("ไม่สามารถแก้ไขผู้ใช้ได้:", response.statusText);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้:", error);
    }
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

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

  const handleRelationshipChange = (e) => {
    const value = e.target.value;
    setRelationship(value);
    if (value === "อื่นๆ") {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setOtherRelationship("");
    }
  };

  const handleOtherRelationshipChange = (e) => {
    const value = e.target.value;
    setOtherRelationship(value);
    setRelationship(value); // Update gender to the value of otherGender
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
          <li>
            <a href="recover-patients">
              <i className="bi bi-trash"></i>
              <span className="links_name">จัดการข้อมูลผู้ป่วยที่ถูกลบ</span>
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
              <a>แก้ไขข้อมูลผู้ป่วย</a>
            </li>
          </ul>
        </div>
        <h3>แก้ไขข้อมูลผู้ป่วย</h3>
        <div className="adminall card mb-3">
          <div className="mb-3">
            <label>ชื่อผู้ใช้</label>
            <input
              type="text"
              readOnly
              className="form-control gray-background"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>


          <div className="mb-3">
            <label>อีเมล</label>
            <input
              type="text"
              value={email}
              readOnly
              className="form-control gray-background"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>ชื่อ</label>
            <input
              value={name}
              type="text"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>นามสกุล</label>
            <input
              type="text"
              className="form-control"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>เพศ</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="ชาย"
                  checked={gender === "ชาย"}
                  onChange={handleGenderChange}
                />
                ชาย
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="หญิง"
                  checked={gender === "หญิง"}
                  onChange={handleGenderChange}
                />
                หญิง
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="ไม่ต้องการระบุ"
                  checked={gender === "ไม่ต้องการระบุ"}
                  onChange={handleGenderChange}
                />
                ไม่ต้องการระบุ
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="อื่นๆ"
                  checked={showOtherInput}
                  onChange={handleGenderChange}
                />
                อื่นๆ
              </label>
              {showOtherInput && (
                <div className="mt-2">
                  <label>กรุณาระบุ:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={otherGender}
                    onChange={handleOtherGenderChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label>วันเกิด</label>
            <input
              value={formatDate(birthday)}
              type="date"
              className="form-control"
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>เลขประจำตัวบัตรประชาชน</label>
            <input
              value={ID_card_number}
              type="text"
              className="form-control"
              onChange={(e) => setIDCardNumber(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>สัญชาติ</label>
            <input
              value={nationality}
              type="text"
              className="form-control"
              onChange={(e) => setNationality(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>ที่อยู่</label>
            <input
              value={Address}
              type="text"
              className="form-control"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              value={tel}
              className="form-control"
              onChange={(e) => setTel(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>ชื่อ(ผู้ดูแล)</label>
            <input
              type="text"
              className="form-control"
              value={caregiverName}
              onChange={(e) => setCaregiverName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>นามสกุล(ผู้ดูแล)</label>
            <input
              type="text"
              className="form-control"
              value={caregiverSurname}
              onChange={(e) => setCaregiverSurname(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>ความสัมพันธ์</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="พ่อ"
                  checked={Relationship === "พ่อ"}
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
                  checked={Relationship === "แม่"}
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
                  checked={Relationship === "ลูก"}
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
                  checked={Relationship === "ภรรยา"}
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
                  checked={Relationship === "สามี"}
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
          <div className="mb-3">
            <label>เบอร์โทรศัพท์(ผู้ดูแล)</label>
            <input
              type="text"
              className="form-control"
              value={caregiverTel}
              onChange={(e) => setCaregiverTel(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button
              onClick={UpdateUser}
              // onClick={() => UpdateUser(id)}
              className="btn btn-outline py-2"
            >
              บันทึก
            </button>
            <br />
          </div>
        </div>
      </div>
      <div></div>
    </main>
  );
}