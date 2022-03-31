//Starting with credits
//A frame boiler plate from ngokevin

import "aframe";
import "aframe-animation-component";
import "aframe-particle-system-component";
import "babel-polyfill";
import { Entity, Scene } from "aframe-react";
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.displayRandom = [];
    this.findThis = [];
    
    //where the data are
    this.state = {
      remaining: 5,
      displayData: this.displayRandom,
      toFind: this.findThis,
      color: "red",
      colors: ["red", "orange", "yellow", "green", "blue"],
      minutes: 1,
      seconds: 0,
      minuteComp: 0,
      secondComp: 0,
      succeed : false,
      ypos: [this.randomXpos(3,1),this.randomXpos(3,1),this.randomXpos(3,1),this.randomXpos(3,1),this.randomXpos(3,1)],
     
    };
  }

  
  //Where I will set up the components
  componentDidMount() {
    console.log("start")
    this.mainLoop(20);
    for (let i = 0; i < 201; i++) {
      this.displayRandom.push(
        <Entity
          id="box"
          // animation__rotate={{
          //   property: "rotation",
          //   dur: 2000,
          //   loop: true,
          //   to: "360 360 360",
          // }}
          geometry={{ primitive: "box", roughness: 0.5 }}
          material={{ color: this.state.color, opacity: 0.9 }}
          position={{
            x: this.randomXpos(20, -20),
            y: this.randomXpos(3, 1),
            z: this.randomXpos(20, -20),
          }}
        ></Entity>
      );
     
    }
    for(let i =0;i<5;i++){
      
      this.findThis.push(
        <Entity
          id="box"
          key = {i}
          geometry={{ primitive: "box", width: 0.5, height: 0.5 }}
          material={{ color: "red", opacity: 1 }}
          position={{
            x: this.randomXpos(10, -10),
            y: this.state.ypos[i],
            z: this.randomXpos(10, -10),
          }}
          events={{
            click: () => {
              console.log("working")
              
              
              if(this.state.ypos[i] !== -99){
                this.setState({
                  remaining : this.state.remaining -1
                })
              }
              else{
                this.changeColor();
              }
              if(this.state.remaining === 0){
                this.setState({
                  minuteComp : this.state.minutes,
                  secondComp: this.state.seconds,
                  succeed : true
                })
              }
              let array = this.state.ypos;
              array[i] = -99;
              this.setState({
                ypos : array
              })
              console.log(this.state.remaining);
            },
          }}
        ></Entity>
      );
    }
    this.setState({
      toFind: this.findThis,
      displayData: this.displayRandom,
    });
  }

  changeColor() {
    this.setState({
      color:
        this.state.colors[Math.floor(Math.random() * this.state.colors.length)],
    });
  }

  randomXpos(max, min) {
    return Math.random() * (max - min + 1) + min;
  }

  //main loop 1-60 
  //each time call method delay 
  mainLoop(second){
    for(let i =0;i<second;i++){
      
      this.delay();
      console.log("1 second passed")
    }
    console.log("Finished")

  }
  //simulate one second
  delay(){
    for(let i=0;i<100000000;i++){
    }
  }


  //timer function
  timerStart() {
    this.myInterval = setInterval(() => {
      const { seconds, minutes } = this.state;
      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1,
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.myInterval);
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59,
          }));
        }
      }
    }, 1000);
  }
  

  render() {
    return (
      <Scene>
        {/* Loading the assets */}
        <a-assets>
          <img
            id="groundTexture"
            src="https://cdn.aframe.io/a-painter/images/floor.jpg"
          />
          <img
            id="skyTexture"
            src="https://cdn.aframe.io/a-painter/images/sky.jpg"
          />
        </a-assets>

        {/* The backgrounds */}
        <Entity
          primitive="a-plane"
          src="#groundTexture"
          rotation="-90 0 0"
          height="100"
          material={{ color: this.state.color }}
          width="100"
        />
        <Entity primitive="a-light" type="ambient" color="#445451" />
        <Entity
          primitive="a-light"
          type="point"
          intensity="2"
          position="2 4 4"
        />
        <Entity
          primitive="a-sky"
          height="2048"
          radius="30"
          src="#skyTexture"
          theta-length="90"
          width="2048"
        />
        <Entity particle-system={{ preset: "snow", particleCount: 2000 }} />

        {/* Main Text */}
        <Entity
          text={{
            value: `You need to find ${this.state.remaining} more red squares`,
            align: "center",
          }}
          position={{ x: 0, y: 3, z: -1 }}
        />
        <Entity
          text={{
            value: `You have ${this.state.minutes} Minute and ${
              this.state.seconds > 10
                ? `${this.state.seconds} Seconds`
                : `${this.state.seconds} Second`
            }`,
            align: "center",
          }}
          position={{ x: 0, y: 2.5, z: -1 }}
        />
        <Entity
          text={{
            value: `You have Completed the challenge at ${this.state.minuteComp} Minute and ${
              this.state.secondComp > 10
                ? `${this.state.secondComp} Seconds`
                : `${this.state.secondComp} Second`
            }`,
            align: "center",
          }}
          position={{ x: 0, y: 2.3, z: -1 }}
        />
        <Entity
          text={{
            value: `Find the odd ones  `,
            align: "center",
          }}
          position={{ x: 0, y: 2, z: -1 }}
        />

        {/* Main shit */}
        <Entity
          geometry={{ primitive: "circle" }}
          material={{ color: "red", roughness: 0.5 }}
          position={{ x: 0, y: 2, z: -1 }}
          events={{ click: this.timerStart.bind(this) }}
        />
        { this.state.succeed ? " ":
        
        this.state.displayData}
        {this.state.toFind}

        {/* Below is the camera */}
        <Entity primitive="a-camera">
          <Entity
            primitive="a-cursor"
            animation__click={{
              property: "scale",
              startEvents: "click",
              from: "0.1 0.1 0.1",
              to: "1 1 1",
              dur: 150,
            }}
          />
        </Entity>
      </Scene>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#sceneContainer"));
