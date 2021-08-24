import React from "react";
import ChannelLoader from "../Utility/loader";
import { FaUserCircle } from "react-icons/fa";
import hamburgerCustom from "../../static/img/hamburger.svg";
import { shortenFileName } from "../Utility/string_shortener";
import connected_svg from "../../static/img/connected.svg";
import loading_svg from "../../static/img/loading/loading.svg";
import { MdChatBubble } from "react-icons/md";

const PrivateChatContainer = (props) => {
  const {
    users,
    changeChannel,
    displayOnlineStatus,
    onlineDectectorById,
    getLastMessageFromChannel,
    getNotificationCount,
    moreThanThreeCount,
    groupCheckSetter,
    sidebarSwitcher,
    currentUser,
    online_pc_status
  } = props;
  return (
    <div className="status channel-status">
      <div className="add_status channel-nav">
        <div className="channel-nav--1">
          <div className="add_status--right">
            <FaUserCircle className="add_status--icon" />
          </div>
          <div className="add_status--left">
            <p className="add_status--header">
              Direct Chats {users.length > 0 ? `(${users.length})` : ""}
            </p>
            <p className="add_status--sub">Enjoy direct contacts...</p>
          </div>
        </div>
        <div className="channel-nav--2" onClick={sidebarSwitcher}>
          <img src={hamburgerCustom} className="hamburger" alt="" />
        </div>
      </div>

      <div className="viewed_updates">
        <div>
          <div className="viewed_updates--container">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  className="viewed_updates--content"
                  key={user.uid}
                  onClick={() => changeChannel(user)}
                >
                  <div className="pc--online">
                    <img
                      src={user.avatar ? user.avatar : loading_svg}
                      className="viewed_updates--ball"
                      alt=""
                      onLoad={() => displayOnlineStatus()}
                    />
                    {online_pc_status && (
                      <span
                        className={`pc--online-status  
                        ${
                          onlineDectectorById(user.uid) === "online"
                            ? "green--online"
                            : "orange--offline"
                        }`}
                      ></span>
                    )}
                  </div>

                  <div className="viewed_updates--left">
                    <div className="add_status--header channel--header">
                      <p> {shortenFileName(user.name, 40, 0.99, "...")}</p>
                      <p className="channel--time">
                        {onlineDectectorById(user.uid) === "online" ? (
                          <span className="online_user">
                            {onlineDectectorById(user.uid)}
                          </span>
                        ) : (
                          onlineDectectorById(user.uid)
                        )}
                      </p>
                    </div>
                    <div className="add_status--sub channel-sub push_status_down">
                      <p className="channels-lastmsg">
                        {getLastMessageFromChannel(currentUser, user)
                          .activity !== ""
                          ? getLastMessageFromChannel(currentUser, user)
                              .activity
                          : `# Bothelper ~ Start connection!`}
                      </p>
                      <div>
                        {getNotificationCount(user) && (
                          <span
                            className={`noti ${moreThanThreeCount(
                              getNotificationCount(user)
                            )}`}
                          >
                            {getNotificationCount(user)}
                          </span>
                        )}
                      </div>
                    </div>
                    <hr className="hr" />
                  </div>
                </div>
              ))
            ) : users.length === 0 ? (
              <div className="no_dm_container">
                <div className="place-center middlelize push_about_down sleek_bkgrd">
                  <div className="profile--about push_contn_down">
                    Start a <span className="themefy">Connection</span>
                  </div>
                  <div className="profile--flex column_flexer">
                    <div className="profile--aboutItem profile--aboutItem2 profile--break">
                      <div className="no_dm">
                        <div className="no_dm--text connected_svg">
                          <img
                            src={connected_svg}
                            alt=""
                            className="connected_svg_1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="place-center middlelize push_about_down sleek_bkgrd">
                  <div className="profile--about"> Pear-to-Pear chat</div>
                  <div className="profile--flex column_flexer">
                    <div className="profile--aboutItem profile--aboutItem2 profile--break">
                      <div className="no_dm">
                        <div className="no_dm--text">
                          There are no users on your{" "}
                          <span className="redify">DM</span>. Add users by
                          visiting the channel and clicking on the
                          avatar(profile picture) of the user.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="place-center middlelize push_about_down sleek_bkgrd">
                  <div className="profile--about">Guide</div>
                  <div className="profile--flex column_flexer no_dm--text">
                    <div className="profile--aboutItem profile--aboutItem2 profile--break">
                      <ol>
                        <li>
                          Go to <span className="themefy">channels</span>
                        </li>
                        <li>
                          Select a <span className="themefy">channel</span> of
                          interest
                        </li>
                        <li>
                          Click on a{" "}
                          <span className="redify">User's profile picture</span>
                        </li>
                        <li>
                          Click on the{" "}
                          <span className="redify">"Secret chat"</span> blue
                          button
                        </li>
                        <li>Now, that's all. Enjoy SneakIn.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="profile_alt_1 profile_alt_2">
                  <button
                    className="profile_alt_1--btn place_at_center"
                    onClick={groupCheckSetter}
                  >
                    <MdChatBubble className="profile_alt_1--svg" />
                    <span className="profile_alt_1--text">Go to Channels</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ChannelLoader />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChatContainer;
