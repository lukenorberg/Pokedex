import React, {useState, useEffect, useCallback} from 'react';
import './App.css';
import pokeImg from './files/pokemon_logo.svg.png';
import close from './files/close.png'
import InfiniteScroll from 'react-infinite-scroll-component';


function Pokemon({pokemonInfo, setData, setMainPageOn, setUserSearch}) {

    const typesToColor = {
        bug: "bg-green-900",
        dark: "bg-stone-900",
        dragon: "bg-teal-600",
        electric: "bg-yellow-400",
        fairy: "bg-rose-800",
        fighting: "bg-orange-700",
        fire: "bg-red-700",
        flying: "bg-cyan-700",
        ghost: "bg-purple-950",
        grass: "bg-green-500",
        ground: "bg-yellow-700",
        ice: "bg-cyan-300",
        normal: "bg-neutral-500",
        poison: "bg-purple-800",
        psychic: "bg-pink-600",
        rock: "bg-yellow-950",
        steel: "bg-emerald-400",
        water: "bg-blue-700"
}

    const searchApi = () => {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonInfo.id}/`)
            .then(response => response.json())
            .then(data => {
                    setData(data);
                setUserSearch(data.name)
                }
            )
            .catch(error => console.error('Error fetching data:', error))
        setMainPageOn(false);
    }

    return (
        <div
            className={"drop-shadow-xl m-2 bg-slate-200 rounded hover:translate-y-0.5 hover:bg-slate-300 ease-in duration-200"}
            onClick={searchApi}
        >
            <img src={pokemonInfo.image} alt={"picture of " + pokemonInfo.name}/>
            <div className={"ml-2"}>
                <div className={"text-sm"}>#{String(pokemonInfo.id).padStart(4, '0')}</div>
                <div className={"font-semibold text-2xl"}>{pokemonInfo.name}</div>
                <div className={"flex my-2"}>
                    {pokemonInfo.types.map(type => (
                        <div key={type.slot} className={` px-2 rounded-lg text-white mr-1 ${typesToColor[type.type.name]}`}>{type.type.name}</div>
                        )
                    )
                    }
                </div>
            </div>
        </div>
    )
}

function Search({mainPageOn, setMainPageOn, setIndividualPokeData, setUserSearch}) {
    const [searchTerm, setSearchTerm] = useState('');

    const searchApi = () => {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${searchTerm}/`)
            .then(response => response.json())
            .then(data => {
                setIndividualPokeData(data);
                    setUserSearch(data.name)
            }
            )
            .catch(error => console.error('Error fetching data:', error))
        setMainPageOn(false);

    }

    return (
        <nav className={`flex justify-center items-center bg-red-600 h-24 px-4 sm:justify-between drop-shadow-xl`}>
            <div>
                <input
                className="w-2/3 h-10 px-2 mr-2 rounded-lg bg-white focus:outline-none sm:w-96"
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search..."
            />
                <button
                    className="bg-slate-300 rounded-lg p-2 text-white"
                    onClick={searchApi}
                >
                    Search
                </button>
            </div>
            <img src={pokeImg} alt="Pokemon Logo"
                 style={{ width: 'auto', height: '60px' }}
                 className={"invisible z-10 absolute sm:visible sm:relative"}
            />
        </nav>
    );
}

function Popup({data, mainPageOn, setMainPageOn, userSearch, setUserSearch}) {
    const setMainPageOnWorking = () => {
        setMainPageOn(true);
        setUserSearch('');
    }
     // "z-10 bg-gray-100 flex flex-col items-center justify-center rounded-2xl ease-in duration-300 window fixed h-5/6 top-10 w-5/6 overflow-auto md:w-[45rem]"

    if (!mainPageOn && data && data.name === userSearch){
        return (
        <div

            className={"z-10 bg-gray-100 fixed top-0 w-full h-full m-0 p-0 overflow-auto flex flex-col items-center rounded-2xl ease-in duration-300 window sm:h-5/6 sm:w-5/6 sm:top-16 md:w-[45rem]"}
        >
            <button
                className={"self-end m-2 h-12 w-12 opacity-70"}
                onClick={setMainPageOnWorking}
            ><img src={close} alt="close button"/></button>
            <div>
                <span className={"font-semibold text-4xl"}>
                    {data.name}</span>
                <span className={"ml-2 text-xl"}>
                    #{String(data.id).padStart(4, '0')}</span>
            </div>
            <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
                className={"w-52 h-auto sm:h-4/5 sm:w-auto"}
                alt={`${data.name} image`}/>
            <p className={"text-xl mx-6 w-fit px-2 my-4"}>{data.flavor_text_entries && data.flavor_text_entries[0].flavor_text}</p>
            <div className={"grid grid-cols-2 gap-4 bg-blue-500 rounded-2xl m-4 p-4"}>
                <div>
                    <div className={"text-xl font-semibold"}>Base Happiness</div>
                    <div className={"text-3xl"}>{data.base_happiness}</div>
                </div>
                <div>
                    <div className={"text-xl font-semibold"}>Capture Rate</div>
                    <div className={"text-3xl"}>{data.capture_rate}</div>
                </div>
                <div>
                    <div className={"text-xl font-semibold"}>Hatch Counter</div>
                    <div className={"text-3xl"}>{data.hatch_counter}</div>
                </div>
                <div>
                    <div className={"text-xl font-semibold"}>Shape</div>
                    <div className={"text-3xl"}>{data.shape.name}</div>
                </div>
            </div>
        </div>
)
    } else {
        return <div></div>
    }
}

