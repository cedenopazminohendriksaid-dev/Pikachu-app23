// ============================================================
// ELEMENTOS DE LA PÁGINA
// ============================================================

const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const links = document.querySelectorAll(".link");

const btnBack = document.querySelector("#btn-back");
const btnNext = document.querySelector("#btn-next");
const paginationList = document.querySelector(".pagination ul");


// ============================================================
// ELEMENTOS DEL POPUP
// ============================================================

const popup = document.getElementById("miPopup");

const popupImagen = document.getElementById("popupImagen");
const popupNombre = document.getElementById("popupNombre");
const popupId = document.getElementById("popupId");
const popupTipos = document.getElementById("popupTipos");

const popupAltura = document.getElementById("popupAltura");
const popupPeso = document.getElementById("popupPeso");

const popupHp = document.getElementById("popupHp");
const popupAtaque = document.getElementById("popupAtaque");
const popupDefensa = document.getElementById("popupDefensa");
const popupAtaqueEspecial = document.getElementById("popupAtaqueEspecial");
const popupDefensaEspecial = document.getElementById("popupDefensaEspecial");
const popupVelocidad = document.getElementById("popupVelocidad");

const btnCerrar = document.getElementById("btnCerrar");


// ============================================================
// CONFIGURACIÓN
// ============================================================

const URL = "https://pokeapi.co/api/v2/pokemon/";

let currentValue = 1;

const TOTAL_POKEMON = 1025;
const POKEMONS_POR_PAGINA = 20;
const TOTAL_PAGINAS = 52;


// ============================================================
// CARGAR POKÉMON POR PÁGINA
// ============================================================

function cargarPagina(pagina) {

    listaPokemon.innerHTML = "";

    const inicio =
        (pagina - 1) * POKEMONS_POR_PAGINA + 1;

    let fin =
        pagina * POKEMONS_POR_PAGINA;

    if (fin > TOTAL_POKEMON) {
        fin = TOTAL_POKEMON;
    }

    for (let i = inicio; i <= fin; i++) {

        fetch(URL + i)
            .then(response => response.json())
            .then(data => {

                mostrarPokemon(data);

            })
            .catch(error => {

                console.error(
                    "Error al cargar Pokémon:",
                    error
                );

            });
    }
}


// ============================================================
// MOSTRAR POKÉMON
// ============================================================

function mostrarPokemon(poke) {

    // --------------------------------------------------------
    // TIPOS
    // --------------------------------------------------------

    let tipos = poke.types.map(type => {

        return `
            <p class="${type.type.name} tipo">
                ${type.type.name}
            </p>
        `;

    });

    tipos = tipos.join("");


    // --------------------------------------------------------
    // ID
    // --------------------------------------------------------

    const pokeId =
        poke.id.toString().padStart(3, "0");


    // --------------------------------------------------------
    // ALTURA Y PESO
    // --------------------------------------------------------

    const alturaEnMetros =
        poke.height / 10;

    const pesoEnKg =
        poke.weight / 10;


    // --------------------------------------------------------
    // CREAR TARJETA
    // --------------------------------------------------------

    const div =
        document.createElement("div");

    div.classList.add("pokemon");


    // --------------------------------------------------------
    // HTML DE LA TARJETA
    // --------------------------------------------------------

    div.innerHTML = `

        <p class="pokemon-id-back">
            #${pokeId}
        </p>


        <div class="pokemon-imagen">

            <img
                src="${
                    poke.sprites.other["official-artwork"].front_default
                    || poke.sprites.front_default
                }"
                alt="${poke.name}"
            >

        </div>


        <div class="pokemon-info">


            <div class="nombre-contenedor">

                <p class="pokemon-id">
                    #${pokeId}
                </p>

                <h2 class="pokemon-nombre">
                    ${poke.name}
                </h2>

            </div>


            <div class="pokemon-tipos">

                ${tipos}

            </div>


            <div class="pokemon-stats">

                <p class="stat">
                    ${alturaEnMetros}m
                </p>

                <p class="stat">
                    ${pesoEnKg}kg
                </p>

            </div>


        </div>

    `;


    // ========================================================
    // ABRIR POPUP
    // ========================================================

    div.addEventListener("click", () => {


        // ----------------------------------------------------
        // IMAGEN
        // ----------------------------------------------------

        popupImagen.src =
            poke.sprites.other["official-artwork"].front_default
            || poke.sprites.front_default;

        popupImagen.alt =
            poke.name;


        // ----------------------------------------------------
        // NOMBRE
        // ----------------------------------------------------

        popupNombre.textContent =
            poke.name.toUpperCase();


        // ----------------------------------------------------
        // ID
        // ----------------------------------------------------

        popupId.textContent =
            `#${pokeId}`;


        // ----------------------------------------------------
        // TIPOS
        // ----------------------------------------------------

        popupTipos.innerHTML =

            poke.types
                .map(type => {

                    return `
                        <span class="${type.type.name} tipo">
                            ${type.type.name}
                        </span>
                    `;

                })
                .join("");


        // ----------------------------------------------------
        // ALTURA
        // ----------------------------------------------------

        popupAltura.textContent =
            `Altura: ${poke.height / 10} m`;


        // ----------------------------------------------------
        // PESO
        // ----------------------------------------------------

        popupPeso.textContent =
            `Peso: ${poke.weight / 10} kg`;


        // ====================================================
        // ESTADÍSTICAS
        // ====================================================

        popupHp.textContent =
            `HP: ${poke.stats[0].base_stat}`;


        popupAtaque.textContent =
            `Ataque: ${poke.stats[1].base_stat}`;


        popupDefensa.textContent =
            `Defensa: ${poke.stats[2].base_stat}`;


        popupAtaqueEspecial.textContent =
            `Ataque especial: ${poke.stats[3].base_stat}`;


        popupDefensaEspecial.textContent =
            `Defensa especial: ${poke.stats[4].base_stat}`;


        popupVelocidad.textContent =
            `Velocidad: ${poke.stats[5].base_stat}`;


        // ----------------------------------------------------
        // MOSTRAR POPUP
        // ----------------------------------------------------

        popup.style.display = "flex";

    });


    // --------------------------------------------------------
    // AGREGAR TARJETA A LA LISTA
    // --------------------------------------------------------

    listaPokemon.append(div);

}


