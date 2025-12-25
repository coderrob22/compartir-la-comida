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

export default function App(){

  // ************************** STATES *****************************
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  //Below is the lifted state for the Friend component, so that when a friend is clicked, the form to the right will receive the info.
  const [selectedFriend, setSelectedFriend] = useState(null);

  // ***************************** HANDLER FUNCTIONS **********************
  function handleShowAddFriend(){
  setShowAddFriend((x) => !x);
}
  function handleAddFriend(friend){
    setFriends((friends) => [...friends, friend])
    setShowAddFriend(false);
  }
  function handleSelectionOfFriend(){
    //setSelectedFriend(friend);
    setSelectedFriend((curr) => curr?.id === friend.id ? null : friend)
    setShowAddFriend(false);
  }

  function handleSplitBill(value){
    setFriends((friends) => 
      friends.map((friend)=> 
        friend.id === selectedFriend.id
          ? {...friend, balance: friend.balance + value}
          : friend
        ));
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList 
          friends={friends} 
          onSelectionOfFriend={handleSelectionOfFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} /> }



        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {/* The component below is being conditionally rendered based on whether a friend is selected. If they are not selected then the form is short circuited. */}
      {selectedFriend && <FormSplitBill 
        selectedFriend={selectedFriend} 
        onSplitBill={handleSplitBill}
        />
      }
    </div>)
}

function FriendsList({friends, onSelectionOfFriend, selectedFriend}){
  
  return (
    <ul>
      {friends.map((friend)=> (
        <Friend 
          friend={friend} 
          key={friend.id} 
          onSelectionOfFriend={onSelectionOfFriend} 
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
    )
}

function Friend ({ friend, onSelectionOfFriend, selectedFriend }) {
  // Used optional chainging for the 'selected friend' since that variable may not always exist
  const isSelected = selectedFriend?.id === friend.id

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}/>
      <h3>{friend.name}</h3>
      
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}.
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}.
        </p>
      )}
      {friend.balance === 0 && (
        <p>
          You and {friend.name} are even. 
        </p>
      )}
      <Button onClick={() => onSelectionOfFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
    );
}

function Button ( {children, onClick} ){
  return <button className="button" onClick={onClick}>{children}</button>
}

function FormAddFriend({onAddFriend}){
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  function handleSubmission(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmission}>
      <label>Friend name</label>
      <input 
        type="text" 
        value={name}
        onChange={(x)=> setName(x.target.value)}
      />

      <label>Image URL</label>
      <input 
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}  
      />

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ selectedFriend, onSplitBill }) {

  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState('user');

  function handleSubmit(e) {
    e.preventDefault();

    if(!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Solit a bill with {selectedFriend.name}</h2>
      
      <label>Bill value</label>
      <input 
        type="text"
        value={bill}
        onChange={(x) => setBill(Number(x.target.value))} 
      />

      <label>Your expense</label>
      <input 
        type="text" 
        value={paidByUser}
        onChange={(x) => setPaidByUser(Number(x.target.value) > bill ?paidByUser : Number(x.target.value))}
      />

      <label>{selectedFriend.name} expense</label>
      <input type="text" disabled value={paidByFriend}/>

      <label>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(x) => setWhoIsPaying(x.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  )
}