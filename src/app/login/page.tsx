'use client'

import React, { useEffect } from "react";
import {gql, useApolloClient} from "@apollo/client";
const Page = () => {
    const [identifier,setIdentifier]=React.useState<string>('');
    const [password,setPassword]= React.useState<string>('');
    const [error,setError]=React.useState<string>('');
    const [counter,setCounter]= React.useState(-1);
    const client=useApolloClient(); 
    const handleLogin=async ()=>{
        const LOGIN_MUTATION= gql`
        mutation Login($user: UserLogInput!){
            login(user: $user){
                code
                message
                token
            }
        }`;
        try{
            const response = await client.mutate({
                mutation:LOGIN_MUTATION,
                variables:{
                    user:{
                        username:identifier,
                        password:password
                    }
                }
            });
            const {code,message,token}=response.data.login;
            if(code==200){
                localStorage.setItem('token',token);
                // window.location.href='/';
                setError(message)
                setCounter(60);
            }else{
                setError(message);
            }
        }catch (e) {
            setError(e.message);
        }
    }
    useEffect(()=>{
        if(counter<0) return;
        const interval=setInterval(()=>{
            setCounter((prev)=>(prev-1))
        },1000);
        return ()=>clearInterval(interval);
    },[counter]);
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-blue-400 gap-2 ">
            <h2 className="text-purple-900 text-2xl font-bold">Login</h2>
            <input className="text-purple-700" type="text" placeholder="username" value={identifier}
                   onChange={(e)=>setIdentifier(e.target.value)}/>
            <input className="text-purple-700" type="password" placeholder="password" value={password}
                   onChange={(e)=>setPassword(e.target.value)}/>
            <button className="border-amber-300 rounded-b bg-red-400 w-fit px-2 py-1" onClick={handleLogin}>Login</button>
            
            <h5>token handler</h5>
            <input value={error} className="w-96 h-8 overflow-hidden"/>
            <label>Token revalidation <div>{counter}</div></label>
        </div>
    )
}
export default Page;