// ============================================================
// CONTROL DE PAGINACIÓN
// ============================================================

function updateActive() {


    // --------------------------------------------------------
    // QUITAR ACTIVE
    // --------------------------------------------------------

    links.forEach(link => {

        link.classList.remove("active");

    });


    // --------------------------------------------------------
    // PONER ACTIVE EN LA PÁGINA ACTUAL
    // --------------------------------------------------------

    if (links[currentValue - 1]) {

        links[currentValue - 1]
            .classList.add("active");

    }


    // --------------------------------------------------------
    // MOVER PAGINACIÓN
    // --------------------------------------------------------

    if (paginationList) {

        const itemWidth = 41;
        const maxVisible = 8;

        let scrollPosition =
            (
                currentValue -
                Math.floor(maxVisible / 2)
            ) * itemWidth;


        if (scrollPosition < 0) {

            scrollPosition = 0;

        }


        paginationList.scrollTo({

            left: scrollPosition,
            behavior: "smooth"

        });

    }


    // --------------------------------------------------------
    // CARGAR PÁGINA
    // --------------------------------------------------------

    cargarPagina(currentValue);

}


// ============================================================
// BOTONES DE LAS PÁGINAS
// ============================================================

links.forEach(link => {

    link.addEventListener("click", e => {

        currentValue =
            parseInt(
                e.target.getAttribute("value")
            );

        updateActive();

    });

});


// ============================================================
// BOTÓN ANTERIOR
// ============================================================

if (btnBack) {

    btnBack.addEventListener("click", () => {


        if (currentValue > 1) {

            currentValue--;

            updateActive();

        }

    });

}


// ============================================================
// BOTÓN SIGUIENTE
// ============================================================

if (btnNext) {

    btnNext.addEventListener("click", () => {


        if (currentValue < TOTAL_PAGINAS) {

            currentValue++;

            updateActive();

        }

    });

}


// ============================================================
// FILTROS POR TIPO
// ============================================================

botonesHeader.forEach(boton => {

    boton.addEventListener("click", event => {


        const botonId =
            event.currentTarget.id;


        // ----------------------------------------------------
        // LIMPIAR LISTA
        // ----------------------------------------------------

        listaPokemon.innerHTML = "";


        // ----------------------------------------------------
        // VER TODOS
        // ----------------------------------------------------

        if (botonId === "ver-todos") {

            currentValue = 1;

            updateActive();

            return;

        }


        // ----------------------------------------------------
        // BUSCAR POR TIPO
        // ----------------------------------------------------

        for (
            let i = 1;
            i <= TOTAL_POKEMON;
            i++
        ) {

            fetch(URL + i)

                .then(response =>
                    response.json()
                )

                .then(data => {


                    const tipos =
                        data.types.map(
                            type =>
                                type.type.name
                        );


                    if (
                        tipos.some(
                            tipo =>
                                tipo.includes(botonId)
                        )
                    ) {

                        mostrarPokemon(data);

                    }

                })

                .catch(error => {

                    console.error(
                        "Error al filtrar Pokémon:",
                        error
                    );

                });

        }

    });

});


