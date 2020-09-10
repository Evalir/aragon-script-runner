// me require the Buidler Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `buidler run <script>` you'll find the Buidler
// Runtime Environment's members available in the global scope.
const bre = require('@nomiclabs/buidler')
const { encodeDelayedMint } = require('./lib/encoder')
const DISPUTABLE_DELAY_ABI = require('./lib/abi/DisputableDelay.json')

usePlugin('@nomiclabs/buidler-truffle5')
usePlugin('@nomiclabs/buidler-web3')

task('delayedMint', 'Mint tokens through the disputable delay app')
  .addParam('tokenManager', 'Token manager address')
  .addParam('disputableDelay', 'Disputable Delay address')
  .addParam('receiver', 'receiver address')
  .addParam('amount', 'amount in wei')
  .addParam('context', 'justification for disputes')
  .setAction(
    async ({ amount, context, disputableDelay, receiver, tokenManager }) => {
      console.log('creating callscript...')
      const encodedDelayedMint = encodedDelayedMint(
        tokenManager,
        receiver,
        amount
      )
      console.log('callscript created successfully: ', encodedDelayedMint)
      const DelayContract = new web3.eth.Contract(
        DISPUTABLE_DELAY_ABI,
        disputableDelay
      )
      console.log('sending tx')
      const tx = await DelayContract.methods.delayExecution(
        encodedDelayedMint,
        web3.utils.utfToHex(context)
      )
      console.log(tx, 'tx sent succesfully')
    }
  )

async function main() {
  // Buidler always runs the compile task when running scripts through it.
  // If this runs in a standalone fashion you may want to call compile manually
  // to make sure everything is compiled
  // await bre.run('compile');

  // We get the contract to deploy
  const Greeter = await ethers.getContractFactory('Greeter')
  const greeter = await Greeter.deploy('Hello, Buidler!')

  await greeter.deployed()

  console.log('Greeter deployed to:', greeter.address)
}

module.exports = {
  networks: {
    rinkeby: {
      accounts: [
        '0xe93482dc183b786db7fc517041299f1172426c09654a554298dc9055cf02b7b2',
      ],
    },
  },
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main()
// .then(() => process.exit(0))
// .catch((error) => {
// console.error(error)
// process.exit(1)
// })
