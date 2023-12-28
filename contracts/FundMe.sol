//SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.8;

//import
import "./PriceConverter.sol";

//error codes
error FundMe__NotOwner();

//interface, libraries, contracts

/**
 * @title A contract for crowd funding
 * @author Gbenga Onifade
 * @notice This contract is to showcase a demo for funding contract
 * @dev This makes use of pricefeed as our library
 */

contract FundMe {
    //Type declaration

    using PriceConverter for uint256;

    //state variables
    uint256 public constant MINIMUM_USD = 50 * 1e18; // 1 * 10 ** 18
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        // require( msg.sender == i_owner, "You are not the owner, lol");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    ///functions order
    /// contsructor
    /// receive
    /// fallback
    /// external
    /// public
    /// internal
    /// private
    /// view /pure

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // fallback() external payable {
    //     fund();
    // }

    // receive() external payable {
    //     fund();
    // }

    function fund() public payable {
        require(
            msg.value.getConvertionRate(s_priceFeed) >= MINIMUM_USD,
            "Didn't send enough"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);
        //call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
        // //transfer
        // payable(msg.sender).transfer(address(this).balance);
        // //send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess,"Send failed");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        for (uint256 funderIndex; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        //call
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success, "Call failed");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
