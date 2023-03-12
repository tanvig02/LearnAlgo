import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ name: "", email: "", balance: "" });
  let name, value;
  const handleInput = (event) => {
    name = event.target.name;
    value = event.target.value;
    setInput({ ...input, [name]: value });
  };

  const postData = async (event) => {
    event.preventDefault();

    const { name, email, balance } = input;

    const res = await fetch("/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //when we will send the data to server it will be in json format,
      //server do not understand json format so we need to convert it to string
      body: JSON.stringify({
        // name: input.name,
        name,
        email,
        balance,
      }),
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      window.alert("Invalid Credentials");
      console.log("Invalid Credentials");
    } else {
      window.alert("login successfull");
      console.log("login successfull");
      navigate("/");
    }
  };

  return (
    <form
      method="POST"
      className="flex flex-col justify-center items-center text-3xl"
    >
      <div className="space-y-5 mt-12 w-[400px] border-2 border-blue-400 bg-blue-100 rounded-xl p-10 shadow-2xl">
        <div>
          <p className="text-sm text-gray-500">User Name</p>
          <input
            type="text"
            name="name"
            value={input.name}
            onChange={handleInput}
            className=" text-lg text-slate-800 rounded-lg outline-none "
          />
        </div>
        <div>
          <p className="text-sm text-gray-500"> Email Id</p>
          <input
            type="text"
            name="email"
            value={input.email}
            onChange={handleInput}
            className=" text-lg text-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500">User Balance</p>
          <input
            type="text"
            name="balance"
            value={input.balance}
            onChange={handleInput}
            className="text-lg text-slate-800 rounded-lg outline-none"
          />
        </div>
      </div>
      <button
        onClick={postData}
        className="rounded-lg text-lg my-5 p-2 px-4 bg-teal-500 shadow-lg shadow-teal-500/50 text-black hover:text-white "
      >
        ADD
      </button>
    </form>
  );
};

export default AddUser;
