"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { subscribe, createAppJwt } from "pubsub-ws";

// Import your images
import blueChain from "./assets/blueChain.png";
import greenChain from "./assets/greenChain.png";
import yellowChain from "./assets/yelloChain.png";
import BlockchainAnimation from "./components/BlockchainAnimation";
import Loader from "./components/loader";

const natsWsUrl =
  "wss://europe-west3-gcp-dl-testnet-brokernode-frankfurt01.synternet.com";
const accessToken =
  "SAAKQGGTZ5ZKPIRJKZBWRJ6KRHK54DSARXUBHBCHE4HSTM32V7HXTXQNOE";
const ethereumBlock = "synternet.ethereum.block";
const solanaBlock = "synternet.solana.block";
const baseBlock = "synternet.base.block";

import ethLogo from "./assets/ethLogo.jpg";
import solLogo from "./assets/solanaLogo.jpg";
import baseLogo from "./assets/baseLogo.png";

export default function Home() {
  const [ethereumBlocks, setEthereumBlocks] = useState([]);
  const [solanaBlocks, setSolanaBlocks] = useState([]);
  const [baseBlocks, setBaseBlocks] = useState([]);
  const [socket, setSocket] = useState(null);

  const [solBlocks, setSolBlocks] = useState(0);
  const [ethBlocks, setEthBlocks] = useState(0);
  const [bseBlocks, setBseBlocks] = useState(0);

  const [solTxs, setSolTxs] = useState(0);
  const [ethTxs, setEthTxs] = useState(0);
  const [baseTxs, setBaseTxs] = useState(0);
  useEffect(() => {
    initNats();
    initSolanaSocket();
  }, []);

  const initNats = async () => {
    const config = { url: natsWsUrl };
    const { userSeed: seed, jwt } = createAppJwt(accessToken);

    const onMessages = async (messages) => {
      messages.forEach((message) => {
        const blockData = JSON.parse(message.data);
        console.log(blockData);
        console.log(message.subject, blockData);
        let newBlock;
        if (message.subject === solanaBlock) {
          newBlock = {
            number: blockData.blockHeight,
            transactions: blockData.transactions.length,
          };
          // increase solBlocks and solTxns by 1 and the number of transactions in the block
          setSolBlocks(solBlocks + 1);
          setSolTxs(solTxs + blockData.transactions.length);
        } else {
          newBlock = {
            number: blockData.blockNumber,
            transactions: blockData.transactionsCount,
          };
        }

        if (message.subject === ethereumBlock) {
          setEthBlocks((prev) => prev + 1);
          setEthTxs((prev) => prev + blockData.transactionsCount);
        }
        if (message.subject === baseBlock) {
          setEthBlocks((prev) => prev + 1);
          setBaseTxs((prev) => prev + blockData.transactionsCount);
        }

        switch (message.subject) {
          case ethereumBlock:
            setEthereumBlocks((prev) => [newBlock, ...prev.slice(0, 20)]);
            break;
          case solanaBlock:
            console.log(solanaBlocks);
            setSolanaBlocks((prev) => [newBlock, ...prev.slice(0, 15)]);
            break;
          case baseBlock:
            setBaseBlocks((prev) => [newBlock, ...prev.slice(0, 15)]);
            break;
        }
      });
    };

    const onError = (text, error) => {
      console.error(text, error);
    };

    try {
      // stoping solana streams due to extreme data spams - temporarily using websockets until fix
      //  await subscribe({
      //   onMessages,
      //   onError,
      //   jwt: jwt,
      //   nkey: seed,
      //   config: config,
      //   subject: solanaBlock,
      // });

      await subscribe({
        onMessages,
        onError,
        jwt: jwt,
        nkey: seed,
        config: config,
        subject: baseBlock,
      });
      await subscribe({
        onMessages,
        onError,
        jwt: jwt,
        nkey: seed,
        config: config,
        subject: ethereumBlock,
      });

      console.log("Connected to NATS server.");
    } catch (error) {
      console.error("Failed to connect to NATS server:", error);
    }
  };

  const initSolanaSocket = async () => {
    const uri = "wss://socket.solana.fm/";
    const newSocket = new WebSocket(uri);

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      const initialMessage = {
        id: "1",
        jsonrpc: "2.0",
        method: "block_subscribe",
        params: null,
      };
      newSocket.send(JSON.stringify(initialMessage));
      console.log("Sent initial message");
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.params) {
        const newBlock = {
          number: message.params.result.number,
          transactions: message.params.result.totalTransactions,
        };
        setSolTxs((prev) => prev + message.params.result.totalTransactions);
        setSolanaBlocks((prev) => [newBlock, ...prev.slice(0, 20)]);
      }

      // console.log("Received:", message);
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(newSocket);

    // Cleanup function to close the WebSocket when the component unmounts
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  };

  return (
    <div className='fixed inset-0 w-full h-full bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 animate-gradient-x'>
      <style jsx>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>

      <main
        className='flex min-h-screen flex-col items-center justify-start   text-black'
        style={{}}>
        <h1 className='text-4xl font-bold mb-8 mt-10 leading-relaxed'>
          BlockView 👁️
        </h1>
        <div>
          <p className='text-lg font-medium text-gray-800 mb-10 text-center'>
            Welcome to BlockView! <br></br> Here you can see block formation of
            Solana, Ethereum and Base in real time using
            <a
              href='https://synternet.com'
              target='_blank'
              className='text-blue-500 ml-1 hover:underline'>
              Synternet
            </a>
          </p>
        </div>

        <div className='md:hidden flex items-center justify-center h-full bg-gray-100 p-4'>
          <p className='text-center text-lg font-medium text-gray-800'>
            Please enable desktop mode to view this app.
          </p>
        </div>

        <div className='hidden sm:block w-full'>
          <div className='flex w-full pl-14 flex-row justify-center items-center  '>
            <div className='w-full max-w-4xl mb-8'>
              <div className='flex items-center mb-3'>
                <Image
                  src={ethLogo}
                  className='rounded-full'
                  alt='Ethereum Logo'
                  width={35}
                  height={35}
                />
                <h2 className='text-2xl font-semibold ml-2'>{`Ethereum (Txns: ${ethTxs.toLocaleString()})`}</h2>
              </div>

              {ethTxs === 0 && (
                <div className='flex justify-start'>
                  <Loader />
                </div>
              )}
              <BlockchainAnimation
                blocks={ethereumBlocks}
                blockchainImage={yellowChain}
                chain={"eth"}
              />
            </div>

            <div className='w-full max-w-4xl mb-8'>
              <div className='flex items-center mb-3'>
                <Image
                  src={baseLogo}
                  className='rounded-full'
                  alt='base Logo'
                  width={35}
                  height={35}
                />
                <h2 className='text-2xl font-semibold ml-2'>{`Base (Txns: ${baseTxs.toLocaleString()})`}</h2>
              </div>
              {baseTxs === 0 && (
                <div className='flex justify-start'>
                  <Loader />
                </div>
              )}
              <BlockchainAnimation
                blocks={baseBlocks}
                blockchainImage={blueChain}
                chain={"base"}
              />
            </div>

            <div className='w-full max-w-4xl mb-8'>
              <div className='flex items-center mb-3'>
                <Image
                  src={solLogo}
                  className='rounded-full'
                  alt='Solana Logo'
                  width={35}
                  height={35}
                />
                <h2 className='text-2xl font-semibold ml-2'>{`Solana (Txns: ${solTxs.toLocaleString()})`}</h2>
              </div>

              <div className='flex justify-center w-full mx-auto '>
                {solTxs === 0 && (
                  <div className='flex justify-start'>
                    <Loader />
                  </div>
                )}
                <BlockchainAnimation
                  blocks={solanaBlocks}
                  blockchainImage={greenChain}
                  chain={"sol"}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
