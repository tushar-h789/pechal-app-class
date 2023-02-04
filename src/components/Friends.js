import Images from "./Images";
import { BsThreeDotsVertical } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";

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


  // ekhan theke jokhon unfriend korte cacche tokhon unfriend button a click korle jotogulo friend ache sob gulo friend unfriend hoye jacche.
  // useEffect(() => {
  //   const userRef = ref(db, "friends");
  //   onValue(userRef, (snapshot) => {
  //     let arr = [];
  //     console.log(arr)
  //     snapshot.forEach((item) => {
  //       arr.push(item.val().senderid + item.val().receverid);
  //       console.log({...item.val(), id: item.key})
  //     });
  //     setUnfiends(arr);
  //   });
  // }, []);


  let handleBlock = (item)=>{

    data.userdata.userInfo.uid === item.senderid 
    ?
    set(push(ref(db, "block")), {
     block: item.recevername,
     blockid: item.receverid,
     blockby: item.sendername,
     blockbyid: item.senderid,
    }).then(()=>{
      remove(ref(db, "friends/" + item.id)).then(() => {
      })
    })
    :
    set(push(ref(db, "block")), {
      block: item.sendername,
      blockid: item.senderid,
      blockby: item.recevername,
      blockbyid: item.receverid,
     }).then(()=>{
      remove(ref(db, "friends/" + item.id)).then(() => {
      });
    })
  }

  let handleUnfriend = (item) => {
      remove(ref(db, "friends/" + item.id)).then(() => {
        console.log("Unfriend done");
      
    });
  };

  return (
    <div className="groupholder">
      <div className="titleHolder">
        <h3>Friends</h3>
        <BsThreeDotsVertical />
      </div>
      <div className="boxHolder">

      {friends.length > 0 
      ?
      friends.map((item) => (
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
            <p>{item.date}</p>
          </div>
          <div>
            <button onClick={()=>handleBlock(item)} className="boxbtn">Block</button>

            <button
                  onClick={() => handleUnfriend(item)}
                  className="boxbtn"
                >
                  Unfriend
                </button>
          </div>
        </div>
      ))
      :
      <Alert className="alert" variant="filled" severity="info">
            No Friend
          </Alert>
      }

        
      </div>
    </div>
  );
};

export default Friends;
