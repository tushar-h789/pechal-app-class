import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Images from "./Images";
import { AiFillHome, AiOutlineMessage, AiFillSetting } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { activeUser } from "../slice/userSlice";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Button from "@mui/material/Button";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

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

const RootLayout = ({ buttonName }) => {
  const auth = getAuth();
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let data = useSelector((state) => state);

  // image crope start

  const [image, setImage] = useState();
  const [profile, setProfile] = useState("");
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `profilePic/${data.userdata.userInfo.uid}`
      );
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        setOpen(false);
        setImage("");
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);

          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            console.log("Image Uploaded");
            dispatch(activeUser(auth.currentUser));
            localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));
          });
        });
      });
    }
  };

  useEffect(() => {
    setProfile(data.userdata.userInfo.photoURL);
  }, [data]);

  // image crope end

  useEffect(() => {
    if (!data.userdata.userInfo) {
      navigate("/login");
    }
  }, []);

  let handelLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("userInfo");
      dispatch(activeUser(null));
      navigate("/login");
    });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <div className="sidebarbox">
            <div className="sidebar">
              <div className="imgholder">
                <img
                  onClick={handleOpen}
                  className="profile_pic"
                  src={profile}
                />
              </div>

              <h5>{data.userdata.userInfo.displayName}</h5>

              <div className="iconholder">
                <AiFillHome className="icon" />
                <AiOutlineMessage className="icon" />
                <IoMdNotificationsOutline className="icon" />
                <AiFillSetting className="icon" />
                <BiLogOut
                  cursor="pointer"
                  onClick={handelLogout}
                  className="icon"
                />
              </div>
            </div>
          </div>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Image Upload
                <div className="imgholder">
                  {image ? (
                    <div className="img-preview"></div>
                  ) : data.userdata.userInfo.photoURL ? (
                    <img
                      className="profile_pic"
                      src={data.userdata.userInfo.photoURL}
                    />
                  ) : (
                    <img imgsrc="assets/profile.png" />
                  )}
                </div>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <input onChange={onChange} type="file" />

                {image && (
                  <>
                    <Cropper
                      style={{ height: 400, width: "100%" }}
                      zoomTo={0.5}
                      initialAspectRatio={1}
                      preview=".img-preview"
                      src={image}
                      viewMode={1}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                      guides={true}
                    />

                    <Button onClick={getCropData} variant="contained">
                      Upload
                    </Button>
                  </>
                )}
              </Typography>
            </Box>
          </Modal>
        </Grid>
        <Outlet />
      </Grid>
    </>
  );
};

export default RootLayout;
