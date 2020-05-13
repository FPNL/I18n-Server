module.exports = {
  diff: true,
  extension: ['ts', 'tsx'],
  require: "ts-node/register",
  watch: false,
  'recursive': ["src/**/test/?(*.)+(spec|test).[tj]s?(x)"],
};
