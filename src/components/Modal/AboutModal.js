import React, { Component } from "react";



class AboutModal extends Component {
  componentDidMount() {
    const { trackCursorPosition, setDefaultStringIndex, setBottomNavInactive } = this.props
    trackCursorPosition();
    setDefaultStringIndex();
    if(this.props.isDesktop === false) {
      setBottomNavInactive();
    }  
  }

  componentWillUnmount() {
    const { setBottomNavActive } = this.props 
   if(this.props.isDesktop === false) {
      setBottomNavActive();
   }
  }



  render() {

    const {
      aboutModalDeactivator,
      handleFocus, 
      aboutTyped, 
      handleChange, 
      isTyping, 
      remainingLetter, 
      handleTogglePicker,
      handleSave,
      error  } = this.props;

    return (
      <>
      <div
        className="add-about--darkLayer"
        onClick={aboutModalDeactivator}
      ></div>

      <div className="add-about">
        <div>
          <div className="add-about--title">Add About</div>
          <div className="add-about--form">
            <form action="">
              <div className="add-about-container">
                <div className="about-text-count">
                  <input
                    type="text"
                    name="about"
                    autoFocus
                    onFocus={handleFocus}
                    value={aboutTyped}
                    onChange={handleChange}
                    className="about-input"
                    maxLength="250"
                    required
                    // placeholder="write a custom about me..."
                    ref={this.props.forwardRef}
                  />
                  <span className="add-about--counter">
                    {isTyping && remainingLetter}
                  </span>
                  {error && 
                  <span className="about_error">
                    {error}
                  </span>
                  }
                </div>
                <div className="add-about--emoji">
                 <button className="emoji--button" onClick={handleTogglePicker}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10"></path><path d="M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0"></path></svg>
                 </button>
                </div>
              </div>

              <div className="add-about--btns">
                <button onClick={aboutModalDeactivator}>
                  Cancel
                </button>
                <button onClick={handleSave}>Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default React.forwardRef((props, ref) => <AboutModal {...props} forwardRef={ref} />)
// export default AboutModal;
