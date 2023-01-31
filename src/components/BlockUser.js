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

const BlockUser = () => {
  const db = getDatabase();

  let [blocklist, setBlocklist] = useState([]);

  let data = useSelector((state) => state);
  console.log(data.userdata.userInfo.uid);

  useEffect(() => {
    const starCountRef = ref(db, "block");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().blockbyid == data.userdata.userInfo.uid) {
          arr.push({
            id: item.key,
            block: item.val().block,
            blockid: item.val().blockid,
            date: `${new Date().getDate()}/${
              new Date().getMonth() + 1
            }/${new Date().getFullYear()}`,
          });
        } else {
          arr.push({
            id: item.key,
            blockby: item.val().blockby,
            blockbyid: item.val().blockbyid,
            date: `${new Date().getDate()}/${
              new Date().getMonth() + 1
            }/${new Date().getFullYear()}`,
          });
        }
      });
      setBlocklist(arr);
    });
  }, []);


  let handleUnblock = (item)=>{
    set(push(ref(db, "friends")), {
      sendername: item.block,
      senderid: item.blockid,
      recevername: data.userdata.userInfo.displayName,
      receverid: data.userdata.userInfo.uid,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
     }).then(()=>{
      remove(ref(db, "block/" + item.id)).then(() => {
        console.log("kaj hoiche")
      });
    })
  }


  return (
    <div className="groupholder">
      <div className="titleHolder">
        <h3>Blocked Users</h3>
        <BsThreeDotsVertical />
      </div>
      <div className="boxHolder">
        {blocklist.map((item) => (
          <div className="box">
            <div className="">
              <Images imgsrc="assets/profile.png" />
            </div>

            <div className="title">
              <h3>{item.block}</h3>
              <h3>{item.blockby}</h3>
              <p>{item.date}</p>
            </div>
            <div>
              <button onClick={()=>handleUnblock(item)} className="boxbtn">Unblock</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockUser;
