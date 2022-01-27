// Node modules
import React, { Component } from "react";

// Components
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";

// CSS
import "./Registration.css";

// Contract
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isAdmin: false,
      isElStarted: false,
      isElEnded: false,
      voterCount: undefined,
      voterName: "",
      voterRegno: "",
      voterCourse: "",
      voterYear: "",
      voters: [],
      currentVoter: {
        address: undefined,
        name: null,
        vRegno: null,
        vCourse: null,
        vYear: null,
        hasVoted: false,
        isVerified: false,
        isRegistered: false,
      },
    };
  }
  // refreshing once
  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Get start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });

      // Total number of voters
      const voterCount = await this.state.ElectionInstance.methods
        .getTotalVoter()
        .call();
      this.setState({ voterCount: voterCount });

      // Loading all the voters
      for (let i = 0; i < this.state.voterCount; i++) {
        const voterAddress = await this.state.ElectionInstance.methods
          .voters(i)
          .call();
        const voter = await this.state.ElectionInstance.methods
          .voterDetails(voterAddress)
          .call();
        this.state.voters.push({
          address: voter.voterAddress,
          name: voter.name,
          vRegno: voter.vRegno,
          vCourse: voter.vCourse,
          vYear: voter.vYear,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
        });
      }
      this.setState({ voters: this.state.voters });

      // Loading current voters
      const voter = await this.state.ElectionInstance.methods
        .voterDetails(this.state.account)
        .call();
      this.setState({
        currentVoter: {
          address: voter.voterAddress,
          name: voter.name,
          vRegno: voter.vRegno,
          vCourse: voter.vCourse,
          vYear: voter.vYear,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
        },
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `Failed to load accounts, or contract. Check console for details (f12).`
      );
    }
  };
  updateVoterName = (event) => {
    this.setState({ voterName: event.target.value });
  };
  updateVoterRegno = (event) => {
    this.setState({ voterRegno: event.target.value });
  };
  updateVoterCourse = (event) => {
    this.setState({ voterCourse: event.target.value });
  };
  updateVoterYear = (event) => {
    this.setState({ voterYear: event.target.value });
  };
  registerAsVoter = async () => {
    await this.state.ElectionInstance.methods
      .registerAsVoter(this.state.voterName, this.state.voterRegno, this.state.voterCourse, this.state.voterYear)
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };
  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>Loading accounts and contract...</center>
          <br></br>
          
        </>
      );
    }
    return (

        
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar /> }
        
        {!this.state.isElStarted && !this.state.isElEnded ? (
          <NotInit />
        ) : (
          <>
            
            <div className="container-item info">
              <p>Total registered voters: {this.state.voters.length}</p>
            </div>
            <div className="container-main">
              <h3>Registration</h3>
              <small>Register to vote.</small>
              <div className="container-item">
                <form>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Account Address
                      <input
                        className={"input-r"}
                        type="text"
                        value={this.state.account}
                        style={{ width: "400px" }}
                      />{" "}
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Name
                      <input
                        className={"input-r"}
                        type="text"
                        placeholder="eg. Mercy Cheptoo"
                        value={this.state.voterName}
                        onChange={this.updateVoterName}
                      />{" "}
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Registration number <span style={{ color: "tomato" }}>*</span>
                      <input
                        className={"input-r"}
                        type="text"
                        placeholder="eg. C025-01-0000/2021"
                        value={this.state.voterRegno}
                        onChange={this.updateVoterRegno}
                      />
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Course
                      <input
                        className={"input-r"}
                        type="text"
                        placeholder="eg. BSc (Information Technology)"
                        value={this.state.voterCourse}
                        onChange={this.updateVoterCourse}
                      />{" "}
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Year of Study
                      <input
                        className={"input-r"}
                        type="text"
                        placeholder="eg. 1st year"
                        value={this.state.voterYear}
                        onChange={this.updateVoterYear}
                      />{" "}
                    </label>
                  </div>
                  <p className="note">
                    <span style={{ color: "tomato" }}> Note: </span>
                    <br /> Make sure your account address and Registration number are
                    correct. <br /> Admin might not approve your account if the
                    provided Registration number does not matches the one registered in admins catalogue.
                  </p>
                  <button
                    className="btn-add"
                    disabled={
                      this.state.voterRegno.length !== 17 ||
                      this.state.currentVoter.isVerified
                    }
                    onClick={this.registerAsVoter}
                  >
                    {this.state.currentVoter.isRegistered
                      ? "Update"
                      : "Register"}
                  </button>
                </form>
              </div>
            </div>
            <div
              className="container-main"
              style={{
                borderTop: this.state.currentVoter.isRegistered
                  ? null
                  : "1px solid",
              }}
            >
              {loadCurrentVoter(
                this.state.currentVoter,
                this.state.currentVoter.isRegistered
              )}
            </div>
            {this.state.isAdmin ? (
              <div
                className="container-main"
                style={{ borderTop: "1px solid" }}
              >
                <small>TotalVoters: {this.state.voters.length}</small>
                {loadAllVoters(this.state.voters)}
              </div>
            ) : null}
          </>
        )}
      </>
    );
  }
}
export function loadCurrentVoter(voter, isRegistered) {
  return (
    <>
      <div
        className={"container-item " + (isRegistered ? "success" : "attention")}
      >
        <center>Your Registered Info</center>
      </div>
      <div
        className={"container-list " + (isRegistered ? "success" : "attention")}
      >
        <table>
          <tr>
            <th>Account Address</th>
            <td>{voter.address}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{voter.name}</td>
          </tr>
          <tr>
            <th>Registration number</th>
            <td>{voter.vRegno}</td>
          </tr>
          <tr>
            <th>Course</th>
            <td>{voter.vCourse}</td>
          </tr>
          <tr>
            <th>Year of Study</th>
            <td>{voter.vYear}</td>
          </tr>
          <tr>
            <th>Voted</th>
            <td>{voter.hasVoted ? "True" : "False"}</td>
          </tr>
          <tr>
            <th>Verification</th>
            <td>{voter.isVerified ? "True" : "False"}</td>
          </tr>
          <tr>
            <th>Registered</th>
            <td>{voter.isRegistered ? "True" : "False"}</td>
          </tr>
        </table>
      </div>
    </>
  );
}
export function loadAllVoters(voters) {
  const renderAllVoters = (voter) => {
    return (
      <>
        <div className="container-list success">
          <table>
            <tr>
              <th>Account address</th>
              <td>{voter.address}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{voter.name}</td>
            </tr>
            <tr>
              <th>Registration number</th>
              <td>{voter.vRegno}</td>
            </tr>
            <tr>
            <th>Course</th>
            <td>{voter.vCourse}</td>
          </tr>
          <tr>
            <th>Year of Study</th>
            <td>{voter.vYear}</td>
          </tr>
            <tr>
              <th>Voted</th>
              <td>{voter.hasVoted ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Verified</th>
              <td>{voter.isVerified ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Registered</th>
              <td>{voter.isRegistered ? "True" : "False"}</td>
            </tr>
          </table>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="container-item success">
        <center>List of voters</center>
      </div>
      {voters.map(renderAllVoters)}
    </>
  );
}
