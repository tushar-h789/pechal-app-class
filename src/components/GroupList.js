import React, { useState, useEffect } from "react";
import Images from "./Images";
import { TextField, Box, Button, Typography, Modal } from "@mui/material/";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";

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

const GroupList = () => {
  let [gname, setGname] = useState("");
  let [gtag, setGtag] = useState("");
  let [glist, setGlist] = useState([]);
  let [loader, setLoader] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const db = getDatabase();

  let data = useSelector((state) => state);
  console.log(data.userdata.userInfo.uid);

  //Created button a click korle je click korche tar id, displayName, gname er moddhe jei input deoa hoiche sei input er value, abar group tag input er moddhe jei input deoa hoiche sei input er value. click korar sathe sathe aegulo sob database a cole jabe. tarpor popup ta false hoye jabe. group create kora hoye geche. akhon aegulo group er nam MyGroup option a dekhanor jonno MyGroup component er moddhe jeye database theke data gulo nite hobe.
  let handleCreateGroup = () => {
    setLoader(true);
    set(push(ref(db, "groups")), {
      groupname: gname,
      grouptag: gtag,
      adminid: data.userdata.userInfo.uid,
      adminname: data.userdata.userInfo.displayName,
    }).then(() => {
      setLoader(false);
      setOpen(false);
      toast("Create a Group");
    });
  };

  useEffect(() => {
    const starCountRef = ref(db, "groups");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userdata.userInfo.uid !== item.val().adminid) {
          arr.push({ ...item.val(), gid: item.key });
        }
      });
      setGlist(arr);
    });
  }, []);

  let handleGroupJoin = (item) => {
    setLoader(true);
    set(push(ref(db, "grouprequest")), {
      groupid: item.gid,
      groupname: item.groupname,
      userid: data.userdata.userInfo.uid,
      username: data.userdata.userInfo.displayName,
    }).then(() => {
      setLoader(false);
      toast("Sent group Request");
    });
  };

  return (
    <>
      {/* <ToastContainer
        position="top-bottom"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="red"
      /> */}

      <div className="groupholder">
        <div className="titleHolder">
          <h3>Group List</h3>

          {loader ? (
            <Oval
              height={30}
              width={30}
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          ) : (
            <button onClick={handleOpen}>Create Group</button>
          )}
        </div>
        <div className="boxHolder">
          {glist.map((item) => (
            <div className="box">
              <div className="">
                <Images imgsrc="assets/profile.png" />
              </div>

              <div className="title">
                <p>{item.adminname}</p>
                <h3>{item.groupname}</h3>
                <p>{item.grouptag}</p>
              </div>
              <div>
                {loader ? (
                  <Oval
                    height={30}
                    width={30}
                    color="#4fa94d"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                ) : (
                  <button
                    onClick={() => handleGroupJoin(item)}
                    className="boxbtn"
                  >
                    Join Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create Group
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {/* input er moddhe jegulo value deoa hobe segulo value dhorar jonno onChange ta deoa hoiche 2ta input er moddhei. */}
                <TextField
                  onChange={(e) => setGname(e.target.value)}
                  style={{ marginBottom: "15px" }}
                  id="outlined-basic"
                  label="Group Name"
                  variant="outlined"
                />
                <TextField
                  onChange={(e) => setGtag(e.target.value)}
                  style={{ marginBottom: "15px" }}
                  id="outlined-basic"
                  label="Group Tag"
                  variant="outlined"
                />
              </Typography>

              {loader ? (
                <Oval
                  height={30}
                  width={30}
                  color="#4fa94d"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#4fa94d"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              ) : (
                <Button onClick={handleCreateGroup} variant="contained">
                  Created
                </Button>
              )}
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default GroupList;
