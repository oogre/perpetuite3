"use strict";

var _sdl = _interopRequireDefault(require("@kmamal/sdl"));
var _UI = _interopRequireDefault(require("./UI"));
var _enum = _interopRequireDefault(require("enum"));
var _Gamepad = _interopRequireDefault(require("./Gamepad"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
process.title = "ui.perpetuite3";
const RobotStatus = new _enum.default(['NOT_CONNECTED', 'NOT_HOMED', 'RUNNING', 'ERROR']);
const CameraStatus = new _enum.default(['NOT_CONNECTED', 'RUNNING', 'ERROR']);
const config = {
  window: {
    title: process.title,
    width: 1200,
    height: 400
  },
  controller: {
    name: "xBox",
    axes: [{
      name: "STICK LEFT",
      values: [{
        name: "Horizontal",
        position: 0.5
      }, {
        name: "Vertical",
        position: 0.5
      }]
    }, {
      name: "STICK RIGHT",
      values: [{
        name: "Horizontal",
        position: 0.5
      }, {
        name: "Vertical",
        position: 0.5
      }]
    }, {
      name: "B TRIG",
      values: [{
        name: "LEFT",
        position: 0
      }, {
        name: "RIGHT",
        position: 0
      }]
    }, {
      name: "T TRIG",
      values: [{
        name: "LEFT",
        position: 0
      }, {
        name: "RIGHT",
        position: 0
      }]
    }, {
      name: "A",
      position: 0
    }, {
      name: "B",
      position: 0
    }, {
      name: "X",
      position: 0
    }, {
      name: "Y",
      position: 0
    }]
  },
  robots: [{
    name: "Horizontal",
    status: RobotStatus.NOT_CONNECTED,
    host: "169.254.80.39",
    port: 502,
    position: 0,
    speed: 0
  }, {
    name: "Vertical",
    status: RobotStatus.NOT_CONNECTED,
    host: "169.254.80.39",
    port: 502,
    position: 0,
    speed: 0
  }],
  camera: {
    name: "Panasonic AW-UE100",
    status: CameraStatus.NOT_CONNECTED,
    host: "192.168.0.10",
    port: 80,
    axes: [{
      name: "Pan",
      position: 0,
      speed: 0
    }, {
      name: "Tilt",
      position: 0,
      speed: 0
    }, {
      name: "Zoom",
      position: 0,
      speed: 0
    }, {
      name: "Iris",
      position: 0,
      speed: 0
    }]
  }
};
const window = _sdl.default.video.createWindow(config.window);
const gamepad = new _Gamepad.default(_sdl.default.joystick.devices, {
  name: 'Xbox One Controller'
});
gamepad.on(_Gamepad.default.EVENT_DESC.JOYSTICK_LEFT, async event => {
  console.log(event);
  if (event.axis == 0) {
    config.controller.axes[0].values[0].position = event.value * 0.5 + 0.5;
  } else if (event.axis == 1) {
    config.controller.axes[0].values[1].position = event.value * -0.5 + 0.5;
  }
}).on(_Gamepad.default.EVENT_DESC.JOYSTICK_RIGHT, async event => {
  if (event.axis == 2) {
    config.controller.axes[1].values[0].position = event.value * 0.5 + 0.5;
  } else if (event.axis == 3) {
    config.controller.axes[1].values[1].position = event.value * -0.5 + 0.5;
  }
}).on(_Gamepad.default.EVENT_DESC.LEFT_TRIGGER, async event => {
  config.controller.axes[2].values[0].position = event.value;
}).on(_Gamepad.default.EVENT_DESC.RIGHT_TRIGGER, async event => {
  config.controller.axes[2].values[1].position = event.value;
}).on(_Gamepad.default.EVENT_DESC.UP_LEFT_PRESS, async event => {
  config.controller.axes[3].values[0].position = 1;
}).on(_Gamepad.default.EVENT_DESC.UP_LEFT_RELEASE, async event => {
  config.controller.axes[3].values[0].position = 0;
}).on(_Gamepad.default.EVENT_DESC.UP_RIGHT_PRESS, async event => {
  config.controller.axes[3].values[1].position = 1;
}).on(_Gamepad.default.EVENT_DESC.UP_RIGHT_RELEASE, async event => {
  config.controller.axes[3].values[1].position = 0;
}).on(_Gamepad.default.EVENT_DESC.A_PRESS, async event => {
  config.controller.axes[4].position = 1;
}).on(_Gamepad.default.EVENT_DESC.A_RELEASE, async event => {
  config.controller.axes[4].position = 0;
}).on(_Gamepad.default.EVENT_DESC.B_PRESS, async event => {
  config.controller.axes[5].position = 1;
}).on(_Gamepad.default.EVENT_DESC.B_RELEASE, async event => {
  config.controller.axes[5].position = 0;
}).on(_Gamepad.default.EVENT_DESC.X_PRESS, async event => {
  config.controller.axes[6].position = 1;
}).on(_Gamepad.default.EVENT_DESC.X_RELEASE, async event => {
  config.controller.axes[6].position = 0;
}).on(_Gamepad.default.EVENT_DESC.Y_PRESS, async event => {
  config.controller.axes[7].position = 1;
}).on(_Gamepad.default.EVENT_DESC.Y_RELEASE, async event => {
  config.controller.axes[7].position = 0;
});

/*
const ui = new UI(window);
ui.draw = ()=>{
  //CONTROLLER STUFF
  {
    const columnWidth = (ui.width - 20)/(config.controller.axes.length);
    const y = 0;
    const x = columnWidth * (config.controller.axes.length / 2) - 50;
    ui.text( x, y + 20, "CONTROLLER");
    ui.text( x, y + 35, config.controller.name);
    config.controller.axes.map((axis, k) =>{
       const x = 10 + columnWidth * k
        ui.text(x, y + 50, axis.name);
      if(axis.values){
        axis.values.map((value, n)=>{
          ui.text(x, y + 65 + (n+1) * 15+ (n) * 30 + n * 15, value.name);
          ui.slider(x, y + 65 + (n+1) * 15 + (n+1) * 30, false, value.position);  
        });
      }else{
        ui.text(x, y + 50, axis.name);
        ui.slider(x, y + 80, false, axis.position);  
      }
    })
  }

  const columnWidth = (ui.width - 20)/(config.robots.length + config.camera.axes.length);
  const y = ui.height/2;
  // ROBOT STUFF
  {
    const x = columnWidth * (config.robots.length / 2) - 50;
    ui.text( x, y + 20, "ROBOTS");
    config.robots.map((robot, k) =>{
      const x = 10 + columnWidth * k
      ui.text(x, y + 35, robot.name);
      ui.text(x, y + 50, `${robot.host}:${robot.port}`);
      if(robot.status == RobotStatus.NOT_CONNECTED){
        ui.checkBox(x, y + 80, "Connection", false)
        .ifMouseRelease(()=>{
          // LAUNCH CONNECTION PROCESS
          robot.status = RobotStatus.NOT_HOMED
        }) 
      }else if(robot.status == RobotStatus.NOT_HOMED){
        ui.checkBox(x, y + 80, "Homing", false)
        .ifMouseRelease(()=>{
          // LAUNCH HOME PROCESS
          robot.status = RobotStatus.RUNNING
        });
      }else if(robot.status == RobotStatus.RUNNING){
        ui.slider(x, y + 80, "position", robot.position);
        ui.slider(x, y + 110, "speed", robot.speed);
      }  
    });
  }

  // CAMERA STUFF
  {
    const x = columnWidth * (config.robots.length + config.camera.axes.length / 2) - 50;
    ui.text(x, y + 20, "CAMERA");
    ui.text(x, y + 35, config.camera.name);
    ui.text(x, y + 50, `${config.camera.host}:${config.camera.port}`);
    if(config.camera.status == CameraStatus.NOT_CONNECTED){
      ui.checkBox(x, y + 80, "Connection", false)
        .ifMouseRelease(()=>{
          // LAUNCH CONNECTION PROCESS
          config.camera.status = CameraStatus.RUNNING
        }) 
    }else if(config.camera.status == CameraStatus.RUNNING){
      config.camera.axes.map((axis, k) =>{
        const x = 10 + columnWidth * (k + config.robots.length)
        ui.text(x, y + 80, axis.name);
        ui.slider(x, y + 95, "position", axis.position);
        ui.slider(x, y + 125, "speed", axis.speed);
      });
    }
  }
}*/

process.on('SIGINT', async () => {
  ui.close();
  process.exit();
});
window.on('close', async () => {
  ui.close();
  process.exit();
});