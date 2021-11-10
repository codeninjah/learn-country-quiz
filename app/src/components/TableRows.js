const TableRows = ({ string, profile, updateProps }) => {
  const {
    updateGrid,
    updateLatestGames,
    updateCountdown,
    updateNumQuestions,
  } = updateProps

  return (
    <>
      <td><input onChange={() => updateGrid(string)} type="checkbox" checked={profile.grid} /></td>
      <td><input onChange={() => updateLatestGames(string)} type="checkbox" checked={profile.latestGames} /></td>
      <td><input onChange={() => updateCountdown(string)} type="checkbox" checked={profile.countdown} /></td>
      <td><input onChange={() => updateNumQuestions(string)} type="checkbox" checked={profile.numQuestions} /></td>
    </>
  )
}

export default TableRows