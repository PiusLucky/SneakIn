import React, { Component } from "react";
import top_modal from "../../static/img/topModal.svg";
import { MdError } from "react-icons/md";

class ChannelModal extends Component {
    componentDidMount() {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.body.classList.add("disable-scroll");
    }

    componentWillUnmount() {
        document.body.classList.remove("disable-scroll");
    }

    render() {
        const { loading, closeModal, submit, handleChange, error } = this.props;
        return (
            <>
                <div className="modal channelModal21">
                    <div className="modal_arrow">
                        <span className="close-modal" onClick={closeModal}>
                            close
                        </span>
                    </div>
                    <div className="svg_part">
                        <img src={top_modal} alt="" className="svgItem" />
                    </div>
                    <div className="white_part">
                        <div className="white_part--form">
                            <span className="white_part--title">
                                Create Channel Anytime.
                            </span>

                            <form className="form1" onSubmit={submit}>
                                {error ? (
                                    <div className="channel_error">
                                        <div>
                                            <MdError className="channel_error--icon" />
                                        </div>
                                        <div className="channel_error--text">
                                            {" "}
                                            {error}{" "}
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="form-group">
                                    <label className="col-form-label channel-label">
                                        Channel Name
                                    </label>
                                    <input
                                        className="form-control channel-form-name"
                                        type="text"
                                        name="channelName"
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group fgpasswd">
                                    <label className="col-form-label channeldescr-label">
                                        Channel Description
                                    </label>
                                    <span> </span>
                                    <textarea
                                        className="form-control channel-form-descr"
                                        name="channelDetails"
                                        type="text"
                                        onChange={handleChange}
                                        cols="40"
                                        rows="10"
                                        maxLength="400"
                                        required
                                    />
                                </div>

                                <div className="button_div">
                                    {!loading ? (
                                        <div>
                                            <span
                                                className="white_part--closebtn"
                                                onClick={closeModal}
                                            >
                                                No thanks
                                            </span>
                                            <button
                                                type="submit"
                                                className="btn-primary remove_outline"
                                            >
                                                <span className="buttons channel-submit">
                                                    Create channel
                                                </span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="spinner">
                                            <div className="bounce1"></div>
                                            <div className="bounce2"></div>
                                            <div className="bounce3"></div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ChannelModal;
