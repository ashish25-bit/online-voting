const fs = require("fs");

const fileSource = "./smart_contract/build/contracts/Election.json";
const fileDestination = "./client/src/utils/Elections.json";

const fields = [
  'contractName', 'abi', 'metadata',
  'bytecode', 'deployedBytecode',
  'sourceMap', 'deployedSourceMap',
  'source', 'compiler',
  'networks', 'schemaVersion',
  'updatedAt', 'networkType'
];

try {
  let data = fs.readFileSync(fileSource, { encoding: "utf8", flag: "r" });

  if (!isJSONSafe(data))
    throw error('data is not json');

  const obj = {};

  data = JSON.parse(data);
  for (let field of fields) {
    obj[field] = data[field];
  }

  data = JSON.stringify(obj);
  fs.writeFileSync(fileDestination, data);
}
catch (err) {
  console.log(err);
}

function isJSONSafe(text) {
  try {
    JSON.parse(text);
    return true;
  }
  catch (_) {
    return false;
  }
}
