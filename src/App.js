import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAdd, setShowAdd] = useState(false);
  const [showBill, setShowBill] = useState(null);
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAdd(false);
  }
  function handleSelection(friend){

    setShowBill((bill)=> (bill?.id=== friend.id? null:friend))
    setShowAdd(false)
  }
  function handleBillSplit(value){
    setFriends((friends)=>friends.map(friend=>friend.id===showBill.id? {...friend,balance: friend.balance + value}:friend))
    setShowBill(null)
  }

  return (
    <div className="app">
      <div className="sidebar">

        <FriendsList friends={friends} showBill={showBill} onSelection={handleSelection} />

        {showAdd && <FormAddFriend onHAddFriend={handleAddFriend} />}

        <Button onClick={() =>     {setShowBill(null)
          setShowAdd(!showAdd)}}>
          {showAdd ? "Close" : "Add Friend"}
        </Button>
      </div>

      {showBill && (
        <FormSplitBill showBill={showBill} key={showBill.id} onSplitBill={handleBillSplit}/>
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, showBill }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={showBill}
        />
      ))}
    </ul>
  );
}


function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onHAddFriend }) {
  const id = crypto.randomUUID(); // it is built in function which assign random 16 digit code
  const [friendName, setFriendName] = useState("");
  const [friendPic, setFriendPic] = useState("  ");
  function handleSubmit(e) {
    e.preventDefault();
    if (!friendName || !friendPic) return;

    const newFriend = {
      id,
      name: friendName,
      image: `${friendPic}?=${id}`,
      balance: 0,
    };
    onHAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏻‍🤝‍🧑🏻Friend name</label>
      <input type="text" onChange={(e) => setFriendName(e.target.value)} />
      <label>🖼 Image Url</label>
      <input type="text" onChange={(e) => setFriendPic(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({showBill , onSplitBill}) {
  const [bill,setBill] = useState("")
  const [expense,setExpense] = useState("")
  const [billPayer,setBillPayer] = useState("")
  const paidByFriend = bill ? bill - expense: ""
  function handleSubmit(e){
    e.preventDefault();

    if(!bill || !expense ) return;

    onSplitBill(billPayer==="user"? paidByFriend: -paidByFriend);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {showBill.name}</h2>
      <label>💰Bill Split</label>
      <input type="text" value={bill} onChange={(e)=>setBill(Number(e.target.value))} />
      <label>🧝‍♂️Your Expense</label>
      <input type="text"
      value={expense}
       onChange={(e)=>
       setExpense(Number(e.target.value) >bill?
        expense: Number(e.target.value))} />
      <label>👩🏼‍🤝‍🧑🏽{showBill.name}'s Expense</label>
      <input type="text" value={paidByFriend} disabled />
      <label>💸Who is going to pay bill</label>
      <select value={billPayer} onChange={(e)=>setBillPayer(e.target.value)}>
        <option value="user" >You</option>
        <option value={showBill.name}>{showBill.name}</option>
      </select>
      <Button>Add</Button>
    </form>
  );
}
