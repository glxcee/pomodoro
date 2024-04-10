let working = false, studying = true, d = new Date(0), first = true;
var timerId, handId
var studyTime, finalTime, cycles
const timerEl = document.querySelector("#time")
const breakEl = document.querySelector("h6")
const cyclEl = document.querySelector("h5")
const buttonEl = document.querySelector("button")
const handEl = document.querySelector(".hand")
var handStyle

const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
const height = (window.innerHeight > 0) ? window.innerHeight : screen.height;


function resume() {
    timerId = setInterval(timerTick,1000/(studying ? 1 : 5))
}

function dropModify(plof) {
    if(droplist.length>0) {
        let x = droplist.pop()
        x.setAttribute("class","rain" + (plof ? " dropped" : ""))
    }
}

function timerTick() {
    var qnt = studying ? 1 : -1
    d.setSeconds(d.getSeconds()+qnt)

    dropModify(studying)

        

    timerEl.innerText = d.toTimeString().split(' ')[0].slice(3,8)
    if(d.getMinutes()==finalTime && d.getSeconds()==0) {
        clearInterval(timerId)

        shuffleArray(drops)
        if(studying) {
            droplist = [...drops]
            studying = false
            finalTime = 0
            ticks = 0
            timerEl.setAttribute("class","back")
            breakEl.setAttribute("style","opacity: 1;")
            handEl.setAttribute("class","hand half")
            setTimeout(function() {
                handEl.setAttribute("class","hand")
            },studyTime*6000)
        } else {
            droplist = [...drops]
            studying = true
            finalTime = studyTime
            timerEl.setAttribute("class","")
            breakEl.setAttribute("style","opacity: 0;")
            cycles--;
        }

        if(cycles>0) {
            if(studying) cyclEl.innerText = (Number(cyclEl.innerText[0])+1) + "*"
            resume()
        }
        else {
            working = false
            first = true
            editInputs()
            buttonEl.innerText = "Start studying!"
            setTimeout(function() {
                rainspace.innerHTML = ""
                fill()
            },3000)
            
        } 
    }
}

function toggleElement(x) {
    x.readOnly = !first
    x.setAttribute("style","opacity: " + (1-(0.5)*(!first)).toString() + ";")
}
function editInputs() {
    document.querySelectorAll('input').forEach(x => toggleElement(x))
    document.querySelectorAll('label').forEach(x => toggleElement(x))
}

document.querySelector("form").addEventListener("submit",function(e) {
    e.preventDefault()
    if(first) {
        editInputs()
        const form = new FormData(e.target)
        cycles = Object.fromEntries(form)["amount"]
        studyTime = Object.fromEntries(form)["study"]
        finalTime = studyTime
        //dropRatio = droplist.length/(studyTime*60)
        handStyle = "transition: all "+ (studyTime*6) + "s; "
        handEl.setAttribute("style",handStyle)

        first = false;
        editInputs()

        if(studying) cyclEl.innerText = "1*"
    }

    working = !working
    var buttonText

    if(working) {
        buttonText = "Pause"
        resume()
    } 
    else {
        buttonText = "Resume"
        clearInterval(timerId)
    } 

    buttonEl.innerText = buttonText
})

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

var drops = [], droplist = []
const rainspace = document.getElementById("raincontainer")

function fill() {
    const rows = Math.round(Math.log2(height))-1
    let cols = Math.round(Math.log2(width))-3

    for(let i = 0; i < rows; i++) {
        if(i%2==0) cols+=2
        else cols-=3

        for(let j = 0; j < cols; j++) {

            let raindrop = document.createElement("h3")
            raindrop.setAttribute("class","rain")
            raindrop.setAttribute("style", "position: fixed; left: " + (((j+1)/(cols+2))*100) + "%; top: " + (((i)/(rows))*100) + "%;")

            let dot = document.createElement("span")
            dot.setAttribute("style","opacity: 0;")
            dot.innerText = "O.."

            raindrop.appendChild(dot)

            drops.push(raindrop)
            rainspace.appendChild(raindrop)

        }
    }

    shuffleArray(drops)
    droplist = [...drops]
    
}

fill()

