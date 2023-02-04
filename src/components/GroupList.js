import React from "react";
import Images from "./Images";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const GroupList = () => {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  return (
    <div className="groupholder">
      <div className="titleHolder">
        <h3>Group List</h3>
        <button onClick={handleOpen}>Create Group</button>
      </div>
      <div className="boxHolder">
        <div className="box">
          <div className="">
            <Images imgsrc="assets/profile.png" />
          </div>

          <div className="title">
            <h3>Friends Reunion</h3>
            <p>Hi Guys, Wassup!</p>
          </div>
          <div>
            <button className="boxbtn">Join</button>
          </div>
        </div>
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
          <Typography  id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField style={{marginBottom: "15px"}} id="outlined-basic" label="Group Name" variant="outlined" />
          <TextField style={{marginBottom: "15px"}} id="outlined-basic" label="Group Tag" variant="outlined" />
          </Typography>
          <Button variant="contained">Contained</Button>
        </Box>
      </Modal>
    </div>
    </div>
  );
};

export default GroupList;
