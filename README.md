# Aptos Creator-Verse

A decentralized platform reimagining how creators and fans interact, own, and monetize digital content using Aptos blockchain's parallel execution capabilities.

## Overview

Creator-Verse solves critical problems in the creator economy: proof of IP ownership, complex royalty distribution, inefficient micro-payments, and dispersed fan engagement through blockchain-native solutions.

## Features

### Core Functionality
- **AI-Powered IP Registration**: Cryptographic fingerprinting and NFT-based proof of ownership
- **Fractionalized IP Ownership**: Tokenized royalty streams for fan investment
- **Real-Time Royalty Distribution**: Smart contract-based automatic payments
- **Decentralized Fan Communities**: DAO governance for creator-fan engagement

### Technical Advantages
- **Parallel Transaction Processing**: Leverages Aptos Block-STM for simultaneous operations
- **Micro-Payment Optimization**: Sub-second finality enables economically viable small payments
- **Asset Security**: Move programming language ensures secure digital asset handling

## Project Structure

```
aptos-creator-verse/
├── contracts/                  # Move smart contracts
│   ├── sources/
│   │   ├── creator_verse.move     # Main platform contract
│   │   ├── ip_registry.move       # IP registration and fingerprinting
│   │   ├── royalty_splitter.move  # Automatic royalty distribution
│   │   └── fractional_nft.move    # Fractionalized ownership tokens
│   ├── tests/                     # Contract tests
│   └── Move.toml                  # Move package configuration
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Application pages
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── utils/                 # Utility functions
│   │   └── types/                 # TypeScript definitions
│   ├── public/
│   └── package.json
├── ai-service/                 # AI fingerprinting service
│   ├── models/                    # ML models for content fingerprinting
│   ├── api/                       # FastAPI endpoints
│   ├── requirements.txt
│   └── Dockerfile
├── indexer/                    # Blockchain data indexer
│   ├── src/
│   │   ├── processors/            # Event processors
│   │   └── database/              # Database schemas
│   └── package.json
├── docs/                       # Documentation
│   ├── api/                       # API documentation
│   ├── contracts/                 # Contract documentation
│   └── user-guide/                # User guides
└── README.md
```

## Technology Stack

### Blockchain
- **Aptos Blockchain**: Main network for smart contracts
- **Move Language**: Smart contract development
- **Aptos SDK**: Blockchain interaction

### Frontend
- **React 18**: User interface framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Styling framework
- **Aptos Wallet Adapter**: Wallet integration

### Backend Services
- **FastAPI**: AI service API
- **PostgreSQL**: Indexer database
- **Redis**: Caching layer
- **Docker**: Containerization

### AI/ML
- **TensorFlow**: Content fingerprinting models
- **OpenAI API**: Content analysis
- **IPFS**: Decentralized file storage

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker
- Aptos CLI

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/sinamchayan/Aptos-Creator-Verse.git
   cd Aptos-Creator-Verse
   ```

2. **Deploy Contracts**
   ```bash
   cd contracts
   aptos move compile
   aptos move test
   aptos move publish
   ```

3. **Start AI Service**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. **Launch Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Run Indexer**
   ```bash
   cd indexer
   npm install
   npm run start
   ```

## Smart Contract Addresses

| Contract | Mainnet | Testnet |
|----------|---------|---------|
| CreatorVerse | `0x...` | `0x...` |
| IPRegistry | `0x...` | `0x...` |
| RoyaltySplitter | `0x...` | `0x...` |
| FractionalNFT | `0x...` | `0x...` |

## API Endpoints

### Creator Operations
- `POST /api/creators/register` - Register new creator
- `POST /api/content/upload` - Upload and fingerprint content
- `GET /api/content/{id}` - Get content details

### IP Management
- `POST /api/ip/register` - Register IP ownership
- `GET /api/ip/{id}/owners` - Get fractional owners
- `POST /api/ip/{id}/fractionalize` - Create fractional tokens

### Royalty Distribution
- `POST /api/royalties/distribute` - Trigger distribution
- `GET /api/royalties/{creator_id}` - Get royalty history

## Testing

### Contract Tests
```bash
cd contracts
aptos move test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

## Deployment

### Testnet
```bash
npm run deploy:testnet
```

### Mainnet
```bash
npm run deploy:mainnet
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contact

**Sina Chayan**
- GitHub: [@sinamchayan](https://github.com/sinamchayan)
- Email: sina@creatorverse.app

## Acknowledgments

- Aptos Foundation for blockchain infrastructure
- Move Language community for development resources
- Creator economy pioneers for inspiration
