import React, { useState } from "react";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Grid from "@mui/material/Grid";
import Images from "../components/Images";
import InputBox from "../components/InputBox";
import PButton from "../components/PButton";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AuthenticationLink from "../components/AuthenticationLink";
import Alert from "@mui/material/Alert";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dna } from "react-loader-spinner";
import { getDatabase, ref, set } from "firebase/database";

const commonButton = styled(Button)({
  width: "100%",
  boxShadow: "none",
  textTransform: "none",
  fontSize: "20.64px",
  padding: "19px 12px",
  backgroundColor: "#5F35F5",
  borderRadius: "86px",
  marginTop: "56px",
  fontFamily: ["Nunito", "sans-serif"],
  "&:hover": {
    backgroundColor: "#000",
  },
});

const Regristration = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  const db = getDatabase();

  let [formData, setFormData] = useState({
    email: "",
    fullname: "",
    password: "",
  });

  let [loader, setLoader] = useState(false);

  let [error, setError] = useState({
    email: "",
    fullname: "",
    password: "",
  });

  let handleForm = (e) => {
    let { name, value } = e.target;

    if (name === "password") {
      let capi = /[A-Z]/;
      let lower = /[a-z]/;
      let num = /[0-9]/;
      if (!capi.test(value)) {
        setError({ ...error, password: "One Capital Letter Required" });
        return;
      }
      if (!lower.test(value)) {
        setError({ ...error, password: "One Small Letter Required" });
        return;
      }
      if (!num.test(value)) {
        setError({ ...error, password: "One Number Required" });
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

  let handelClick = () => {
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
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((user) => {
          console.log(user);
          sendEmailVerification(auth.currentUser)
            .then(() => {
              updateProfile(auth.currentUser, {
                displayName: formData.fullname,
              }).then(() => {
                set(ref(db, "users/" + user.user.uid), {
                  displayName: user.user.displayName,
                  email: user.user.email,
                }).then(() => {
                  setLoader(false);
                  toast("Regrestration Successful. Please Check Your Email");
                  setTimeout(() => {
                    navigate("/login");
                  }, 2000);
                });
              });
            })
            .catch((error) => {
              // An error occurred
              // ...
            });
        })

        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode.includes("auth/email-already-in-use")) {
            setError({ ...error, email: "Email Already Exists" });
            setLoader(false);
          }
        });
    }
  };

  let [show, setShow] = useState(false);

  return (
    <>
      {/* this is email validation */}
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
          <div className="regleftside">
            <div>
              <Header>
                <Heading
                  title="Get started with easily register"
                  className="heading"
                  as="h2"
                />
              </Header>
              <p className="regsubheading">
                Free register and you can enjoy it
              </p>
              <div className="inputboxcontainer">
                <InputBox
                  className="reginput"
                  label="Email Address"
                  variant="outlined"
                  textChange={handleForm}
                  type="email"
                  name="email"
                />

                {error.email && (
                  <Alert className="error" variant="filled" severity="error">
                    {error.email}
                  </Alert>
                )}

                <InputBox
                  className="reginput"
                  label="Ful name"
                  variant="outlined"
                  textChange={handleForm}
                  type="text"
                  name="fullname"
                />

                {error.fullname && (
                  <Alert className="error" variant="filled" severity="error">
                    {error.fullname}
                  </Alert>
                )}

                <div style={{ width: "100%", position: "relative" }}>
                  <InputBox
                    className="reginput"
                    label="Password"
                    variant="outlined"
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
                    click={handelClick}
                    bname={commonButton}
                    title="Sign up"
                  />
                )}

                <AuthenticationLink
                  className="reglink"
                  title="Already  have an account ?"
                  href="/login"
                  hreftitle="Sign In"
                />
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <Images className="regimg" imgsrc="assets/regimg.png" />
        </Grid>
      </Grid>
    </>
  );
};

export default Regristration;
