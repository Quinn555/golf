async function getAvailableCourses() {
    const url = 'https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json';
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

dropDown1();

function dropDown1(){
    getAvailableCourses().then((data) => {
        let courseOptionsHtml = `<option>Select A Course</option>`;
        
        data.forEach((course) => {
            courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
        });
        let selectCorse = document.getElementById('course-select');
        selectCorse.innerHTML = courseOptionsHtml;
        selectCorse.addEventListener('change', function() {
            main();
        })
    });
    
}

//Gets info from course selected
async function CourseDetails(golfCourseId) {
    return fetch(
      `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`
    ).then(function (response) {
      return response.json();
    });
  }

function main() {
    const selected = document.getElementById('tee-box-select');
    const selectTeeBox = document.getElementById('course-select').value;
    //runs things based off of the course selected
    CourseDetails(selectTeeBox).then((data) => {
        //Gives drop down options
        dropDown2(data);

        //Add in info to table
        selected.addEventListener('change', () => tableAdd(data))
        
    });
}

function dropDown2(data) {
    let totalYards = {};
    data.holes.forEach((hol) => {
        //Finds the total yards for each group
        hol.teeBoxes.forEach((teeBox) => {
            const teeType = teeBox.teeType;
            const number = teeBox.yards;

            if (totalYards[teeType]) {
                totalYards[teeType] += number;
            } else {
                totalYards[teeType] = number;
            }
        });

        //Displays the drop down options
        let cleanTeaBox = `<option>Select A Team</option>`;;
        hol.teeBoxes.forEach(function (box, index) {
            let yar = 0;
            if (totalYards[box.teeType]) {
                yar = totalYards[box.teeType];
            }
            cleanTeaBox += `<option value="${index}">${box.teeType.toUpperCase()}, ${yar} yards</option>`;
        });

        document.getElementById('tee-box-select').innerHTML = cleanTeaBox;
    });
}

function tableAdd(data) {
    let contain = document.getElementById('table-holder');
    let table = `<div class="row" id="scorecard-container">
    <div class="col-lg-12" id="scorecard">
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Hole</th>
                        <th scope="col">1</th>
                        <th scope="col">2</th>
                        <th scope="col">3</th>
                        <th scope="col">4</th>
                        <th scope="col">5</th>
                        <th scope="col">6</th>
                        <th scope="col">7</th>
                        <th scope="col">8</th>
                        <th scope="col">9</th>
                        <th scope="col">Out</th>
                    </tr>
                </thead>
                <tbody id="bod">
                </tbody>
            </table>
        </div>
    </div>`;
    let secondTable = `<div class="row" id="scorecard-container">
    <div class="col-lg-12" id="scorecard">
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Hole</th>
                        <th scope="col">10</th>
                        <th scope="col">11</th>
                        <th scope="col">12</th>
                        <th scope="col">13</th>
                        <th scope="col">14</th>
                        <th scope="col">15</th>
                        <th scope="col">16</th>
                        <th scope="col">17</th>
                        <th scope="col">18</th>
                        <th scope="col">In</th>
                    </tr>
                </thead>
                <tbody id="bod2">
                </tbody>
            </table>
        </div>
    </div>`;
    let finalPlacing = ` 
    <div class="row" id="scorecard-container">
        <div class="col-lg-12" id="scorecard">
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr id="name">
                            <th scope="col">handicap</th>
                            <th scope="col">Yardage</th>
                            <th scope="col">Par</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="complete-total">

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
    let clear = document.getElementById('table-holder');
    clear.innerHTML = '';

    let teamSelected = document.getElementById('tee-box-select');
    let selectedOption = teamSelected.options[teamSelected.selectedIndex].text;
    let selectedOptionCut = selectedOption.split(',')

    contain.innerHTML += table;
    let arrNames = ['hcp', 'yards', 'par'];
    for(i = 0; i < arrNames.length; i ++){
        let placeToPut = document.getElementById('bod');

        let rowT = `
        <tr id = "${arrNames[i]}">
            <th scope="row">${arrNames[i]}</th>
        </tr>`;
        placeToPut.innerHTML += rowT;

        let check = document.querySelectorAll('tbody');
        if(check.length !== 3){
            contain.innerHTML += secondTable;
            contain.innerHTML += finalPlacing
        }
        let placeToPut2 = document.getElementById('bod2');
        let finalTotalSelector = document.getElementById('complete-total');

        let rowT2 = `
        <tr id = "${arrNames[i]}2">
            <th scope="row">${arrNames[i]}</th>
        </tr>`;
        placeToPut2.innerHTML += rowT2;

        let rowIn = [];
        let numbersNeeded = [];
        data.holes.forEach((hol) =>{
            hol.teeBoxes.forEach((box) => {
                if (selectedOptionCut.includes(box.teeType.toUpperCase())) {
                    rowIn.push(`<th scope="row">${box[arrNames[i]]}</th>`);
                    numbersNeeded.push(box[arrNames[i]]);
                };
            });
        }); 

        let putHere = document.getElementById(`${arrNames[i]}`);
        let putHere2 = document.getElementById(`${arrNames[i]}2`);

        let firstPart = rowIn.slice(0,9);
        let secondPart = rowIn.slice(9);

        let firstPartNum = eval(numbersNeeded.slice(0,9).join('+'));
        let secondPartNum = eval(numbersNeeded.slice(9).join('+'));

        const codeFinal1 = `<th scope="row">${firstPartNum}</th>`;
        const codeFinal2 = `<th scope="row">${secondPartNum}</th>`;
        const codeFin = `<th scope="row">${firstPartNum + secondPartNum}</th>`;

        putHere.innerHTML += firstPart.join('');
        putHere.innerHTML += codeFinal1;
        putHere2.innerHTML += secondPart.join('');
        putHere2.innerHTML += codeFinal2;

        finalTotalSelector.innerHTML += codeFin;
    };
   
}

//Adds Players
document.getElementById('add-Player').addEventListener('click', () => addingPlayers());

function addingPlayers(){
    let inerSelect = document.getElementById('selectPlayer');
    let nameOfValue = inerSelect.value;
    const CreateRow = `
    <tr id="${nameOfValue}">
        <th scope="row">${nameOfValue} <h6 type="button" id="del" >Delete</h6> </th>
        <td scope="row" id="update" contenteditable="true"></td>
        <td scope="row" id="update" contenteditable="true"></td>
        <td scope="row" id="update" contenteditable="true"></td>
        <td scope="row" id="update" contenteditable="true"></td>
        <td scope="row" id="update" contenteditable="true"></td>
        <td scope="row" id="update" contenteditable="true"></td>
        <td scope="row" id="update" contenteditable="true"></td>
        <td scope="row" id="update" contenteditable="true"></td>
        <td scope="row" id="update" contenteditable="true"></td>
        <td scope="row"</td>
    </tr>`;
    document.getElementById('bod').innerHTML += CreateRow;
    document.getElementById('bod2').innerHTML += CreateRow;

    const finalName = `<th scope="col" id="d${nameOfValue}">${nameOfValue}</th>`
    document.getElementById('name').innerHTML += finalName;

    const finalNameNum = `<td scope="row" id="f${nameOfValue}"</td>`
    document.getElementById('complete-total').innerHTML += finalNameNum;

    nameOfValue = '';

    

    //adds total
    update();

    //Adds player deleting capability
    deletingPlayers();
}

function deletingPlayers(){
    let dels = document.querySelectorAll('#del')
    dels.forEach((del) => {
        del.addEventListener('click', () => {
            const thingToRemove = del.parentElement.parentElement;
            thingToRemove.remove();
            document.getElementById(`${thingToRemove.id}`).remove();
            document.getElementById(`d${thingToRemove.id}`).remove();
            document.getElementById(`f${thingToRemove.id}`).remove();
        })
    })

}

function update() {
    let ups = document.querySelectorAll('#update');
    ups.forEach((up) => {
        up.addEventListener('keyup',() => {
            const parentRow = up.parentElement;
            const childrenOfRow = parentRow.children;
            let finalPlayerNum = parentRow.lastChild;

            let adding = 0;
            for (let i = 1; i < childrenOfRow.length - 2; i++) {
              const childText = childrenOfRow[i].textContent;
              adding = adding + Number(childText);
            }
            finalPlayerNum.textContent = adding;

            const ids = parentRow.id;
            const f1 = document.querySelectorAll(`#${ids}`);
            let fAdding = 0;
            f1.forEach((f) => {
                const lastThing = f.lastChild.textContent;
                fAdding += Number(lastThing)
            })
            document.getElementById(`f${ids}`).innerHTML = fAdding;
        })
    });
}