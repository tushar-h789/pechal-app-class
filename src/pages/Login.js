import React, { useState } from "react";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Grid from "@mui/material/Grid";
import Images from "../components/Images";
import InputBox from "../components/InputBox";
import PButton from "../components/PButton";
import { styled } from "@mui/material/styles";
import { ButtonProps } from "@mui/material/Button";
import AuthenticationLink from "../components/AuthenticationLink";
import Alert from "@mui/material/Alert";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dna } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { activeUser } from "../slice/userSlice";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const commonButton = styled(Button)({
  width: "100%",
  boxShadow: "none",
  textTransform: "none",
  fontSize: "20.64px",
  padding: "19px 12px",
  backgroundColor: "#5F35F5",
  marginTop: "56px",
  fontFamily: ["Nunito", "sans-serif"],
  "&:hover": {
    backgroundColor: "#000",
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Login = () => {
  let auth = getAuth();
  let navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  let dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let [formData, setFormData] = useState({
    email: "",
    password: "",
    fgp: "",
  });

  let [loader, setLoader] = useState(false);

  let [error, setError] = useState({
    email: "",
    password: "",
  });

  let handleForm = (e) => {
    let { name, value } = e.target;

    if (name === "password") {
      let capi = /[A-Z]/;
      let lower = /[a-z]/;
      let num = /[0-9]/;
      if (!capi.test(value)) {
        setError({ ...error, password: "One Capital Letter Rewuired" });
        return;
      }
      if (!lower.test(value)) {
        setError({ ...error, password: "One Small Letter Rewuired" });
        return;
      }
      if (!num.test(value)) {
        setError({ ...error, password: "One Number Rewuired" });
        return;
      }
      if (value.length < 6) {
        setError({ ...error, password: "Password length atlest 6" });
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: "" });
  };

  let handleClick = () => {
    let expression =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (formData.email === "") {
      setLoader(false);
      setError({ ...error, email: "Email Required" });
    } else if (!expression.test(formData.email)) {
      setLoader(false);
      setError({ ...error, email: "Valid Email Required" });
    } else if (formData.fullname === "") {
      setLoader(false);
      setError({ ...error, fullname: "Fullname Required" });
    } else if (formData.password === "") {
      setLoader(false);
      setError({ ...error, password: "Password Required" });
    } else {
      setLoader(true);
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          dispatch(activeUser(userCredential.user));
          localStorage.setItem("userInfo", JSON.stringify(userCredential.user));
          navigate("/pachel");
        //   if (userCredential.user.emailVerified) {
        //     toast("Login Successful");
        //     setTimeout(() => {
        //       navigate("/pachel");
        //     }, 2000);
        //   } else {
        //     toast("Please Verify your email first and try again");
        //   }
        //   setLoader(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
  };

  let handleFgp = () => {
    // setLoader(true);
    // let expression =
    //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //   if (formData.email === "") {
    //     setError({ ...error, email: "Email Required" });
    //   } else if (!expression.test(formData.email)) {
    //     setError({ ...error, email: "Valid Email Required" });
    //   }
    sendPasswordResetEmail(auth, formData.fgp).then(() => {
      console.log("mail geche");

      // setLoader(false);
      //       setTimeout(() => {
      //         toast("Login Successful");
      //       }, 2000);
    });
  };

  let [show, setShow] = useState(false);

  let handleGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      console.log("google done");
    });
  };

  return (
    <>
      <Grid container spacing={2}>
        <ToastContainer
          position="top-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Grid item xs={6}>
          <div className="regrightside">
            <div>
              <Header>
                <Heading
                  title="Login to your account!"
                  className="heading"
                  as="h2"
                />
              </Header>
              <div onClick={handleGoogle} className="googlelogin">
                <Images imgsrc="assets/googlelogin.png" />
              </div>
              <div className="inputboxcontainer">
                <InputBox
                  className="reginput"
                  label="Email Address"
                  variant="standard"
                  textChange={handleForm}
                  type="email"
                  name="email"
                />

                {error.email && (
                  <Alert className="error" variant="filled" severity="error">
                    {error.email}
                  </Alert>
                )}
                <div style={{ width: "100%", position: "relative" }}>
                  <InputBox
                    className="reginput"
                    label="Password"
                    variant="standard"
                    textChange={handleForm}
                    type={show ? "text" : "password"}
                    name="password"
                  />
                  {show ? (
                    <AiFillEye
                      onClick={() => setShow(false)}
                      className="eyeicon"
                    />
                  ) : (
                    <AiFillEyeInvisible
                      onClick={() => setShow(true)}
                      className="eyeicon"
                    />
                  )}
                </div>
              </div>

              {error.password && (
                <Alert className="error" variant="filled" severity="error">
                  {error.password}
                </Alert>
              )}

              {loader ? (
                <Dna
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                />
              ) : (
                <PButton
                  click={handleClick}
                  bname={commonButton}
                  title="Login to Continue"
                />
              )}

              <AuthenticationLink
                className="reglink"
                title="Don’t have an account ?"
                href="/"
                hreftitle="Sign Up"
              />

              <Button onClick={handleOpen}>Forgotten password</Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <Images className="regimg" imgsrc="assets/regimgTwo.png" />
        </Grid>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Forgot Password
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <InputBox
                className="reginput"
                label="Email Address"
                variant="standard"
                textChange={handleForm}
                type="email"
                name="fgp"
              />
              <PButton
                click={handleFgp}
                bname={commonButton}
                title="Email Sent"
              />
            </Typography>
          </Box>
        </Modal>
      </Grid>
    </>
  );
};

export default Login;
