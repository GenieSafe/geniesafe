# geniesafe

[Geniesafe](https://geniesafe.tech) is an Ethereum-based web app to manage your crypto inheritance and safeguard your private keys.

This project is built and maintained by [Alif](https://github.com/alifmazli) and [Syaamil](https://github.com/escornbar).

## Getting started

```bash
git clone https://github.com/GenieSafe/geniesafe.git
cd geniesafe/contract

npm i
```
```bash
cd ..
cd frontend
npm i
```

This will install the frontend packages. We also need to set up the local configuration file.

```bash
copy .env.example .env
```

This will create a file called `.env`. Open up that file and fill in the environment variables.

```bash
npm run dev
```

This will start up the Next.js development server. Your site will be available at http://localhost:3001/

### Metamask

To interact with the local contract, be sure to switch your MetaMask network to Sepolia testnet.
