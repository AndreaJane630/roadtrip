let current_car;
let stats = document.querySelectorAll(".carstat"); // cache this at the beginning so that browser doesn't have to keep accessing for display_stats method
let trip_meter = document.getElementById('trip');
 
class Car{
	constructor(choice){ // user will select car from select box ooptions
	
		this.passengers = [];
		this.odometer = 0;
				
		switch (choice) {
			
			case "Corolla":
				this.make = "Toyota";
				this.model = "Corolla";
				this.year = 2010;
				this.mpg = 50;
				this.max_fuel_capacity = 40;
				this.current_fuel = 40;
				this.seating_capacity = 4; 
				break;
				
			case "Prius":
				this.make = "Toyota";
				this.model = "Prius";
				this.year = 2017;
				this.mpg = 66;
				this.max_fuel_capacity = 60;
				this.current_fuel = 60;
				this.seating_capacity = 3; 
				break;
							
			case "Altima":
				this.make = "Nissan";
				this.model = "Altima";
				this.year = 2000;
				this.mpg = 40;
				this.max_fuel_capacity = 40;
				this.current_fuel = 40;
				this.seating_capacity = 5; 
				// break ?
		} // end of switch
	} // end of constructor, but still in Car class
	
	// wanted to use a "getter" method, but did not use convention of underscore for property names:
	
	get seats() {
		return this.seating_capacity - this.passengers.length;
	} 
	
	drive(){
		
		if(trip_meter.value >= trip_meter.max){
			console.log("You finished the trip - there's no more driving to do");
			return 0; // must provide return value - otherwise you will throw an error when attempting to update meter value - see EVL for drive button
		}
		
		if(this.current_fuel <= 0){
			console.log("We are out of fuel");
			return 0;
		}

		let consumption = Math.floor(Math.random()*5)+1; // allow for 1-5 units of gas at a time

		if(consumption > this.current_fuel){ // if less than 5 units in the gas tank, can't drive further than what the tank will allow us
			consumption = this.current_fuel;
		}

		let travelled = (consumption * this.mpg); // amt of gas * mpg will tell us how far we've gone
		this.odometer += travelled; // update the odometer
		this.current_fuel -= consumption; // deduct what we used in gas from the tank	
		
		console.log("The car consumed " + consumption + " units of gas");
		console.log("The car travelled " + travelled + "miles.");
		console.log("The car has " + this.current_fuel + " units of gas left");
		
		return travelled; // will be used to update odometer and trip meter element
	}
	
	refuel(amount){

	// if the amt selected to refuel takes us over the tank's capacity, we'll have to set the tank to the max capacity value - the tank can't take any more than that, i.e just add enough to "top off" the tank
		
		if(this.current_fuel + amount > this.max_fuel_capacity){
			this.current_fuel = this.max_fuel_capacity;
			console.log("The car was topped off");
		}
		else{ // otherwise, just add the amount to the tank
			this.current_fuel += amount;
			console.log(amount + " units of gas was added");
		}
		// update dashboard car stats
		
		stats[2].textContent = this.current_fuel; // update dashboard stats
	}
	embark(p){ 	
		
		// do not allow another passenger to embark if all seats taken
		// User will be able to see that the car is full by checking the dashboard stats
		
		if (this.passengers.length < this.seating_capacity) {
			this.passengers.push(p);
			console.log(p.passenger_id + " boarded the car");
		} else{
			console.log("No room for another passenger");
		}
		
		// update dashboard stats - here, we make use of the getter seats() to update available seating:
		
		stats[5].textContent = this.passengers.length;	
		stats[6].textContent = this.seats;			
	}
	
	disembark(pid) {
		
		// remove passnger's image from viewport
		
		let fig = document.getElementById(pid);
		document.getElementById('passenger_storage').removeChild(fig);
		
		// Next, remove passenger from options list of select box for deleting passengers:
		
		let opt = document.querySelector(".p" + pid);
		document.getElementById("remove_passenger").removeChild(opt);
		
		// splice array to remove passenger, then update carstats
			 
		for (let i = 0; i < this.passengers.length; i++) {
			
			if (this.passengers[i].passenger_id == pid) { // do not use strict equality here since we're comparing a number to a string
				this.passengers.splice(i,1);
				console.log("Passenger " + pid + " disembarked");
				break;
			}
		} // end of for loop
		
		stats[5].textContent = this.passengers.length;
		stats[6].textContent = this.seats;
	}		
	
	// method to display car stats
	
