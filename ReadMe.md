# StakeStream: Umi-Powered Project Staking Platform

![StakeStream Banner](https://via.placeholder.com/1200x400?text=StakeStream+Umi+Hackathon+Project)

## Overview
StakeStream is a MEV-proof project staking platform built on **Umi Network** that enables:
- Users to discover projects, stake funds via intents, and track results
- Admins to manage projects with Umi's intent infrastructure
- Conditional execution ("if-this-then-that" rules) for both parties

**Hackathon Submission For**: Umi Network Hackathon  
**Built With**: React - Vite(TypeScript), Tailwindcss, Solidity, Foundry, Umi SDK, Tailwind CSS  
**Demo Video**: [Watch Demo](https://youtu.be/demo-link)

## ✨ Key Features

### User Dashboard
- **Discover Projects**: Filter active/upcoming/completed staking opportunities
- **Intent-Based Staking**: Stake funds via Umi encrypted intents
- **Real-time Tracking**: Visual progress bars and countdown timers
- **MEV-Proof Transactions**: Protected from front-running
- **One-Click Claims**: Gasless reward distribution

### Admin Dashboard
- **Project Management**: Create/update projects with parameters
- **Conditional Rules**: Set auto-execution rules (e.g., "Extend deadline if 90% funded")
- **Revenue Distribution**: Configure streaming payments
- **Intent-Based Updates**: Modify projects without direct contract calls

### Umi-Powered Innovations
- 🔒 **Encrypted Staking Intents**: Hide user actions from MEV bots
- ⚡ **Batch Processing**: Execute 100+ stakes in 1 transaction
- ⚙️ **Conditional Execution**: Auto-stake when criteria met
- 🌐 **Cross-Chain Compatibility**: Native support for multi-chain stakes

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Foundry (forge, anvil, cast)
- Yarn or npm
- MetaMask wallet

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/stakestream-umi.git
cd stakestream-umi

# Install dependencies
cd contracts && forge install
cd ../frontend && yarn install

# Configure environment
cp .env.example .env
# Fill in your environment variables