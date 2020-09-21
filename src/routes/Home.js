import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [cweet, setCweet] = useState("");
  const [cweets, setCweets] = useState([]);
  const getCweets = async () => {
    const dbCweets = await dbService.collection("cweets").get();
    dbCweets.forEach((document) => {
      const cweetObject = {
        ...document.data(),
        id: document.id,
      };
      setCweets((prev) => [cweetObject, ...prev]);
    });
  };
  useEffect(() => {
    getCweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("cweets").add({
      cweet,
      createdAt: Date.now(),
    });
    setCweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setCweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={cweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Cweet" />
      </form>
      <div>
        {cweets.map((cweet) => (
          <div key={cweet.id}>
            <h4>{cweet.cweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
