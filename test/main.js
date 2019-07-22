
let questions =	[]

let j = 0;
let summ = 0;
let checked = 0;
let nextBt = document.querySelector('.next');
let question = document.querySelector('.question');
let questionText = document.querySelector('.questionText');
let answer = document.querySelectorAll('.answer')
let radio =  document.querySelectorAll('.radio')
let test = document.querySelector('.test')
let result = document.querySelector('.result')



function fetchData(){
	fetch('json/data.json')
		.then((response)=>{
			return response.json()
		})
		.then((data)=>{
			questions = data;
            init();
			console.log(questions);
		})
}
fetchData();
function init() {
    nextBt.addEventListener('click', next);
    for(let i=0; i<answer.length;i++){
        answer[i].addEventListener('click', makeActive)
    }
    renderQuestion()
}
function next(){
	checkAnswer()
	delActive()
	if (j<9){
		j++
		renderQuestion()
	} else{
		nextBt.removeEventListener('click', next);
		test.style.display = 'none';
		result.style.display = 'block';
		getResult()
	}
}
function renderQuestion(){
	if(questions[j].img){
		let img = document.createElement('img');
		img.src = questions[j].img;
		question.appendChild(img)
		question.insertBefore(img, questionText)
	}
	if(questions[j].img == undefined){
		let imgs = document.querySelectorAll('img')
		for(let i=0; i<imgs.length; i++){
			imgs[i].remove()
		}
	}
	questionText.innerHTML = questions[j].question;
	for(let i=0; i<answer.length; i++){
		answer[i].innerHTML = questions[j].answers[i].text
	}
	for(let i=0; i<radio.length; i++){
		radio[i].checked = false
	}
}

function checkAnswer(){
	for(let i=0; i<radio.length; i++){
		if(radio[i].checked){
			checked = radio[i].value-1;
			if(questions[j].answers[checked].isRight){
				summ++
			}
			break;
		}
	}
	console.log(summ)
}
function getResult(){
	result.children[0].innerHTML += summ;
	if(summ == 10){
		result.children[1].innerHTML += "Отлично";
	} else if(summ < 10 && summ >=5){
		result.children[1].innerHTML += "Хорошо";
	} else{
		result.children[1].innerHTML += "Тест не пройден";
	}
}
function delActive(){
	for(let i=0; i<answer.length; i++){
		answer[i].classList.remove('active')
	}
}
function makeActive(){
	delActive()
	this.classList.add('active')
}
