import React, { useEffect, useState } from "react";
import Images from "./Images";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";

const FriendRequest = () => {
  const db = getDatabase();

  let [freq, setFreq] = useState([]);
  let [loader, setLoader] = useState(false);

  let data = useSelector((state) => state);

  //Sent Request button a click korar pore database jei sob information pathano hoichilo segulo information gulo ekhane onValue diye dhorte hobe. arr.push({ ...item.val(), id: item.key }) == aetar mane holo 2jon user er sob data/informatin aksathe niye ...item.val() diye splet korteche. r tader 2jon er jonno akta id/key create hoiche. sei id/key ta ke dhorar jonno id:item.key deoa hoiche. akhon aegulo information gulo ke arr te push kora hiche. tarpor freq ta ke map kora hoiche. nice map kora ache....
  useEffect(() => {
    const starCountRef = ref(db, "friendrequest");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().receverid === data.userdata.userInfo.uid) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setFreq(arr);
    });
  }, []);

  //Reject button a click korar pore database a "friendRequest" folder er moddhe 2jon er jonno jei id/key toiri hoichilo sei id/key ta delete hoye jabe.
  let handleDeleteRriendRequest = (friendRequest) => {
    setLoader(true)
    remove(ref(db, "friendrequest/" + friendRequest.id)).then(() => {
      setLoader(false)
      toast("Calcle Friend Request");
    });
  };

  //friend request asar pore Accept button a click korar pore je request pathaiche r je request ppaiche tader 2jon er under a akta id/key create hobe. ae key ta database a "friends" namer akta folder create hobe. data ta database a pathanor pore friend request option theke remove hoye jabe r Friends option a user ke show korabe. user er sob information er sathe date o database a pathano hobe.
  let handleAcceptFriendRequest = (friendRequest) => {
    setLoader(true);
    set(push(ref(db, "friends")), {
      ...friendRequest,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    }).then(() => {
      remove(ref(db, "friendrequest/" + friendRequest.id)).then(() => {
        setLoader(false);
        toast("Accept Friend Request");
      });
    });
  };

  return (
    <div className="groupholder">
      <div className="titleHolder">
        <h3>Friend Request</h3>
        <BsThreeDotsVertical />
      </div>
      <div className="boxHolder">
        {/* ekhane useState er freq ke map kora hoiche. akta user er sob information map er moddhe rakha hoiche. freq.length > 0 = er mane holo Friend Request er moddhe jodi kono request thake tahole sey request ta ke show korabe r jodi na thake tahole "No Friend Request" dekhabe */}
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
                    onClick={() => handleAcceptFriendRequest(item)}
                    className="boxbtn"
                  >
                    Accept
                  </button>
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
                    onClick={() => handleDeleteRriendRequest(item)}
                    className="boxbtn"
                  >
                    Reject
                  </button>
                )}
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
