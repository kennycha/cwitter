import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Cweet = ({ cweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newCweet, setNewCweet] = useState(cweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure to delete this cweet?");
    if (ok) {
      await dbService.doc(`cweets/${cweetObj.id}`).delete();
      await storageService.refFromURL(cweetObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
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
    <div className="cweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container cweetEdit">
            <input
              type="text"
              placeholder="Edit your cweet"
              value={newCweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Cweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{cweetObj.text}</h4>
          {cweetObj.attachmentUrl && (
            <img src={cweetObj.attachmentUrl} alt="attachment" />
          )}
          {isOwner && (
            <div className="cweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cweet;
