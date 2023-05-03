let note = 8;
let delay = 300;
let currentNote = 1;


var addRow = document.querySelector('#addRow');
let tbody = document.querySelector('tbody');
let runButton = document.querySelector('#run');

const audio_supported_formats = [
    "wav",
    "ogg",
    "mp3"
];



addRow.addEventListener('click', function () {

    let tr = document.createElement('tr');
    var tds = tr.children;

    let lastRow = tbody.children[tbody.children.length - 1];
    tbody.removeChild(lastRow);

    let th = document.createElement('th');

    let input = document.createElement('input');
    input.type = "file";
    let audio = document.createElement('audio');
    let volume = document.createElement('i');
    volume.classList.add("fa-solid", "fa-volume-high");

    
    volume.addEventListener('click', function(){
        if (volume.classList.contains('fa-volume-high')){

            volume.classList.remove('fa-volume-high');
            volume.classList.add('fa-volume-xmark');
            volume.parentElement.querySelector('audio').muted = true;
            volume.parentElement.classList.add('silenced');

            for (let i = 1; i < tds.length - 1; i++){
                tds[i].classList.add('silenced');
            }

        }
        else if (volume.classList.contains('fa-volume-xmark')){

            volume.classList.remove('fa-volume-xmark');
            volume.classList.add('fa-volume-high');
            volume.parentElement.querySelector('audio').muted = false;
            
            volume.parentElement.classList.remove('silenced');

            for (let i = 1; i < tds.length - 1; i++){
                tds[i].classList.remove('silenced');
            }
        }
    })

    th.appendChild(input);    
    th.appendChild(audio);
    th.appendChild(volume);

    input.addEventListener('change', function () {

        let file = input.files[0];

        const audioFile = input.parentElement.querySelector('audio');
        if (file == undefined) {
            audioFile.src = ";"
            return;
        }

        let fileName = file.name.split('.');
        let extension = fileName[fileName.length - 1];

        console.log(input.files[0].type.split('/')[0]);
        console.log(extension);

        if (!audio_supported_formats.includes(extension, 0)) {
            input.value = "";
            return;
        }

        const reader = new FileReader();

        reader.addEventListener("load", () => {
            audioFile.src = reader.result;
        })
        reader.readAsDataURL(file);
    })


    tr.appendChild(th);

    for (let i = 0; i < note; i++) {
        var td = document.createElement('td');

        td.setAttribute('data-checked', "disabled");
        tr.appendChild(td);
    }

    var closeRow = document.createElement('td');
    closeRow.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;

    closeRow.addEventListener('click', function () {
        closeRow.parentElement.remove();
    })

    tr.appendChild(closeRow);
    for (let i = 1; i < tds.length - 1; i++){
        
        tds[i].addEventListener('click', function () {
            if (tds[i].getAttribute('data-checked') == "enabled") {

                tds[i].setAttribute('data-checked', "disabled");

                if (tds[i].classList.contains('selected')){
                    tds[i].classList.remove('selected');    
                }

            }
            else if (tds[i].getAttribute('data-checked') == "disabled")  {

                tds[i].setAttribute('data-checked', "enabled");
                
                tds[i].classList.add('selected');
            }

        })
    }


    tbody.appendChild(tr);
    tbody.appendChild(lastRow);
})

var runMusic;
runButton.addEventListener('click', function () {



    if (runButton.innerText == "Stop") {
        runButton.innerText = "Run";
        clearInterval(runMusic);
        runMusic = null;

    }
    else if (runButton.innerText == "Run") {
        runButton.innerText = "Stop";
        runMusic = setInterval(function () {
            const rows = tbody.children;

            if (rows.length == 1) return;


            for (let i = 1; i < rows.length - 1; i++) {

                let cell = rows[i].children[currentNote]
                if (cell.getAttribute('data-checked') == "enabled") {
                    rows[i].children[0].querySelector("audio").currentTime = 0;
                    rows[i].children[0].querySelector("audio").play();
                    cell.classList.add('played');


                    setTimeout(function () {
                        cell.classList.remove('played');

                    }, delay)
                }


            }

            if (currentNote != note) {
                currentNote++;
            }
            else {
                currentNote = 1;
            }

        }, delay)
    }
})

var delayInput = document.getElementById('delay');
delayInput.addEventListener('change', function(){
    if (delayInput.value < 0){
        delayInput.value = Math.abs(delayInput.value);
    }
    delay = delayInput.value * 1000;
})