import { Component } from 'react'
import { ethers } from 'ethers'

import { ConnectWallet } from '../components/ConnectWallet'

import auctionAddress from '../contracts/AcceptingDonations-contract-address.json'
import auctionArtifact from '../contracts/AcceptingDonations.json'

const HARDHAT_NETWORK_ID = '1337'
const RINKEBY_NETWORK_ID = '4'
const ERROR_CODE_TX_REJECTED_BY_USER = 4001


export default class extends Component {
  constructor(props) {
    super(props)

    this.initialState = {
      selectedAccount: null,
      txBeingSent: null,
      networkError: null,
      transactionError: null,
      balance: null,
    }

    this.state = this.initialState
  }

  _connectWallet = async () => {
    if(window.ethereum === undefined) {
      this.setState({
        networkError: 'Please install Metamask!'
      })
      return
    }

    const [selectedAddress] = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    if(!this._checkNetwork()) { return }

    this._initialize(selectedAddress)

    window.ethereum.on('accountsChanged', ([newAddress]) => {
      if(newAddress === undefined) {
        return this._resetState()
      }

      this._initialize(newAddress)
    })

    window.ethereum.on('chainChanged', ([networkId]) => {
      this._resetState()
    })
  }

  async _initialize(selectedAddress) {
    this._provider = new ethers.providers.Web3Provider(window.ethereum)

    this._auction = new ethers.Contract(
      auctionAddress.AcceptingDonations,
      auctionArtifact.abi,
      this._provider.getSigner(0)
    )

    this.setState({
      selectedAccount: selectedAddress
    }, async () => await this.updateBalance())
  }

  async updateBalance() {
    const newBalance = (await this._provider.getBalance(
      this.state.selectedAccount
    )).toString()

    this.setState({
      balance: newBalance
    })
  }

  _resetState() {
    this.setState(this.initialState)
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) { return true }
    if (window.ethereum.networkVersion === RINKEBY_NETWORK_ID) { return true }

    this.setState({
      networkError: 'Please connect to localhost:8545 or rinkeby network.'
    })

    return false
  }

  _dismissNetworkError = () => {
    this.setState({
      networkError: null
    })
  }

  render() {
    if(!this.state.selectedAccount) {
      return <ConnectWallet
        connectWallet={this._connectWallet}
        networkError={this.state.networkError}
        dismiss={this._dismissNetworkError}
      />
    }

    return(
      <>
        {this.state.balance &&
          <p>Your balance: {ethers.utils.formatEther(this.state.balance)} ETH</p>}
      </>
    )
  }
} 

