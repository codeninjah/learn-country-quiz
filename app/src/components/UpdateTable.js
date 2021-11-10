import TableHeader from "./TableHeader"
import TableRows from "./TableRows"
import ColorPicker from "./ColorPicker"

const UpdateTable = ({ snapshot, updateProps }) => {
  const { alpha, beta, pilots, rest } = snapshot
  const { updateBackground } = updateProps

  return (
    <table className="advanced-setup-table">
      <tbody>
        <TableHeader />
        <tr>
          <th className="profile-cap" scope="row">Alpha</th>
          <TableRows string="alpha" profile={alpha} updateProps={updateProps} />
          <ColorPicker profile={alpha} string="alpha" updateBackground={updateBackground} />
        </tr>
        <tr>
          <th className="profile-cap" scope="row">Beta</th>
          <TableRows string="beta" profile={beta} updateProps={updateProps} />
          <ColorPicker profile={beta} string="beta" updateBackground={updateBackground} />
        </tr>
        <tr>
          <th className="profile-cap" scope="row">Pilots</th>
          <TableRows string="pilots" profile={pilots} updateProps={updateProps} />
          <ColorPicker profile={pilots} string="pilots" updateBackground={updateBackground} />
        </tr>
        <tr>
          <th className="profile-cap" scope="row">Rest</th>
          <TableRows string="rest" profile={rest} updateProps={updateProps} />
          <ColorPicker profile={rest} string="rest" updateBackground={updateBackground} />
        </tr>
      </tbody>
    </table>
  )
}

export default UpdateTable