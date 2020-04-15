'use strict';

var gPokemons = [];
var getSize = 20;
var callEnd = false;
var KEY = 'pokemonCollection';
var gCurrPokemonInterval;
var gLastAnimatedPokemon;
var gAnimating = false;
var gSort = 'id';

function populatePokemons() {

    var pokemonsInPokeball = loadFromStorage(KEY);
    if (pokemonsInPokeball) {

        gPokemons = pokemonsInPokeball;
        renderPokemons();
    } else {

        for (let i = 0; i < getSize; i++) {

            if (i === getSize - 1) callEnd = true;
            getPokemons(addPokemon);
        }
    }


}

function addPokemon(pokemon) {

    gPokemons.push(pokemon);

    if(callEnd) {

        renderPokemons();
    }

}

function renderPokemons() {

    gPokemons.sort(sortByType(gSort));
    var mappedPokemons = gPokemons.map(pokemon => {

        return `<div class="pokemon flex column hidden" onclick="toggleMenu('pokemon', this.dataset.num, this)" data-tilt data-num="${pokemon.id}" onmouseover="animatePokemon(this, this.dataset.num)" onmouseout="removeInterval(this, this.dataset.num)">
        <span class="name flex space-center">#${pokemon.id}:<p> ${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</p></span>
        <img src="${pokemon.sprites.front_default}" class="pokemon-img" onload="showPokemon(this)">
        <span class="flex space-between"><p class="weight">${pokemon.weight}lb</p><p class="type">${pokemon.types[pokemon.types.length - 1].type.name}</p></span>
    </div>`;

    });

    document.querySelector('.pokemons-section').innerHTML = mappedPokemons.join('');
    updatePokemonsStat();
    afterGettingPokemons();

}

function updatePokemonsStat() {

    document.querySelector('.poke-count').textContent = gPokemons.length;

}

function initTilt(elElement = null) {

    var allPokemon, tiltOptions = {};

    if(!elElement) {

        allPokemon = document.querySelectorAll('.pokemon');
        tiltOptions = {

            scale: 1.1,
            axis: 'x',
            speed: 400,
            perspective: 1000,
            gyroscope: false,
            max: 20
        }

    } else {
        // console.log('here!');
        
        allPokemon = elElement;
        tiltOptions = {

            speed: 450,
            perspective: 1000,
            gyroscope: false,
            max: 10
        }
    }

    VanillaTilt.init(allPokemon, tiltOptions);
}


function afterGettingPokemons() {

    initTilt();
    saveToStorage(KEY, gPokemons);
}

function animatePokemon(elPokemon, pokemonId = null) {

    // console.log(gAnimating);
    
    if(gAnimating) return;
    gAnimating = true;
    
    var elPokemonImg, pokemonIdx, backPokemonImage, frontPokemonImage;
    
    if(pokemonId) {
//         console.log('ended here');
        
        elPokemon.style.zIndex = '1';
        gLastAnimatedPokemon = elPokemon;
        elPokemonImg = elPokemon.querySelector('img');

        pokemonIdx = getPokemonById(pokemonId);
        backPokemonImage = gPokemons[pokemonIdx].sprites.back_default;
        frontPokemonImage = gPokemons[pokemonIdx].sprites.front_default;

    } else {
//         console.log('ended there');
        elPokemonImg = document.querySelector('.pokemon-modal .pokemon-img');
        backPokemonImage = elPokemon.sprites.back_default;
        frontPokemonImage = elPokemon.sprites.front_default;
    }


    gCurrPokemonInterval = setInterval(() => {
//         console.log('here');

        if (elPokemonImg.src === frontPokemonImage) {
            elPokemonImg.style.opacity = '0';
            setTimeout(() => {
                elPokemonImg.src = backPokemonImage;
                elPokemonImg.onload = () => {

                    elPokemonImg.style.opacity = '1';
                }
            }, 200);

        } else if (elPokemonImg.src === backPokemonImage) {

            elPokemonImg.style.opacity = '0';
            setTimeout(() => {
                elPokemonImg.src = frontPokemonImage;
                elPokemonImg.onload = () => {

                    elPokemonImg.style.opacity = '1';
                }
            }, 200);
        }

    }, 1250);

}


function getPokemonById(pokemonId) {

    var pokemonIdx = gPokemons.findIndex(pokemon => {
        
        return pokemon.id === +pokemonId;
    });

    return pokemonIdx;
}

