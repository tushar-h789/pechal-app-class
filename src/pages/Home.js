import React from "react";
import Grid from "@mui/material/Grid";
import GropuList from "../components/GroupList";
import FriendRequest from "../components/FriendRequest";
import Friends from "../components/Friends";
import MyGroup from "../components/MyGroup";
import UserList from "../components/UserList";
import BlockUser from "../components/BlockUser";

const Home = () => {
  return (
    <>
      {/* <h1>Home</h1> */}
      <Grid item xs={4}>
        <GropuList />
        <FriendRequest/>
      </Grid>
      <Grid item xs={3}>
        <Friends/>
        <MyGroup/>
      </Grid>
      <Grid item xs={3}>
        <UserList/>
        <BlockUser/>
      </Grid>
    </>
  );
};

export default Home;
