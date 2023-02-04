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
import Grid from "@mui/material/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FriendRequest from "./FriendRequest";

const UserList = () => {
  const db = getDatabase();
  let [userlist, setUserlist] = useState([]);
  let [freq, setFreq] = useState([]);
  let [friends, setFiends] = useState([]);
  // let [unfriends, setUnfiends] = useState([]);
  let [block, setBlock] = useState([]);
  let [cancle, setCancle] = useState([]);

  let data = useSelector((state) => state);
  // console.log(data.userdata.userInfo.uid);

  //je kew akta account create korar pore tar data gulo database a set hoye jabe. akhon tar data theke onValue er maddhume tar information gulo user list a dekhano hobe useEffect er maddhume. arr.push({ ...item.val(), id: item.key }) = er mane holo je account create korche tar sokol information gulo ...item er moddhe splet kora hoiche. id:item.key = er mane hocche user er akta key ache. oi key ta ke dhorte aeta use kora hoiche. akhon aegulo informition gulo arr er moddhe push kora hocche.  if (data.userdata.userInfo.uid !== item.key) = er mane hocche, je akhon login obosthai ache take user list a dekhabena.
  //er pore userlist ke map korate hobe.

  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userdata.userInfo.uid !== item.key) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setUserlist(arr);
    });
  }, []);

  //aeta diye friendrequest er moddhe theke data gulo niye setFreq er moddhe data gulo store korteche. tarpor useState er maddhume freq ke diye map korano hocche. conditaion hisebe deoa hocche j jodi je login obosthai ache tar id r jar button a click korteche tar id jog(+) hoi tahole tar kache friend request cole jabe r 2ta button show korbe seyta holo (Panding)(Cancle).
  useEffect(() => {
    const userRef = ref(db, "friendrequest");
    onValue(userRef, (snapshot) => {
      let arr = [];
      // let arrTwo = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receverid + item.val().senderid);
        // arrTwo.push({ ...item.val(), id: item.key });
      });
      setFreq(arr);
      // setCancle(arrTwo);
    });
  }, []);

  //friend request cancle er jonno aeta kora hoiche. friend request pathanor pore seyta calcle korar jonno user der sokol informition er sathe sathe tader 2jon er jonno akta id/key create hoiche. sey id/key ta ke dhorar jonno item.key neoa hoiche. akhon aegulo information gulo akta arr er moddhe push kora hoiche. ebar cancle ke nice map kora hoiche.
  useEffect(() => {
    const userRef = ref(db, "friendrequest");
    onValue(userRef, (snapshot) => {
      // let arr = [];
      let arrTwo = [];
      snapshot.forEach((item) => {
        // arr.push(item.val().receverid + item.val().senderid);
        arrTwo.push({ ...item.val(), id: item.key });
      });
      // setFreq(arr);
      setCancle(arrTwo);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "friends");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receverid + item.val().senderid);
      });
      setFiends(arr);
    });
  }, []);

  // ekhane jei user er "unfriend" button a click korar pore database a "friends" er moddhe theke sei user er sob data remove kore dibe r notun kore akta buttn show korbe "sent Request" namer. { ...item.val(), id: item.key }== ekhane 2jon user er sob data niye (...) diye spleat kore deoa hoiche r tader data gulo jei id/key ta chilo oita (id: item.key) diye dhora hoiche.
  // useEffect(() => {
  //   const userRef = ref(db, "friends");
  //   onValue(userRef, (snapshot) => {
  //     let arr = [];
  //     snapshot.forEach((item) => {
  //       arr.push({ ...item.val(), id: item.key });
  //     });
  //     setUnfiends(arr);
  //   });
  // }, []);

  useEffect(() => {
    const userRef = ref(db, "block");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receverid + item.val().senderid);
      });
      setBlock(arr);
    });
  }, []);

  //ekane sent Request button a click korle, je click kortech r jake click korteche tader informition gulo database a "friendrequest" name akta folder a cole jabe push er maddhume. ekane data hisebe user er nam r id pathano hocche.
  let handleFriendRequest = (info) => {
    set(push(ref(db, "friendrequest")), {
      sendername: data.userdata.userInfo.displayName,
      senderid: data.userdata.userInfo.uid,
      recevername: info.displayName,
      receverid: info.id,
    });
  };

  //delete button a jokhon click kora hocche tokhon cancle ke map kora hocche. handleDelete er moddhe jei id ta ache, mane je cancle button a click korteche tar id r jar button a click kora hocche tar id jodi == hoi tahole database theke friendrequest er moddhe theke tader 2jon er jonno friend request pathanor pore jei id/key ta create hoichilo seyta remove kore dibe.
  let handleDelete = (item) => {
    cancle.map((cancle) => {
      console.log(cancle);
      if (item.id === cancle.receverid) {
        remove(ref(db, "friendrequest/" + cancle.id)).then(() => {
          setTimeout(() => {
            toast("Cancle Request");
          }, 2000);
          console.log("cancle");
        });
      }
    });

    // console.log("Calcle Friend Request");
  };

  //kono user friend hoar pore tar sob data/information gulo database a "friends" folder er moddhe thake. unfriend button a click korar pore database "friends" er moddhe theke friend hoar pore 2jon user er jonno jei id/key toiri hoicilo seita delete hoye jabe. r user list a "sent friend request" button ta show korbe
  // let handleUnfriend = (item) => {
  //   console.log(unfriends);
  //   remove(ref(db, "friends/" + unfriends.id)).then(() => {
  //     console.log("kaj hoiche");
  //   });
  // };

  return (

    <>
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

    <div className="groupholder">
      <div className="titleHolder">
        <h3>User List</h3>
        <BsThreeDotsVertical />
      </div>
      <div className="boxHolder">
        {/* ekhane userlist ke map korano hoiche. map er mane holo user er joto informition thakbe sob gulo show korabe*/}
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
              {/* jodi useState er moddhe theke "friends" er data ta includes kora hoi tarpore (item.id + data.userdata.userInfo.uid) == er mane holo jake request pathano hoice tar id r je login ache jar id jog hoye jai ||(or) je login obosthai ache tar id r jake request pathano hoiche tar id ta jog hoy jai. aeta jodi sotto hoi tahole "Friend" r "Unfriend" button show korbe.  r jodi sotto na hoi tahole nicer ta show korbe.... */}
              {friends.includes(item.id + data.userdata.userInfo.uid) ||
              friends.includes(data.userdata.userInfo.uid + item.id) ? (
                <div className="flex_button">
                  <button className="boxbtn">Friend</button>
                  {/* <button
                    onClick={() => handleUnfriend(item)}
                    className="boxbtn"
                  >
                    Unfriend
                  </button> */}
                </div>
              ) : // r jodi sotto na hoi tahole useState er "freq" er moddhe theke freq ta includes kore dibe. tarpor (item.id + data.userdata.userInfo.uid) == er mane holo je friend request pathaiche tar id r je login obosthai ache tar id ||(or) je login obosthai ache tar id r jake friend request pathaiche tar id ta jodi jog hoye jai tahoole "panding" r "Cancle" button show korbe. tarpor aetao jodi sotto na hoi tahole nicer "Sent Request" button show korbe.
              freq.includes(item.id + data.userdata.userInfo.uid) ||
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
    </>
  );
};

export default UserList;
