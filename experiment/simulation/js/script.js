let triggerBtn;
    let triggerStatus;
    let trigger = true;

// var canvas = document.querySelector("#simscreen");
// var ctx = canvas.getContext("2d");
const btnStart = document.querySelector(".btn-start");
const btnReset = document.querySelector(".btn-reset");
const voltageButtons = document.querySelectorAll(".voltage");
const vfspinner = document.querySelector("#vfspinner");
const temperature1 = document.querySelector("#temp1");
const temperature2 = document.querySelector("#temp2");
const temperature3 = document.querySelector("#temp3");
const temperature4 = document.querySelector("#temp4");
const temperature5 = document.querySelector("#temp5");
const temperature6 = document.querySelector("#temp6");
const temperature7 = document.querySelector("#temp7");
const temperature8 = document.querySelector("#temp8");
const btnCheck1 = document.querySelector(".btn-check1");
const btnCheck2 = document.querySelector(".btn-check2");
const btnCheck3 = document.querySelector(".btn-check3");
const btnCheck4 = document.querySelector(".btn-check4");
const btnCheck5 = document.querySelector(".btn-check5");

btnStart.addEventListener("click", initiateProcess);
btnReset.addEventListener("click", resetAll);
voltageButtons.forEach((voltage) =>
  voltage.addEventListener("click", () => setVoltage(voltage))
);

let steadyState = 0;
let currentVoltage = 0;
//controls section
let v = 0;
// let vf = 0;

// var canvas;
// var ctx;


//timing section
let simTimeId = setInterval("", "1000");
let TimeInterval = setInterval("", "1000");
let TimeInterval1 = setInterval("", "1000");
let time = 0;
let time1 = 0;
let time2 = 0;

//point tracing section and initial(atmospheric section)
let t1 = [26, 26, 27, 27.5, 26.5, 27, 28, 36];
// let th = [55, 55, 55, 55, 55];
let off = [0, 0, 0, 0, 0, 0, 0, 0];
let slope = [-282.86, -315.71, -354.29];
let k = [40.83, 37.99, 37.61];
var beta = 0.003038;
var gr = 4.37;
var nu = 87.51;
var h = 5.01;
var qc = 13.85;
//temporary or dummy variables for locking buttons
let temp = 0;
let temp1 = 2;
let temp2 = 0;
let tempslope = 0;
let tempk = 0;


function displayDiv(ele) {
  const taskScreen = document.querySelectorAll(".task-screen");
  taskScreen.forEach((task) => {
    task.classList.add("hide");
  });
  if (ele.classList.contains("tool-objective")) {
    document.querySelector(".objective").classList.remove("hide");
  }
  if (ele.classList.contains("tool-description")) {
    document.querySelector(".description").classList.remove("hide");
  }
  if (ele.classList.contains("tool-explore")) {
    document.querySelector(".explore").classList.remove("hide");
    document.querySelector(".extra-info").classList.add("hide");
    if (temp2 !== 1) {
      drawModel();
      startsim();
      varinit();
    }
  }
  if (ele.classList.contains("tool-practice")) {
    document.querySelector(".practice").classList.remove("hide");
    document.querySelector(".extra-info").classList.remove("hide");
    if (temp2 == 1) {
      temp1 = 1;
      validation();
      document.querySelector("#info").innerHTML = "Temperature distribution";
    } else {
      document.querySelector("#info").innerHTML =
        "Perform the experiment to solve the questions";
      document.querySelector(".graph-div").classList.add("hide");
      document.querySelector(".questions").classList.add("hide");
      document.querySelector(".extra-info").classList.add("hide");
    }
  }
}
function offset() {
  if (currentVoltage == 10.81) {
    //path = "./images//currentVoltage1.jpg";
    off[0] = 3;
    off[1] = 5.8;
    off[2] = 9.2;
    off[3] = 11.7;
    off[4] = 12.9;
    off[5] = 13;
    off[6] = 13.2;
    off[7] = 0;
  } 
  
}

