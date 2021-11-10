const ColorPicker = ({ profile, string, updateBackground }) => {
  return (
    <td>
      <select value={profile.background} onChange={(e) => updateBackground(string, e.target.value)} style={{ backgroundColor: profile.background, color: profile.background === 'yellow' ? 'black' : 'white' }}>
        <option value="blue">Blue</option>
        <option value="yellow">Yellow</option>
        <option value="red">Red</option>
        <option value="green">Green</option>
      </select>
    </td>
  )
}

export default ColorPicker