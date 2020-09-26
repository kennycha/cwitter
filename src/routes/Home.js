import Cweet from "components/Cweet";
import CweetFactory from "components/CweetFactory";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [cweets, setCweets] = useState([]);

  useEffect(() => {
    dbService.collection("cweets").onSnapshot((snapshot) => {
      const cweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCweets(cweetArray);
    });
    return;
  }, []);

  return (
    <div>
      <CweetFactory userObj={userObj} />
      <div>
        {cweets.map((cweet) => (
          <Cweet
            key={cweet.id}
            cweetObj={cweet}
            isOwner={cweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
