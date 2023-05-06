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
