import React, { useState } from "react";
import axios from "axios";
import UserContext from "./UserProvider copy";
import { useContext } from "react";

export default function LoginT(props) {
    const {userValue,set_userValue} = useContext(UserContext);//get the curent user from the context

    const [auth, setAuth] = useState(true);
    const [input, setInput] = useState({
        username: '',
        password: ''
    })

    function handleChange(event) {
        const { name, value } = event.target;

        setInput(prevInput => {
            return {
                ...prevInput,
                [name]: value
            }
        })
    }
    function validateForm() {
        return input.username.length > 0 && input.password.length > 0;
    }

    function setUser(user) {
        window.sessionStorage.setItem('auth', true);
        window.sessionStorage.setItem('name', user.name);
        window.sessionStorage.setItem('id', user._id);
        window.sessionStorage.setItem('innerAuth', user.auth);
        set_userValue({id:user._id,user:user.name, innerAuth:user.auth ,auth:true});
    }
    // {user,id,auth,innerAuth}

    function logoutUser() {
        window.sessionStorage.setItem('auth', null);
        window.sessionStorage.setItem('name', null);
        window.sessionStorage.setItem('id', null);
        window.sessionStorage.setItem('innerAuth', null);
        // props.setLogin(null);
        // props.setInnerLogin(null);
        set_userValue({})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newManager = {
            username: input.username,
            password: input.password
        }
        console.log(newManager);

        const res = await axios.post('http://localhost:3001/user/validateUser', newManager);
        console.log("res", res);
        if (res.data.valid === true) {
            console.log(res.data.user);
            setUser(res.data.user);
            console.log("hey",window.sessionStorage.getItem('name'));
            setAuth(true);
            // props.setLogin(true);
            // props.setInnerLogin(res.data.user.innerAuth);
            const user = res.data.user;
            console.log('the server give me user',user);
            props.setUser({id:user._id,user:user.name, innerAuth:user.auth ,auth:true});
        }
        if (res.data === false) {
            setAuth(false);
            console.log(auth);

        }
    }
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleSubmit}>

                    <h1> Ordman Suppliers </h1>

                    <h3>??????????</h3>

                    <div className="form-group">
                        <label>???? ??????????</label>
                        <input onChange={handleChange}
                            name="username"
                            value={input.username}
                            type="text"
                            className="form-control"
                            placeholder="???????? ???? ??????????"
                        />
                    </div>
                    <br></br>

                    <div className="form-group">
                        <label>??????????</label>
                        <input onChange={handleChange}
                            name="password"
                            value={input.password}
                            type="password"
                            className="form-control"
                            placeholder="???????? ??????????"
                        />
                    </div>
                    {!auth && <p>???? ?????????? ???????????? ????????????, ?????? ????????</p>}
                    {/* <br></br> */}
                    {/* <div className="form-group">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="customCheck1" />
                            <label className="custom-control-label m-1" htmlFor="customCheck1">???????? ????????</label>
                        </div>
                    </div> */}
                    <button type="submit" className="btn btn-primary btn-block mt-3" disabled={!validateForm()}>??????????</button>
                    {/* <p className="forgot-password text-right">
                        ???????? <a href="google.com">???????????</a>
                    </p> */}
                </form>
            </div>
        </div>
    );
}