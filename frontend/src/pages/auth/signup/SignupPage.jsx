import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom"

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    fullName: "",
    password: "",
  });
  const navigate = useNavigate()

  const {mutate, isError, isPending, error} = useMutation({
    mutationFn: async ({userName, fullName, email, password}) => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/signup", {
      withCredntials: true,
      credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({userName, fullName, email, password})
        })
        console.log(res)
const data = res.json()
if(!res.ok) {
  throw new Error(data.err)
}
navigate("/")
return data
      }
      catch(err) {
        console.error(err)
        throw err
      }

      

    },

    onSuccess: () => toast.success("Account created successfull")
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    mutate(formData)
    
    // const response = await fetch("http://localhost:4000/api/auth/signup", {
    //   withCredntials: true,
    //   credentials: "include",
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({...formData })
    // })
    // const data = await response.json()
    // console.log(data)
    // if(!response.ok) {
    //     return console.log("something went wrong")
    // }
  };

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  };

  // const isError = false;

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="userName"
                onChange={handleInputChange}
                value={formData.userName}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            Sign up
          </button>
          {isError && <p className="text-red-500">{error || "something went wrong"}</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              {isPending ? "Loading" : "Signup"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;