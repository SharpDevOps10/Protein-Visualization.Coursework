'use strict';

export const getAtomCoordinates = (structure) => {
  if (typeof structure !== 'string') {
    throw new Error('Invalid argument type. Expected string');
  }
  const firstAtomIndex = structure.indexOf('ATOM');
  const atomLines = structure.substring(firstAtomIndex).split('\n');
  let atomCoordinates = [];
  if (atomLines && atomLines.length > 0) {
    atomCoordinates = atomLines.filter((line) => {
      const trimmedLine = line.trim();
      return (/^ATOM \d* .* A 1$/).test(trimmedLine);
    });
  }
  return atomCoordinates;
};

export const filterAtomLines = (atom, atomLinesArray) => atomLinesArray.filter((atomLine) => {
  atomLine.includes(`${atom}`);
});

export const getResidues = (atomLinesArray) => {
  const residuePosition = 4;
  const residues = atomLinesArray.map((atomLine) => {
    if (!atomLine) return;
    const lineArray = atomLine.split(' ');
    return lineArray.length > residuePosition ? lineArray[residuePosition] : undefined;
  });
  return residues;
};

export const getCoordinates = (atomLinesArray) => {
  const coordinatesPosition = {
    xPos: 10,
    yPos: 11,
    zPos: 12
  };
  const coordinates = atomLinesArray.map((atomLine) => {
    if (!atomLine) return;
    const lineArray = atomLine.split(' ');
    const x = lineArray[coordinatesPosition.xPos];
    const y = lineArray[coordinatesPosition.yPos];
    const z = lineArray[coordinatesPosition.zPos];
    return { x, y, z };
  });
  return coordinates;
};
