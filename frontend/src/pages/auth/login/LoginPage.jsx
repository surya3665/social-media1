import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import XSvg from "../../../components/svgs/X.jsx";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import  { toast } from "react-hot-toast";

const LoginPage = () => {
	// const [formData, setFormData] = useState({

    const [dataForm,setDataForm] = useState({
		userName:"",
		password:"",
	})
const navigate = useNavigate()
// const [resData, setResDate] = useState({})
// const [isLoading, setIsLoading] = useState(false)
const {mutate,isPending,isError,error} = useMutation({
	mutationFn:async ({userName,password}) => {
		try{
			const res = await fetch("http://localhost:4000/api/auth/login",{
				withCredntials: true,
                credentials: "include",
				method:"POST",
				headers:{
					"Content-Type":"application/json",
				},
				body:JSON.stringify({userName,password}),
			})
			const data = await res.json()
			if(data.success == false){
				console.log(err.message)
				throw new Error(data.error || "Somthing went wrong")
			}
			navigate("/")
			return data
			
		}catch(err){
			console.log(err)
		}
	},
	onSuccess:() => {
		toast.success("login successfully")
	}
})

    
	const handleSubmit = (e) => {
	e.preventDefault();
	mutate(dataForm)
		
// 	const response = await fetch("http://localhost:4000/api/auth/login", {
// 	  withCredentials: true,
// 	  credentials: "include",
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json"
// 		},
// 		body: JSON.stringify({...dataForm })
// 	})
// 	console.log(response)
// 	const data = await response.json()
// 	setIsLoading(false)
// 	setResDate(data)
// 	navigate("/")
// }
// catch(err) {
// 	console.log(err)
// }
		
	  };
// 	console.log(isLoading, resData)

	const handleInputChange = (e) => {
		setDataForm({ ...dataForm, [e.target.name]: e.target.value });
		console.log(dataForm)
	};



	// const isError = false;

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white'/>
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='userName'
							className='grow'
							placeholder='userName'
							name='userName'
							onChange={handleInputChange}
							value={dataForm.userName}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={dataForm.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>{isPending ? "Loading" : "Login"}</button>
					{isError && <p className='text-red-500'>Something went wrong</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
