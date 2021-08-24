import React, { useEffect, useRef } from "react";

const ChannelModalDesktop = ({
    isCLModal,
    isDesktop,
    CLModalReverse,
    error,
    loading,
    submit,
    removeError,
    handleChange,
    channelName,
    channelDetails,
    generateCSP,
}) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (isDesktop) {
            document.body.classList.add("modal-cl-open");
        } else {
            document.body.classList.remove("modal-cl-open");
        }
        return () => {
            document.body.classList.remove("modal-cl-open");
        };
    }, [isDesktop]);

    useEffect(() => {
        const modal = modalRef.current;
        const handleWindowClick = (event) => {
            if (modal) {
                if (modal.contains(event.target)) {
                    return;
                } else {
                    if (
                        event.target.className === "modal-cl fade show" ||
                        event.target.className ===
                            "modal-cl-dialog modal-cl-dialog-centered modal-cl-dialog-zoom"
                    ) {
                        CLModalReverse();
                    } else {
                        return;
                    }
                }
            }
        };

        if (isCLModal) {
            window.addEventListener("click", handleWindowClick);
        } else {
            window.removeEventListener("click", handleWindowClick);
        }
        return () => {
            window.removeEventListener("click", handleWindowClick);
        };
    }, [isCLModal, CLModalReverse]);

    const submitForm = (event) => {
        submit(event);
    };


    return isDesktop && (
        <>
            <div
                className="modal-cl fade show"
                id="addFriends"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="modal-cl-dialog modal-cl-dialog-centered modal-cl-dialog-zoom"
                    role="document"
                    id="addChannelModal"
                >
                    <div className="modal-cl-content" ref={modalRef}>
                        <div className="modal-cl-header">
                            <h5 className="modal-cl-title">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-users mr-2"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                New Channel
                            </h5>
                            <button
                                type="button"
                                className="close"
                                datadismiss="modal-cl"
                                aria-label="Close"
                                onClick={() => CLModalReverse()}
                            >
                                <svg
                                    stroke="currentColor"
                                    className="ti-close"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 512 512"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="32"
                                        d="M368 368L144 144m224 0L144 368"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-cl-body">
                            {!error ? (
                                <div className="alert alert-info">
                                    Create a new Channel to explore.
                                </div>
                            ) : (
                                <div
                                    className="alert alert-error"
                                    id={error && "alert-error"}
                                >
                                    Warning: {error}
                                </div>
                            )}
                            <form onSubmit={submitForm}>
                                <div className="form-group">
                                    <label
                                        htmlFor="name"
                                        className="col-form-label"
                                    >
                                        Channel name
                                    </label>
                                    <input
                                        className="form-control"
                                        id="name"
                                        type="text"
                                        name="channelName"
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                        onFocus={removeError}
                                        style={{
                                            fontSize: "0.9rem",
                                            color: "grey",
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="channelDetails"
                                        className="col-form-label"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        name="channelDetails"
                                        type="text"
                                        onChange={handleChange}
                                        maxLength="400"
                                        required
                                        style={{
                                            fontSize: "0.9rem",
                                            color: "grey",
                                        }}
                                        onFocus={removeError}
                                    />
                                </div>
                                <div className="modal-cl-footer">
                                    {!loading ? (
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Create Channel
                                        </button>
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
            </div>
            <div
                className="modal-backdrop"
                onClick={() => CLModalReverse()}
            ></div>
        </>
    );
};

export default ChannelModalDesktop;
