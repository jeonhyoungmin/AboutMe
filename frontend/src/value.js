const cameraValue = {
  fov: 50,
  near: 0.1,
  far: 10000,
  positionX: 0,
  positionY: 15,
  positionZ: -20,
};

const ambientLightValue = {
  on: true,
  color: 0xffffff,
  intensity: 1,
};

const shadowLightValue = {
  on: true,
  color: 0xffffff,
  intensity: 1,
  positionX: -2000,
  positionY: 2000,
  positionZ: 1000,
  targetX: -1000,
  targetY: 0,
  targetZ: -2000,
  castShadow: true,
  width: 2000,
  height: 1000,
  TopRight: 5000,
  BottomLeft: -3000,
  near: 10,
  far: 3500,
  radius: 5,
  helperSize: 10,
};

const addPointLightValue = {
  on: false,
  color: 0xffffff,
  intensity: 1.5,
  distance: 1000,
  sphereSize: 10,
};

const spaceValue = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
};

const characterValue = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  capsuleStart: 90.9 / 2,
  capsuleEnd: 259 - 90.9 / 2,
  capsuleRadius: 90.9 / 2,
  axisHelper: 10000,
  maxRunSpeed: 100,
  maxRunAcceleration: 50,
  maxSpeed: 50,
  maxAcceleration: 25,
};

export {
  cameraValue,
  ambientLightValue,
  shadowLightValue,
  addPointLightValue,
  spaceValue,
  characterValue,
};
