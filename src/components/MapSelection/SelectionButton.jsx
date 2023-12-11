import React from 'react';

function MapSelectionButton({ onClick, mapName }) {
  return (
    <button onClick={onClick}>{mapName}</button>
  );
}

export default MapSelectionButton;