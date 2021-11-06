import { useState,useEffect } from 'react';
import axios from 'axios';
import { ethers } from "ethers";
import config from "./config";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();
const ipfUrl = "https://ipfs.fleek.co/"
const provider = new ethers.providers.JsonRpcProvider(config.RPC);
const ERC1155ABI = [
  "function MintNFT() public",
  "function getLastBalance(address _owner) public view returns(uint256)",
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function uri(uint256 id) view returns (string)"
];
const ERC1155Contract = new ethers.Contract(config.address, ERC1155ABI, provider);

function Metadata(metadata){
  metadata = metadata.data
 
  console.log(metadata)
  if(metadata === undefined){
    return <div></div>
  }else{
    console.log(ipfUrl+metadata.image)
    return (
      <Card>
        <CardMedia
          sx={{ height: 400 }}
          component="img"
          height="140"
          image={ipfUrl+metadata.image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {metadata.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {metadata.description}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

function App() {
  const [metadata,setMetadata] = useState()
  const [nftId,setNftId] = useState("null")
  const handleMint = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const address = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const mintContract = new ethers.Contract(config.address, ERC1155ABI, signer);
    const result = await mintContract.MintNFT()
    await result.wait();
    const id = await mintContract.getLastBalance(address[0]);
    setNftId(id.toString());
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data)
    if(data.get('address').length > 20){
      const balance = await ERC1155Contract.balanceOf(data.get('address'),data.get('id'))
      if(balance.toString() !== "0"){
        const url = await ERC1155Contract.uri(balance)
        const result = await axios.get(url.replace("{id}",data.get('id')))
        setMetadata(result.data)
      }
    }
  };
  useEffect(() =>setMetadata(metadata),[metadata])
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
           ERC1155
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleMint}
              sx={{ mt: 3, mb: 2 }}
            >
              mint random nft
            </Button>
            <Typography component="h1" variant="h5">
           You last nft id:{nftId}
          </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="address"
              name="address"
              autoComplete="address"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="id"
              label="id"
              id="id"
              type="number"
              autoComplete="id"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Search
            </Button>
            <Grid container>
              <Metadata data={metadata} />
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App
