document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("zadania")) {
        let zadania = JSON.parse(localStorage.getItem("zadania"));
        wyswietlZadania(zadania);
    }
});

function dodajZadanie() {
    let poleZadania = document.getElementById("taskInput");
    let poleTerminu = document.getElementById("dueDate");
    let tekstZadania = poleZadania.value;
    let terminWykonania = poleTerminu.value;

    if (tekstZadania.length < 3 || tekstZadania.length > 255) {
        alert("Tekst zadania musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.");
        return;
    }

    if (terminWykonania !== "" && new Date(terminWykonania) <= new Date()) {
        alert("Data wykonania zadania musi być pusta lub w przyszłości.");
        return;
    }

    let zadania = localStorage.getItem("zadania") ? JSON.parse(localStorage.getItem("zadania")) : [];
    zadania.push({ text: tekstZadania, dueDate: terminWykonania });
    localStorage.setItem("zadania", JSON.stringify(zadania));
    wyswietlZadania(zadania);
    poleZadania.value = "";
    poleTerminu.value = "";
}

function usunZadanie(index) {
    let zadania = JSON.parse(localStorage.getItem("zadania"));
    zadania.splice(index, 1);
    localStorage.setItem("zadania", JSON.stringify(zadania));
    wyswietlZadania(zadania);
}

function zapiszZmiany(index) {
    let zadania = JSON.parse(localStorage.getItem("zadania"));
    let poleEdycjiTekstu = document.getElementById(`editText${index}`);
    let poleEdycjiTerminu = document.getElementById(`editDueDate${index}`);

    let nowyTekst = poleEdycjiTekstu.value;
    let nowyTerminWykonania = poleEdycjiTerminu.value;

    if (nowyTekst.length < 3 || nowyTekst.length > 255) {
        alert("Tekst zadania musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.");
        return;
    }

    let aktualneZadanie = zadania[index];

    if (nowyTekst !== aktualneZadanie.text) {
        aktualneZadanie.text = nowyTekst;
    }

    if (nowyTerminWykonania !== "" && new Date(nowyTerminWykonania) <= new Date()) {
        alert("Data wykonania zadania musi być w przyszłości.");
        return;
    }

    if (nowyTerminWykonania !== aktualneZadanie.dueDate) {
        aktualneZadanie.dueDate = nowyTerminWykonania;
    }

    localStorage.setItem("zadania", JSON.stringify(zadania));

    wyswietlZadania(zadania);
}

function pokazPolaEdycji(index) {
    let poleEdycjiTekstu = document.getElementById(`editText${index}`);
    let poleEdycjiTerminu = document.getElementById(`editDueDate${index}`);
    let przyciskEdycji = document.getElementById(`editButton${index}`);

    if (poleEdycjiTekstu.style.display === "none") {
        poleEdycjiTekstu.style.display = "inline";
        poleEdycjiTerminu.style.display = "inline";
        przyciskEdycji.innerHTML = "Zapisz";
    } else {
        zapiszZmiany(index);
        poleEdycjiTekstu.style.display = "none";
        poleEdycjiTerminu.style.display = "none";
        przyciskEdycji.innerHTML = "Edytuj";
    }
}

function edytujZadanie(index) {
    pokazPolaEdycji(index);
}

function wyswietlZadania(zadania, szukane) {
    let listaZadan = document.getElementById("listaZadan");
    listaZadan.innerHTML = "";

    zadania.forEach(function (zadanie, index) {
        let elementListy = document.createElement("li");
        let tekstZadania = zadanie.text;

        let wyswietlanyTekst = tekstZadania;
        if (szukane && tekstZadania.toLowerCase().includes(szukane)) {
            let poczatek = tekstZadania.toLowerCase().indexOf(szukane);
            let koniec = poczatek + szukane.length;

            wyswietlanyTekst = `${tekstZadania.substring(0, poczatek)}<span class="highlight">${tekstZadania.substring(poczatek, koniec)}</span>${tekstZadania.substring(koniec)}`;
        }

        elementListy.innerHTML = `${wyswietlanyTekst} 
                             <input type="text" id="editText${index}" class="editFields" value="${tekstZadania}" style="display: none;">
                             <input type="date" id="editDueDate${index}" class="editFields" value="${zadanie.dueDate || ''}" style="display: none;">
                             <button class="editButton" onclick="edytujZadanie(${index})">Edit</button>
                             <button onclick="usunZadanie(${index})">Delete</button>`;

        if (zadanie.dueDate) {
            elementListy.innerHTML += " - Termin wykonania: " + zadanie.dueDate;
        }

        listaZadan.appendChild(elementListy);
    });
}

function szukajZadan() {
    let poleSzukania = document.getElementById("searchInput");
    let szukane = poleSzukania.value.toLowerCase();
    let zadania = localStorage.getItem("zadania") ? JSON.parse(localStorage.getItem("zadania")) : [];
    let przefiltrowaneZadania = zadania.filter(function (zadanie) {
        return zadanie.text && zadanie.text.toLowerCase().includes(szukane);
    });

    wyswietlZadania(przefiltrowaneZadania, szukane);
}

function obsluzKlikniecieNaLiscie(event) {
    let cel = event.target;

    if (cel.tagName === 'LI') {
        let index = Array.from(cel.parentElement.children).indexOf(cel);
        pokazPolaEdycji(index);
    }

    if (!cel.closest('li')) {
        let listItems = document.querySelectorAll('#listaZadan li');
        listItems.forEach((item, index) => {
            zapiszZmiany(index);
        });
    }
}

document.addEventListener('click', obsluzKlikniecieNaLiscie);
