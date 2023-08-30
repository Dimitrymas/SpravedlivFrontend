import React from "react";
import {Link} from "react-router-dom";
import axios from "axios";


class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login: '', password: '', error: ''}
        this.handleSubmit = this.handleSubmit.bind(this)

    }


    async handleSubmit(e) {
        e.preventDefault()
        this.setState({error: ""})
        if (this.state.login === "") {
            this.setState({error: 'Введите логин'})
        } else if (this.state.password === "") {
            this.setState({error: 'Введите пароль'})
        } else {
            try {
                const data = (await axios.post('/user/login',
                        {
                            username: this.state.login,
                            password: this.state.password
                        }
                    )
                ).data
                this.props.handleLogin(data.response.JWT)
            } catch (error) {
                const data = error.response.data
                this.setState(data.response)
                setTimeout(() => this.setState({error: ""}), 2000)
            }
        }
    }


    render() {
        return (

            <div className="d-flex flex-row-reverse d-flex" style={{alignItems: "center", height: "90vh"}}>
                <div className="col-1 col-lg-1"></div>
                <div className="col-10 col-lg-4 container justify-content-center mt-3 ml-3 login-registration-card">
                    <form onSubmit={(e) => this.handleSubmit(e)} className="lgrg-div-i">
                        <h1 className="login-registration-title">Войти</h1>
                        <p style={{width: "100%", textAlign: "center", marginBottom: "0"}}>{this.state.error}</p>
                        <p className="mb-2 lgrg-q">Новый пользователь?
                            <Link to={'/registration'} style={{color: '#271155', fontWeight: "500"}}>Создать учетную
                                записть</Link>
                        </p>
                        <label htmlFor="inputLogin" className="lgrg-label">Логин</label>
                        <input type="text" onChange={(e) => this.setState({login: e.target.value})}
                               className="form-control inp" id="inputLogin"/>
                        <label htmlFor="inputPassword" className="lgrg-label">Пароль</label>
                        <input type="password" onChange={(e) => {
                            this.setState({password: e.target.value})
                        }}
                               className="form-control inp" id="inputPassword"/>
                        <div className="d-flex flex-row-reverse" style={{marginTop: "1rem", marginBottom: "1rem"}}>
                            <button className="btn lgrg-btn col-12 col-lg-6">Продолжить</button>
                        </div>
                    </form>
                </div>
                <div className="col-1"></div>
            </div>
        )
    }
}

export default LoginPage;