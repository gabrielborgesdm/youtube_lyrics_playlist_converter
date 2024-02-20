export const removeWordsFromString = (wordsToBeRemoved, targetString) => {
  const regex = new RegExp(`${wordsToBeRemoved.join('|')}|\\(|\\)|\\[|\\]`, 'gi')

  const result = targetString.replace(regex, '')
  return result
}
