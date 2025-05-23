export const getSender = (loggedUser, users = []) => {
  const validUsers = users.filter((user) => user?.name);
  if (validUsers.length < 2) return "No valid users";

  return validUsers[0]._id === loggedUser._id
    ? validUsers[1].name
    : validUsers[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0].name;
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    m.sender._id !== userId && 
    (i === 0 || messages[i - 1]?.sender._id !== m.sender._id) 
  ) {
    return 10;
  }

  if (m.sender._id !== userId) {
    return 10; 
  }

  return "auto"; 
};





export const isSameUser = (messages,m,i)=>{
  return i>0 && messages[i-1].sender._id === m.sender._id
}
