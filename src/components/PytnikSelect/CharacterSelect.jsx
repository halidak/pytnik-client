import React from 'react';

function CharacterSelection({ selectedCharacter, onSelectCharacter }) {
  const characters = [
    { id: 1, name: 'Aki - Pohlepni', image: 'src/img/Aki.png' },
    { id: 2, name: 'Jocke - Brute force', image: 'src/img/Jocke.png' },
    { id: 3, name: 'Uki - Grananje i ogranicavanje', image: 'src/img/Uki.png' },
    { id: 4, name: 'Micko - A*', image: 'src/img/Micko.png' },
  ];

  // Check if selectedCharacter is not null or undefined
  const characterImageUrl = selectedCharacter ? [selectedCharacter.image] : [];

  return (
    <div style={containerStyle}>
      <select
        value={selectedCharacter ? selectedCharacter.name : ''}
        onChange={(e) => {
          const selectedCharacter = characters.find((character) => character.name === e.target.value);
          onSelectCharacter(selectedCharacter);
        }}
        style={selectStyle}
      >
        {characters.map((character) => (
          <option key={character.id} value={character.name}>
            {character.name}
          </option>
        ))}
      </select>
      {selectedCharacter && (
        <div style={imageContainerStyle}>
          {/* Check if selectedCharacter.image is not null or undefined */}
          {selectedCharacter.image && (
            <img src={selectedCharacter.image} alt={selectedCharacter.name} style={imageStyle} />
          )}
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const selectStyle = {
  padding: '5px',
  fontSize: '16px',
  backgroundColor: 'black',
  border: '1px solid #ccc',
  borderRadius: '4px',
  width: '150px',
  cursor: 'pointer',
};

const imageContainerStyle = {
  marginLeft: '10px',
};

const imageStyle = {
  width: '50px',
  height: '50px',
};

export default CharacterSelection;