function simperiod() {
  if (time1 >= 5.0) {
    clearInterval(TimeInterval);
    clearInterval(TimeInterval1);
    time1 = 0;
    time2 = 0;
    temp1 = 0;
    temp2 = 1;
  } else {
    drawGradient();
    draw_array();
    steadyState = 5 - Math.round(time1);
    const commentElement = document.querySelector(".comment");

    if (steadyState > 0) {
      commentElement.innerHTML = `Wait for ${steadyState} seconds for steady state`;
      btnReset.setAttribute("disabled", true);
    } else {
      temp2 = 0;
      commentElement.innerHTML = `The steady state is achieved`;
      btnReset.removeAttribute("disabled");
    }
  }
}
//Change in Variables with respect to time
function varinit() {
  $('#vfslider').slider("value", v);
  // $("#vfspinner").spinner("value", v);
  console.log(currentVoltage, temperature1);
  if (time2 > 0) { t1[0] += off[0]; };
  if (time2 > 0) { t1[1] += off[1]; };
  if (time2 > 0) { t1[2] += off[2]; };
  if (time2 > 0) { t1[3] += off[3]; };
  if (time2 > 0) { t1[4] += off[4]; };
  if (time2 > 0) { t1[5] += off[5]; };
  if (time2 > 0) { t1[6] += off[6]; };
  // if (time2 > 0) { t1[7] += off[7]; };

  // vfspinner.textContent = vf;
  temperature1.textContent = t1[0].toFixed(2);
  temperature2.textContent = t1[1].toFixed(2);
  temperature3.textContent = t1[2].toFixed(2);
  temperature4.textContent = t1[3].toFixed(2);
  temperature5.textContent = t1[4].toFixed(2);
  temperature6.textContent = t1[5].toFixed(2);
  temperature7.textContent = t1[6].toFixed(2);
  temperature8.textContent = t1[7].toFixed(2);
}

// //water temperature changes
// function watertemp() {
//   switch (vf) {
//     case 26:
//       t1[6] += 2.2;
//       break;
//     case 54:
//       t1[6] += 1.2;
//       break;
//     case 60:
//       t1[6] += 1.2;
//       break;
//   }
// }

//stops simulations

//draw gradient w.r.t. time in thermometer water flow and heater
function drawGradient() {
  //heater simulation
  var h = 400 * time1;
  //create gradient
  var grd1 = ctx.createLinearGradient(0, 0, h, 0)
  grd1.addColorStop(0, "red");
  grd1.addColorStop(1, "white");
  // Fill with gradient
  ctx.fillStyle = grd1;
  ctx.fillRect(380.5, 98, 3, 375);


  //outer parallel tube simulation
  var t1 = 110 * time1;
  //create gradient
  var grd2 = ctx.createLinearGradient(0, 0, t1, 0)
  grd2.addColorStop(0, "#FF0000");
  grd2.addColorStop(1, "white");
  // Fill with gradient
  ctx.fillStyle = grd2;
  ctx.fillRect(387, 98, 39.5, 375);


  var t6 = 50 * time1;
  var y6 = 500 - t6;

  //create gradient
  var grd3 = ctx.createLinearGradient(500, 0, y6, 0)
  grd3.addColorStop(0, "#FF0000");
  grd3.addColorStop(1, "white");
  //Fill with gradient
  ctx.fillStyle = grd3;
  ctx.fillRect(375.5, 98, -39.5, 375);

  //create gradient
  // var grd4 = ctx.createLinearGradient(0, 0, 0, 0)
  // grd4.addColorStop(0, "blue");
  // grd4.addColorStop(1, "white");
  // //Fill with gradient
  // ctx.fillStyle = grd4;
  // ctx.fillRect(259.5, 60, -39.5, 375)
}



