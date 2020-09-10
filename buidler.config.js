const { encodeDelayedMint } = require('./scripts/lib/encoder')
const DISPUTABLE_DELAY_ABI = require('./scripts/lib/abi/DisputableDelay.json')

const ETH_KEY = process.env.ETH_KEY

usePlugin('@nomiclabs/buidler-truffle5')
usePlugin('@nomiclabs/buidler-web3')

task('delayedMint', 'Mint tokens through the disputable delay app')
  .addParam('tokens', 'Token manager address')
  .addParam('delay', 'Disputable Delay address')
  .addParam('receiver', 'receiver address')
  .addParam('amount', 'amount in wei')
  .addParam('context', 'justification for disputes')
  .setAction(async ({ amount, context, delay, receiver, tokens }) => {

    console.log('creating callscript...')
    // This gets the encoded action to be sent to the disputable delay, which is expecting
    // a `bytes evmScript` as the first argument of the `delayExecution` function.
    const encodedDelayedMint = encodeDelayedMint(tokens, receiver, amount)
    console.log('callscript created successfully: ', encodedDelayedMint)

    const DelayContract = new web3.eth.Contract(DISPUTABLE_DELAY_ABI, delay)
    console.log('sending tx')

    const [sender] = await web3.eth.getAccounts()

    const tx = await DelayContract.methods
      .delayExecution(encodedDelayedMint, web3.utils.utf8ToHex(context))
      .send({
        from: sender,
      })
    console.log('Sent! txhash: ', tx.transactionHash)
  })

module.exports = {
  networks: {
    rinkeby: {
      url: 'https://rinkeby.eth.aragon.network',
      accounts: ETH_KEY
        ? ETH_KEY.split(',')
        : [
            '0xa8a54b2d8197bc0b19bb8a084031be71835580a01e70a45a13babd16c9bc1563',
          ],
    },
  },
}
