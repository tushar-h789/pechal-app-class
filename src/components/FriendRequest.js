import React, { useEffect, useState } from "react";
import Images from "./Images";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue, remove, set, push } from "firebase/database";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FriendRequest = () => {
  const db = getDatabase();

  let [freq, setFreq] = useState([]);

  let data = useSelector((state) => state);
  console.log(data.userdata.userInfo.uid);

  useEffect(() => {
    const starCountRef = ref(db, "friendrequest");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().receverid == data.userdata.userInfo.uid) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setFreq(arr);
    });
  }, []);

  let handleDeleteRriendRequest = (friendRequest) => {
    console.log(friendRequest);
    remove(ref(db, "friendrequest/" + friendRequest.id)).then(() => {
      toast("Calcle Friend Request");
    });
  };

  let handleAcceptFriendRequest = (friendRequest) => {
    set(push(ref(db, "friends")), {
      ...friendRequest,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    }).then(()=>{
      remove(ref(db, "friendrequest/" + friendRequest.id)).then(() => {
        toast("Calcle Friend Request");
      });
    })
  };

  return (
    <div className="groupholder">
      <div className="titleHolder">
        <h3>Friend Request</h3>
        <BsThreeDotsVertical />
      </div>
      <div className="boxHolder">
        {freq.length > 0 ? (
          freq.map((item) => (
            <div className="box">
              <div className="">
                <Images imgsrc="assets/profile.png" />
              </div>

              <div className="title">
                <h3>{item.sendername}</h3>
                <p>Hi Guys, Wassup!</p>
              </div>
              <div>
                <button
                  onClick={() => handleAcceptFriendRequest(item)}
                  className="boxbtn"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDeleteRriendRequest(item)}
                  className="boxbtn"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <Alert className="alert" variant="filled" severity="info">
            No Friend Request
          </Alert>
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
