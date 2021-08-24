import React, { Component } from "react";
import { BiArrowBack } from "react-icons/bi";
import { BsImageFill } from "react-icons/bs";
import hamburgerCustom from "../../static/img/hamburger.svg";
import { connect } from "react-redux";
import firebase from "../../firebase";
import 'emoji-mart/css/emoji-mart.css';
import ProfileHamburgerModal from "../Modal/ProfileHamburgerModal";
import Skeleton from "react-loading-skeleton";
import mime from "mime-types";
import AvatarEditor from 'react-avatar-editor';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { MdChatBubble } from "react-icons/md";
import BlackRock from "../Themefy/BlackRock";
import { ManeteeSpan } from "../Themefy/ManateeColor";
import { ButtonColor } from "../Themefy/CustomTheme";

class ProfileImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.loggedInUser,
      hamModalTracker: false,
      photoURL: "",
      previewImage: "",
      croppedImage: "",
      blob: "",
      uploadCroppedImage: "",
      storageRef: firebase.storage().ref(),
      userRef: firebase.auth().currentUser,
      usersRef: firebase.database().ref('users'),
      isOpen: false,
      metadata: {
        contentType: 'image/jpeg'
      },
      loading: false,
      saving: false
    };

    this.profileImageRef = React.createRef();
    this.profileImageInputRef = React.createRef();
  }

  componentDidMount() {
    const { photoURL } = this.props
   if(photoURL) {
     this.setState({
       photoURL: this.props.photoURL
     })
   }
  }

  addHamModal = () => {
    this.setState({
      hamModalTracker: true,
    });
  };

  removeHamModal = () => {
    this.setState({
      hamModalTracker: false,
    });
  };

  handleClick = (event) => {
      this.profileImageInputRef.current.click();
  };



  isAuthorized = (filename) => {
    const allowed_mime_types = ["image/jpeg", "image/png", "image/webp"];
    allowed_mime_types.includes(mime.lookup(filename));
  }
      

  uploadCroppedImage = () => {
    this.setState({
      saving: true
    })
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({ croppedImage: imageUrl, blob }, () => this.uploadLogic());

      })
    }
 
 

  };




  uploadLogic = () => {
    const { storageRef, userRef, blob, metadata } = this.state;
    if(blob && metadata) {
       storageRef.child(`avatars/users/${userRef.uid}`)
         .put(blob, metadata)
         .then(snap => {
           snap.ref
           .getDownloadURL()
           .then(downloadURL => {
             this.setState({ uploadCroppedImage: downloadURL }, () => {
               this.changeAvatar();
             });
           })
         })
    }



  }

  changeAvatar = () => {
    this.state.userRef.updateProfile({
      photoURL: this.state.uploadCroppedImage
    })
    .catch(err => {
      console.error(err);
    });

    this.state.usersRef.child(this.state.user.uid)
      .update({ avatar: this.state.uploadCroppedImage })
      .then(() => {
         this.props.isDesktop? this.props.handleSetIsProfile() : this.props.profileCheckSetter()
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleChange = event => {
    this.setState({
      loading: true
    })
    const file = event.target.files[0];
    const reader = new FileReader();
    
    if (file) {
      // This converts our image to base64 string. 
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result, loading: false });
      });
    }
  };
  

  openModal = () => {
    this.setState({
      isOpen: true
    })
  }


  returnNothing = () => {
    return;
  }

  render() {
    const { hamModalTracker, photoURL, loading, previewImage, saving, isOpen } = this.state
    const { goBack, groupCheckSetter, dmCheckSetter } = this.props
    return (
      <>
        {
          isOpen && photoURL &&  (
          <Lightbox
          mainSrc={photoURL}
          onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )
        }
        {hamModalTracker ? (
          <ProfileHamburgerModal
            goBack={this.removeHamModal}
            groupCheckSetter={groupCheckSetter}
            dmCheckSetter={dmCheckSetter}
            removeHamModal={goBack}
            ref={this.profileImageRef}
          />
        ) : (
          ""
        )}
        <div className="about-container">
          <BlackRock className="status channel-status profile-status white-background">
            <div className="add_status channel-nav profile-nav">
              <div className="channel-nav--1">
                <div className="add_status--right" onClick={goBack}>
                  <BiArrowBack className="hamModal--backItem" />
                </div>
                <div className="add_status--left">
                  <p className="add_status--header profile-header">Preview-1</p>
                </div>
              </div>
              <div className="channel-nav--2" onClick={this.addHamModal}>
                <img src={hamburgerCustom} className="hamburger" alt="" />
              </div>
            </div>
            
            {this.props.isDesktop?
            <header>
              <ManeteeSpan onClick={() => this.props.handleSetIsProfile()}  className="btn btn-outline-light sidebar-close">
                  Back
              </ManeteeSpan>
              <ul className="list-inline">
              <li className="list-inline-item">
               {previewImage && (
              <span onClick={!saving?() => this.uploadCroppedImage(): () => this.returnNothing()}  className="btn btn-outline-light text-danger sidebar-close" id={saving?"lessen_opacity":""} >
                  {!saving ? "Save" : "Saving..."} 
              </span>
              )}
              </li>
              </ul>
            </header>
            :
              <div className="saveImage">
                {previewImage && (
                <span className="saveImageItem" onClick={this.uploadCroppedImage} >
                  {!saving ? "Save" : "Saving..."} 
                </span>
                )
                }
              </div>
            }


            <div className="all--section rem_padder">
              <section className="about--section1">
                <div className="about--header">
                  {previewImage ? (
                    <div className="profileImage--image">
                     <AvatarEditor image={previewImage} width={240} height={240}
                       border={10} color={[207, 49, 230, 0.17]} borderRadius={50} scale={1.2} ref={node => (this.avatarEditor = node)}  /> 
                    </div>
                  )
                  :
                   photoURL ? 
                     (
                     <div className="profileImage--image">
                       <img
                         src={photoURL}
                         alt=""
                         className="profileImage--imageItem"
                         onClick={this.openModal}
                       />
                     </div>

                   ) : (
                     <div className="profileImage--image">
                       <Skeleton circle={true} height={96} width={96} />
                     </div>
                   )
                }

                </div>
              </section>
              <input
                  type="file"
                  ref={this.profileImageInputRef}
                  onChange={this.handleChange}
                  style={{ display: "none" }}
                  accept="image/jpeg, image/png, image/webp"
              />
              <section className="profileItem--section2">
                <span>
                  <BsImageFill className="galleryItem" />
                </span>
                <span className="chooseG" onClick={this.handleClick}>
                   {loading? "Loading..." : "Choose from Gallery"}                
                </span>
              </section>

              <div className="profile_alt_1 profile_alt_1_pi1">
                <ButtonColor className="profile_alt_1--btn" onClick={this.props.isDesktop? () => this.props.handleSetIsProfile() : () => goBack()}>
                  <MdChatBubble className="profile_alt_1--svg" />
                  <span  className="profile_alt_1--text profile_alt_1--text_pi1">
                    Go to Profile
                  </span>
                </ButtonColor>
              </div>

            </div>
          </BlackRock>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.user.currentUser,
  photoURL: state.userInfo.userInfo.avatar
});

export default connect(mapStateToProps)(ProfileImage);
