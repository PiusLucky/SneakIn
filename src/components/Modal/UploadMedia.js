import React, { Component, useState, useEffect } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { BiImageAdd } from "react-icons/bi";
import mime from "mime-types";
import { shortenFileNameWithEnd } from "../Utility/string_shortener";
import Compress from "browser-image-compression";
import  { UploaderBackground, UploaderBtnBackground, BorderStyle } from "../Themefy/CustomTheme";
import  { ManeteeSpan } from "../Themefy/ManateeColor";
import  BlueCharcoal from "../Themefy/BlueCharcoal";


const UploadMediaFunc = (props) => {
  const allowed_mime_types = ["image/jpeg", "image/png", "image/webp"];
  const [file, setFile] = useState(null);
  const [compressionRate, setCompressionRate] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const hiddenFileInput = React.useRef(null);

  const { closeModal } = props

  const handleClick = (event) => {
    hiddenFileInput.current.click();
    if(file) {
      setUploadProgress(0)
      setCompressionRate(0)
      setFile(null)
    }
  };

  const rateLogic = (f1, f2) => {
    const result = 100 * Math.abs( ( f1 - f2 ) / ( (f1 + f2)/2 ) );
    const newResult = parseFloat(result).toFixed(2)
    setCompressionRate(newResult)
  }

  const onProgress = progress => {
    setUploadProgress(progress)
  }

  const handleChange = (event) => {
    let file = event.target.files[0];
    if (file) {
      const originalFile = file.size
      const options = {
        maxSizeMB: 0.1,
        useWebWorker: true,
        onProgress: p => onProgress(p),
      };
      Compress(file, options)
        .then((compressedBlob) => {
          compressedBlob.lastModifiedDate = new Date();
          let convertedBlobFile = new File([compressedBlob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          const compressedFile = convertedBlobFile.size
          rateLogic(originalFile, compressedFile)
          setFile(convertedBlobFile);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const isAuthorized = (filename) =>
    allowed_mime_types.includes(mime.lookup(filename));

  const sendFile = () => {
    const { uploadFile, closeModal, channelClearNoti, currentChannel } = props;

    if (file !== null) {
      if (isAuthorized(file.name)) {
        const metadata = {
          contentType: mime.lookup(file.name),
        };
        uploadFile(file, metadata);
        closeModal();
        clearFile();
        channelClearNoti(currentChannel);
      }
    }
  };

  const clearFile = () => setFile({ file: null });

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const capitalizeFirstLetter = (string) => {
    const lowercase_str = string.toLowerCase();
    return lowercase_str.charAt(0).toUpperCase() + lowercase_str.slice(1);
  };

  useEffect(() => {
    setCompressionRate(compressionRate)
  }, [compressionRate, setCompressionRate]);

  

  useEffect(() => {
    setUploadProgress(uploadProgress)
  }, [uploadProgress, setUploadProgress]);

  return (
    <>
      <div className="accept_ignore upload-modal-container">
        <UploaderBackground className="accept_ignore--modal">
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleChange}
            style={{ display: "none" }}
            accept="image/jpeg, image/png, image/webp"
          />
          <div className="cancel_um">
            <ManeteeSpan onClick={closeModal}>Cancel</ManeteeSpan>
          </div>
          <BlueCharcoal className="accept_ignore--littlebox upload_box">
            <div className="accept_ignore--details accept_ignore--upload">
              <UploaderBtnBackground
                onClick={handleClick}
                className={
                  !!file
                    ? "accept_ignore--btn2 select-style down_opacity_upload_btn"
                    : "accept_ignore--btn2 select-style"
                }
              >
                {file !== null ? (
                  <span>
                    {capitalizeFirstLetter(
                      shortenFileNameWithEnd(file.name, 15, 0.65, "...")
                    )}
                    , {formatBytes(file.size)}.
                  </span>
                ) : (
                  <>
                   {uploadProgress > 0?
                     <span>Compressing <span className="themefy">{uploadProgress} %</span></span>
                    :
                     <>
                     <BiImageAdd className="add_image_icon" /> Select Any Image
                     </>
                    }
                  </>
                )}
              </UploaderBtnBackground>
            </div>
          </BlueCharcoal>

          <div className="accept_ignore--instructions">
            <div className="accept_ignore--icon">
              <BsInfoCircle className="accept_ignore--iconItem" />
            </div>
            <ManeteeSpan as="div" className="accept_ignore--text">
              You can upload the maximum of one image (png, jpg, and webp) at a
              time. We have a fancy algorithm to help compress{compressionRate > 0 && <span> (<span className="themefy"> +{compressionRate}% saved! </span>)</span>} any image uploaded.
            </ManeteeSpan>
          </div>

          <BorderStyle className="accept_ignore--hr" />

          <div className="accept_ignore--btn lift_accept_ignore upload--comp">
            <div
              className={
                !!file
                  ? "accept_ignore--btn2 remove_accept_ignore--btn2 up_opacity_upload_btn"
                  : "accept_ignore--btn2 remove_accept_ignore--btn2"
              }
              onClick={() => sendFile()}
            >
              Upload
            </div>
          </div>
        </UploaderBackground>
      </div>
    </>
  );
};

class UploadMedia extends Component {
  render() {
    const {
      closeModal,
      uploadFile,
      currentChannel,
      channelClearNoti,
    } = this.props;
    return (
      <>
        <UploadMediaFunc
          closeModal={closeModal}
          uploadFile={uploadFile}
          currentChannel={currentChannel}
          channelClearNoti={channelClearNoti}
        />
      </>
    );
  }
}

export default UploadMedia;
