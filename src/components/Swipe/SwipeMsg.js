import React, { Component } from "react";
import StarLoader from "../Utility/starMsg_loader";
import { shortenFileName } from "../Utility/string_shortener";
import moment from "moment";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import loading_svg from "../../static/img/loading/loading.svg";
import BlackRock from "../Themefy/BlackRock";
import StarBlackRock from "../Themefy/StarBlackRock";
import { LazyLoadImage } from 'react-lazy-load-image-component';


class SwipeMsg extends Component {
  state = {
    photoIndex: 0,
    isOpen: false,
    imagesArray: [],
    imageDetail: null
  }

  componentDidMount () {
    this.imageUrlAppender()

  }

  imageUrlAppender = () => {
    const { swipeArray } = this.props
    const { imagesArray } = this.state
    if(swipeArray.length > 0) {
      swipeArray.map((swipeArrayItem) => (
       swipeArrayItem.isContent === false && 
       imagesArray.push(swipeArrayItem.item)
      )) 
    }
  }

  ImageUrlIndexFinder = (imageArr, starredChn) => {
     if(imageArr){
       let index = imageArr.findIndex((item) => item === starredChn.item);
       this.nameTimestampExtractor(imageArr[index])
       this.setState({
         photoIndex: index,
         isOpen: true
       })
     }
  };

  openModal = (imagesArray, starredChn) => {
    this.ImageUrlIndexFinder(imagesArray, starredChn)
  }

  nameTimestampExtractor = (currentImgUrl) => {
    const { swipeArray } = this.props
    if(swipeArray.length > 0) {
      swipeArray.map((swipeArrayItem) => (
       swipeArrayItem.isContent === false && 
       swipeArrayItem.item === currentImgUrl &&   
       this.setState({
         imageDetail: {
           name: swipeArrayItem.createdBy.name, 
           timestamp: swipeArrayItem.timestamp
         }
       })
      )) 
    }
  }


  handleStar = () => {
    this.setState(prevState => ({
      isChannelStarred: !prevState.isChannelStarred
    }), () => this.starChannel());
  };

  render() {
    const { swipeArray, indexFinder, getAvatarFromUserId } = this.props;
    const { photoIndex, isOpen, imagesArray, imageDetail } = this.state;
    return swipeArray.length > 0 ? (
      <> 
          {
            isOpen && imagesArray.length > 0 &&  (
            <Lightbox
            mainSrc={imagesArray[photoIndex]}
            nextSrc={imagesArray[(photoIndex + 1) % imagesArray.length]}
            prevSrc={imagesArray[(photoIndex + imagesArray.length - 1) % imagesArray.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={
            () => this.setState(previousState => ({
              photoIndex: (previousState.photoIndex + imagesArray.length - 1) % imagesArray.length,
            }), () => this.nameTimestampExtractor(imagesArray[(photoIndex + imagesArray.length - 1) % imagesArray.length]))}
            onMoveNextRequest={() =>
            this.setState(previousState => ({
             photoIndex: (previousState.photoIndex + 1) % imagesArray.length,
             }), () => this.nameTimestampExtractor(imagesArray[(photoIndex + 1) % imagesArray.length]))}
            imageTitle={imageDetail && imageDetail.name }
            imageCaption={moment(imageDetail && imageDetail.timestamp).calendar()}
            />
          )
          }
          <BlackRock className="profile place-on-top place-on-top2">
          </BlackRock>
          {swipeArray.map((starredChn) => (
            starredChn !== null &&
            <section key={starredChn.id}>
              <StarBlackRock className="text_div">
                <span className="text_divItem">
                {starredChn.isContent?
                starredChn.item:
                <div className="big_div--image">
                  {imagesArray &&
                  <LazyLoadImage 
                    effect="blur"
                    src={starredChn.item} 
                    className="big_div--imageItem" 
                    alt="" 
                    placeholderSrc={loading_svg}
                    onClick={() => this.openModal(imagesArray, starredChn)} 
                  />
                  }
                </div>

                }
                </span>
                <span className="text_divItemDate">- {moment(starredChn.timestamp).format("lll")}</span>
                <span className="text_divItemDate leftPush">{indexFinder(swipeArray, starredChn)} ({shortenFileName(starredChn.createdBy.name, 22, 0.99, "...")})</span>
                <div className="creator_avatar">
                  <img
                    src={getAvatarFromUserId(starredChn.createdBy.id)? getAvatarFromUserId(starredChn.createdBy.id): loading_svg}
                    alt=""
                    className="creator_avatarItem"
                  />
                </div>
                <div className="avatarOverlay"></div>
              </StarBlackRock>

              
            </section>
          ))}

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

export default SwipeMsg;
