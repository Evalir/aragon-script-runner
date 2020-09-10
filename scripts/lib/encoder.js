const abi = require('web3-eth-abi')
const TOKEN_MANAGER_ABI = require('./abi/TokenManager.json').abi

const CALLSCRIPT_ID = '0x00000001'

function encodeCallsScript(actions) {
  return actions.reduce((script, { to, data }) => {
    const address = abi.encodeParameter('address', to)
    const dataLength = abi
      .encodeParameter('uint256', (data.length - 2) / 2)
      .toString('hex')
    return script + address.slice(26) + dataLength.slice(58) + data.slice(2)
  }, CALLSCRIPT_ID)
}

function getFunctionABI(ABI, functionName) {
  const functionABI = ABI.find(
    (item) => item.type === 'function' && item.name === functionName
  )
  if (!functionABI)
    throw Error(`Could not find function ABI called ${functionName}`)
  return functionABI
}

function encodeDelayedMint(tokenManager, receiver, amount) {
  const mintABI = getFunctionABI(TOKEN_MANAGER_ABI, 'mint')
  const mintAction = abi.encodeFunctionCall(mintABI, [receiver, amount])
  const mintCallscript = encodeCallsScript([{ to: tokenManager, data: mintAction }])

  return mintCallscript
}

module.exports = {
  encodeDelayedMint,
}
