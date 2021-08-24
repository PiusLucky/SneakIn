import React, { Component } from "react";
import StarLoader from "../Utility/starMsg_loader";
import { shortenFileName } from "../Utility/string_shortener";
import moment from "moment";
import loading_svg from "../../static/img/loading/loading.svg";
import BlackRock from "../Themefy/BlackRock"
import StarBlackRock from "../Themefy/StarBlackRock"


class Swipe extends Component {
  render() {
    const { swipeArray, indexFinder, getAvatarFromUserId } = this.props;
    return swipeArray.length > 0 ? (
      <>
        <BlackRock className="profile place-on-top place-on-top2"></BlackRock>
        {swipeArray.map(
          (starredChn) =>
            starredChn !== null && (
              <section key={starredChn.id}>
                <StarBlackRock className="text_div">
                  <span className="text_divItem">{starredChn.details}</span>
                  <span className="text_divItemDate leftPush">
                    {indexFinder(swipeArray, starredChn)} (
                    {shortenFileName(starredChn.name, 22, 0.99, "...")})
                  </span>
                  <span className="text_divItemDate">
                    - {moment(starredChn.createdBy.timestamp).format("lll")}
                  </span>
                  <div className="creator_avatar">
                    <img
                      src={
                        getAvatarFromUserId(starredChn.createdBy.id)
                          ? getAvatarFromUserId(starredChn.createdBy.id)
                          : loading_svg
                      }
                      alt=""
                      className="creator_avatarItem"
                    />
                  </div>
                  <div className="avatarOverlay"></div>
                </StarBlackRock>
              </section>
            )
        )}
      </>
    ) : (
      <>
        <BlackRock className="profile place-on-top">
          <div className="big_div big_div--sm">
            <StarLoader />
          </div>
        </BlackRock>
      </>
    );
  }
}

export default Swipe;