function SortBy({sortOrder, setSortOrder, updatePokemon, setPokemonLoadedChange, pokemonLoadedChange}) {
    return (
        <div>
            <label htmlFor="sort">Sort By:</label>
            <select
                id="sort"
                value={sortOrder}
                onChange={(e) => {
                    setSortOrder(e.target.value)
                    console.log('load before', pokemonLoadedChange)
                    setPokemonLoadedChange(true);
                    console.log('load after', pokemonLoadedChange)
                    updatePokemon();
                }}
            >
                <option value="ascending">Ascending</option>
                <option value="descending">descending</option>
            </select>
        </div>
    );
}

function App(callback, deps) {
    const [numOfPokemon, setNumOfPokemon] = useState(null);
    const [pokemonLoaded, setPokemonLoaded] = useState([]);
    const [load, setLoad] = useState(0);
    const [apiLoading, setApiLoading] = useState(true);
    const [mainPageOn, setMainPageOn] = useState(true);
    const [individualPokeData, setIndividualPokeData] = useState(null);
    const [userSearch, setUserSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('ascending');
    const [pokemonLoadedChange, setPokemonLoadedChange] = useState(true);

    const updatePokemon = (() => {

        if (!apiLoading) {

            const promises = [];

                for (let i = 1 + (load * 20); i <= 20 + (load * 20) && i <= numOfPokemon; i++) {
                    promises.push(
                        fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`)
                            .then(response => response.json())
                            .then(data => ({
                                name: data.name,
                                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png`,
                                types: data.types,
                                id: data.id,
                            }))
                    );
                }


            Promise.all(promises)
                .then(pokemonData => {
                    setPokemonLoaded(pokemonLoaded => [...pokemonLoaded, ...pokemonData]);
                })
                .catch(error => console.error('Error fetching data:', error));

            setLoad(load + 1);

        }
    });


    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokedex/1/")
            .then(response => response.json())
            .then(data => {
                    setNumOfPokemon(data.pokemon_entries.length)
                    setApiLoading(false);
                }
            )
            .catch(error => console.error('Error fetching data:', error))
        updatePokemon();
    }, [numOfPokemon])


  return (
    <div className="App">
        <Search setIndividualPokeData={setIndividualPokeData} mainPageOn={mainPageOn} setMainPageOn={setMainPageOn} setUserSearch={setUserSearch}></Search>
        <main className={`flex justify-center ${!mainPageOn && 'static'}`}>
            <InfiniteScroll
                dataLength={pokemonLoaded.length}
                next={updatePokemon}
                hasMore={true}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
                loader={""}>
                <div
                    className={`grid grid-cols-2 my-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6
                     ${!mainPageOn && 'blur overflow-hidden absolute left-0 ease-in duration-300'}`}
                >
                    {   pokemonLoaded &&
                        pokemonLoadedChange &&
                        pokemonLoaded.map(val => (
                                <Pokemon key={val.id} pokemonInfo={val} setMainPageOn={setMainPageOn} setData={setIndividualPokeData} setUserSearch={setUserSearch}></Pokemon>
                            )
                        )
                    }
                </div>
            </InfiniteScroll>
            <Popup data={individualPokeData} setMainPageOn={setMainPageOn} mainPageOn={mainPageOn} userSearch={userSearch} setUserSearch={setUserSearch}></Popup>
        </main>

    </div>
  );
}

export default App;
