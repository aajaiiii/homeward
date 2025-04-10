import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/equipment.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "./sidebar";

export default function AllEquip() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // ค้นหา
  const [token, setToken] = useState("");
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
    getAllEquip();
  }, []);

  const getAllEquip = () => {
    fetch("https://backend-deploy-render-mxok.onrender.com/allequip", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllEquip");
        setData(data.data);
      });
  };

  const deleteEquipment = async (id, equipment_name) => {
    if (window.confirm(`คุณต้องการลบ ${equipment_name} หรือไม่ ?`)) {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/deleteEquipment/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert(data.data);
          getAllEquip();
        } else {
          console.error("Error during deletion:", data.data);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };

  useEffect(() => {
    const searchEquipment = async () => {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/searchequipment?keyword=${encodeURIComponent(
            searchKeyword
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const searchData = await response.json();
        if (response.ok) {
          if (searchData.data.length > 0) {
            setData(searchData.data);
          } else {
            setData([]); // ล้างข้อมูลเดิมในกรณีไม่พบข้อมูล
          }
        } else {
          console.error("Error during search:", searchData.status);
        }
      } catch (error) {
        console.error("Error during search:", error);
      }
    };
    searchEquipment();
  }, [searchKeyword, token]);

  return (
    <main className="body">
     <Sidebar />
      <div className="home_content">
        <div className="homeheader">
          <div className="header">จัดการอุปกรณ์ทางการแพทย์</div>
          <div className="profile_details">
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
            <li>
              <a>จัดการอุปกรณ์ทางการแพทย์</a>
            </li>
          </ul>
        </div>

        <div className="content-toolbar">
          <div className="toolbar-container">
            <div className="search-bar">
              <i className="bi bi-search search-icon"></i>
              <input
                className="search-text"
                type="text"
                placeholder="ค้นหา"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <div className="toolbar">
              <button
                className="btn btn-outline py-1 px-4"
                onClick={() => navigate("/addequip", { state: adminData })}
              >
                <i
                  className="bi bi-plus-circle"
                  style={{ marginRight: "8px" }}
                ></i>
                เพิ่มอุปกรณ์
              </button>
            </div>
          </div>
          <p className="countadmin">จำนวนอุปกรณ์ทั้งหมด : {data.length} ชิ้น</p>
        </div>
        <div className="content">
          {/* <div className="cardall card mb-3"> */}
          <div className="table-container">
            <table className="equipments-table table-all">
              <thead>
                <tr>
                  <th>ชื่ออุปกรณ์</th>
                  <th>ประเภทอุปกรณ์</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((i, index) => (
                    <tr key={index}>
                      <td data-title="">{i.equipment_name}</td>
                      <td>{i.equipment_type}</td>
                      <td className="buttongroup-in-table">
                        <button
                          className="editimg2"
                          onClick={() =>
                            navigate("/updateequip", {
                              state: { id: i._id, equip: i },
                            })
                          }
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="deleteimg2"
                          alt="deleteimg"
                          onClick={() =>
                            deleteEquipment(i._id, i.equipment_name)
                          }
                        >
                          {" "}
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      ไม่พบข้อมูลที่คุณค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* </div> */}
        </div>
      </div>
    </main>
  );
}
