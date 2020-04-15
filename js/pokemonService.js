'use strict';

var pokemonCount = 1;

function getPokemons(onSuccess) {
    $.get(`https://pokeapi.co/api/v2/pokemon/${pokemonCount++}/`, (res) => {
        console.log('Service Got:', res);
        onSuccess(res);
    });
}















