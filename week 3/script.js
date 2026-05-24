$(document).ready(function(){

let balance = 10000;
let correctPIN = "1234";
let visible = false;


// Toggle Balance
$("#eyeIcon").click(function(){

if(visible){
$("#balance").text("****");
visible = false;
}
else{
$("#balance").text(balance);
visible = true;
}

});


// Show Deposit
$("#depositBtn").click(function(){

$("#depositBox").show();
$("#withdrawBox").hide();

});


// Show Withdraw
$("#withdrawBtn").click(function(){

$("#withdrawBox").show();
$("#depositBox").hide();

});


// Deposit
window.Deposit = function(){

let amount = Number($("#num1").val());

if(amount <= 0){
alert("Enter valid amount");
return;
}

if(amount % 100 !== 0){
alert("Amount must be multiple of 100");
return;
}

let pin = prompt("Enter PIN");

if(pin === correctPIN){

balance = balance + amount;

$("#balance").text(balance);

alert("Deposit Successful");

}
else{
alert("Incorrect PIN");
}

}


// Withdraw
window.Withdraw = function(){

let amount = Number($("#num2").val());

if(amount <= 0){
alert("Enter valid amount");
return;
}

if(amount % 100 !== 0){
alert("Amount must be multiple of 100");
return;
}

if(amount > balance){
alert("Insufficient Balance");
return;
}

let pin = prompt("Enter PIN");

if(pin === correctPIN){

balance = balance - amount;

$("#balance").text(balance);

alert("Withdrawal Successful");

}
else{
alert("Incorrect PIN");
}

}

});
