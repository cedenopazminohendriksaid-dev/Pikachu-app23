// Elementos principales

const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");

const btnFavoritos = document.getElementById("ver-favoritos");
const contadorFavoritos = document.getElementById("contador-favoritos");

const links = document.querySelectorAll(".link");
const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");
const paginationList = document.querySelector(".pagination ul");

const inputSearch = document.getElementById("inputSearch");


// Elementos del popup

const popup = document.getElementById("miPopup");
const btnCerrar = document.getElementById("btnCerrar");

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


// Configuración de la Pokédex

const URL = "https://pokeapi.co/api/v2/pokemon/";

const TOTAL_POKEMON = 1025;
const POKEMONS_POR_PAGINA = 20;
const TOTAL_PAGINAS = Math.ceil(TOTAL_POKEMON / POKEMONS_POR_PAGINA);

let currentValue = 1;


// Favoritos guardados en el navegador

let favoritos = JSON.parse(
    localStorage.getItem("favoritosPokemon")
) || [];


// Lista de nombres que utiliza el buscador

let listaNombresPokemon = [];


// Actualiza el texto que aparece junto al botón de favoritos

function actualizarContadorFavoritos() {

    if (!contadorFavoritos) {
        return;
    }

    if (favoritos.length === 0) {
        contadorFavoritos.textContent = "";
        return;
    }

    contadorFavoritos.textContent =
        favoritos.length === 1
            ? "1 guardado"
            : `${favoritos.length} guardados`;
}


// Guarda los favoritos en localStorage

function guardarFavoritos() {

    localStorage.setItem(
        "favoritosPokemon",
        JSON.stringify(favoritos)
    );

    actualizarContadorFavoritos();
}


// Cambia el estado de favorito de un Pokémon

function cambiarFavorito(id, boton) {

    if (favoritos.includes(id)) {

        favoritos = favoritos.filter(
            favorito => favorito !== id
        );

        boton.classList.remove("favorito");
        boton.title = "Agregar a favoritos";

    } else {

        favoritos.push(id);

        boton.classList.add("favorito");
        boton.title = "Quitar de favoritos";
    }

    guardarFavoritos();
}


// Carga los nombres de todos los Pokémon para el buscador

