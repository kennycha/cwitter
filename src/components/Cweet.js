import { dbService } from "fbase";
import React, { useState } from "react";

const Cweet = ({ cweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newCweet, setNewCweet] = useState(cweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure to delete this cweet?");
    if (ok) {
      await dbService.doc(`cweets/${cweetObj.id}`).delete();
    }
  };
  const toggelEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`cweets/${cweetObj.id}`).update({
      text: newCweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewCweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your cweet"
                  value={newCweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Cweet" />
              </form>
              <button onClick={toggelEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{cweetObj.text}</h4>
          {cweetObj.attachmentUrl && (
            <img
              src={cweetObj.attachmentUrl}
              width="50px"
              height="50px"
              alt="attachment"
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Cweet</button>
              <button onClick={toggelEditing}>Edit Cweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cweet;
