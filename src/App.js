import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/login";
import Home from "./components/home";
import Profile from "./components/profile";
import Updateadmin from "./components/updateadmin";
import Alladmin from "./components/alladmin";
import AddAdmin from "./components/addadmin";
import AddEquip from "./components/addequipment";
import AllEquip from "./components/allequipment";
import AllMpersonnel from "./components/allmpersonnel";
import AddMpersonnel from "./components/addmpersonnel";
import AddCaremanual from "./components/addcaremanual";
import Reset from "./components/forgetpassword";
import UpdateCareManual from "./components/updatecaremanual";
import AddUser from "./components/adduser";
import AllUser from "./components/alluser";
import UpdateUser from "./components/updateuser";
import UpdateName from "./components/updatenameadmin";
import UpdateEmail from "./components/updateemail";
import UpdateOTP from "./components/updateotp";
import AddMDinformation from "./components/addmdinformation";
import AddEquipment from "./components/addequipment";
import AllInfo from "./components/allinfo";
import AddEquipUser from "./components/addequipuser";
import Updatemedicalinformation from "./components/updatemedicalinformation";
import Success from "./components/success";
import UpdateMPersonnel from "./components/updatempersonnel";
import UpdateEquipment from "./components/updateequipment";
import AddSymptom from "./components/addsymptom";
import Allsymptom from "./components/allsymptom";
import UpdateSymptom from "./components/updatesymptom";
import UpdateEquipUser from "./components/updateequipuser";
import AlluserInSetting from "./components/alluserinsetting";
import SettingNoti from "./components/settingnoti";
import DisplayUser from "./components/DisplayUser";
import PhysicalTherapyUser from "./components/PhysicalTherapyUser";
import Emailverification from "./components/email-verification";
import VerifyOtp from "./components/VerifyOtp";
import UpdateDefault from "./components/updatedefaultThreshold";
import Recover from "./components/recover";
import UpdateCaregiver from "./components/updatecaregiver";
import AddCaregiver from "./components/addcaregiver";
import AllInfoDeleted from "./components/allinfo-deleted";
import ScrollToTop from "../src/components/ScrollToTop";

const PrivateRoute = ({ element, isLoggedIn }) => {
  return isLoggedIn === "true" ? (
    element
  ) : (
    <Navigate to="/" replace state={{ from: window.location.pathname }} />
  );
};

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <Router>
      <ScrollToTop /> 
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={isLoggedIn === "true" ? <Home /> : <Login />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute element={<Home />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/alladmin"
            element={
              <PrivateRoute element={<Alladmin />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/addadmin"
            element={
              <PrivateRoute element={<AddAdmin />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/updateadmin"
            element={
              <PrivateRoute element={<Updateadmin />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute element={<Profile />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/allequip"
            element={
              <PrivateRoute element={<AllEquip />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/addequip"
            element={
              <PrivateRoute element={<AddEquip />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/allmpersonnel"
            element={
              <PrivateRoute
                element={<AllMpersonnel />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/addmpersonnel"
            element={
              <PrivateRoute
                element={<AddMpersonnel />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/addcaremanual"
            element={
              <PrivateRoute
                element={<AddCaremanual />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/addcaregiver"
            element={
              <PrivateRoute
                element={<AddCaregiver />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/updatecaremanual"
            element={
              <PrivateRoute
                element={<UpdateCareManual />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          {/* ที่เพิ่ม */}
          <Route
            path="/adduser"
            element={
              <PrivateRoute element={<AddUser />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/displayUser"
            element={
              <PrivateRoute element={<DisplayUser />} isLoggedIn={isLoggedIn} />
            }
          />{" "}
          <Route
            path="/physicalTherapyUser"
            element={
              <PrivateRoute
                element={<PhysicalTherapyUser />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/addsymptom"
            element={
              <PrivateRoute element={<AddSymptom />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/allsymptom"
            element={
              <PrivateRoute element={<Allsymptom />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/updatesymptom"
            element={
              <PrivateRoute
                element={<UpdateSymptom />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/alluser"
            element={
              <PrivateRoute element={<AllUser />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/updatecaregiver"
            element={
              <PrivateRoute
                element={<UpdateCaregiver />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/updateuser"
            element={
              <PrivateRoute element={<UpdateUser />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/updatenameadmin"
            element={
              <PrivateRoute element={<UpdateName />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/updateemail"
            element={
              <PrivateRoute element={<UpdateEmail />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/updateotp"
            element={
              <PrivateRoute element={<UpdateOTP />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route path="/forgetpassword" element={<Reset />} />
          <Route path="/success" element={<Success />} />
          <Route
            path="/addmdinformation"
            element={
              <PrivateRoute
                element={<AddMDinformation />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/addequipment"
            element={
              <PrivateRoute
                element={<AddEquipment />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/allinfo"
            element={
              <PrivateRoute element={<AllInfo />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/addequipuser"
            element={
              <PrivateRoute
                element={<AddEquipUser />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/updatemedicalinformation"
            element={
              <PrivateRoute
                element={<Updatemedicalinformation />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/updatempersonnel"
            element={
              <PrivateRoute
                element={<UpdateMPersonnel />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/updateequip"
            element={
              <PrivateRoute
                element={<UpdateEquipment />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/updateequipuser"
            element={
              <PrivateRoute
                element={<UpdateEquipUser />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/alluserinsetting"
            element={
              <PrivateRoute
                element={<AlluserInSetting />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/settingnoti"
            element={
              <PrivateRoute element={<SettingNoti />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/updatedefault"
            element={
              <PrivateRoute
                element={<UpdateDefault />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/emailverification"
            element={
              <PrivateRoute
                element={<Emailverification />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/verifyotp"
            element={
              <PrivateRoute element={<VerifyOtp />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/recover-patients"
            element={
              <PrivateRoute element={<Recover />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/allinfodeleted"
            element={
              <PrivateRoute
                element={<AllInfoDeleted />}
                isLoggedIn={isLoggedIn}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
