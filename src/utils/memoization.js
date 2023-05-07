'use strict';

const getArgKey = (arg) => arg.toString() + ':' + typeof (arg);
const generateKey = (args) => args.map(getArgKey).join('|');