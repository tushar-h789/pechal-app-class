import React from "react";
import Images from "./Images";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FriendRequest from "./FriendRequest";

const UserList = () => {
  const db = getDatabase();
  let [userlist, setUserlist] = useState([]);
  let [freq, setFreq] = useState([]);
  let [friends, setFiends] = useState([]);
  let [block, setBlock] = useState([]);
  let [cancle, setCancle] = useState([]);

  let data = useSelector((state) => state);
  console.log(data.userdata.userInfo.uid);

  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userdata.userInfo.uid != item.key) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setUserlist(arr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "friendrequest");
    onValue(userRef, (snapshot) => {
      let arr = [];
      let arrTwo = [];
      snapshot.forEach((item) => {
        console.log(item);
        arr.push(item.val().receverid + item.val().senderid);
        arrTwo.push({...item.val(), id:item.key});
      });
      setFreq(arr);
      setCancle(arrTwo)
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "friends");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        console.log(item);
        arr.push(item.val().receverid + item.val().senderid);
      });
      setFiends(arr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "block");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        console.log(item);
        arr.push(item.val().receverid + item.val().senderid);
      });
      setBlock(arr);
    });
  }, []);

  let handleFriendRequest = (info) => {
    console.log(info);
    set(push(ref(db, "friendrequest")), {
      sendername: data.userdata.userInfo.displayName,
      senderid: data.userdata.userInfo.uid,
      recevername: info.displayName,
      receverid: info.id,
    });
  };

  let handleDelete = (item) => {
    console.log(item);
    remove(ref(db, "friendrequest/" + item.id)).then(() => {
      console.log("Calcle Friend Request");
    });
  };

  return (
    <div className="groupholder">
      <div className="titleHolder">
        <h3>User List</h3>
        <BsThreeDotsVertical />
      </div>
      <div className="boxHolder">
        {userlist.map((item) => (
          <div className="box">
            <div className="">
              <Images imgsrc="assets/profile.png" />
            </div>

            <div className="title">
              <h3>{item.displayName}</h3>
              <p>{item.email}</p>
            </div>
            <div>
              {friends.includes(item.id + data.userdata.userInfo.uid) ||
              friends.includes(data.userdata.userInfo.uid + item.id) ? (
                <button className="boxbtn">Friend</button>
              ) : freq.includes(item.id + data.userdata.userInfo.uid) ||
                freq.includes(data.userdata.userInfo.uid + item.id) ? (
                <div className="flex_button">
                  <button className="boxbtn">Panding</button>
                  <button onClick={() => handleDelete(item)} className="boxbtn">
                    Cancle
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleFriendRequest(item)}
                  className="boxbtn"
                >
                  Sent Request
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
