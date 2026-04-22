const ting = [
    "Banan", "Æble", "Pære"
];

function main() {
    const velkommen = document.getElementById("velkommen");
    const lavet = document.getElementById("lavet");

    velkommen.style.color = "red";

    let farve = "red";
    
    setInterval(() => {
        if (farve === "red") {
            velkommen.style.color = "blue";
            farve = "blue";
        } else {
            velkommen.style.color = "red";
            farve = "red";
        }
    }, 1_000);

    const tekst = document.getElementById("tekst");

    let nuværende = 0;
    setInterval(() => {
        tekst.innerHTML = ting[nuværende];
        nuværende = nuværende + 1;
        if (nuværende === ting.length) {
            nuværende = 0;
        }
    }, 1_000);
}

function destroy() {
    const button = document.getElementById("destroy");

    button.setAttribute("disabled", "true");
}

window.onload = main;