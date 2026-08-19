const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const links = document.querySelectorAll(".link");
const btnBack = document.querySelector("#btn-back");
const btnNext = document.querySelector("#btn-next");
const paginationList = document.querySelector(".pagination ul");

let URL = "https://pokeapi.co/api/v2/pokemon/";
let currentValue = 1;

const TOTAL_POKEMON = 1025; // Límite actual de Pokémon en PokeAPI
const POKEMONS_POR_PAGINA = 20;
const TOTAL_PAGINAS = 52;


// ==========================================
// CARGAR POKÉMON POR PÁGINA
// ==========================================

function cargarPagina(pagina) {
    listaPokemon.innerHTML = "";

    let inicio = (pagina - 1) * POKEMONS_POR_PAGINA + 1;
    let fin = pagina * POKEMONS_POR_PAGINA;

    if (fin > TOTAL_POKEMON) {
        fin = TOTAL_POKEMON;
    }

    for (let i = inicio; i <= fin; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => mostrarPokemon(data));
    }
}


// ==========================================
// MOSTRAR POKÉMON
// ==========================================

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => 
        `<p class="${type.type.name} tipo">${type.type.name}</p>`
    );

    tipos = tipos.join('');

    let pokeId = poke.id.toString().padStart(3, '0');

    const alturaEnMetros = poke.height / 10;
    const pesoEnKg = poke.weight / 10;

    const div = document.createElement("div");

    div.classList.add("pokemon");

    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>

        <div class="pokemon-imagen">
            <img 
                src="${poke.sprites.other["official-artwork"].front_default || poke.sprites.front_default}" 
                alt="${poke.name}"
            >
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


// ==========================================
// CONTROL DE PAGINACIÓN CON DESPLAZAMIENTO SUAVE
// ==========================================

function updateActive() {

    // 1. Quitar la clase active de todos los links
    links.forEach(link => link.classList.remove("active"));

    // 2. Activar el botón de la página actual
    if (links[currentValue - 1]) {
        links[currentValue - 1].classList.add("active");
    }

    // 3. Mover la tira de números para ver máximo 8 a la vez
    if (paginationList) {
        const itemWidth = 41; // 38px de ancho del botón + 3px de espacio (gap)
        const maxVisible = 8;  // Cantidad máxima visible en pantalla

        // Centramos la página actual dentro de los 8 visibles
        let scrollPosition = (currentValue - Math.floor(maxVisible / 2)) * itemWidth;

        // Evitar desplazamientos negativos si estamos al inicio (páginas 1 a 4)
        if (scrollPosition < 0) scrollPosition = 0;

        // Transición suave horizontal
        paginationList.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }

    // 4. Cargar la API con los Pokémon de esa página
    cargarPagina(currentValue);
}


// ==========================================
// BOTONES DE LAS PÁGINAS
// ==========================================

links.forEach(link => {

    link.addEventListener("click", (e) => {

        currentValue = parseInt(
            e.target.getAttribute("value")
        );

        updateActive();

    });

});


// ==========================================
// BOTÓN ANTERIOR
// ==========================================

if (btnBack) {

    btnBack.addEventListener("click", () => {

        if (currentValue > 1) {

            currentValue--;

            updateActive();

        }

    });

}


// ==========================================
// BOTÓN SIGUIENTE
// ==========================================

if (btnNext) {

    btnNext.addEventListener("click", () => {

        if (currentValue < TOTAL_PAGINAS) {

            currentValue++;

            updateActive();

        }

    });

}


// ==========================================
// FILTROS POR TIPO
// ==========================================

botonesHeader.forEach(boton => 

    boton.addEventListener("click", (event) => {

        const botonId = event.currentTarget.id;

        listaPokemon.innerHTML = "";

        if (botonId === "ver-todos") {

            currentValue = 1;

            updateActive();

            return;
        }


        for (let i = 1; i <= TOTAL_POKEMON; i++) {

            fetch(URL + i)
                .then((response) => response.json())
                .then(data => {

                    const tipos = data.types.map(
                        type => type.type.name
                    );

                    if (tipos.some(tipo => tipo.includes(botonId))) {

                        mostrarPokemon(data);

                    }

                });

        }

    })

);


// ==========================================
// BUSCADOR
// ==========================================

const inputSearch = document.getElementById("inputSearch");
const boxSearch = document.getElementById("box-search");
const coverCtnSearch = document.getElementById("cover-ctn-search");


if (inputSearch) {

    inputSearch.addEventListener(
        "keyup", 
        filtrarPokemon
    );

}


function filtrarPokemon() {

    const filter = inputSearch.value
        .toLowerCase()
        .trim();

    const pokemons = document.querySelectorAll(".pokemon");

    boxSearch.innerHTML = "";


    if (filter === "") {

        boxSearch.style.display = "none";

        if (coverCtnSearch) {
            coverCtnSearch.style.display = "none";
        }

        pokemons.forEach(
            pokemon => pokemon.style.display = "block"
        );

        return;
    }


    boxSearch.style.display = "block";

    if (coverCtnSearch) {
        coverCtnSearch.style.display = "block";
    }


    pokemons.forEach(pokemon => {

        const nombre = pokemon
            .querySelector(".pokemon-nombre")
            .textContent
            .toLowerCase();

        const id = pokemon
            .querySelector(".pokemon-id")
            .textContent
            .toLowerCase();


        if (
            nombre.includes(filter) ||
            id.includes(filter)
        ) {

            pokemon.style.display = "block";


            const li = document.createElement("li");

            li.innerHTML = `
                <a href="#">
                    <i class="fas fa-search"></i> 
                    ${nombre.toUpperCase()} 
                    (${id})
                </a>
            `;


            li.addEventListener("click", (e) => {

                e.preventDefault();

                inputSearch.value = nombre;

                filtrarPokemon();

                boxSearch.style.display = "none";

                if (coverCtnSearch) {
                    coverCtnSearch.style.display = "none";
                }

            });


            boxSearch.appendChild(li);


        } else {

            pokemon.style.display = "none";

        }

    });

}


// ==========================================
// CERRAR BUSCADOR AL HACER CLIC AFUERA
// ==========================================

if (coverCtnSearch) {

    coverCtnSearch.addEventListener("click", () => {

        boxSearch.style.display = "none";

        coverCtnSearch.style.display = "none";

    });

}


// ==========================================
// INICIALIZACIÓN
// ==========================================

cargarPagina(1);