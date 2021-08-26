import React, { Component, useRef } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { LOGIN } from "../../constants/routes";
import Firebase from "../../firebase";
import "../../static/css/style.css";
import "../../static/css/responsive.css";
import logo from "../../static/img/logo_no_gradient.svg";
import sneakin_auth from "../../static/img/auth_svg.svg";
import sneakin_auth_dark from "../../static/img/auth_svg_dark.svg";
import { fadeIn, fadeOut } from "../Utility/animate";
import { useIntersection } from "react-use";
import GoogleAuth from "./GoogleAuth";
import * as ROUTES from '../../constants/routes';
import { MdFingerprint } from "react-icons/md";
import BlackRock from "../Themefy/BlackRock";
import BlueCharcoal from "../Themefy/BlueCharcoal";
import lightTheme from "../../themes/light";
import darkTheme from "../../themes/dark";
import { setCurrentTheme } from "../../actions";
import { ThemeProvider } from "styled-components";
import { useMediaQuery } from "react-responsive";
import { ManeteeSpan } from "../Themefy/ManateeColor"
import { GoogleAuthColor } from "../Themefy/CustomTheme";
import Moon from "../Moon";
import Preloader from "../Preloader";
import { Footer } from "../Themefy/CustomTheme";


const RegisterAnimate = ({
  errors,
  displayErrors,
  username,
  email,
  password,
  passwordConfirmation,
  handleSubmit,
  handleChange,
  loading,
  themeToggler,
  theme
}) => {
  var sneakinAuthRef = useRef(null);
  const intersection = useIntersection(sneakinAuthRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  if (!!sneakinAuthRef && !!intersection) {
    intersection && intersection.intersectionRatio < 0.5
      ? fadeIn(".fadeIn")
      : fadeOut(".fadeIn");
  }



  return (
    <>
    <span className="top_liner"></span>
      <BlueCharcoal className="auth_wrapper new_auth_wrapper">
      <Moon themeToggler={themeToggler} />
        <BlackRock leftSider className="leftside">
          <div className="auth_container">
            <div className="auth_logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="top_texter">
              <ManeteeSpan as="p" className="main_text">
                Register to <span className="Sneak_part">Sneak</span>In,
              </ManeteeSpan>
              <ManeteeSpan as="p" className="mini_text">Let's get you hooked up!</ManeteeSpan>
            </div>

            <form onSubmit={handleSubmit}>
              {errors.length > 0 && (
                <div className="error_div">
                  <span className="css_bolder">#Error Alert</span>:&nbsp;&nbsp;
                  {displayErrors(errors)}
                </div>
              )}
              <div className="form-group">
                <ManeteeSpan as="label" className="col-form-label" htmlFor="inputUsername">
                  Username
                </ManeteeSpan>
                <input
                  className="form-control"
                  name="username"
                  type="text"
                  value={username}
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  data-test="username"
                />
              </div>
              <div className="form-group fgpasswd">
                <ManeteeSpan as="label" className="col-form-label" htmlFor="inputEmail3">
                  Email Address
                </ManeteeSpan>
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  placeholder="Email address"
                  name="email"
                  onChange={handleChange}
                  required
                  data-test="email"
                />
              </div>
              <div className="form-group fgpasswd">
                <ManeteeSpan as="label" className="col-form-label" htmlFor="inputPassword3">
                  Password
                </ManeteeSpan>
                <span> </span>
                <input
                  className="form-control"
                  type="password"
                  value={password}
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  required
                  data-test="password"
                />
              </div>
              <div className="form-group fgpasswd">
                <ManeteeSpan as="label" className="col-form-label" htmlFor="inputPassword3">
                  Confirm Password
                </ManeteeSpan>
                <span> </span>
                <input
                  className="form-control"
                  type="password"
                  value={passwordConfirmation}
                  placeholder="Password Confirmation"
                  name="passwordConfirmation"
                  onChange={handleChange}
                  required
                  data-test="cpassword"
                />
              </div>
              <div className="form-group rememberme">
                <div className="rememberchk">
                  <div className="form-check final">
                    <div></div>
                    <Link to={LOGIN} className="fgpaswd_text">
                      <ManeteeSpan>Login Instead? </ManeteeSpan>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="button_div">
                {!loading ? (
                  <button className="btn-primary" type="submit">
                    <span className="buttons">Signup</span>
                  </button>
                ) : (
                  <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div>
                )}
              </div>

              <span className="divider"></span>

              <ManeteeSpan as="div" className="non-acct">Already have an account?</ManeteeSpan>

              <div className="button_div">
                <Link to={LOGIN}>
                  <button className="buttons">Login</button>
                </Link>
              </div>

              <div className="non-acctt">
                OR connect with Google Authentication
              </div>
              <GoogleAuthColor className="position_auth fadeIn">
                <GoogleAuth />
              </GoogleAuthColor>
            </form>
          </div>
        </BlackRock>

        <div className="rightside">
         <img src={theme === "light"?sneakin_auth:sneakin_auth_dark} ref={sneakinAuthRef} alt="illustration" />
        </div>
      </BlueCharcoal>
      <Footer className="bottom_filler">
        <MdFingerprint className="bottom_filler--emojiItem" />
        <span>
          2021
        </span>
      </Footer>
    </>
  );
};

export class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: Firebase.database().ref("users"),
    theme: "dark",
    isPreloading: true,
  };
  
  componentDidMount() {
    document.body.classList.remove('fix_body');
    window.scrollTo({ top: 0 });
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push(ROUTES.HOME);
      }
    })
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      this.setState(
        {
          theme: localTheme,
        },
        () => this.props.setCurrentTheme(localTheme)
      );
      this.props.setCurrentTheme(localTheme);
    }else{
      const defaultTheme = "dark"
      this.setState(
        {
          theme: defaultTheme,
        },
        () => this.props.setCurrentTheme(defaultTheme)
      );
      this.props.setCurrentTheme(defaultTheme);
      localStorage.setItem("theme", defaultTheme);
    }

    setTimeout(() => this.setState({...this.state, isPreloading:false}), 2000);
  }

  setMode = (mode) => {
    localStorage.setItem("theme", mode);
    this.setState(
      {
        theme: mode,
      },
      () => this.props.setCurrentTheme(mode)
    );
    this.props.setCurrentTheme(mode);
  };

  themeToggler = () => {
    const { theme } = this.state;
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      this.setState(
        {
          theme: localTheme,
        },
        () => this.props.setCurrentTheme(localTheme)
      );
      this.props.setCurrentTheme(localTheme);
    } else {
      this.setMode("light");
    }
    theme === "dark" ? this.setMode("light") : this.setMode("dark");
  };

  themeMode = () => {
    return this.props.isDesktop
      ? this.state.theme === "light"
        ? lightTheme
        : darkTheme
      : lightTheme;
  };



  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields!" };
      this.setState({ ...this.state, errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ ...this.state, errors: errors.concat(error) });

      return false;
    } else {
      return true;
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  saveUser = (success_data) => {
    return this.state.usersRef.child(success_data.user.uid).set({
      name: success_data.user.displayName,
      avatar: success_data.user.photoURL,
    });
  };

 
  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);


  handleSubmit = (event) => {
    event.preventDefault();

    if (this.isFormValid()) {
      this.setState({ ...this.state, errors: [], loading: true });
      Firebase.auth()


        .createUserWithEmailAndPassword(this.state.email, this.state.password)

        .then((success_data) => {
          success_data.user
            .updateProfile({
              displayName: this.state.username,
            })

            .then(() => {
              this.saveUser(success_data)
                .then(() => {
                    this.setState({ loading: false });
                 });
            })
            .then(() => {
              this.props.history.push(ROUTES.HOME);
            })
            .catch((error_data) => {
              this.setState({
                ...this.state,
                errors: this.state.errors.concat(error_data),
                loading: false,
              });
            });
        })
        .catch((error_data) => {
          this.setState({
            ...this.state,
            errors: this.state.errors.concat(error_data),
            loading: false,
          });
        });
    }
  };

  componentWillUnmount() {
        this.setState = (state, callback)=>{
            return;
        };

    }

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading,
      isPreloading
    } = this.state;
    if(isPreloading) {
      return <Preloader />;
    }
    return (
      <>
        <ThemeProvider
          theme={this.themeMode()}
          themeToggler={this.themeToggler}
        >
        <RegisterAnimate
          errors={errors}
          displayErrors={this.displayErrors}
          username={username}
          email={email}
          password={password}
          passwordConfirmation={passwordConfirmation}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          loading={loading}
          themeToggler={this.themeToggler}
          theme={this.state.theme}
        />
        </ThemeProvider>
      </>
    );
  }
}

const RegisterFunc = () => {
  let history = useHistory();
  const isDesktop = useMediaQuery({
    query: "(min-width: 1201px)",
  });
  return <Register isDesktop={isDesktop} setCurrentTheme={setCurrentTheme} history={history}/>
}


export default connect(null, { setCurrentTheme })(RegisterFunc);

