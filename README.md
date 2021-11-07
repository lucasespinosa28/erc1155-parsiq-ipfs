# random nft with parsiq and ipfs
its app use Parsiq to generate random NFT using webhook
![Screenshot from 2021-11-06 19-57-10](https://user-images.githubusercontent.com/52639395/140627594-866549d2-8c61-4fd1-b25e-c11a1969ac56.png)
# how to run the app
1. copy the `contract/erc115.sol`` to [remix](https://remix.ethereum.org/),deploy into rinkeby network
2. add the contract address and the Rinkeby network endpoint RPC in the config `src/config.js`
3. in the `/script/config.js` add apiKey and apiSecret from [fleek](https://fleek.co/)
4. run the webhook,`npm run webhook`
5. add new webhook transport with ngrok url,[parsiq transport](https://staging.parsiq.net/monitoring/transports)
6. in the [parsiq events](https://staging.parsiq.net/monitoring/events) add the file `contract/abi.json`
7. create a new trigger with this code 
```sql 
stream TriggerMint
from ETH_TriggerMint_Minted_Events
where @contract == ETH.address("0x316C93610973Da894649aA61f4B9b008aedF412a")
process
   emit {owner:@_owner,id:@_id}
end
```
8. run the web app,`npm run dev`
