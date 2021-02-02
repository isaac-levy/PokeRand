const getPokemon = () => {
  const rand = Math.floor(Math.random() * 898) + 1;

  chrome.storage.local.get([`${rand}`], (result) => {
    const pokeObj = result[rand];

    if (pokeObj == undefined) {
      findAndSavePoke(rand);
    } else {
      printPopup(pokeObj);
      console.log(`Retrieved ${pokeObj.name}`);
    }
  });
};

const findAndSavePoke = (id) => {
  $.get(`https://pokeapi.co/api/v2/pokemon/${id}`, (res) => {
    const newPokeObj = {};

    newPokeObj[id] = {
      name: res.name,
      sprite: res.sprites.front_default,
      types: res.types,
      id: res.id,
    };

    chrome.storage.local.set(newPokeObj, () => {
      console.log(`Saved: ${res.name}`);
    });

    printPopup(newPokeObj[id], true);
  });
};

const printPopup = (pokemon, newPoke = false) => {
  let template,
    types = "";

  $(".container").html("");

  template = `
        <h1>${pokemon.name}</h1>
        <img src="${pokemon.sprite}" alt="Please connect to the internet to display ${pokemon.name}'s sprite" height="96" width="96"/>
        <h2>No. ${pokemon.id}</h2>
    `;

  types = `<div class="types">`;

  for (type of pokemon.types) {
    const name = type.type.name;
    types += `<div class="type color-${name}">${name}</div>`;
  }

  types += "</div>";

  $(".container").append(template);
  $(".container").append(types);

  if (!newPoke) {
    $(".container").append(`<span class="already-found"></span>`);
  }
};

$(".container").click(() => {
  $(".container").html("");
  $(".container").append('<h1 class="loading">Loading...</h1>');
  getPokemon();
});

getPokemon();
