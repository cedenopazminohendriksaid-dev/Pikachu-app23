const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join 
    ('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }


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
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))

// Captura de elementos DOM del buscador
const inputSearch = document.getElementById("inputSearch");
const boxSearch = document.getElementById("box-search");
const coverCtnSearch = document.getElementById("cover-ctn-search");

// Escuchar evento al escribir en el input
inputSearch.addEventListener("keyup", filtrarPokemon);

function filtrarPokemon() {
    const filter = inputSearch.value.toLowerCase().trim();
    const pokemons = document.querySelectorAll(".pokemon");

    // Limpiar lista de sugerencias desplegable
    boxSearch.innerHTML = "";

    if (filter === "") {
        // Si el buscador está vacío, ocultamos la lista y mostramos todos los Pokémon en grid
        boxSearch.style.display = "none";
        if (coverCtnSearch) coverCtnSearch.style.display = "none";
        
        pokemons.forEach(pokemon => pokemon.style.display = "block");
        return;
    }

    // Mostrar contenedor de lista desplegable y fondo oscuro
    boxSearch.style.display = "block";
    if (coverCtnSearch) coverCtnSearch.style.display = "block";

    pokemons.forEach(pokemon => {
        const nombre = pokemon.querySelector(".pokemon-nombre").textContent.toLowerCase();
        const id = pokemon.querySelector(".pokemon-id").textContent.toLowerCase();

        // Verificar si coincide por nombre o ID
        if (nombre.includes(filter) || id.includes(filter)) {
            // 1. Mostrar tarjeta principal en la pantalla
            pokemon.style.display = "block";

            // 2. Crear elemento dinámico para la lista desplegable de sugerencias
            const li = document.createElement("li");
            li.innerHTML = `<a href="#"><i class="fas fa-search"></i> ${nombre.toUpperCase()} (${id})</a>`;

            // Al hacer clic en la sugerencia
            li.addEventListener("click", (e) => {
                e.preventDefault();
                inputSearch.value = nombre;
                filtrarPokemon(); // Refiltrar con el nombre exacto
                boxSearch.style.display = "none";
                if (coverCtnSearch) coverCtnSearch.style.display = "none";
            });

            boxSearch.appendChild(li);
        } else {
            // Ocultar tarjeta principal si no coincide
            pokemon.style.display = "none";
        }
    });
}

// Ocultar la lista desplegable al hacer clic fuera (en el cover)
if (coverCtnSearch) {
    coverCtnSearch.addEventListener("click", () => {
        boxSearch.style.display = "none";
        coverCtnSearch.style.display = "none";
    });
}