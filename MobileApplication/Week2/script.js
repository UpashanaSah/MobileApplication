function checkResult(){

let m1 = Number(document.getElementById("m1").value);
let m2 = Number(document.getElementById("m2").value);
let m3 = Number(document.getElementById("m3").value);
let m4 = Number(document.getElementById("m4").value);
let m5 = Number(document.getElementById("m5").value);
let m6 = Number(document.getElementById("m6").value);
let m7 = Number(document.getElementById("m7").value);
let m8 = Number(document.getElementById("m8").value);

let total = m1 + m2 + m3 + m4 + m5 + m6 + m7 + m8;

let division;

if(total >= 700){
division = "Distinction";
}
else if(total >= 600){
division = "First Division";
}
else if(total >= 500){
division = "Second Division";
}
else if(total >= 400){
division = "Third Division";
}
else{
division = "Fail";
}

document.getElementById("result").innerHTML =
"Total Marks = " + total + "<br>Result: " + division;

}