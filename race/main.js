
let race = {
	data: {},
	roads: [],
	cars: [],
	t: 0, //Время движения для правильного рассчета пройденого расстояния при ускорении
	trackDistance: 0.5, // км
	carsCount: null,
	stopedCars: [],
	init: async function(){
		this.data = await this.fetchData();
		this.carsCount = this.data.items.length;
		this.drawTrack()
		this.drawCars()
		setTimeout(this.setStartPositions.bind(this), 1000)
		setTimeout(this.start.bind(this), 3000)
	},
	setStartPositions: function(){
		this.cars.forEach((car)=>{
			car.elem.style.transform = 'translateX(0)'
		})
	},
	start: function(){
		window.timerId = setInterval(this.moveCars.bind(this), 1000)
	},
	fetchData: async function(){
		let response = await fetch('http://we.pena-app.ru/rcrtng/api/cars/');
		return await response.json();
	},
	drawTrack: function(){
		let track = document.querySelector('.track')
		for(let i=0; i<this.carsCount; i++){
			let road = document.createElement('div');
			road.classList.add('road');
			road.style.height = 100/this.carsCount + "vh";
			track.appendChild(road)
			this.roads.push(road);
		}
	},
	drawCars: function(){
		for(let i=0; i<this.carsCount; i++){
			let car = document.createElement('div');
			car.classList.add('car');
			car.style.width = 100/this.carsCount*1.2 + "vh";
			car.style.backgroundImage = 'url(http://we.pena-app.ru'+this.data.config.image_path + '/' + this.data.items[i].image + '.' + this.data.config.image_ext + ')'
			this.roads[i].appendChild(car);
			this.cars.push({
				elem: car,
				acceleration: this.data.items[i].acceleration,
				maxVelocity: this.data.items[i].max_velocity,
				fuelRest: this.data.items[i].fuel_rest,
				fuelConsumption: this.data.items[i].fuel_consumption,
				speed: 0,
				distance: 0,
				overclocked: false, // Разогнались до макс. скорости
				isStop: false, 
				isFinished: false,
				name: this.data.items[i].image,
			})
		}
	},
	moveCars: function(){
		this.cars.forEach((car)=>{
			if(car.isStop||car.isFinished){
				return
			}
			// Если кончился бензин
			if(car.fuelConsumption*car.distance > car.fuelRest){
				this.stopedCars.push(car);
				car.isStop = true;
				return
			}
			// ПРИЕХАЛИ НА ФИНИШ.
			if((car.overclocked && car.distance + car.maxVelocity/3600 >= this.trackDistance)||(!car.overclocked && car.acceleration*(this.t+1)*(this.t+1)/3600/2>=this.trackDistance)){
				this.stopedCars.push(car);
				car.isFinished = true;
				car.distance = this.trackDistance;
				car.elem.style.transform = 'translateX('+car.distance/this.trackDistance*(document.documentElement.offsetWidth-car.elem.offsetWidth) + 'px)';
				return
			}
			if(car.acceleration*(this.t+1) < car.maxVelocity){
				car.distance = car.acceleration * this.t*this.t/3600/2; // км
			} else{
				car.distance += car.maxVelocity/3600; // км
				car.overclocked = true
			}
			car.elem.style.transform = 'translateX('+car.distance/this.trackDistance*(document.documentElement.offsetWidth-car.elem.offsetWidth) + 'px)';
			
		});
        this.t++;
		if(this.stopedCars.length == this.carsCount){
			clearInterval(window.timerId);
			this.showResults(this.stopedCars.filter((car)=>{
				return car.isFinished
			}));
		}
	},
	showResults: function(winners){
		let popUp = document.querySelector('.popUp')
		if(winners.length == 0){
			popUp.classList.add('empty')
			popUp.classList.add('show')
			return
		}
		let list = document.createElement('ol');
		winners.forEach((car)=>{
			let li = document.createElement('li');
			li.innerHTML  = car.name;
			list.appendChild(li);
		})
		let winersList = document.querySelector('.winersList')
		winersList.appendChild(list);
		popUp.classList.add('show')
	}
}
window.addEventListener('load', function(){
	race.init();
})