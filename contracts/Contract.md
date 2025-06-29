```mermaid
 graph TD
    A[User Dashboard] --> B[StakeStream.sol]
    A --> C[UmiResolver.sol]
    B --> D[Project Management]
    B --> E[Staking Actions]
    C --> F[Intent Processing]
    C --> G[MEV Protection]
    B --> H[RewardDistributor.sol]
    H --> I[Reward Calculation]
    H --> J[Payout Execution]
    ```
