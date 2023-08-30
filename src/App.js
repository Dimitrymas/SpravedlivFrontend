import './App.css';
import React, {Component} from "react";
import axios from "axios";
import NavBarPanel from "./components/NavBarPanel";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import CrashPage from "./pages/CrashPage";
import socketIo from 'socket.io-client'

class App extends Component {
    constructor(props) {
        super(props);
        axios.defaults.baseURL = 'http://localhost:5000/api'
        this.state = {balance: 0, isLoggedIn: !!localStorage.getItem('JWT')}
        if (this.state.isLoggedIn) {
            this.authorize()
        }
        this.handleLogout = this.handleLogout.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
        this.makeRequest = this.makeRequest.bind(this)
        this.authorize = this.authorize.bind(this)
    }


    async authorize() {
        const JWT = localStorage.getItem('JWT')
        axios.defaults.headers.common['authorization'] = `Bearer ${JWT}`
        this.socket = socketIo('http://localhost:5000/', {
                transports: ['websocket'],
                auth: {token: `Bearer ${JWT}`}
            }
        )
        this.socket.on('user', (message) => {
            switch (message.type) {
                case 'updateBalance':
                    const currentUser = this.state.user
                    currentUser.balance = message.value
                    this.setState({user: null}, () => {
                        this.setState({user: currentUser})
                    })
                    break
                default:
                    break
            }
        });
        this.socket.connect()
        const data = await this.makeRequest('GET', '/user/profile')
        if (data.success) {
            this.setState({user: data.response})
        }
    }

    handleLogout() {
        localStorage.removeItem('JWT');
        delete axios.defaults.headers.common['authorization']
        this.socket.disconnect()
    }

    handleLogin(JWT) {
        this.setState({isLoggedIn: true}, this.authorize);
        localStorage.setItem('JWT', JWT);

    }

    async makeRequest(method, path, data) {
        if (method === 'GET') {
            try {
                return (await axios.get(path, {params: data})).data

            } catch (error) {
                if (error.status === 403 || error.status === 401) {
                    this.handleLogout()
                }
                return error.response.data
            }
        } else {
            try {
                return (await axios.post(path, data)).data
            } catch (error) {
                return error.response.data
            }

        }

    }

    render() {
        return (<BrowserRouter>
            <NavBarPanel isLoggedIn={this.state.isLoggedIn}/>
            {this.state.user && <h1>Баланс {this.state.user.balance}</h1>}

            <Routes>
                <Route exact path="/user/login"
                       element={!this.state.isLoggedIn ? <LoginPage handleLogin={this.handleLogin}/> :
                           <Navigate replace to={"/"}/>}/>
                <Route exact path="/user/registration"
                       element={!this.state.isLoggedIn ? <RegistrationPage handleLogin={this.handleLogin}/> :
                           <Navigate replace to={"/"}/>}/>

                <Route exact path="/game/crash"
                       element={this.state.isLoggedIn ?
                           <CrashPage socket={this.socket} makeRequest={this.makeRequest}/> :
                           <Navigate replace to={"/user/login"}/>}/>
            </Routes>
        </BrowserRouter>)
    }
}


export default App;
