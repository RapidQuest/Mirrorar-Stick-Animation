const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const face = new Image();
face.src = "./assets/face.svg";

let index = 0;
let playing = true;
let predictions;
let playInterval;
let data;

const angleMap = {
  trunk: ["pelvis", "thorax"],
  leftHip: ["leftHip", "leftKnee"],
  rightHip: ["rightHip", "rightKnee"],
  head: ["neck", "head"],
  rightPelvis: ["rightHip", "pelvis"],
  leftPelvis: ["leftHip", "pelvis"],
  leftKnee: ["leftKnee", "leftAnkle"],
  rightKnee: ["rightKnee", "rightAnkle"],
  rightShoulder: ["rightShoulder", "rightElbow"],
  leftShoulder: ["leftShoulder", "leftElbow"],
  rightElbow: ["rightElbow", "rightWrist"],
  leftElbow: ["leftElbow", "leftWrist"],
};

const jointMap = {
  rightAnkle: 0,
  rightKnee: 1,
  rightHip: 2,
  leftHip: 3,
  leftKnee: 4,
  leftAnkle: 5,
  pelvis: 6,
  thorax: 7,
  neck: 8,
  head: 9,
  rightWrist: 10,
  rightElbow: 11,
  rightShoulder: 12,
  leftShoulder: 13,
  leftElbow: 14,
  leftWrist: 15,
};

fetch("data/balance-test-new.json")
  .then((response) => response.json())
  .then((json) => {
    data = json;
    main();
  });

function main() {
  predictions = data.predictions;
  playInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFigure(index);
    index++;
  }, 25);
  // drawFigure(353);

  console.log(predictions);
}

