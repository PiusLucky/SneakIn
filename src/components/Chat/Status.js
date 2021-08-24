import React from "react";
import { FaUserCircle } from 'react-icons/fa';
import { FiCamera } from 'react-icons/fi';
import { BiPencil } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
//dummy images [remove in production]
import dummy_01 from "../../static/img/dummy/man_avatar1.jpg";
import dummy_03 from "../../static/img/dummy/man_avatar3.jpg";
import dummy_04 from "../../static/img/dummy/man_avatar4.jpg";
import dummy_05 from "../../static/img/dummy/man_avatar5.jpg";
import dummy_06 from "../../static/img/dummy/women_avatar1.jpg";
import dummy_07 from "../../static/img/dummy/women_avatar2.jpg";
// import dummy_08 from "../../static/img/dummy/women_avatar3.jpg";
// import dummy_09 from "../../static/img/dummy/women_avatar4.jpg";
// import dummy_10 from "../../static/img/dummy/women_avatar5.jpg";
// import dummy_11 from "../../static/img/dummy/women_avatar6.jpg";





const Status = () => {
  return (
    <>
    <div className="status">
        <div className="add_status channel-nav">
          <div className="channel-nav--1">
            <div className="add_status--right">
              <FaUserCircle className="add_status--icon" />
            </div>
            <div className="add_status--left">
              <p className="add_status--header">My Status</p>
              <p className="add_status--sub">Tap to add new status</p>
            </div>
          </div>
          <div className="channel-nav--2">
            <GiHamburgerMenu className="hamburger"/>
          </div>
        </div>

        <div className="viewed_updates">
            <div>
                <p className="viewed_updates--header">Viewed updates</p>
                <div className="viewed_updates--container">
                    <div className="viewed_updates--content">
                      <img src={dummy_01} className="viewed_updates--ball" alt="" />
                      <div className="viewed_updates--left">
                        <p className="add_status--header">Pius Lucky</p>
                        <p className="add_status--sub">Today, 2.58 AM</p>
                        <hr className="hr"/>
                      </div>
                    </div>
                    <div className="viewed_updates--content">
                      <img src={dummy_03} className="viewed_updates--ball" alt="" />
                      <div className="viewed_updates--left">
                        <p className="add_status--header">Pampay Guy</p>
                        <p className="add_status--sub">Today, 8.58 AM</p>
                        <hr className="hr"/>
                      </div>
                    </div>
                     <div className="viewed_updates--content">
                      <img src={dummy_04} className="viewed_updates--ball" alt="" />
                      <div className="viewed_updates--left">
                        <p className="add_status--header">Aribobo</p>
                        <p className="add_status--sub">Today, 5.58 AM</p>
                        <hr className="hr"/>
                      </div>
                    </div>
                </div>

            </div>
        </div>

         <div className="muted_updates">
            <div>
                <p className="viewed_updates--header">Muted updates</p>
                <div className="viewed_updates--container muted-color">
                    <div className="viewed_updates--content">
                      <img src={dummy_05} className="viewed_updates--ball" alt="" />
                      <div className="viewed_updates--left">
                        <p className="add_status--header">Pius Lucky</p>
                        <p className="add_status--sub">Today, 2.58 AM</p>
                        <hr className="hr"/>
                      </div>
                    </div>
                    <div className="viewed_updates--content">
                      <img src={dummy_06} className="viewed_updates--ball" alt="" />
                      <div className="viewed_updates--left">
                        <p className="add_status--header">Pampay Guy</p>
                        <p className="add_status--sub">Today, 8.58 AM</p>
                        <hr className="hr"/>
                      </div>
                    </div>
                     <div className="viewed_updates--content">
                      <img src={dummy_07} className="viewed_updates--ball" alt="" />
                      <div className="viewed_updates--left">
                        <p className="add_status--header">Aribobo</p>
                        <p className="add_status--sub">Today, 5.58 AM</p>
                        <hr className="hr"/>
                      </div>
                    </div>
                </div>

            </div>
        </div>
    </div> 
    <div className="easy-icons">
        <span className="pencil-plate"></span>
        <span className="camera-plate"></span>
        <div className="pencil-div">
            <BiPencil className="pencil-icon" />
        </div>
        <div className="camera-div">
            <FiCamera className="camera-icon"/>
        </div>
    </div>  
    </>
  );
}





export default Status;