function removeInterval(elPokemon, pokemonId) {

//     console.log('STOPPING INTERVAL');
    
    clearInterval(gCurrPokemonInterval);
    elPokemon.style.zIndex = 'unset';
    var pokemonIdx = gPokemons.findIndex(pokemon => {

        return pokemon.id === +pokemonId;
    });

    if(gLastAnimatedPokemon) {

        var lastAnimatedPokemonImg = gLastAnimatedPokemon.querySelector('img');
        var frontPokemonImage = gPokemons[pokemonIdx].sprites.front_default;
        var backPokemonImage = gPokemons[pokemonIdx].sprites.back_default;
    
        if(lastAnimatedPokemonImg.src === backPokemonImage) {
    
            lastAnimatedPokemonImg.style.opacity = '0';
            setTimeout(() => {
                lastAnimatedPokemonImg.src = frontPokemonImage;
                lastAnimatedPokemonImg.style.opacity = '1';
            }, 150);
    
        }
        gLastAnimatedPokemon = null;

    }
    gAnimating = false;
}


function showPokemon (elImg) {

    var elPokemon = elImg.parentElement;

    setTimeout(() => {

        elPokemon.classList.remove('hidden');
    }, Math.floor(Math.random() * 100) + 20);
}

function sortPokemons() {

    var newButtonText = 'by ';

    if(gSort === 'name') {

        gSort = 'id';
        newButtonText += 'Name'
    } else {

        gSort = 'name';
        newButtonText += 'ID #'
    }
    document.querySelector('.sort-pokemons').textContent = newButtonText;
    
    renderPokemons();
}


function toggleMenu(path, id = null, elPokemon) {
    
    if(event != undefined) event.stopPropagation();

    if(path === 'exit') {

        closeModal();
        setTimeout(() => {
            document.body.classList.remove('menu-open');
        }, 150);

    } else if (path === 'pokemon') {
        
        
        // removeInterval(elPokemon, id);
        
        document.body.classList.add('menu-open');
        var pokemon = gPokemons[getPokemonById(id)];
        openModal(pokemon);
    }

}

function openModal(pokemon) {

    var elModal = document.querySelector('.modal');

    updateModal(elModal, pokemon);
    initTilt(document.querySelector('.pokemon-modal'));
    setPokemonCardGradient();
    openElModal(elModal, pokemon);
}

function openElModal(elModal, pokemon) {
    
    elModal.classList.add('show');
    
    const gameboySound = new Audio ('../assets/sounds/gameboy.mp3');
    gameboySound.volume = '0.075';
    gameboySound.play();
    
    // gAnimating = false;
    
    setTimeout(() => {
        animatePokemon(pokemon);
    }, 500); 
}

function setPokemonCardGradient() {

    let elPokemon = document.querySelector('.pokemon-modal');
    let randomDegree = Math.floor(Math.random()* 360);
    
    let randomColor1 = getRandomColor();
    let randomColor2 = getRandomColor();
    let randomColor3 = getRandomColor();
    let randomColor4 = getRandomColor();
    let randomColor5 = getRandomColor();

    let randomBackground = `linear-gradient(${randomDegree}deg, ${randomColor1} 0%, ${randomColor2} 19%, ${randomColor3} 42%, ${randomColor4} 79%, ${randomColor5} 100%)`;
    // console.log(randomBackground);
    elPokemon.style.backgroundImage = randomBackground;

    // document.querySelector('.modal .pokemon-img').style.backgroundImage = `linear-gradient(${Math.abs(randomDegree - 180)}deg, #ffffff 0%, #335c81 74%)`;
}

function closeModal() {

    var elModal = document.querySelector('.modal');
    elModal.innerHTML = '';
    elModal.classList.remove('show');
}


function updateModal(elModal, pokemon) {

    let types = '';
    for(let i = pokemon.types.length - 1; i >= 0; i--) {

        types += `<span>${pokemon.types[i].type.name}</span>`;
    }

    elModal.innerHTML = `<div class="pokemon-modal flex column space-between" data-tilt data-num="${pokemon.id}">
    <span class="name flex space-between">#${pokemon.id}<p> ${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</p><span class="evolution"></span></span>
    <img src="${pokemon.sprites.front_default}" class="pokemon-img">
    <span class="bottom-info flex space-between"><p class="weight">${pokemon.weight}lb</p><p class="type flex column">${types}</p></span>
</div>`;

}
