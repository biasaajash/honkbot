const fs = require('fs');
const axios = require('axios');

const FILE_PATH = './data.txt';

function readTokens() {
  return fs.readFileSync(FILE_PATH, 'utf8').trim().split('\n');
}

async function honk(token, index) {
  try {
    const decoded = parseJwt(token);
    const fid = decoded.fid;
    const username = decoded.username;

    const res = await axios.post('https://sillyhonk.replit.app/api/honk', {
      fid,
      username,
      displayName: username,
      sessionToken: token,
      location: {
        type: "cast_embed",
        embed: "https://sillyhonk.replit.app/",
        cast: {
          fid: 341055,
          hash: "0x7e92460ea2e4da74764bbe5abfcb5e3c05f95008"
        }
      },
      frameContext: {
        clientFid: 9152,
        added: false
      },
      untrustedData: {
        fid,
        username
      }
    });

    if (res.data.success) {
      console.log(`[${new Date().toLocaleTimeString()}] [${username}] HONK sukses! Total Honks: ${res.data.honksCount}`);
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] [${username}] Gagal honk: ${res.data.message || 'Unknown error'}`);
    }
  } catch (err) {
    console.error(`[${new Date().toLocaleTimeString()}] [Akunnya #${index + 1}] Error:`, err.message);
  }
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = Buffer.from(base64, 'base64').toString();
  return JSON.parse(jsonPayload);
}

function startMultiHonk() {
  const tokens = readTokens();
  tokens.forEach((token, index) => {
    honk(token, index); // langsung jalanin
    setInterval(() => honk(token, index), 3600 * 1000); // tiap 3600 detik (1 jam)
  });
}

startMultiHonk();
