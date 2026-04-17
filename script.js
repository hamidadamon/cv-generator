function generatorCV() {
    const nom = document.getElementById("nom").value;
    const metier = document.getElementById("metier").value;
    const desc = document.getElementById("desc").value;

    document.getElementById("cv").innerHTML = `
    <h2>${nom}</h2>
    <h2>${metier}</h2>
    <p>${desc}</p>
    `
}
