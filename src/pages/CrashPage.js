import React from "react";


class CrashPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentMultiplier: 1, currentTimer: 15, amount: 0, message: "", winAmount: 0}
        this.makeRequest = this.props.makeRequest
        this.subscribe()
        this.doBet = this.doBet.bind(this)
        this.takeBet = this.takeBet.bind(this)
        this.subscribe = this.subscribe.bind(this)
    }

    async subscribe () {
        if (this.props.socket) {
            this.props.socket.on("crash", async (message) => {
                switch (message.type) {
                    case "updateTimer":
                        this.setState({currentTimer: message.value})
                        break
                    case "updateMultiplier":
                        this.setState({currentMultiplier: message.value})
                        break
                    case "updateWinAmount":
                        this.setState({winAmount: message.value})
                        break
                    default:
                        break

                }
                }
            )
            this.props.socket.emit('join', 'crash')
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.socket !== prevProps.socket) {
            this.subscribe()
        }
    }

    async doBet(event) {
        event.preventDefault()
        const data = await (this.makeRequest('POST', '/game/crash/bet', {amount: this.state.amount}))
        if (data.success) {
            this.setState({message: data.response.message})
        } else {
            this.setState({message: data.response.error})
        }
    }


    async takeBet(event) {
        event.preventDefault()
        const data = await (this.makeRequest('POST', '/game/crash/takebet'))
        if (data.success) {
            this.setState({message: data.response.message})
        } else {
            this.setState({message: data.response.error})
        }
    }
    render() {
        return (
            <div>
                <h1>Crash</h1>
                <h1>{this.state.message}</h1>
                <h2>currentMultiplier</h2>

                <h3>{this.state.currentMultiplier}</h3>
                <h2>currentTimer</h2>
                <h3>{this.state.currentTimer}</h3>
                <h3>Забрать: {this.state.winAmount}</h3>
                <input value={this.state.amount} onChange={(e) => {
                    this.setState({amount: Number(e.target.value)}); console.log(e.target.value)
                }}/>

                <button onClick={this.doBet}>Сделать ставку</button>
                <button onClick={this.takeBet}>Забрать ставку</button>
            </div>
        )
    }
}

export default CrashPage;