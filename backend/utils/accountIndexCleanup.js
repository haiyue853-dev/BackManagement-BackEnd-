function findDuplicateAccountUsernameIndexes(indexRows = []) {
  return indexRows
    .filter((item) => item.Column_name === 'username')
    .map((item) => item.Key_name)
    .filter((keyName) => keyName !== 'username')
}

module.exports = {
  findDuplicateAccountUsernameIndexes
}
