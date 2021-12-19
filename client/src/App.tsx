import React, { Component } from "react";
import Web3 from "web3";
import Election from "./contracts/Election.json";
import connectWallet from "./connectWallet";
import "./App.css";
import { AbiItem } from "web3-utils";
import { Election as IElection } from "./contracts/Election";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Candidate {
  name: string;
  voteCount: number;
  id: number;
}

interface Props {}
interface State {
  web3?: Web3;
  election?: IElection;
  candidates?: Candidate[];
  address?: string;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      web3: undefined,
      election: undefined,
      candidates: undefined,
      address: undefined,
    };
  }

  listenForEvents: () => void = async () => {
    const election = this.state.election;
    if (election) {
      election.events.NewVote({}, (error, event) => {
        if (error) {
          toast(JSON.stringify(error), { type: "error" });
          return;
        }
        const eventData = event.returnValues;
        this.setState((state) => {
          const candidates = state.candidates;
          if (candidates) {
            return {
              candidates: candidates.map((candidate) => {
                if (candidate.id === +eventData.id) {
                  this.toastVote(eventData.voter, candidate.name);
                  return {
                    ...candidate,
                    voteCount: candidate.voteCount + 1,
                  };
                }
                return candidate;
              }),
            };
          }
          return state;
        });
      });
    }
  };

  toastVote: (voter: string, to: string) => void = (voter, to) => {
    const selfVoted = voter === this.state.address;
    toast(`${selfVoted ? "You" : voter} just voted to ${to}`, {
      type: selfVoted ? "success" : "default",
      toastId: `${voter}to${to}`,
    });
  };

  connectContract = async (networkId: string | number) => {
    const { web3 } = this.state;
    if (web3) {
      const deployedNetwork =
        Election.networks[
          `${networkId}` as unknown as keyof typeof Election.networks
        ];

      if (!deployedNetwork) {
        this.setState({
          election: undefined,
          candidates: undefined,
          address: undefined,
        });
        const isProd = process.env.NODE_ENV === "production";
        toast(
          `Connect to ropsten testnet${!isProd ? " or local network" : ""}.`,
          { type: "error" }
        );
        return;
      }

      const accounts = await web3.eth.getAccounts();

      const election = new web3.eth.Contract(
        Election.abi as AbiItem[],
        deployedNetwork && deployedNetwork.address
      ) as unknown as IElection;

      toast("Wallet connected.", { type: "success" });
      this.setState({ election, address: accounts[0] }, () => {
        this.listenForEvents();
        this.fetchCandidates();
      });
    }
  };

  connect: () => void = async () => {
    const web3 = await connectWallet(this.connectContract);
    const networkId = await web3.eth.net.getId();
    this.setState({ web3 }, () => this.connectContract(networkId));
  };

  fetchCandidates: () => void = async () => {
    const election = this.state.election;
    if (election) {
      const count = await election.methods.candidatesCount().call();
      const candidates: Candidate[] = [];
      for (let i = 0; i < +count; i++) {
        const candidate = await election.methods.candidates(i).call();
        candidates.push({
          name: candidate.name,
          voteCount: +candidate.voteCount,
          id: i,
        });
      }
      this.setState({ candidates });
    }
  };

  vote: (id: number) => Promise<void> = async (id: number) => {
    const { election, address } = this.state;
    try {
      if (!address) {
        toast("No address", { type: "error" });
        return;
      }
      const hasVoted = await election?.methods.voters(address).call();
      if (hasVoted) {
        toast("Already voted!", { type: "error" });
        return;
      }
      await election?.methods.vote(id).send({ from: address });
      toast("Vote sent, wait for block confirmations.", { type: "error" });
    } catch (error: any) {
      toast(error.message, { type: "error" });
    }
  };

  render() {
    const { candidates, address } = this.state;

    return (
      <>
        <ToastContainer />
        <div className="app">
          {address ? (
            <div className="container">
              <div>
                <p className="detail">
                  {address}
                  <br />
                  <br />
                  <span>Choose one to vote:</span>
                </p>
              </div>
              <div className="candidates">
                {candidates
                  ? candidates.map((candidate) => (
                      <div
                        className="candidate"
                        onClick={() => this.vote(candidate.id)}
                        key={candidate.id}
                      >{`${candidate.name}: ${candidate.voteCount}`}</div>
                    ))
                  : "Loading..."}
              </div>
            </div>
          ) : (
            <button className="connect-button" onClick={this.connect}>
              Connect Wallet
            </button>
          )}
        </div>
      </>
    );
  }
}

export default App;