// ============================================================
// ELEMENTOS DEL BUSCADOR
// ============================================================

const inputSearch =
    document.getElementById("inputSearch");

const boxSearch =
    document.getElementById("box-search");

const coverCtnSearch =
    document.getElementById("cover-ctn-search");


// ============================================================
// BUSCAR POKÉMON EN LA API
// ============================================================

async function buscarPokemonAPI(busqueda) {

    try {


        const response =
            await fetch(URL + busqueda);


        if (!response.ok) {

            return null;

        }


        const data =
            await response.json();


        return data;


    } catch (error) {


        console.error(
            "Error al buscar Pokémon:",
            error
        );


        return null;

    }

}


// ============================================================
// MOSTRAR RESULTADO DEL BUSCADOR
// ============================================================

function mostrarResultadoBusqueda(pokemon) {


    boxSearch.innerHTML = "";


    const li =
        document.createElement("li");


    li.innerHTML = `

        <a href="#">

            ${pokemon.name.toUpperCase()}
            (#${pokemon.id})

        </a>

    `;


    // --------------------------------------------------------
    // CLICK EN RESULTADO
    // --------------------------------------------------------

    li.addEventListener("click", e => {

        e.preventDefault();


        listaPokemon.innerHTML = "";


        mostrarPokemon(pokemon);


        boxSearch.style.display =
            "none";


        if (coverCtnSearch) {

            coverCtnSearch.style.display =
                "none";

        }


        inputSearch.value =
            pokemon.name;

    });


    boxSearch.appendChild(li);


    boxSearch.style.display =
        "block";


    if (coverCtnSearch) {

        coverCtnSearch.style.display =
            "block";

    }

}


// ============================================================
// BUSCADOR
// ============================================================

if (inputSearch) {

    inputSearch.addEventListener(
        "keyup",
        async () => {


            const busqueda =
                inputSearch.value
                    .toLowerCase()
                    .trim();


            // ------------------------------------------------
            // BUSCADOR VACÍO
            // ------------------------------------------------

            if (busqueda === "") {


                boxSearch.innerHTML =
                    "";


                boxSearch.style.display =
                    "none";


                if (coverCtnSearch) {

                    coverCtnSearch.style.display =
                        "none";

                }


                cargarPagina(
                    currentValue
                );


                return;

            }


            // ------------------------------------------------
            // BUSCAR EN API
            // ------------------------------------------------

            const pokemon =
                await buscarPokemonAPI(
                    busqueda
                );


            // ------------------------------------------------
            // POKÉMON ENCONTRADO
            // ------------------------------------------------

            if (pokemon) {

                mostrarResultadoBusqueda(
                    pokemon
                );

            }

            // ------------------------------------------------
            // POKÉMON NO ENCONTRADO
            // ------------------------------------------------

            else {


                boxSearch.innerHTML = `

                    <li>

                        <a href="#">

                            Pokémon no encontrado

                        </a>

                    </li>

                `;


                boxSearch.style.display =
                    "block";


                if (coverCtnSearch) {

                    coverCtnSearch.style.display =
                        "block";

                }

            }

        }
    );

}


// ============================================================
// CERRAR BUSCADOR AL HACER CLICK AFUERA
// ============================================================

if (coverCtnSearch) {

    coverCtnSearch.addEventListener(
        "click",
        () => {


            boxSearch.style.display =
                "none";


            coverCtnSearch.style.display =
                "none";

        }
    );

}


// ============================================================
// CERRAR POPUP CON LA X
// ============================================================

if (btnCerrar) {

    btnCerrar.addEventListener(
        "click",
        () => {


            popup.style.display =
                "none";

        }
    );

}


// ============================================================
// CERRAR POPUP CON ESC
// ============================================================

document.addEventListener(
    "keydown",
    e => {


        if (e.key === "Escape") {

            popup.style.display =
                "none";

        }

    }
);


// ============================================================
// INICIAR PÁGINA
// ============================================================

cargarPagina(1);