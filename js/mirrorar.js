/* Copyright 2022 MirrorAR LLC - All Rights Reserved */

var user_joints;

function clearSvg(){
      $('#svg').empty();

}

function drawCircle(x,y,r=5,color='black',fill="transparent"){
    var newCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    newCircle.setAttribute("stroke", color) 
    newCircle.setAttribute("stroke-width","2")
    newCircle.setAttribute("fill",fill)
    newCircle.setAttribute("r",r)
    newCircle.setAttribute("cx",x)
    newCircle.setAttribute("cy",y)
    $("#svg").append(newCircle);

}

function drawLine(x1,y1,x2,y2,color='black',fill="transparent",dasharray=""){
    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    newLine.setAttribute("stroke", color) 
    newLine.setAttribute("stroke-width","2")
    newLine.setAttribute("fill",fill)
    newLine.setAttribute("stroke-dasharray",dasharray)
    newLine.setAttribute("x1",x1)
    newLine.setAttribute("y1",y1)
    newLine.setAttribute("x2",x2)
    newLine.setAttribute("y2",y2)
 
    $("#svg").append(newLine);

}


function getDrawPoints(drawPointsArray){

	if(!drawPointsArray){
		console.log("Failed to parse",drawPointsArray)
    return;
	}
	user_joints = drawPointsArray["joints"]
  console.log("user_joints is",user_joints)

  // if(!scaled_user_joints){
  //   scaled_user_joints = _.cloneDeep(user_joints)
  // }

  //scaleUserJoints(user_joints)
  
  clearSvg()

  for (var i = user_joints.length - 1; i >= 0; i--) {
    orignal_joint = user_joints[i]

    x = (orignal_joint["x"]) 
    y = (orignal_joint["y"]) 
    drawCircle(x,y,2,"red")

  }
}


function updateData(userData,index){

  setTimeout(function() { 
    getDrawPoints(JSON.stringify(userData))
  },132*index)

}

function simulateData(file_path){
  
  $.getJSON(file_path, function( userData ) {
    console.log(userData)


    $("#dataRange").attr({"max":userData["predictions"].length})

    $('#dataRange').on("input",function () {

      var selected_index = parseInt(this.value)
      console.log("selected index",parseInt(selected_index))

      getDrawPoints(userData["predictions"][selected_index])
    
    });

  });

}

