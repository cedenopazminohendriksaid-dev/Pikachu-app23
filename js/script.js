const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const links = document.querySelectorAll(".link");
const btnBack = document.querySelector("#btn-back");
const btnNext = document.querySelector("#btn-next");

let URL = "https://pokeapi.co/api/v2/pokemon/";
let currentValue = 1;

// Cargar Pokémon por página (Página 1: 26 items | Páginas 2 a 6: 25 items)
function cargarPagina(pagina) {
    listaPokemon.innerHTML = "";
    
    let inicio, fin;
    if (pagina === 1) {
        inicio = 1;
        fin = 16;
    } else {
        inicio = 17 + (pagina - 2) * 15;
        fin = inicio + 14;
    }

    for (let i = inicio; i <= fin; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => mostrarPokemon(data));
    }
}

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const alturaEnMetros = poke.height / 10;
    const pesoEnKg = poke.weight / 10;

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${alturaEnMetros}m</p>
                <p class="stat">${pesoEnKg}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

// Control visual de la paginación y cambio de vista
function updateActive() {
    links.forEach(link => link.classList.remove("active"));
    links[currentValue - 1].classList.add("active");
    cargarPagina(currentValue);
}

links.forEach(link => {
    link.addEventListener("click", (e) => {
        currentValue = parseInt(e.target.getAttribute("value"));
        updateActive();
    });
});

if (btnBack) {
    btnBack.addEventListener("click", () => {
        if (currentValue > 1) {
            currentValue--;
            updateActive();
        }
    });
}

if (btnNext) {
    btnNext.addEventListener("click", () => {
        if (currentValue < links.length) {
            currentValue++;
            updateActive();
        }
    });
}

// Botones de filtro de tipos
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    if (botonId === "ver-todos") {
        currentValue = 1;
        updateActive();
        return;
    }

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                const tipos = data.types.map(type => type.type.name);
                if (tipos.some(tipo => tipo.includes(botonId))) {
                    mostrarPokemon(data);
                }
            });
    }
}));

// Buscador
const inputSearch = document.getElementById("inputSearch");
const boxSearch = document.getElementById("box-search");
const coverCtnSearch = document.getElementById("cover-ctn-search");

if (inputSearch) {
    inputSearch.addEventListener("keyup", filtrarPokemon);
}

function filtrarPokemon() {
    const filter = inputSearch.value.toLowerCase().trim();
    const pokemons = document.querySelectorAll(".pokemon");

    boxSearch.innerHTML = "";

    if (filter === "") {
        boxSearch.style.display = "none";
        if (coverCtnSearch) coverCtnSearch.style.display = "none";
        pokemons.forEach(pokemon => pokemon.style.display = "block");
        return;
    }

    boxSearch.style.display = "block";
    if (coverCtnSearch) coverCtnSearch.style.display = "block";

    pokemons.forEach(pokemon => {
        const nombre = pokemon.querySelector(".pokemon-nombre").textContent.toLowerCase();
        const id = pokemon.querySelector(".pokemon-id").textContent.toLowerCase();

        if (nombre.includes(filter) || id.includes(filter)) {
            pokemon.style.display = "block";

            const li = document.createElement("li");
            li.innerHTML = `<a href="#"><i class="fas fa-search"></i> ${nombre.toUpperCase()} (${id})</a>`;

            li.addEventListener("click", (e) => {
                e.preventDefault();
                inputSearch.value = nombre;
                filtrarPokemon();
                boxSearch.style.display = "none";
                if (coverCtnSearch) coverCtnSearch.style.display = "none";
            });

            boxSearch.appendChild(li);
        } else {
            pokemon.style.display = "none";
        }
    });
}

if (coverCtnSearch) {
    coverCtnSearch.addEventListener("click", () => {
        boxSearch.style.display = "none";
        coverCtnSearch.style.display = "none";
    });
}

// Inicialización
cargarPagina(1);