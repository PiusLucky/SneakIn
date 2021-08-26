import React, { Component, useRef } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Firebase from "../../firebase";
import { REGISTER } from "../../constants/routes";
import "../../static/css/style.css";
import "../../static/css/responsive.css";
import logo from "../../static/img/logo_no_gradient.svg";
import sneakin_auth from "../../static/img/auth_svg.svg";
import sneakin_auth_dark from "../../static/img/auth_svg_dark.svg";
import {fadeIn, fadeOut} from "../Utility/animate"
import { useIntersection } from "react-use";
import GoogleAuth from "./GoogleAuth"
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


const LoginAnimate = ({
  errors,
  displayErrors,
  email,
  password,
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
                Signin to <span className="Sneak_part">Sneak</span>In,
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
                <ManeteeSpan as="label" className="col-form-label">Email Address</ManeteeSpan>
                <input
                  className="form-control"
                  id="inputEmail3"
                  type="email"
                  placeholder="vikings@gmail.com"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  data-test="email"
                />
              </div>
              <div className="form-group fgpasswd">
                <ManeteeSpan as="label" className="col-form-label">Password</ManeteeSpan>
                <span> </span>
                <input
                  className="form-control"
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={handleChange}
                  type="password"
                  required
                  data-test="password"
                />
              </div>
              <div className="form-group rememberme">
                <div className="rememberchk">
                  <div className="form-check final">   
                     <Link to={REGISTER} className="fgpaswd_text">
                       <ManeteeSpan as="span">No account?</ManeteeSpan>
                     </Link>
                  </div>
                </div>
              </div>

              <div className="button_div">
                {!loading ? (
                  <button className="btn-primary" type="submit">
                    <span className="buttons">Login</span>
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

              <ManeteeSpan as="div" className="non-acct">Don't have an account yet?</ManeteeSpan>

              <div className="button_div">
                <Link to={REGISTER}>
                  <span className="buttons">Signup</span>
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

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: [],
      loading: false,
      theme: "dark",
      isPreloading: true,
    };
  }
  
  componentDidMount() {
    window.scrollTo({ top: 0 });
    document.body.classList.remove('fix_body');
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

  
  isFormValid = ({ email, password }) => email && password;

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });

      Firebase.auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signedInUser) => {
          this.setState({ loading: false });
          this.props.history.push(ROUTES.HOME);  
        })
        .catch((err) => {
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          });
        });
    }
  };

  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  render() {
    const { email, password, errors, loading, isPreloading } = this.state;
    if(isPreloading) {
      return <Preloader />;
    }

    return (
      <>
        <ThemeProvider
          theme={this.themeMode()}
          themeToggler={this.themeToggler}
        >
        <LoginAnimate
          errors={errors}
          displayErrors={this.displayErrors}
          email={email}
          password={password}
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


const LoginFunc = ({theme_type}) => {
  let history = useHistory();
  const isDesktop = useMediaQuery({
    query: "(min-width: 1201px)",
  });
  return <Login isDesktop={isDesktop} setCurrentTheme={setCurrentTheme} history={history} />
}


export default connect(null, { setCurrentTheme })(LoginFunc);
