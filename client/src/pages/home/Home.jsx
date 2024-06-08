import { useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../component/authentication/firebaseConfig";
import axios from "axios";
import SignIn from "../../component/authentication/SignIn";
import SignUp from "../../component/authentication/SignUp";
import MessageWindow from "../../component/messageWindow/MessageWindow";
import "./style.scss";

axios.defaults.baseURL = 'http://localhost:3000';

const Home = () => {
  const [value, setValue] = useState("Sign In");
  const [verified, setVerified] = useState(false);
  const [memberStatus, setMemberStatus] = useState(false);

  const checkMemberStatus = async()=>{
    const token = await auth.currentUser.getIdToken(true);
        console.log("making request to see member status")
        axios
          .get("/isMember", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setMemberStatus(response.data.memberStatus);
            console.log("Member Status:",response.data);
          })
          .catch((error) => {
            setMemberStatus(false);
            console.log("error on checking member status",error);
          });
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      setValue("authenticated");
      if (user.emailVerified) {
        setVerified(true);
        checkMemberStatus();
      }
      else setVerified(false);
    } else {
      if (value === "authenticated") setValue("Sign In");
    }
  });

  const signout = () => {
    setValue("Sign In");
    auth.signOut();
  };
  return (
    <div className="homeContainer">
      <div className="motive">
        <h2>Who We Are</h2>
        <p>
          We are Jawahar Navaodya Vidyalaya Raipur, Students of 27th Batch. This
          community motives to collect funds and help the members in their
          struggling phase. Donate today to contribute towards better future
        </p>
      </div>
      {value === "Sign In" && <SignIn setValue={setValue} />}
      {value === "Sign Up" && <SignUp setValue={setValue} />}
      {value === "authenticated" && verified && (
        <MessageWindow setVerified={setVerified} verified={verified} memberStatus={memberStatus} />
      )}
      {value === "authenticated" && !verified && (
        <MessageWindow setVerified={setVerified} verified={verified} memberStatus={memberStatus} />
      )}
    </div>
  );
};

export default Home;
