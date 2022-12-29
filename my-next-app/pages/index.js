import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract, utils } from "ethers";
import { useEffect, useRef, useState } from "react";
import { CRYPTODEVS_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  //This state will keep track of the owner status
  const [isOwner, setIsOwner] = useState(false);
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  //To Check Presale is started or not
  const [presaleStarted, setPresaleStarted] = useState(false);
//To check if presale is ended or not
  const [isPresaleEnded, setIsPresaleEnded] = useState(false);
//TO keep track of how many NFTs has been minted currently
  const [numTokensMinted, setNumTokensMinted] = useState("");
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const getNumMintedTokens = async () =>{
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(CRYPTODEVS_CONTRACT_ADDRESS, abi, provider)
      const numTokenIds = await nftContract.tokenIds();
      setNumTokensMinted(numTokenIds.toString()); 
    } catch (error) {
      console.error(error);
    }
   
  }

  const presaleMint = async () =>{
    console.log("in the presale mint")
    try {
      const signer = getProviderOrSigner(true);
      const nftContract = new Contract(CRYPTODEVS_CONTRACT_ADDRESS, abi, signer);
      const txn = await nftContract.presaleMint({value: utils.parseEther("0.01")})
      await txn.wait();
      window.alert("you've successfully minted a CryptoDev")
    } catch (error) {
      console.log(error);
    }
  }
  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      console.log(`in public mint ${signer}`)
      const nftContract = new Contract(CRYPTODEVS_CONTRACT_ADDRESS, abi, signer);
      const txn = await nftContract.mint({value: utils.parseEther("0.01")})
      await txn.wait();
      window.alert("you've successfully minted a CryptoDev")
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };
  const startPresale = async() =>{
    try {
        const signer = await getProviderOrSigner(true);
        const nftContract = new Contract(CRYPTODEVS_CONTRACT_ADDRESS, abi, signer);
        const txn = await nftContract.startPresale();
        await txn.wait();
        
    } catch (error) {
      console.log(error)
    }
  }
  const checkIfPresaleStarted = async () =>{
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(CRYPTODEVS_CONTRACT_ADDRESS, abi, provider);
      const isPresaleStarted = await nftContract.presaleStarted();
      setPresaleStarted(isPresaleStarted);

      return isPresaleStarted
    } catch (error) {
      return false;  
      console.log(error)
    }
  }
  const checkIfPresaleEnded =async() => {
    try {
      
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(CRYPTODEVS_CONTRACT_ADDRESS, abi, provider);
      const presaleEndTime = await nftContract.presaleEnded(); //time in seconds
      
      const currentTime = Date.now() / 1000; //time in seconds after dividing it by 1000

      const hasPresaleEnded = presaleEndTime.lt(Math.floor(currentTime));
      setIsPresaleEnded(hasPresaleEnded);

    } catch (error) {
      console.error(error);
    }
  }
  const getOwner = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(CRYPTODEVS_CONTRACT_ADDRESS, abi, signer);
      const owner = await nftContract.owner();
      const userAddress = await signer.getAddress(); 
      if(owner.toString().toLowerCase() === userAddress.toString().toLowerCase()){
        setIsOwner(true);

      }


    } catch (error) {
      console.error(error)
    }
  }

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);

    } catch (err) {
      console.error(err);
    }
  };

  
  //  renderBody: Returns a body based on the state of the dapp
  const renderBody = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    if(isOwner && !presaleStarted)
    {
      return(<button onClick={startPresale} className={styles.button}> Start Presale </button>)
    }
    if(!presaleStarted){
      return(<div>
        <span className = {styles.description}>
          Presale has not been started come back later.
        </span>
      </div>)
    }
    if(!isPresaleEnded && presaleStarted ){
   
      return(
        <div>
        <div className={styles.description} >Presale is started If you are in the whitelist 
        mint you NFT.</div>
        <button onClick={presaleMint} className={styles.button}> Mint NFT</button>
        </div>

      )
    }
    
    if(isPresaleEnded){
      return(
        <div>
        <div className={styles.description} >Presale is already ended mint your NFT normally.</div>
        <button onClick={publicMint} className={styles.button}>Public Mint!</button>
        </div>

      )
    }



  }
  const onPageLoad = async () => {
      await connectWallet();
      await getOwner();
      const presaleStarted = await checkIfPresaleStarted(); 
      console.log("variable presale started = "+ presaleStarted)
      if(presaleStarted ){
        await checkIfPresaleEnded();
      }
      await getNumMintedTokens();
      setInterval(async () => {
        await getNumMintedTokens();

      },5 *1000)
      setInterval(async () => {
        const presaleStarted = await checkIfPresaleStarted();
        
        if(presaleStarted)
        await checkIfPresaleEnded();
      },5 * 1000)
  }
  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      onPageLoad();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Crypto Devs NFT</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>

          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numTokensMinted}/20 NFTs has already been minted.
          </div>
          {renderBody()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
