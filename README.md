# FundMe Solidity Project

Welcome to the FundMe Solidity Project! This project showcases a crowdfunding smart contract created using Hardhat.

## Project Overview

- Built a crowdfunding contract using Hardhat.
- Integrated CoinMarketCap API for price feed data. [CoinMarketCap API Documentation](https://coinmarketcap.com/api/documentation/v1/)
- Utilized Alchemy's RPC URL for Ethereum network connectivity. [Alchemy RPC_URL](https://www.alchemy.com/dapps/alchemy)
- Inspired by Patrick's Solidity tutorial powered by FreeCodeCamp. [Patrick's Solidity Tutorial](https://youtu.be/gyMwXuJrbJQ?si=Pk-F1s9vlNxTakBH)

## Getting Started

To set up the project:

1. Clone the repository:

    ```bash
    https://github.com/Ebenezary/Hardhat-Fundme-Project
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure API keys:
    - Obtain an API key from CoinMarketCap and insert it into your project. Refer to the [CoinMarketCap API Documentation](https://coinmarketcap.com/api/documentation/v1/).
    - Set up the Alchemy RPC URL for Ethereum network connectivity. Access it [here](https://www.alchemy.com/dapps/alchemy).

## Environment Configurations

In the `hardhat.config.js` file, you'll find environment configurations that can be set via environment variables or manually if needed. Here's a breakdown of these configurations:

```
const SEPOLIA_RPC_URL = "ENTER YOUR RPC_URL";

const ETHERSCAN_API_KEY = "ENTER YOUR API";

const COINMARKETCAP_API_KEY = "ENTER YOUR API";
```

```SEPOLIA_RPC_URL:``` Specifies the RPC URL for the Ethereum network. Replace ```"ENTER YOUR RPC_URL"``` with your specific RPC URL.
```ETHERSCAN_API_KEY:``` Represents the API key for Etherscan. Replace ```"ENTER YOUR API"``` with your specific Etherscan API key.
```COINMARKETCAP_API_KEY:``` Denotes the API key for CoinMarketCap. Replace ```"ENTER YOUR API"``` with your specific CoinMarketCap API key. Ensure to set these values with your actual API keys or RPC URLs based on your development or deployment environment.

## Acknowledgments
I would like to extend my gratitude to FreeCodeCamp for powering Patrick's Solidity tutorial. The tutorial was immensely helpful in guiding me through various aspects of Solidity development. You can find the tutorial here.

## Contributing
Contributions are welcome! If you'd like to contribute to the codebase:

## Fork the Project
- Create your Bugfix Branch ```git checkout -b bugfix/yourbugfix```
- Commit your Changes ```git commit -m 'Fix specific bug details'```
- Push to the Branch ```git push origin bugfix/yourbugfix```
- Open a Pull Request
- Feel free to suggest enhancements, report bugs, or add new features!

## Contact Information
- Twitter: @G_E_O15
- GitHub: Ebenezary