function drawFigure(i) {
  if (!predictions[i]) {
    index = 0;
    return;
  }

  const joints = predictions[i].joints;
  const distanceBetweenShoulders =
    joints[jointMap["leftShoulder"]].x - joints[jointMap["rightShoulder"]].x;
  let defaulRectWidth = 15;

  for (const angle in angleMap) {
    if (
      angle === "head" ||
      angle === "trunk" ||
      angle === "rightPelvis" ||
      angle === "leftPelvis"
    ) {
      continue;
    }

    if (angle === "leftElbow" || angle === "rightElbow") {
      defaulRectWidth = 10;
    }

    const origin = angleMap[angle][0];
    const target = angleMap[angle][1];

    const origin_point = joints[jointMap[origin]]; // userJoints[14]
    const target_point = joints[jointMap[target]]; // userJoints[15]

    const x1 = origin_point.x;
    const y1 = origin_point.y;

    const x2 = target_point.x;
    const y2 = target_point.y;

    let rectWith = (defaulRectWidth * distanceBetweenShoulders) / 110;

    // ctx.beginPath();
    // ctx.arc(x1, y1, 5, 0, 2 * Math.PI);
    // ctx.arc(x2, y2, 5, 0, 2 * Math.PI);
    // ctx.stroke();

    const colorMap = {
      head: "cyan",
      trunk: "#f7f7f7",
      leftPelvis: "#f7f7f7",
      rightPelvis: "#f7f7f7",
      leftShoulder: "#438cf4",
      leftKnee: "black",
      leftElbow: "#f7f7f7",
      leftHip: "black",
      rightShoulder: "#438cf4",
      rightKnee: "black",
      rightElbow: "#f7f7f7",
      rightHip: "black",
    };

    ctx.fillStyle = colorMap[angle];
    ctx.strokeStyle = colorMap[angle];

    ctx.beginPath();
    ctx.moveTo(x1 - rectWith, y1);
    ctx.lineTo(x1 + rectWith, y1);
    ctx.lineTo(x2 + rectWith, y2);
    ctx.lineTo(x2 - rectWith, y2);
    ctx.closePath();
    ctx.fill();
  }

  //drawing neck
  let rectWith = (15 * distanceBetweenShoulders) / 110;
  let x1 = joints[jointMap.neck].x;
  let y1 = joints[jointMap.neck].y;
  let x2 = joints[jointMap.thorax].x;
  let y2 = joints[jointMap.thorax].y;

  ctx.fillStyle = "#f7f7f7";
  ctx.beginPath();
  ctx.moveTo(x1 - rectWith, y1);
  ctx.lineTo(x1 + rectWith, y1);
  ctx.lineTo(x2 + rectWith, y2);
  ctx.lineTo(x2 - rectWith, y2);
  ctx.closePath();
  ctx.fill();

  //drawing chest area
  x1 = joints[jointMap.rightShoulder].x;
  y1 = joints[jointMap.rightShoulder].y;
  x2 = joints[jointMap.leftShoulder].x;
  y2 = joints[jointMap.leftShoulder].y;
  x3 = joints[jointMap.leftHip].x + (distanceBetweenShoulders < 0 ? -15 : 15);
  y3 = joints[jointMap.leftHip].y;
  x4 = joints[jointMap.rightHip].x - (distanceBetweenShoulders < 0 ? -15 : 15);
  y4 = joints[jointMap.rightHip].y;

  ctx.fillStyle = "#438cf4";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.closePath();
  ctx.fill();

  // drawing head
  rectWith = (15 * distanceBetweenShoulders) / 110;
  x1 = joints[jointMap.neck].x;
  y1 = joints[jointMap.neck].y;
  x2 = joints[jointMap.head].x;
  y2 = joints[jointMap.head].y;

  const radius = (y1 - y2) / 2;
  const mid = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };

  ctx.fillStyle = "#f7f7f7";
  ctx.beginPath();
  ctx.arc(mid.x, mid.y, radius + 15, 0, 2 * Math.PI, false);
  ctx.fill();

  //drawing shoes left
  x1 = joints[jointMap.leftKnee].x;
  y1 = joints[jointMap.leftKnee].y;
  x2 = joints[jointMap.leftAnkle].x;
  y2 = joints[jointMap.leftAnkle].y;

  if (distanceBetweenShoulders > 0) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x2 + rectWith, y2);
    ctx.lineTo(x2 + rectWith + 25, y2 + 25);
    ctx.lineTo(x2 + rectWith + 25, y2 + 35);
    ctx.lineTo(x2 - rectWith + 15, y2 + 35);
    ctx.lineTo(x2 - rectWith, y2);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x2 + rectWith, y2);
    ctx.lineTo(x2 + rectWith - 25, y2 + 25);
    ctx.lineTo(x2 + rectWith - 25, y2 + 35);
    ctx.lineTo(x2 - rectWith - 15, y2 + 35);
    ctx.lineTo(x2 - rectWith, y2);
    ctx.closePath();
    ctx.fill();
  }

  //drawing shoes left
  x1 = joints[jointMap.rightKnee].x;
  y1 = joints[jointMap.rightKnee].y;
  x2 = joints[jointMap.rightAnkle].x;
  y2 = joints[jointMap.rightAnkle].y;

  if (distanceBetweenShoulders > 0) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x2 + rectWith, y2);
    ctx.lineTo(x2 + rectWith + 25, y2 + 25);
    ctx.lineTo(x2 + rectWith + 25, y2 + 35);
    ctx.lineTo(x2 - rectWith + 15, y2 + 35);
    ctx.lineTo(x2 - rectWith, y2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
  } else {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x2 + rectWith, y2);
    ctx.lineTo(x2 + rectWith - 25, y2 + 25);
    ctx.lineTo(x2 + rectWith - 25, y2 + 35);
    ctx.lineTo(x2 - rectWith - 15, y2 + 35);
    ctx.lineTo(x2 - rectWith, y2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
  }

  // ctx.fill();
}

canvas.addEventListener("click", () => {
  if (playing) {
    clearInterval(playInterval);
  } else {
    main();
  }
  playing = !playing;
});
