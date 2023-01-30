import Images from "./Images";
import { BsThreeDotsVertical } from "react-icons/bs";
import React, { useEffect, useState } from "react";

import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";

const Friends = () => {
  const db = getDatabase();

  let [friends, setFriends] = useState([]);

  let data = useSelector((state) => state);
  console.log(data.userdata.userInfo.uid);

  useEffect(() => {
    const starCountRef = ref(db, "friends");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          data.userdata.userInfo.uid === item.val().receverid ||
          data.userdata.userInfo.uid === item.val().senderid
        ) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setFriends(arr);
    });
  }, []);

  return (
    <div className="groupholder">
      <div className="titleHolder">
        <h3>Friends</h3>
        <BsThreeDotsVertical />
      </div>
      <div className="boxHolder">
        {friends.map((item) => (
          <div className="box">
            <div className="">
              <Images imgsrc="assets/profile.png" />
            </div>
            <div className="title">
              {data.userdata.userInfo.uid == item.senderid  ? (
                <h3>{item.recevername}</h3>
              ) : (
                <h3>{item.sendername}</h3>
              )}
              <p>Hi Guys, Wassup!</p>
            </div>
            <div>
              <button className="boxbtn">Block</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