function draw_array() {
  ctx.beginPath();
  let y = time1 * 100;
  
  ctx.fillStyle = 'white';
  ctx.fillRect(289, 0, 15, 600);
  ctx.fillRect(469, 0, 15, 600);

  // Update arrow positions for the first red rectangle at x = 289
  ctx.moveTo(295, (400 - time1 * 200));
  ctx.lineTo(295, (360 - time1 * 200));
  ctx.lineTo(290, (370 - time1 * 200));
  ctx.moveTo(295, (360 - time1 * 200));
  ctx.lineTo(300, (370 - time1 * 200));

  ctx.moveTo(295, (400 - (time1 - 2) * 200));
  ctx.lineTo(295, (360 - (time1 - 2) * 200));
  ctx.lineTo(290, (370 - (time1 - 2) * 200));
  ctx.moveTo(295, (360 - (time1 - 2) * 200));
  ctx.lineTo(300, (370 - (time1 - 2) * 200));

  // Update arrow positions for the second red rectangle at x = 469
  ctx.moveTo(475, (400 - time1 * 200));
  ctx.lineTo(475, (360 - time1 * 200));
  ctx.lineTo(470, (370 - time1 * 200));
  ctx.moveTo(475, (360 - time1 * 200));
  ctx.lineTo(480, (370 - time1 * 200));

  ctx.moveTo(475, (400 - (time1 - 2) * 200));
  ctx.lineTo(475, (360 - (time1 - 2) * 200));
  ctx.lineTo(470, (370 - (time1 - 2) * 200));
  ctx.moveTo(475, (360 - (time1 - 2) * 200));
  ctx.lineTo(480, (370 - (time1 - 2) * 200));

  ctx.stroke();
}

// initial model
function drawModel() {
  // Get the canvas element and context
  canvas = document.getElementById("simscreen");
  ctx = canvas.getContext("2d");
  
  // Clear the complete canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // New dimensions for scaling
  const originalWidth = 550;
  const originalHeight = 400;
  const scaleX = canvas.width / originalWidth;
  const scaleY = canvas.height / originalHeight;
  const scale = Math.min(scaleX, scaleY);

  // Calculate center offsets
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Define drawing offsets relative to the canvas center
  const offsetX = centerX - (originalWidth * scale) / 2;
  const offsetY = centerY - (originalHeight * scale) / 2;

  // Save the current state of the context
  ctx.save();

  // Apply translation and scaling
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Set the line width for thicker lines
  ctx.lineWidth = 3 / scale;  // Adjust line width according to scale

  // Text elements
  ctx.font = `${22 / scale}px  Nunito`;
  ctx.fillStyle = "black"; // Ensure text color is set

  // Draw text elements
  ctx.fillText("Air flow", 230, 370);
  ctx.fillText("Wooden container", 45, 70);
  ctx.fillText("stainless", 230, 35);
  ctx.fillText("steel tube", 230, 55);

  ctx.fillText("1", 300, 287.5);
  ctx.fillText("2", 300, 255);
  ctx.fillText("3", 300, 222.5);
  ctx.fillText("4", 300, 190);
  ctx.fillText("8", 200, 190);
  ctx.fillText("5", 300, 157.5);
  ctx.fillText("6", 300, 125);
  ctx.fillText("7", 300, 92.5);

  // Thermometers
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.rect(230, 60, 65, 260);
  ctx.rect(260, 60, 5, 260);
  ctx.stroke();

  ctx.beginPath();
  ctx.rect(230, 60, 65, 260);
  ctx.rect(260, 60, 5, 260);
  ctx.stroke();
  ctx.beginPath()
  ctx.moveTo(50, 40);
  ctx.lineTo(180, 40);
  //ctx.moveTo(105, 60);
  ctx.lineTo(180, 340);
  //ctx.moveTo(155, 60);
  ctx.lineTo(50, 340);

  ctx.moveTo(480, 40);
  ctx.lineTo(350, 40);
  ctx.lineTo(350, 340);
  ctx.lineTo(480, 340);

  //array 


  ctx.stroke();
  // Draw gradient
  drawGradient();

  // Restore the saved state of the context
  ctx.restore();
}

function comment1() {
  if (currentVoltage != 0) {
    time = 0;
    temp = 1;
    clearInterval(simTimeId);
    //printcomment("start simulation", 0);
    // if (currentVoltage == 10.81) {
    //   // vf = 26;
    // } 
    // else if (currentVoltage == 20) {
    //   vf = 54;
    // } else if (currentVoltage == 30) {
    //   vf = 60;
    // }
    offset();
  }
}

//offset for thermometer and temp change

function setVoltage(ele) {
  currentVoltage = Number(ele.value);
  btnStart.removeAttribute("disabled");
}

function startsim() {
  simTimeId = setInterval("time=time+0.1; comment1(); ", "100");
}
function initiateProcess() {
  if (currentVoltage === 0) return;
  btnStart.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => voltage.setAttribute("disabled", true));
  simstate();
}

