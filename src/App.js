import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { render } from '@testing-library/react';
import { Component } from 'react';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    winner: ''
  }
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address)
    this.setState({
      manager, players, balance
    });
  };

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' })

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    this.setState({ message: 'You have been entered!' });
  };

  onClick = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' })

    await lottery.methods.pickWinner().send({
      from: accounts[0],
      // value: web3.utils.toWei(this.state.balance, 'ether')
    });
    const lastWinner = await lottery.methods.lastWinner().call();
    this.setState({ message: 'A winner has been picked!', winner: lastWinner });
  }

  render() {
    //when using getAccounts, ethereum must be enabled in the web3 file, if not you can use requestAccounts() instead
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people entered. competting to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input value={this.state.value} onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button >Enter</button>
        </form>
        <hr />
        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner</button>
        <h4>Our winner is {this.state.winner}</h4>
        <h1>{this.state.message}</h1>
      </div>
    );

  }
}
export default App;
