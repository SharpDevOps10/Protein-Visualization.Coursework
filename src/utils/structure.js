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
  let residues = [];
  const residuePosition = 4;
  residues = atomLinesArray.map((atomLine => {
    if (!atomLine) return;
    const lineArray = atomLine.split(' ');
    return lineArray.length > residuePosition ? lineArray[residuePosition] : undefined;
  }));
  return residues;
}
