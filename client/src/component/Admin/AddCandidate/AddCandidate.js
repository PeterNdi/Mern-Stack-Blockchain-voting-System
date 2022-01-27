import React, { Component } from "react";

import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";

import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";

import AdminOnly from "../../AdminOnly";

import "./AddCandidate.css";

export default class AddCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      accounts: null,
      isAdmin: false,
      header: "",
      Cyear: "",
      Cregno: "",
      course: "",
      candidates: [],
      candidateCount: undefined,
    };
  }

  componentDidMount = async () => {
    // refreshing page only once
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

      // Total number of candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Loading Candidates details
      for (let i = 0; i < this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i)
          .call();
        this.state.candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          Cyear: candidate.Cyear,
          Cregno: candidate.Cregno,
          course: candidate.course,
        });
      }

      this.setState({ candidates: this.state.candidates });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  };
  updateHeader = (event) => {
    this.setState({ header: event.target.value });
  };
  updateCourse = (event) => {
    this.setState({ course: event.target.value });
  };
  updateCyear = (event) => {
    this.setState({ Cyear: event.target.value });
  };
  updateCregno = (event) => {
    this.setState({ Cregno: event.target.value });
  };

  addCandidate = async () => {
    await this.state.ElectionInstance.methods
      .addCandidate(this.state.header, this.state.course, this.state.Cyear, this.state.Cregno)
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>Loading accounts and contract...</center>
        </>
      );
    }
    if (!this.state.isAdmin) {
      return (
        <>
          <Navbar />
          <AdminOnly page="Add Candidate Page." />
        </>
      );
    }
    return (
      <>
        <NavbarAdmin />
        <div className="container-main">
          
          <h2>Add a new candidate</h2>
          <small>Total candidates: {this.state.candidateCount}</small>
          <div className="container-item">
            <form className="form">
              <label className={"label-ac"}>
                Name
                <input
                  className={"input-ac"}
                  type="text"
                  placeholder="eg. Moses Mwangi"
                  value={this.state.header}
                  onChange={this.updateHeader}
                />
              </label>
              <label className={"label-ac"}>
                Registration Number
                <input
                  className={"input-ac"}
                  type="text"
                  placeholder="eg. B010-01-0000/2021"
                  value={this.state.Cregno}
                  onChange={this.updateCregno}
                />
              </label>
              <label className={"label-ac"}>
                Course
                <input
                  className={"input-ac"}
                  type="text"
                  placeholder="eg. Bsc (Information Technology)"
                  value={this.state.course}
                  onChange={this.updateCourse}
                />
              </label>
              <label className={"label-ac"}>
                Year Of Study
                <input
                  className={"input-ac"}
                  type="text"
                  placeholder="eg. 1st year"
                  value={this.state.Cyear}
                  onChange={this.updateCyear}
                />
              </label>
              <button
                className="btn-add"
                disabled={
                  this.state.header.length < 3 || this.state.header.length > 21
                }
                onClick={this.addCandidate}
              >
                Add
              </button>
            </form>
          </div>
        </div>
        {loadAdded(this.state.candidates)}
      </>
    );
  }
}
export function loadAdded(candidates) {
  const renderAdded = (candidate) => {
    return (
      <>
       {/* 
        <div className="container-list success">
          <div
            style={{
              maxHeight: "21px",
              overflow: "auto",
            }}
          >
            {candidate.id}. <strong>{candidate.header}</strong>:{" "} {" "} {candidate.Cyear} {""} {" "} {candidate.Cregno} {" "} {" "}
            {candidate.course} 
          </div>
        </div>
        */}


        <div 
          style={{
            margin: "10px",
            border: "1px solid",
            overflow: "auto",
          }}
        
        >
          <table>
            <tr>
              <th>Candidate Id</th>
              <td>{candidate.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{candidate.header}</td>
            </tr>
            <tr>
              <th>Registration number</th>
              <td>{candidate.Cregno}</td>
            </tr>
            <tr>
            <th>Course</th>
            <td>{candidate.course}</td>
          </tr>
          <tr>
            <th>Year of Study</th>
            <td>{candidate.Cyear}</td>
          </tr>
          </table>
          </div>
      </>
    );
  };
  return (
    <div className="container-main" style={{ borderTop: "1px solid" }}>
      <div className="container-item info">
        <center>Candidates List</center>
      </div>
      {candidates.length < 1 ? (
        <div className="container-item alert">
          <center>No candidates added.</center>
        </div>
      ) : (
        <div
          className="container-item"
          style={{
            display: "block",
            backgroundColor: "#DDFFFF",
          }}
        >
          {candidates.map(renderAdded)}
        </div>
      )}
    </div>
  );
}
