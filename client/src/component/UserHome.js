import React from "react";

function UserHome(props) {
  return (
    <div>
      <div className="container-main">
        <div className="container-list title">
          <table style={{ marginTop: "21px" }}>
            <tr>
              <th>Election Title:</th>
              <td style={{ textTransform: "uppercase" }}>
                {props.el.electionTitle}
              </td>
            </tr>
            <tr>
              <th>Department:</th>
              <td style={{ textTransform: "uppercase" }}>{props.el.organizationTitle}</td>
            </tr>
          </table>

          <table style={{ marginTop: "21px" }}>
            <tr>
              <th>Admin:</th>
              <td>
                {props.el.adminName} ({props.el.adminTitle})
              </td>
            </tr>
            <tr>
              <th>Reg No:</th>
              <td style={{ textTransform: "uppercase" }}>{props.el.adminReg}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