	display_stats() { 
	
		stats[0].textContent = this.make + " " + this.model + " " + this.year;
		stats[1].textContent = this.mpg;
		stats[2].textContent = this.current_fuel;
		stats[3].textContent = this.max_fuel_capacity;
		stats[4].textContent = this.odometer;
		stats[5].textContent = this.passengers.length;
		stats[6].textContent = this.seats;
	}	
}	// end of car class	

class Passenger{
	
	constructor(){ // do not create a passenger if car is full:
	
		if (current_car.passengers.length === current_car.seating_capacity) {
			console.log("The car is full");
			return;
		} 
		// o.k. - we have a car and there's enough room for another passenger
		
		this.passenger_id = ++Passenger.counter; 
		console.log("The new passenger's id is " + this.passenger_id);
		
		if(Math.random() < 0.5){ // "toss a coin" to decide whether to construct a man or woman
			this.sprite = "sprites/man1.png";
		}else{
			this.sprite = "sprites/woman1.png";
		}
		// put image with caption in figure element
		
		let fig = document.createElement('figure');
		fig.id = this.passenger_id; // we'll need this for disembark method 
		let img = document.createElement('img');
		img.src = this.sprite;
		img.classList.add("imgstyle");
		fig.appendChild(img);
		let figcap = document.createElement('figcaption');
		figcap.textContent = 'Passenger Id: ' + this.passenger_id;
		fig.appendChild(figcap);
			
		document.getElementById('passenger_storage').appendChild(fig);
				
		// we also have to add this passenger to the select box for deleting passengers when they want to disembark. Should I also give this option elt a value attribute?
		
		let newpassenger = document.createElement('option');
		newpassenger.className = "p" + this.passenger_id; // couldn't use id attribute since figure elt is using passenger id 
		newpassenger.textContent = 'Passenger Id: ' + this.passenger_id;
		
		document.getElementById('remove_passenger').appendChild(newpassenger);
		
	} // end of Person constructor
} // end of Person class

Passenger.counter = 0; // set a new property outside of the Passenger class - it's available to all instances of the Passenger class, and may only be referred to via the class name, not an instantiated object name

let cartype = document.getElementById("carmodel"); // access select element with drop down options to choose the car to drive

cartype.addEventListener('change',function() {
	current_car = new Car(this.value);
	console.log(current_car);
	this.disabled = true; // do not allow another car to be created during this road trip - have to refresh browser to start a new trip - maybe I should include a "reset" button? 
	// once car selected, make dashboard visible:
	
	document.getElementById('dashboard').style.display = "flex";
	document.getElementById('dashheader').style.display = "block";
	current_car.display_stats();
});


// our meter element started with 0 units, unlike the Dragonslayer exercise, where we started the meter out with the dragon's hitpoints - here we'll start with 0, and as we keep driving, the meter will tell us how far we've gone, although you'll only be able to see it increasing on the screen, not a numeric value, although I am adding the car stats in "dashboard" to this program which will show miles travelled via the odometer

let drive_btn = document.getElementById('drive');
drive_btn.addEventListener('click',function() {
	if (current_car) {
		let travelled = current_car.drive();
		trip_meter.value += travelled;
		current_car.display_stats(); // update dashboard stats for user
	} else {
		console.log("You haven't selected a car to drive.");
	}
});

let refuel_btn = document.getElementById('refuel');
refuel_btn.addEventListener('click',function(){
	if (current_car) {
		let refuel_amount = document.getElementById('amount').value; // how much gas does driver want to add to tank?
	// the amount is stored as a string - convert it
		current_car.refuel(Number(refuel_amount));
	} else {
		console.log("Select car first before refueling.");
	}
});

// let trip_meter = document.getElementById('trip'); 3/23 I decided to place this at top of script

let meter_interval_id = setInterval(function(){
	if(trip_meter.value >= trip_meter.max){
		console.log('Trip Complete');
		clearInterval(meter_interval_id);
	}
},3000);

let add_passenger_btn = document.getElementById('add_passenger');
add_passenger_btn.addEventListener('click',	function(){
		if (current_car) {
			let p = new Passenger();
			current_car.embark(p);
		} else {
			console.log("There isn't a car for a passenger to board.");
		}
	});

let delete_passenger = document.getElementById("remove_passenger"); // access select element with drop down options to remove passenger from this list when passenger wants to disembark

delete_passenger.addEventListener('change',function() {
	console.log('Passenger to disembark: ' + this.value.charAt(14));
	current_car.disembark(this.value.charAt(14)); // need to extract the passenger id from the option element's value
});



