
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const maxRecords = 251
const limit = 10;
let offset = 0;


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {      
            //nova lista
            pokemonList.innerHTML += pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}" onclick="selectPokemon(${pokemon.number})")>
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>    
                <div class="detail">
                    <ol class="types">
                       ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
                </div>              
            </li>  
            `
            ).join('')    
        })
       
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
   
    const qtdeRecordNexPage = offset + limit

    if(qtdeRecordNexPage => maxRecords){
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    }else {
        loadPokemonItens(offset, limit)
    }
})

const selectPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const pokemon = await res.json();

  popup(pokemon);
};

const popup = (pokemon) => {
  const types = pokemon.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;
  const abilities = pokemon.abilities.map((abilitySlot) => abilitySlot.ability.name);

  pokemon.types = types;
  pokemon.type = type;

  const photo = pokemon.sprites.other.dream_world.front_default;
  pokemon.abilities = abilities;

  const htmlString = `
    <div class="${pokemon.type}" id="modal">
    <section class="detailPokemon ${pokemon.type}">
      <div class="pokeHeader">
        <button id="goBackButton" onClick="closeModal()">
          <img src="assets/img/go-back.png" alt="Voltar <-" />
        </button>
        <h1 id="pokeDetailName">${pokemon.name}</h1>
        <span id="pokeDetailNumber">#${pokemon.id}</span>
        <ul class="pokeDetailTypes">
          ${pokemon.types .map((type) => `
          <li class="pokeDetailType ${type}">${type}</li>
          `) .join("")}
        </ul>
      </div>

      <figure>
        <img src="${photo}" alt="${pokemon.name} image" class="pokeDetailImage" />
      </figure>

      <section class="pokeDetailContent">
        <h2 class="pokeDetailData">Sobre</h2>
        <ul class="pokeDetailAbout">
          <li><strong>Altura</strong></li>
          <li>${(pokemon.height / 10).toFixed(2)} m</li>
          <li><strong>Peso</strong></li>
          <li>${(pokemon.weight / 10).toFixed(2)} kg</li>
          <li><strong>Abilidades</strong></li>
          <li>${pokemon.abilities.slice().join(", ")}</li>
        </ul>
        <h2 class="pokeDetailData">Status base</h2>
        <div class="pokeDetailStatus">
          <div class="statusName">
            ${pokemon.stats .map((name_stats) => `
            <p class="${type}">${name_stats.stat.name}</p>
            `) .join("")}
          </div>
          <div class="statusNum">
            ${pokemon.stats .map((base_stats) => `
            <p>${base_stats.base_stat}</p>
            `) .join("")}
          </div>
        </div>
      </section>
    </section>
  </div>`;
  pokemonList.innerHTML += htmlString;
};

const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.parentElement.removeChild(modal);
}








