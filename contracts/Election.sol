// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract Election {
    
    event NewVote(address voter, uint id, uint voteCount);

    struct Candidate {
        string name;
        uint voteCount;
    }
    
    Candidate[] public candidates;
    uint public candidatesCount;
    // Store accounts that have voted
    mapping(address => bool) public voters;

    constructor(string[] memory candidateNames) {
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                voteCount: 0
            }));
        }
        candidatesCount = candidateNames.length;
    }
    

    function vote (uint _candidate) public {
        // require that they haven't voted before
        require(!voters[msg.sender], "Already voted!");

        // If `candidate` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        Candidate storage candidate = candidates[_candidate];
        
        // Record that voter has voted
        voters[msg.sender] = true;

        // Update candidate vote Count
        candidate.voteCount ++;
        
        // Emit the new vote event
        emit NewVote(msg.sender, _candidate, candidate.voteCount);
    }
    
    function winningCandidate() public view
            returns (uint winningCandidate_)
    {
        uint winningVoteCount = 0;
        for (uint candidate = 0; candidate < candidates.length; candidate++) {
            if (candidates[candidate].voteCount > winningVoteCount) {
                winningVoteCount = candidates[candidate].voteCount;
                winningCandidate_ = candidate;
            }
        }
    }

    function winnerName() external view
            returns (string memory winnerName_)
    {
        winnerName_ = candidates[winningCandidate()].name;
    }
}