async function cargarNombresPokemon() {

    try {

        const respuesta = await fetch(
            `${URL}?limit=${TOTAL_POKEMON}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la lista de Pokémon");
        }

        const datos = await respuesta.json();

        listaNombresPokemon = datos.results;

    } catch (error) {

        console.error(
            "No se pudo cargar la lista para el buscador:",
            error
        );
    }
}


// Busca un Pokémon por nombre o número

async function buscarPokemonAPI(busqueda) {

    try {

        const respuesta = await fetch(
            `${URL}${busqueda}`
        );

        if (!respuesta.ok) {
            return null;
        }

        return await respuesta.json();

    } catch (error) {

        console.error(
            "Error al buscar Pokémon:",
            error
        );

        return null;
    }
}


// Carga una página de Pokémon

async function cargarPagina(pagina) {

    listaPokemon.innerHTML = "";

    const inicio =
        (pagina - 1) * POKEMONS_POR_PAGINA + 1;

    const fin =
        Math.min(
            pagina * POKEMONS_POR_PAGINA,
            TOTAL_POKEMON
        );

    try {

        // Se solicitan todos los Pokémon de la página
        // y después se muestran en el mismo orden.

        const peticiones = [];

        for (let id = inicio; id <= fin; id++) {

            peticiones.push(
                buscarPokemonAPI(id)
            );
        }

        const pokemons = await Promise.all(peticiones);

        pokemons.forEach(pokemon => {

            if (pokemon) {
                mostrarPokemon(pokemon);
            }

        });

    } catch (error) {

        console.error(
            "Error al cargar la página:",
            error
        );
    }
}


// Crea la tarjeta de cada Pokémon

function mostrarPokemon(poke) {

    const tipos = poke.types
        .map(type => {

            return `
                <p class="${type.type.name} tipo">
                    ${type.type.name}
                </p>
            `;

        })
        .join("");


    const pokeId = poke.id
        .toString()
        .padStart(3, "0");


    const altura = poke.height / 10;
    const peso = poke.weight / 10;


    const imagen =
        poke.sprites.other["official-artwork"].front_default ||
        poke.sprites.front_default;


    const div = document.createElement("div");

    div.classList.add("pokemon");


    div.innerHTML = `

        <p class="pokemon-id-back">
            #${pokeId}
        </p>

        <div class="pokemon-imagen">

            <img
                src="${imagen}"
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
                    ${altura}m
                </p>

                <p class="stat">
                    ${peso}kg
                </p>

            </div>

        </div>
    `;


    // Botón para guardar o quitar de favoritos

    const botonFavorito =
        document.createElement("button");

    botonFavorito.classList.add(
        "boton-favorito"
    );

    botonFavorito.textContent = "👍";


    const esFavorito =
        favoritos.includes(poke.id);


    if (esFavorito) {

        botonFavorito.classList.add(
            "favorito"
        );

    }


    botonFavorito.title =
        esFavorito
            ? "Quitar de favoritos"
            : "Agregar a favoritos";


    botonFavorito.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            cambiarFavorito(
                poke.id,
                botonFavorito
            );

        }
    );


    div.appendChild(
        botonFavorito
    );


    // Al hacer clic en la tarjeta se abre el popup

    div.addEventListener(
        "click",
        () => {

            mostrarPopup(
                poke,
                imagen,
                pokeId
            );

        }
    );


    listaPokemon.appendChild(div);
}


// Llena todos los datos del popup

function mostrarPopup(
    poke,
    imagen,
    pokeId
) {

    popupImagen.src = imagen;
    popupImagen.alt = poke.name;

    popupNombre.textContent =
        poke.name.toUpperCase();

    popupId.textContent =
        `#${pokeId}`;


    // Tipos

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


    // Altura y peso

    popupAltura.textContent =
        `Altura: ${poke.height / 10} m`;

    popupPeso.textContent =
        `Peso: ${poke.weight / 10} kg`;


    // Busca una estadística por su nombre

    function obtenerEstadistica(nombre) {

        const estadistica =
            poke.stats.find(
                stat => stat.stat.name === nombre
            );

        return estadistica
            ? estadistica.base_stat
            : 0;
    }


    // Estadísticas

    popupHp.textContent =
        `HP: ${obtenerEstadistica("hp")}`;

    popupAtaque.textContent =
        `Ataque: ${obtenerEstadistica("attack")}`;

    popupDefensa.textContent =
        `Defensa: ${obtenerEstadistica("defense")}`;

    popupAtaqueEspecial.textContent =
        `Ataque especial: ${obtenerEstadistica("special-attack")}`;

    popupDefensaEspecial.textContent =
        `Defensa especial: ${obtenerEstadistica("special-defense")}`;

    popupVelocidad.textContent =
        `Velocidad: ${obtenerEstadistica("speed")}`;


    // Mostrar popup

    popup.style.display = "flex";
}


// Actualiza el número de página seleccionado

function actualizarPaginaActiva() {

    links.forEach(link => {

        link.classList.remove("active");

    });


    const paginaActual =
        links[currentValue - 1];


    if (paginaActual) {

        paginaActual.classList.add(
            "active"
        );

    }


    // Mantiene visible el número de página actual

    if (paginationList) {

        const itemWidth = 41;
        const paginasVisibles = 8;

        let posicion =
            (
                currentValue -
                Math.floor(paginasVisibles / 2)
            ) * itemWidth;


        if (posicion < 0) {
            posicion = 0;
        }


        paginationList.scrollTo({

            left: posicion,

            behavior: "smooth"

        });
    }
}


// Cambiar directamente de página

links.forEach(link => {

    link.addEventListener(
        "click",
        event => {

            currentValue =
                parseInt(
                    event.currentTarget
                        .getAttribute("value")
                );

            actualizarPaginaActiva();

            cargarPagina(
                currentValue
            );

        }
    );

});


// Botón anterior

if (btnBack) {

    btnBack.addEventListener(
        "click",
        () => {

            if (currentValue > 1) {

                currentValue--;

                actualizarPaginaActiva();

                cargarPagina(
                    currentValue
                );
            }

        }
    );
}


// Botón siguiente

if (btnNext) {

    btnNext.addEventListener(
        "click",
        () => {

            if (
                currentValue <
                TOTAL_PAGINAS
            ) {

                currentValue++;

                actualizarPaginaActiva();

                cargarPagina(
                    currentValue
                );
            }

        }
    );
}


// Filtrar Pokémon por tipo

async function filtrarPorTipo(tipo) {

    listaPokemon.innerHTML = "";

    try {

        // Primero obtenemos los Pokémon que pertenecen
        // al tipo seleccionado.

        const respuesta = await fetch(
            `https://pokeapi.co/api/v2/type/${tipo}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el tipo");
        }

        const datos = await respuesta.json();


        // Cargamos los datos completos de cada Pokémon.

        const resultados =
            datos.pokemon
                .map(item => {

                    const id =
                        item.pokemon.url
                            .split("/")
                            .filter(Boolean)
                            .pop();

                    return parseInt(id);

                })
                .filter(id => id <= TOTAL_POKEMON);


        const peticiones =
            resultados.map(
                id => buscarPokemonAPI(id)
            );


        const pokemons =
            await Promise.all(peticiones);


        pokemons.forEach(pokemon => {

            if (pokemon) {
                mostrarPokemon(pokemon);
            }

        });

    } catch (error) {

        console.error(
            "Error al filtrar Pokémon:",
            error
        );
    }
}


// Botones del menú superior

botonesHeader.forEach(boton => {

    boton.addEventListener(
        "click",
        event => {

            const botonId =
                event.currentTarget.id;


            // Ver todos

            if (botonId === "ver-todos") {

                currentValue = 1;

                actualizarPaginaActiva();

                cargarPagina(1);

                return;
            }


            // Estos botones son filtros de tipo.
            // Inicio y favoritos tienen su propio evento.

            const tiposValidos = [
                "normal",
                "fire",
                "water",
                "grass",
                "electric",
                "ice",
                "fighting",
                "poison",
                "ground",
                "flying",
                "psychic",
                "bug",
                "rock",
                "ghost",
                "dark",
                "dragon",
                "steel",
                "fairy"
            ];


            if (
                tiposValidos.includes(
                    botonId
                )
            ) {

                filtrarPorTipo(
                    botonId
                );

            }

        }
    );

});


// Buscador

if (inputSearch) {

    inputSearch.addEventListener(
        "input",
        async () => {

            const busqueda =
                inputSearch.value
                    .toLowerCase()
                    .trim();


            // Si el buscador queda vacío,
            // regresamos a la página actual.

            if (busqueda === "") {

                cargarPagina(
                    currentValue
                );

                return;
            }


            // Busca coincidencias por nombre o número.

            const resultados =
                listaNombresPokemon.filter(
                    pokemon => {

                        const numero =
                            pokemon.url
                                .split("/")
                                .filter(Boolean)
                                .pop();


                        return (
                            pokemon.name.includes(
                                busqueda
                            ) ||
                            numero.includes(
                                busqueda
                            )
                        );

                    }
                );


            // Si no existe ningún resultado

            if (
                resultados.length === 0
            ) {

                listaPokemon.innerHTML = `
                    <p style="
                        text-align:center;
                        width:100%;
                        font-size:1.2rem;
                        font-weight:600;
                    ">
                        Pokémon no encontrado
                    </p>
                `;

                return;
            }


            // Tomamos la primera coincidencia.

            const resultado =
                resultados[0];


            const numero =
                resultado.url
                    .split("/")
                    .filter(Boolean)
                    .pop();


            const pokemon =
                await buscarPokemonAPI(
                    numero
                );


            if (pokemon) {

                listaPokemon.innerHTML = "";

                mostrarPokemon(
                    pokemon
                );

            }

        }
    );
}


// Cerrar popup con la X

if (btnCerrar) {

    btnCerrar.addEventListener(
        "click",
        () => {

            popup.style.display = "none";

        }
    );
}


// Cerrar popup con la tecla ESC

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            popup.style.display === "flex"
        ) {

            popup.style.display = "none";

        }

    }
);


// Mostrar favoritos

if (btnFavoritos) {

    btnFavoritos.addEventListener(
        "click",
        async () => {

            listaPokemon.innerHTML = "";


            // Si todavía no hay favoritos

            if (favoritos.length === 0) {

                listaPokemon.innerHTML = `
                    <p style="
                        width:100%;
                        text-align:center;
                        font-size:1.2rem;
                        font-weight:600;
                    ">
                        No tienes Pokémon favoritos 👍
                    </p>
                `;

                return;
            }


            // Cargar cada favorito

            const peticiones =
                favoritos.map(
                    id => buscarPokemonAPI(id)
                );


            const pokemons =
                await Promise.all(
                    peticiones
                );


            pokemons.forEach(pokemon => {

                if (pokemon) {
                    mostrarPokemon(
                        pokemon
                    );
                }

            });

        }
    );
}


// Botón Inicio

const btnInicio =
    document.getElementById("btn-inicio");


if (btnInicio) {

    btnInicio.addEventListener(
        "click",
        () => {

            currentValue = 1;

            inputSearch.value = "";

            actualizarPaginaActiva();

            cargarPagina(1);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );
}


// Al iniciar la página

actualizarPaginaActiva();

cargarPagina(1);

cargarNombresPokemon();

actualizarContadorFavoritos();