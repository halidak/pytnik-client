import React, { useEffect, useState } from 'react';
import terrain from '../../img/terrain.png';
import coin from '../../img/coin.png';
import collectedCoin from '../../img/collected_coin.png';
import CharacterSelection from '../PytnikSelect/CharacterSelect';
import './PytnikMap.css';
import axios from 'axios';

function Map() {
  let map;
  const [mapCoordinates, setMapCoordinates] = useState([]);
  const [selectedMap, setSelectedMap] = useState();
  const [selectedCharacter, setSelectedCharacter] = useState({name :'Aki - Pohlepni', id : 1, image : 'src/img/Aki.png'});
  const [selectedAgentPath, setSelectedAgentPath] = useState([]);
  const [agentPosition, setAgentPosition] = useState(0);
  const [collectedCoins, setCollectedCoins] = useState([]);
  const [agentPathIndex, setAgentPathIndex] = useState(0);
  const [moveCosts, setMoveCosts] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  //TODO: ADD RETURN TO INITAL STATE

  useEffect(() => {
    const mapUrl =
      selectedMap === 'map0'
        ? '/src/components/PytnikMap/Maps/map0.txt'
        : '/src/components/PytnikMap/Maps/map1.txt';

    fetch(mapUrl)
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split('\n');
        const coordinates = lines.map((line) => {
          const [x, y] = line.split(',').map(Number);
          return { x, y };
        });
        const numRows = lines.length;
        map = new Array(numRows);
        for (let i = 0; i < numRows; i++) {
          map[i] = new Array(numRows).fill(0);
        }

        for (let i = 0; i < numRows; i++) {
          const values = lines[i].split(',').slice(2).map(value => parseInt(value.trim()));
          for (let j = 0; j < values.length; j++) {
            const rowIndex = i;
            const colIndex = j;
            if (colIndex < numRows) {
              map[rowIndex][colIndex] = values[j];
              map[colIndex][rowIndex] = values[j];
            }
          }
        }
        setMapCoordinates(coordinates);
        resetAgentPosition();
      })
      .catch((error) => {
        console.error('Error reading map file:', error);
      });
  }, [selectedMap]);

  useEffect(() => {
    const total = moveCosts.reduce((acc, cost) => acc + (cost || 0), 0);
    setTotalCost(total);
  }, [moveCosts]);

  useEffect(() => {
    const initializeAgentPath = async () => {
      try {
        const selectedCharacterId = selectedCharacter.id;
        const response = await axios.post('http://127.0.0.1:8000/game/move/', {
          mapName: selectedMap,
          characterId: selectedCharacterId,
        });
  
        const updatedAgentPath = response.data.updatedAgentPath;
        console.log(response.data)
  
        if (selectedAgentPath == null) {
          setSelectedAgentPath(updatedAgentPath);
          
        }
      } catch (error) {
        console.error('Error updating agent position to Django:', error);
      }
    };
  
    if (selectedMap || selectedAgentPath == null) {
      initializeAgentPath();
    }
    
  }, [selectedMap, selectedAgentPath, selectedCharacter]);
  
  
  useEffect(() => {
    const resetAgentAndMap = async () => {
      try {
        resetAgentPosition();
      } catch (error) {
        console.error('Error resetting agent position:', error);
      }
    };

    if (selectedMap && selectedCharacter) {
      resetAgentAndMap();
      resetAgentPosition();
    }
  }, [selectedCharacter]);

  const characterImages = {
    'Aki - Pohlepni': 'src/img/Aki.png',
    'Jocke - Brute force': 'src/img/Jocke.png',
    'Uki - Grananje i ogranicavanje': 'src/img/Uki.png',
    'Micko - A*': 'src/img/Micko.png',
  };

  const characterImageUrl = characterImages[selectedCharacter];

  const backgroundStyle = {
    left: '-100px',
    backgroundImage: `url('${terrain}')`,
    backgroundSize: 'cover',
    width: '1050px',
    height: '650px',
    position: 'relative',
  };

  const handleMapSelection = async (mapName, selectedCharacter) => {
    try {
      const selectedCharacterId = selectedCharacter.id;
      const response = await axios.post('http://127.0.0.1:8000/game/move/', {
        mapName: mapName,
        characterId: selectedCharacterId,
      });
  
      const updatedAgentPath = response.data.updatedAgentPath;
  
      setSelectedAgentPath(updatedAgentPath);
    } catch (error) {
      console.error('Error sending map selection to Django:', error);
    }
    setSelectedMap(mapName);
  };
  

  const updateAgentPosition = async () => {
    const mapUrl =
      selectedMap === 'map0'
        ? '/src/components/PytnikMap/Maps/map0.txt'
        : '/src/components/PytnikMap/Maps/map1.txt';

        
    if (agentPathIndex < selectedAgentPath.length) {
  
      const currentAgentPathIndex = selectedAgentPath[agentPathIndex];
      setAgentPosition(currentAgentPathIndex);
      setAgentPathIndex(agentPathIndex + 1);
      
      const collectedCoin = mapCoordinates[currentAgentPathIndex];
      setCollectedCoins([...collectedCoins, collectedCoin]);
      
      await fetch(mapUrl)
        .then((response) => response.text())
        .then((data) => {
          const lines = data.split('\n');
          const numRows = lines.length;
          map = new Array(numRows);
          for (let i = 0; i < numRows; i++) {
            map[i] = new Array(numRows).fill(0);
          }
  
          for (let i = 0; i < numRows; i++) {
            const values = lines[i].split(',').slice(2).map(value => parseInt(value.trim()));
            for (let j = 0; j < values.length; j++) {
              const rowIndex = i;
              const colIndex = j;
              if (colIndex < numRows) {
                map[rowIndex][colIndex] = values[j];
                map[colIndex][rowIndex] = values[j];
              }
            }
          }
        })
        .catch((error) => {
          console.error('Error reading map file:', error);
        });
  
        setMoveCosts([...moveCosts, map[agentPosition][currentAgentPathIndex]]);
        
    } else {
      setAgentPathIndex(0);
    }
  };
  

  const resetAgentPosition = () => {
    setAgentPosition(0);
    setMoveCosts([]);
    setCollectedCoins([]);
    const currentAgentPathIndex = selectedAgentPath[0];
    const currentAgentPathCoordinates = mapCoordinates[currentAgentPathIndex];
    setSelectedAgentPath([currentAgentPathIndex, ...selectedAgentPath.slice(1)]);
  };

  const generateCostIndexes = (path) => {
    const indexes = [];
    
    indexes.push(`Cost ${path[path.length - 1]} to ${path[0]}`);
    
    for (let i = 0; i < path.length - 1; i++) {
      indexes.push(`Cost ${path[i]} to ${path[i + 1]}`);
    }
    return indexes;
  };

  const costIndexes = generateCostIndexes(selectedAgentPath);

  return (
    <div>
      <div>
        <CharacterSelection
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
        />
        <button onClick={() => handleMapSelection('map0', selectedCharacter)}>Map 0</button>
        <button onClick={() => handleMapSelection('map1', selectedCharacter)}>Map 1</button>
        <button onClick={() => {
          updateAgentPosition();
        }}>Move Agent</button>
      </div>

      <div style={backgroundStyle}>
        {mapCoordinates.map((coords, index) => {
          const { x, y } = coords;

          const coinStyle = {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: '40px',
            height: '40px',
          };

          const characterStyle = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50px',
            height: '50px'
            
          };

          const costListStyle = {
            position: 'absolute',
            top: 0,
            left: '1050px',
            width: '200px',
            height: '100%',
            backgroundColor: 'black', 
            overflow: 'auto',
            color: 'green',
          };

          return (
            <div key={index}>
            <div key={index} style={coinStyle}>
              {collectedCoins.includes(coords) ? (
                <img src={collectedCoin} alt="Collected coin" style={{ width: '100%', height: '100%' }} />
              ) : (
                <img src={coin} alt="Coin" style={{ width: '100%', height: '100%' }} />
              )}
              {index === agentPosition && (
                <div style={characterStyle}>
                  <img src={selectedCharacter.image} alt={selectedCharacter.name} style={{ width: '100%', height: '100%' }} />
                </div>
              )}
              {index !== agentPosition && (
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {index}
                </span>
              )}
            </div>
            <div style={costListStyle}>
            <h2>Cost List</h2>
            <ul>
              {moveCosts.map((cost, index) => (
                <li key={index}>
                  {costIndexes[index]}: {cost !== undefined ? cost : 'N/A'}
                </li>
              ))}
            </ul>
            <div className='total'>
              <h2>Total Cost</h2>
              <p>{totalCost}</p>
            </div>
          </div>
        </div>
          );
        })}
      </div>
    </div>
  );
}

export default Map;