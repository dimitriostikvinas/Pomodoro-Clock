import React from 'react';

const audio = new Audio("https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav");
class PomodoroClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breakLength: 5,
            sessionLength: 25,
            timeLeft: 1500,
            timerRunning: false,
            timerSession: true, //True if session, False if break
        };
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
        this.buttonPressed = this.buttonPressed.bind(this);
        this.interval = null;
    }

    increment(id) {
        this.setState(prevState => {
            switch (id) {
                case "breakIncrement":
                    return { breakLength: prevState.breakLength + 1 };
                case "sessionIncrement":
                    return { sessionLength: prevState.sessionLength + 1,
                             timeLeft: (prevState.sessionLength - 1) * 60
                     };
                default:
                    return prevState;  // Always return the previous state if no case matches
            }
        });
    }

    decrement(id) {
        this.setState(prevState => {
            switch (id) {
                case "breakDecrement":
                    return { breakLength: Math.max(prevState.breakLength - 1, 1) };  // Prevent negative or zero length
                case "sessionDecrement":
                    return { sessionLength: Math.min(prevState.sessionLength - 1, 60),
                            timeLeft: (prevState.sessionLength - 1) * 60};
                default:
                    return prevState;
            }
        });
    }

    buttonPressed(button){
        audio.pause();
        switch (button){
            case "start":
                if(!this.state.timerRunning){
                    this.setState({timerRunning: true});
                    this.interval = setInterval(() => {
                        this.setState(prevState =>{
                            if(prevState.timeLeft <= 0){
                                clearInterval(this.interval);
                                audio.play(); 
                                const newSession = !prevState.timerSession;
                                return {
                                    timerSession: newSession,
                                    timeLeft: newSession ? prevState.sessionLength * 60 : prevState.breakLength * 60,
                                    timerRunning: false
                                }
                            }
                            return {timeLeft: prevState.timeLeft - 1};
                        })
                    }, 1000)
                }
                break;
            case "stop":
                if(this.state.timerRunning){
                    clearInterval(this.interval);
                    this.setState({ timerRunning: false });
                }
                break;
            case "reset":
                clearInterval(this.interval);
                this.setState({
                    timeLeft: this.state.sessionLength * 60,
                    timerRunning: false,
                    timerSession: true
                });
                break;
            default:
                break;
        }

    }

    componentWillUnmount() {
        clearInterval(this.interval);  // Clear interval if component is unmounted
    }

    render() {
        const currentSitutation = this.state.timerSession ? "Session" : "Break";

        const minutes = Math.floor(this.state.timeLeft / 60);
        const seconds = this.state.timeLeft % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        return (
            <div id="container">
                <div id="title">Pomodoro Clock</div>
                <div className="lengthControls">
                    <div className="lengthControl">
                        <div className="control-label">Break Length</div>
                        <button id="breakIncrement" className="controlIncrement" onClick={() => this.increment("breakIncrement")}><i className="fas fa-arrow-up fa-2x"></i></button>
                        <div className="control-length">{this.state.breakLength}</div>
                        <button id="breakDecrement" className="controlDecrement" onClick={() => this.decrement("breakDecrement")}><i className="fas fa-arrow-down fa-2x"></i></button>
                    </div>
                    <div className="lengthControl">
                        <div className="control-label">Session Length</div>
                        <button id="sessionIncrement" className="controlIncrement" onClick={() => this.increment("sessionIncrement")}><i className="fas fa-arrow-up fa-2x"></i></button>
                        <div className="control-length">{this.state.sessionLength}</div>
                        <button id="sessionDecrement" className="controlDecrement" onClick={() => this.decrement("sessionDecrement")}><i className="fas fa-arrow-down fa-2x"></i></button>
                    </div>
                </div>
                <div id="timer">
                    <div id="timerWrapper">
                        <div id="timer-label" className={currentSitutation}>{currentSitutation}</div>
                        <div id="timer-left">{formattedTime}</div>
                    </div>
                    <div id="timer-control">
                        <button id="start" onClick={() => this.buttonPressed("start")}><i className="fas fa-play fa-2x"></i></button>
                        <button id="stop" onClick={() => this.buttonPressed("stop")}><i className="fas fa-pause fa-2x"></i></button>
                        <button id="reset" onClick={() => this.buttonPressed("reset")}><i className="fas fa-sync-alt fa-2x"></i></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PomodoroClock;
