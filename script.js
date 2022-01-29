
//event listener per si prem ENTER a l'entrada de tasques
document.getElementById("taskInput")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key === "Enter") {
        let taskInfo = document.getElementById('taskInput');
        addTasquesLS(taskInfo.value);
        taskInfo.value = "";
    }
});

//event listener per fer botons els filtres de llista
let filtres = document.getElementsByClassName('selectFilter');
localStorage.getItem('filter') === null ? localStorage.setItem('filterLS', "All "): console.log('OK');
let startFilter = localStorage.getItem('filterLS');
for (var i = 0; i < filtres.length; i++) {
    filtres[i].innerText === startFilter ? filtres[i].classList.add("acitve") :filtres[i].classList.remove("active");
    filtres[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    localStorage.setItem("filterLS", this.innerText);
    dibuixaTasques();
    });
  }

recompte();


/* --------------------GESTIO DE TASQUES----------------------------------- */

function tatxaTasques(id){
    //console.log(id);
    let taskList = getTasquesLS();
    let element = document.getElementById(id).parentElement.parentElement;
    if(document.getElementById(id).checked === true){
        element.classList.add("acabat");
        taskList[id].acabat = true;
    } else{
        element.classList.remove("acabat");
        taskList[id].acabat = false;
    }
    localStorage.setItem("taskList",JSON.stringify(taskList));
    recompte();
}

function tancaTasques(id){
    //console.log(id)
    let opacityInicial = document.getElementById('completedTitle').style.opacity;
    let opacityFinal;
    let temp = "" + id + "_li";
    let plusItem = document.getElementById('tasks').lastElementChild.tagName === "SCRIPT"? 1 : 0;
    const llista = document.getElementById("tasks");
    console.log("plusItem = " + plusItem)
    if(llista.childElementCount > (2 + plusItem)){
        document.getElementById(temp).style.maxHeight = "0px";
        opacityFinal = "0";
    } else {
        opacityFinal = "1";
    }
    //Esborrarem visualment la tasca després actulaitzem la llista i redibuixem perquè no es descuadrin les ID.
    removeTasquesLS(id);
    //SetTimeot afegim un delay perquè acabi l'animació de tancar la tasca abans d'executar:
    setTimeout(dibuixaTasques, 200, opacityInicial);
   // console.log(document.getElementById("tasks").childElementCount + "\n" + document.getElementById('tasks').lastElementChild.tagName + "\n" + opacityFinal);
    setTimeout(()=> { requestAnimationFrame(() => { document.getElementById('completedTitle').style.opacity = opacityFinal;});},210)
    
}

function dibuixaTasques(opacityInicial){
    const taskList = getTasquesLS();
    let taskListFiltrada;
    if (localStorage.getItem('filterLS') === "Active "){
        console.log('dibuixatasques 1')
        taskListFiltrada = taskList.filter(task => task.acabat === false);
    } else if (localStorage.getItem('filterLS') === "Completed"){
        console.log('dibuixatasques 2')
        taskListFiltrada = taskList.filter(task => task.acabat === true);
    } else {
        console.log('dibuixatasques 3')
        taskListFiltrada = taskList;
    };
    console.log(taskListFiltrada);
    const llista = document.getElementById("tasks");
    llista.innerHTML = 
        `
        <li class="empty requadre">
            <p id="completedTitle" style="opacity:${opacityInicial}">
            Tasks Completed!
            </p>
        </li>
        `;

    for(element in taskListFiltrada){
        let varAcabat = taskListFiltrada[element].acabat ? "acabat" : ""; 
        llista.insertAdjacentHTML('afterbegin', 
        `
            <li class="requadre ${varAcabat}" id="${element}_li" style="max-height: 4rem">
            <label for="${element}" class="custom-checkbox" onclick="tatxaTasques(this.htmlFor)">
                <input type="checkbox" name="${element}" id="${element}" class="checkbox-input">
                <span class="checkbox-show checkbox-show--checkbox"></span>
            </label> 
            <p>${taskListFiltrada[element].tasca}</p>
            <button class="tanca btnTransp" onclick="tancaTasques(this.parentElement.id[0])"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#d1d3e0" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></button>
            </li>
            `
            );
        document.getElementById(element).checked = taskListFiltrada[element].acabat;
    }
}

/*------------------------------LOCAL STORAGE--------------------------------*/

function addTasquesLS(tasca) {
    const taskList = getTasquesLS();
    const newTask = {};
    const llista = document.getElementById("tasks");

    newTask.tasca = tasca;
    newTask.acabat = false;
    console.log(localStorage.getItem('filterLS')!== "Completed");
    if(localStorage.getItem('filterLS')!== "Completed"){
        llista.insertAdjacentHTML('afterbegin', 
            `
                <li class="requadre" id="${taskList.length}_li" style="max-height: 0px">
                <label for="${taskList.length}" class="custom-checkbox" onclick="tatxaTasques(this.htmlFor)">
                    <input type="checkbox" name="${taskList.length}" id="${taskList.length}" class="checkbox-input">
                    <span class="checkbox-show checkbox-show--checkbox"></span>
                </label> 
                <p>${tasca}</p>
                <button class="tanca btnTransp" onclick="tancaTasques(this.parentElement.id[0])"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#d1d3e0" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></button>
                </li>
                `
                /*<div class="separador"></div>*/
        );
        document.getElementById('completedTitle').style.opacity = "0";
        requestAnimationFrame(() => {
            llista.firstElementChild.style.maxHeight = "4rem";
            });
    }
    localStorage.setItem("taskList", JSON.stringify([...taskList, newTask]));
    recompte();
}

function removeTasquesLS(tascaId) {
    let taskList = getTasquesLS();
    taskList.splice(tascaId, 1)
    localStorage.setItem("taskList",JSON.stringify(taskList));
    recompte();
}

function getTasquesLS() {
    const taskList = JSON.parse(localStorage.getItem("taskList"));
    return taskList === null ? [] : taskList;
}


/*--------------------------------SCRIPTS Recompte i neteja----------------- */

function recompte(){
    const taskList = getTasquesLS();
    let recompte = 0;

    for(element in taskList){
        if(taskList[element].acabat === false){
            recompte ++;
        }
    }
    document.getElementById('recompteLlista').innerText = recompte;
}

function neteja(){
    const taskList = getTasquesLS();
    let taskListFiltrada = taskList.filter(task => task.acabat === false);
    localStorage.setItem("taskList",JSON.stringify(taskListFiltrada));
    dibuixaTasques();
}
