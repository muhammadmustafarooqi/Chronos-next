import { io } from 'socket.io-client';
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testSocketBid() {
  try {
    // Step 1: Get user token and ID
    console.log('Step 1: Getting user token and ID...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@chronos.com',
        password: process.env.ADMIN_PASSWORD || 'Admin123@'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.data?.token;
    const userId = loginData.data?.user?.id;
    console.log(`Token obtained: ${!!token}`);
    console.log(`User ID: ${userId}\n`);

    // Step 2: Get auction
    console.log('Step 2: Getting live auction...');
    const auctionsRes = await fetch(`${BASE_URL}/auctions?status=live`);
    const auctionsData = await auctionsRes.json();
    const auction = auctionsData.data?.auctions?.[0];
    console.log(`Auction ID: ${auction?._id}`);
    console.log(`Current price: $${auction?.currentPrice}\n`);

    if (!auction || !token || !userId) {
      console.log('Missing required data');
      process.exit(1);
    }

    const auctionId = auction._id;
    const currentPrice = auction.currentPrice;
    const bidAmount = currentPrice + 100;

    // Step 3: Connect socket
    console.log('Step 3: Connecting socket.io...');
    const socket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 3
    });

    let eventReceived = false;

    socket.on('connect', () => {
      console.log('✓ Socket connected\n');

      socket.emit('join-auction', auctionId);
      console.log('Emitted: join-auction\n');

      console.log(`Placing bid: $${bidAmount} on auction ${auctionId.substring(0,8)}...`);
      socket.emit('place-bid', {
        auctionId,
        amount: bidAmount,
        userId,
        customerName: 'Admin User',
        token
      });
    });

    socket.on('bid-placed', (data) => {
      eventReceived = true;
      console.log('\n✓✓✓ EVENT RECEIVED: bid-placed');
      console.log(JSON.stringify(data, null, 2));
      
      setTimeout(() => {
        socket.disconnect();
        queryDB();
      }, 500);
    });

    socket.on('bid-error', (data) => {
      console.log('\n✗ EVENT: bid-error');
      console.log(data.message);
      socket.disconnect();
      process.exit(1);
    });

    socket.on('disconnect', () => {
      if (!eventReceived) {
        console.log('\n✗ Socket disconnected without bid-placed event');
        process.exit(1);
      }
    });

    async function queryDB() {
      console.log('\nQuerying MongoDB for current price...');
      const queryRes = await fetch(`${BASE_URL}/auctions/${auctionId}`);
      const queryData = await queryRes.json();
      const newPrice = queryData.data?.auction?.currentPrice;
      console.log(`Auction currentPrice: $${newPrice}`);
      process.exit(0);
    }

    setTimeout(() => {
      if (!eventReceived) {
        console.log('\n✗ Timeout: No bid-placed event received after 8 seconds');
        socket.disconnect();
        process.exit(1);
      }
    }, 8000);

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

testSocketBid();
