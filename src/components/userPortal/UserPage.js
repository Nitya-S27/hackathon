import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase-config";
import Modal from "react-modal";

const UID = [1, 2, 3, 4, 5];

const UserPage = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState();
  const [conversingUser, setConversingUser] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getFavs = async () => {
      const docRefGet = doc(db, "admin", "links");
      const docSnap = await getDoc(docRefGet);
      let fetchedMeetings = [];
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        fetchedMeetings = [...docSnap.data().meetings];
        console.log(fetchedMeetings);
      } else {
        console.log("No favourites added!");
      }
      setMeetings([...fetchedMeetings]);
    };

    getFavs();
  }, []);

  const addUser = (uid) => {
    setConversingUser((prev) => [...prev, uid]);
    let userCopy = [...conversingUser];
    userCopy.push(uid);
    console.log(userCopy);
    setConversingUser(userCopy);
    setDoc(doc(db, "admin", "user"), {
      selectedLink: selectedMeeting,
      usersInteracted: [...conversingUser],
    });
  };
  const addMeeting = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div>
        <h3>
          You want to have your meeting with ? Select any one user and any one
          link available .
        </h3>
        {UID.map((uid, index) => (
          <div key={index + uid}>
            <label
              onClick={() => {
                setOpen(true);
              }}
              htmlFor="userChecked"
            >
              User : {uid}
            </label>
            <input
              onChange={() => {
                addUser(uid);
              }}
              id="userCheck"
              type="checkbox"
            />
          </div>
        ))}
      </div>

      <Modal
        isOpen={open}
        onRequestClose={handleClose}
        // style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          {meetings?.map((meet, index) => (
            <div key={index}>
              <input
                onChange={() => {
                  addMeeting(meet.m);
                }}
                id="availablemeets"
                type="checkbox"
              />
              <label htmlFor="availablemeets">
                <div>{meet.m.appointmentName}</div>
                <div>{meet.m.meetingLink}</div>
                <div>{meet.m.appointmentDesc}</div>
              </label>
            </div>
          ))}
          <button onClick={handleClose}>Start/Schedule</button>
        </div>
      </Modal>
    </div>
  );
};

export default UserPage;
/* <span key={uid + index}>User : {uid}</span> */
