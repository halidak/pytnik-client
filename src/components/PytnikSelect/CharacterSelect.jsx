import React from 'react';
import './CharacterSelection.css'

function CharacterSelection({ selectedCharacter, onSelectCharacter }) {
  const characters = [
    { id: 1, name: 'Aki - Pohlepni', image: 'src/img/Aki.png' },
    { id: 2, name: 'Jocke - Brute force', image: 'src/img/Jocke.png' },
    { id: 3, name: 'Uki - Grananje i ogranicavanje', image: 'src/img/Uki.png' },
    { id: 4, name: 'Micko - A*', image: 'src/img/Micko.png' },
  ];

  const characterImageUrl = selectedCharacter ? [selectedCharacter.image] : [];

  return (
    <div className="character-selection-container">
      <select
        value={selectedCharacter ? selectedCharacter.name : ''}
        onChange={(e) => {
          const selectedCharacter = characters.find((character) => character.name === e.target.value);
          onSelectCharacter(selectedCharacter);
        }}
        className="character-select"
      >
        {characters.map((character) => (
          <option key={character.id} value={character.name}>
            {character.name}
          </option>
        ))}
      </select>
      {selectedCharacter && (
        <div className="character-image-container">
          {selectedCharacter.image && (
            <img src={selectedCharacter.image} alt={selectedCharacter.name} className="character-image" />
          )}
        </div>
      )}
    </div>
  );
}

export default CharacterSelection;
