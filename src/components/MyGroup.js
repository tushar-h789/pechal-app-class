import Images from "./Images";
import { BsThreeDotsVertical } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  Modal,
  Alert,
} from "@mui/material/";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
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

const MyGroup = () => {
  let data = useSelector((state) => state);
  console.log(data.userdata.userInfo.uid);
  const handleClose = () => setOpen(false);
  const db = getDatabase();

  let [glist, setGlist] = useState([]);
  let [grlist, setGrlist] = useState([]);
  let [loader, setLoader] = useState(false);

  const [open, setOpen] = React.useState(false);

  // MR button a click korar pore modal er moddhe member request ke show korar jonno "onValue" diye "grouprequest" er moddhe theke data gulo niye aste hobe. condition hisebe deoa hocche (item.val().groupid === id)== ekhane groupid ta paoa jacche jei member ta jei group er join request button a click korbe jei group er id ta. r id ta paoa jacche handleOpen er moddhe theke. ae 2tar id jodi soman hoi tahole arr te push korbe.
  const handleOpen = (id) => {
    console.log(id);
    setOpen(true);
    const starCountRef = ref(db, "grouprequest");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        //request je dibe se ae group er member ki na seyta check korar jonno ae condition ta dite hobe.
        if (item.val().groupid === id) {
          // member request delete korar jonno ekane group er id/key dhora hoiche did:item.key diye
          arr.push({ ...item.val(), did: item.key });
        }
      });
      setGrlist(arr);
    });
  };

  //group list theke jegulo data database a pathano hobe segulo data ekhane onValue diye dhore nite hobe.  ...item.val() == ekhane user er sobgulo data niye asbe. (gid:item.key) == aeta diye bojhano hoiche je jei group ta create hoiche sei group er jonno akta id create hoiche. sei id ta ke dhorar jonno item.key ta dhora hoiche. condition hisebe deoa hoiche (data.userdata.userInfo.uid === item.val().adminid) == jei user ta login obosthai ache sei user er sathe jodi admin id ta mile jei tahole bujhte hobe ae group ta je login ache tar.
  useEffect(() => {
    const starCountRef = ref(db, "groups");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userdata.userInfo.uid === item.val().adminid) {
          // group er id/key ta neoar jonno ekhane gid:item.key diye id/key ta dhora hoiche.
          arr.push({ ...item.val(), gid: item.key });
        }
      });
      setGlist(arr);
    });
  }, []);

  let handleGroupMR = (id) => {
    setLoader(true);
    remove(ref(db, "grouprequest/" + id)).then(() => {
      setTimeout(() => {
        setLoader(false);
        toast("Delete Member Request");
      }, 1000);
    });
  };

  return (
    <div className="groupholder">
      <div className="titleHolder">
        <h3>My Group</h3>
        <BsThreeDotsVertical />
      </div>
      <div className="boxHolder">
        {/* glist.length > 0 === mane bujhano hoiche je useState er moddhe jodi kono group na thake tahole Alart er moddhe "No Group" likha ta show korbe */}
        {glist.length > 0 ? (
          // group create hoar pore useState er moddhe theke glist ta ke map kora hoiche. aeta map korar karon ta holo ekhane jotogulo group create hobe segulo sob create hoar sathe sathe ekhane show korbe. map amn e kaj kore.
          glist.map((item) => (
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
                {/* jei group er button a click kortechi sei group er id ta nite hole item.gid ta dhorte hobe. mane [gid:item.key] == aeta groups er moddhe jei id/key er under a group ta create hoiche sei group er id/key ta dhore hoiche ""gid"" diye. ekhane onClick er maddhume click er sathe sathe jei group a click kortechi sei group er id ta pass hoye jacche. ebar opure jeye oi id ta dhorte hobe */}

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
                  <button className="boxbtn">info</button>
                )}

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
                    onClick={() => handleOpen(item.gid)}
                    className="boxbtn"
                  >
                    MR
                  </button>
                )}
                {/* <button className="boxbtn">D</button> */}
              </div>
            </div>
          ))
        ) : (
          <Alert className="alert" variant="filled" severity="info">
            No Group
          </Alert>
        )}
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
              Member Request
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {grlist.length > 0 ? (
                  grlist.map((item) => (
                    <>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            alt="Remy Sharp"
                            src="/static/images/avatar/1.jpg"
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.username}
                          secondary={
                            <React.Fragment>
                              {" — wants to join your group"}
                            </React.Fragment>
                          }
                        />

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
                          <Button
                            onClick={() => handleGroupMR(item.did)}
                            variant="outlined"
                            color="error"
                          >
                            Delete
                          </Button>
                        )}
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </>
                  ))
                ) : (
                  <Alert variant="filled" severity="info">
                    No Member Request
                  </Alert>
                )}
              </List>
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default MyGroup;
