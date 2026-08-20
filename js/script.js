// Elementos del DOM
const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const links = document.querySelectorAll(".link");

const btnBack = document.querySelector("#btn-back");
const btnNext = document.querySelector("#btn-next");
const paginationList = document.querySelector(".pagination ul");

// Modal / Popup
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

// Buscador
const inputSearch = document.getElementById("inputSearch");
const boxSearch = document.getElementById("box-search");
const coverCtnSearch = document.getElementById("cover-ctn-search");

// Configuración general
const URL = "https://pokeapi.co/api/v2/pokemon/";

let currentValue = 1;

const TOTAL_POKEMON = 1025;
const POKEMONS_POR_PAGINA = 20;
const TOTAL_PAGINAS = 52;

// Lista en memoria para buscar rápido
let listaNombresPokemon = [];

// Precarga todos los nombres para la búsqueda global
async function cargarNombresPokemon() {

    try {

        const respuesta = await fetch(
            `${URL}?limit=${TOTAL_POKEMON}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la lista");
        }

        const datos = await respuesta.json();

        listaNombresPokemon = datos.results;

    } catch (error) {

        console.error(
            "Error al cargar los nombres:",
            error
        );

    }
}

// Renderiza los 20 Pokémon de la página actual
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

            .then(response => {

                if (!response.ok) {
                    throw new Error("Error al cargar Pokémon");
                }

                return response.json();

            })

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

// Pinta la card del Pokémon en el grid
function mostrarPokemon(poke) {

    // Tipos de elementos
    const tipos = poke.types

        .map(type => {

            return `
                <p class="${type.type.name} tipo">
                    ${type.type.name}
                </p>
            `;

        })

        .join("");

    // Formato de ID (#001)
    const pokeId =
        poke.id.toString().padStart(3, "0");

    // Decímetros/Hectogramos a M y KG
    const alturaEnMetros =
        poke.height / 10;

    const pesoEnKg =
        poke.weight / 10;

    // Sprite oficial o fallback
    const imagenPokemon =
        poke.sprites.other["official-artwork"].front_default
        || poke.sprites.front_default;

    // Crear la tarjeta
    const div = document.createElement("div");

    div.classList.add("pokemon");

    div.innerHTML = `

        <p class="pokemon-id-back">
            #${pokeId}
        </p>

        <div class="pokemon-imagen">

            <img
                src="${imagenPokemon}"
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

    // Abrir modal con datos completos al dar clic
    div.addEventListener("click", () => {

        popupImagen.src = imagenPokemon;

        popupImagen.alt = poke.name;

        popupNombre.textContent =
            poke.name.toUpperCase();

        popupId.textContent =
            `#${pokeId}`;

        popupTipos.innerHTML = poke.types

            .map(type => {

                return `
                    <span class="${type.type.name} tipo">
                        ${type.type.name}
                    </span>
                `;

            })

            .join("");

        popupAltura.textContent =
            `Altura: ${poke.height / 10} m`;

        popupPeso.textContent =
            `Peso: ${poke.weight / 10} kg`;

        // Helper para extraer stat por nombre
        function obtenerEstadistica(nombre) {

            const estadistica =
                poke.stats.find(
                    stat =>
                        stat.stat.name === nombre
                );

            if (estadistica) {
                return estadistica.base_stat;
            }

            return 0;

        }

        // Asignar stats al modal
        if (popupHp) {

            popupHp.textContent =
                `HP: ${obtenerEstadistica("hp")}`;

        }

        if (popupAtaque) {

            popupAtaque.textContent =
                `Ataque: ${obtenerEstadistica("attack")}`;

        }

        if (popupDefensa) {

            popupDefensa.textContent =
                `Defensa: ${obtenerEstadistica("defense")}`;

        }

        if (popupAtaqueEspecial) {

            popupAtaqueEspecial.textContent =
                `Ataque especial: ${obtenerEstadistica("special-attack")}`;

        }

        if (popupDefensaEspecial) {

            popupDefensaEspecial.textContent =
                `Defensa especial: ${obtenerEstadistica("special-defense")}`;

        }

        if (popupVelocidad) {

            popupVelocidad.textContent =
                `Velocidad: ${obtenerEstadistica("speed")}`;

        }

        popup.style.display = "flex";

    });

    listaPokemon.appendChild(div);

}

// Actualiza botones activos y scroll de la paginación
function updateActive() {

    links.forEach(link => {

        link.classList.remove("active");

    });

    if (links[currentValue - 1]) {

        links[currentValue - 1]
            .classList.add("active");

    }

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

    cargarPagina(currentValue);

}

// Navegación por número de página
links.forEach(link => {

    link.addEventListener("click", event => {

        currentValue =
            parseInt(
                event.currentTarget.getAttribute("value")
            );

        updateActive();

    });

});

// Botón anterior
if (btnBack) {

    btnBack.addEventListener("click", () => {

        if (currentValue > 1) {

            currentValue--;

            updateActive();

        }

    });

}

// Botón siguiente
if (btnNext) {

    btnNext.addEventListener("click", () => {

        if (currentValue < TOTAL_PAGINAS) {

            currentValue++;

            updateActive();

        }

    });

}

// Filtros de la barra superior
botonesHeader.forEach(boton => {

    boton.addEventListener("click", event => {

        const botonId =
            event.currentTarget.id;

        listaPokemon.innerHTML = "";

        // Resetear vista
        if (botonId === "ver-todos") {

            currentValue = 1;

            updateActive();

            return;

        }

        // Traer de la API los que coincidan con el tipo
        for (
            let i = 1;
            i <= TOTAL_POKEMON;
            i++
        ) {

            fetch(URL + i)

                .then(response => {

                    if (!response.ok) {
                        throw new Error(
                            "Error al cargar Pokémon"
                        );
                    }

                    return response.json();

                })

                .then(data => {

                    const tipos =
                        data.types.map(
                            type =>
                                type.type.name
                        );

                    if (
                        tipos.includes(botonId)
                    ) {

                        mostrarPokemon(data);

                    }

                })

                .catch(error => {

                    console.error(
                        "Error al filtrar:",
                        error
                    );

                });

        }

    });

});

// Fetch directo a un Pokémon específico
async function buscarPokemonAPI(busqueda) {

    try {

        const respuesta =
            await fetch(URL + busqueda);

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

// Búsqueda en tiempo real
if (inputSearch) {

    inputSearch.addEventListener(
        "input",
        async () => {

            const busqueda =
                inputSearch.value
                    .toLowerCase()
                    .trim();

            // Si limpia el input, restaura la página
            if (busqueda === "") {

                listaPokemon.innerHTML = "";

                cargarPagina(currentValue);

                return;

            }

            // Filtrar por nombre o ID
            const resultados =
                listaNombresPokemon.filter(
                    pokemon => {

                        const numero =
                            pokemon.url
                                .split("/")
                                .filter(Boolean)
                                .pop();

                        return (
                            pokemon.name.includes(busqueda)
                            ||
                            numero.includes(busqueda)
                        );

                    }
                );

            // Mensaje si no hay match
            if (resultados.length === 0) {

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

            // Cargar el primer resultado coincidente
            const primerResultado =
                resultados[0];

            const numero =
                primerResultado.url
                    .split("/")
                    .filter(Boolean)
                    .pop();

            const pokemon =
                await buscarPokemonAPI(numero);

            if (pokemon) {

                listaPokemon.innerHTML = "";

                mostrarPokemon(pokemon);

            }

        }
    );

}

// Cerrar modal con botón X
if (btnCerrar) {

    btnCerrar.addEventListener("click", () => {

        popup.style.display = "none";

    });

}

// Cerrar modal al hacer clic en el backdrop
if (popup) {

    popup.addEventListener("click", event => {

        if (event.target === popup) {

            popup.style.display = "none";

        }

    });

}

// Cerrar modal con la tecla Escape
document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        if (popup) {

            popup.style.display = "none";

        }

    }

});

// Inicialización
cargarPagina(1);
cargarNombresPokemon();