function simstate() {
  // triggerBtn.classList.add('disabled-btn')
  // trigger=false;
  if (temp == 1) {
    temp = 0;
    temp1 = 1;
    offset();
    TimeInterval = setInterval("time1 = time1 + .1; simperiod();", '100');
    TimeInterval1 = setInterval("time2 = time2 + 1; varinit();", '1000');
  }
}

//Calculations of the experienment
function validation() {
  var datapoints = [];

  for (var i = 1; i <= 7; i++) {
    p = i * 62.5;
    r = t1[i - 1];
    datapoints.push({ x: p, y: r });
  }
  document.querySelector(".graph-div").classList.remove("hide");
  document.querySelector(".questions").classList.remove("hide");
  drawgraph("graph", datapoints, "Length from bottom in mm", "temperatures in deg.");
  if (currentVoltage == 10) {
    tempslope = slope[0];
    tempk = k[0];
  } else if (currentVoltage == 20) {
    tempslope = slope[1];
    tempk = k[1];
  } else if (currentVoltage == 30) {
    tempslope = slope[2];
    tempk = k[2];
  }
  btnCheck1.addEventListener("click", () => validateAnswer1());
  btnCheck2.addEventListener("click", () => validateAnswer2());
  btnCheck3.addEventListener("click", () => validateAnswer3());
  btnCheck4.addEventListener("click", () => validateAnswer4());
  btnCheck5.addEventListener("click", () => validateAnswer5());
  
}

function validateAnswer1() {
  const correctAnswer = document.querySelector(".correct-answer1");
  const unit = document.querySelector(".question-unit1");
  unit.innerHTML = `<sup></sup>1/K`;
  let userEnteredValue = Number(
    document.querySelector(".question-input1").value
  );
  let answer = userEnteredValue === beta ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span> beta = ${beta} <sup></sup>1/K `;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateAnswer2() {
  const correctAnswer = document.querySelector(".correct-answer2");
  const unit = document.querySelector(".question-unit2");
  unit.innerHTML = ``;
  let userEnteredValue = Number(
    document.querySelector(".question-input2").value
  );
  let answer = userEnteredValue === gr ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span> Gr = ${gr} `;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateAnswer3() {
  const correctAnswer = document.querySelector(".correct-answer3");
  const unit = document.querySelector(".question-unit3");
  unit.innerHTML = ``;
  let userEnteredValue = Number(
    document.querySelector(".question-input3").value
  );
  let answer = userEnteredValue === nu ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span> Nu = ${nu} `;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateAnswer4() {
  const correctAnswer = document.querySelector(".correct-answer4");
  const unit = document.querySelector(".question-unit4");
  unit.innerHTML = `W/m<sup>2</sup> K`;
  let userEnteredValue = Number(
    document.querySelector(".question-input4").value
  );
  let answer = userEnteredValue === h ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span> h = ${h} W/m<sup>2</sup> K `;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateAnswer5() {
  const correctAnswer = document.querySelector(".correct-answer5");
  const unit = document.querySelector(".question-unit5");
  unit.innerHTML = `W`;
  let userEnteredValue = Number(
    document.querySelector(".question-input5").value
  );
  let answer = userEnteredValue === qc ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span> Qc = ${qc} W `;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function resetAll() {
  btnStart.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => {
    voltage.removeAttribute("disabled");
    voltage.checked = false;
  });
  document.querySelector(".comment").innerHTML = "";
  temp2 = 0;
  temp1 = 2;
  t1 = [26, 26, 27, 27.5, 26.5, 27, 28, 36];
  off = [0, 0, 0, 0, 0, 0, 0, 0];
  th = [45, 45, 45, 45, 45];
  currentVoltage = 0;
  document.querySelector(".correct-answer1").innerHTML = "";
  document.querySelector(".question-unit1").innerHTML = `<sup>&deg;</sup>C/m`;
  document.querySelector(".question-input1").value = "";
  document.querySelector(".correct-answer2").innerHTML = "";
  document.querySelector(".question-unit2").innerHTML = `W/m.K`;
  document.querySelector(".question-input2").value = "";
  document.querySelector(".correct-answer3").innerHTML = "";
  document.querySelector(".question-unit3").innerHTML = `W/m.K`;
  document.querySelector(".question-input3").value = "";
  varinit();
  startsim();
  drawModel();
}

function movetoTop() {
  practiceDiv.scrollIntoView();
}
