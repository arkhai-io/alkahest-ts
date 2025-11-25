import * as viem from 'viem';
import { Hex, BlockNumber, BlockTag, WalletClient, Transport, Chain, Account, PublicActions, AbiParameter, DecodeAbiParametersReturnType } from 'viem';
import * as abitype from 'abitype';
import * as arktype from 'arktype';
import * as zod from 'zod';

type ChainAddresses = {
    eas: `0x${string}`;
    easSchemaRegistry: `0x${string}`;
    erc20EscrowObligation: `0x${string}`;
    erc20PaymentObligation: `0x${string}`;
    erc20BarterUtils: `0x${string}`;
    erc721EscrowObligation: `0x${string}`;
    erc721PaymentObligation: `0x${string}`;
    erc721BarterUtils: `0x${string}`;
    erc1155EscrowObligation: `0x${string}`;
    erc1155BarterUtils: `0x${string}`;
    erc1155PaymentObligation: `0x${string}`;
    tokenBundleEscrowObligation: `0x${string}`;
    tokenBundlePaymentObligation: `0x${string}`;
    tokenBundleBarterUtils: `0x${string}`;
    attestationEscrowObligation: `0x${string}`;
    attestationEscrowObligation2: `0x${string}`;
    attestationBarterUtils: `0x${string}`;
    stringObligation: `0x${string}`;
    trustedPartyArbiter: `0x${string}`;
    trivialArbiter: `0x${string}`;
    specificAttestationArbiter: `0x${string}`;
    trustedOracleArbiter: `0x${string}`;
    anyArbiter: `0x${string}`;
    allArbiter: `0x${string}`;
    notArbiter: `0x${string}`;
    intrinsicsArbiter: `0x${string}`;
    intrinsicsArbiter2: `0x${string}`;
    erc8004Arbiter: `0x${string}`;
    confirmationArbiter: `0x${string}`;
    confirmationArbiterComposing: `0x${string}`;
    revocableConfirmationArbiter: `0x${string}`;
    revocableConfirmationArbiterComposing: `0x${string}`;
    unrevocableConfirmationArbiter: `0x${string}`;
    unrevocableArbiterComposing: `0x${string}`;
    nativeTokenEscrowObligation: `0x${string}`;
    nativeTokenPaymentObligation: `0x${string}`;
    nativeTokenBarterUtils: `0x${string}`;
    attesterArbiterComposing?: `0x${string}`;
    expirationTimeArbiterComposing?: `0x${string}`;
    recipientArbiterComposing?: `0x${string}`;
    refUidArbiterComposing?: `0x${string}`;
    revocableArbiterComposing?: `0x${string}`;
    revocationTimeArbiterComposing?: `0x${string}`;
    schemaArbiterComposing?: `0x${string}`;
    timestampArbiterComposing?: `0x${string}`;
    uidArbiterComposing?: `0x${string}`;
    valueArbiterComposing?: `0x${string}`;
    attesterArbiterNonComposing?: `0x${string}`;
    expirationTimeArbiterNonComposing?: `0x${string}`;
    recipientArbiterNonComposing?: `0x${string}`;
    refUidArbiterNonComposing?: `0x${string}`;
    revocableArbiterNonComposing?: `0x${string}`;
    revocationTimeArbiterNonComposing?: `0x${string}`;
    schemaArbiterNonComposing?: `0x${string}`;
    timestampArbiterNonComposing?: `0x${string}`;
    uidArbiterNonComposing?: `0x${string}`;
    valueArbiterNonComposing?: `0x${string}`;
};
type PermitSignature = {
    deadline: bigint;
    v: number;
    r: `0x${string}`;
    s: `0x${string}`;
};
type SignPermitProps = {
    /** Address of the token to approve */
    contractAddress: Hex;
    /** Name of the token to approve.
     * Corresponds to the `name` method on the ERC-20 contract. Please note this must match exactly byte-for-byte */
    erc20Name: string;
    /** Owner of the tokens. Usually the currently connected address. */
    ownerAddress: Hex;
    /** Address to grant allowance to */
    spenderAddress: Hex;
    /** Expiration of this approval, in SECONDS */
    deadline: bigint;
    /** Numerical chainId of the token contract */
    chainId: number;
    /** Defaults to 1. Some tokens need a different version, check the [PERMIT INFORMATION](https://github.com/vacekj/wagmi-permit/blob/main/PERMIT.md) for more information */
    permitVersion?: string;
    /** Permit nonce for the specific address and token contract. You can get the nonce from the `nonces` method on the token contract. */
    nonce: bigint;
};
type Eip2612Props = SignPermitProps & {
    /** Amount to approve */
    value: bigint;
};
type Erc20 = {
    address: `0x${string}`;
    value: bigint;
};
type Erc721 = {
    address: `0x${string}`;
    id: bigint;
};
type Erc1155 = {
    address: `0x${string}`;
    id: bigint;
    value: bigint;
};
type Demand = {
    arbiter: `0x${string}`;
    demand: `0x${string}`;
};
type TokenBundle = {
    erc20s: Erc20[];
    erc721s: Erc721[];
    erc1155s: Erc1155[];
};
type TokenBundleFlat = {
    erc20Tokens: `0x${string}`[];
    erc20Amounts: bigint[];
    erc721Tokens: `0x${string}`[];
    erc721TokenIds: bigint[];
    erc1155Tokens: `0x${string}`[];
    erc1155TokenIds: bigint[];
    erc1155Amounts: bigint[];
};
type ApprovalPurpose = "escrow" | "payment";
type Attestation = {
    uid: `0x${string}`;
    schema: `0x${string}`;
    time: bigint;
    expirationTime: bigint;
    revocationTime: bigint;
    refUID: `0x${string}`;
    recipient: `0x${string}`;
    attester: `0x${string}`;
    revocable: boolean;
    data: `0x${string}`;
};
interface TimeFilters {
    /** Only process attestations after this timestamp (Unix timestamp in seconds) */
    minTime?: bigint;
    /** Only process attestations before this timestamp (Unix timestamp in seconds) */
    maxTime?: bigint;
    /** Skip attestations past their expiration time */
    excludeExpired?: boolean;
    /** Only process attestations older than this duration (seconds) */
    minAge?: bigint;
    /** Only process attestations newer than this duration (seconds) */
    maxAge?: bigint;
}
interface AttestationFilters {
    /** Only process attestations from specific attester */
    specificAttester?: string;
    /** Skip attestations from these attesters */
    excludeAttesters?: string[];
    /** Only process attestations for specific recipient */
    specificRecipient?: string;
    /** Skip revoked attestations */
    excludeRevoked?: boolean;
    /** Only process attestations with reference UID */
    requireRefUID?: boolean;
    /** Only process attestations with specific schema */
    specificSchema?: string;
}
interface BlockFilters {
    /** Start from specific block number or block tag */
    fromBlock?: BlockNumber | BlockTag;
    /** End at specific block number or block tag */
    toBlock?: BlockNumber | BlockTag;
    /** Limit the block range to prevent timeouts */
    maxBlockRange?: bigint;
}
interface BatchFilters {
    /** Limit number of obligations to process */
    maxObligations?: number;
    /** Process recent attestations first */
    prioritizeRecent?: boolean;
    /** Process in batches of this size */
    batchSize?: number;
}
interface PerformanceFilters {
    /** Skip if estimated gas exceeds limit */
    maxGasPerTx?: bigint;
    /** Only simulate, don't execute transactions */
    dryRun?: boolean;
    /** Skip validation for faster processing */
    skipValidation?: boolean;
}
interface EnhancedArbitrateFilters extends TimeFilters, AttestationFilters, BlockFilters, BatchFilters, PerformanceFilters {
    /** Only arbitrate if escrow demands current oracle */
    onlyIfEscrowDemandsCurrentOracle?: boolean;
    /** Skip obligations that have already been arbitrated */
    skipAlreadyArbitrated?: boolean;
}

type ViemClient = WalletClient<Transport, Chain, Account> & PublicActions;
/**
 * Detect if the viem client is using WebSocket transport
 * @param viemClient - The viem client
 * @returns true if using WebSocket transport, false otherwise
 */
declare const isWebSocketTransport: (viemClient: ViemClient) => boolean;
/**
 * Get optimal polling interval based on transport type
 * @param viemClient - The viem client
 * @param defaultInterval - Default polling interval for HTTP
 * @returns optimal polling interval or undefined for WebSocket
 */
declare const getOptimalPollingInterval: (viemClient: ViemClient, defaultInterval?: number) => number | undefined;
declare const getAttestation: (viemClient: ViemClient, uid: `0x${string}`, addresses?: Pick<ChainAddresses, "eas">) => Promise<{
    uid: `0x${string}`;
    schema: `0x${string}`;
    time: bigint;
    expirationTime: bigint;
    revocationTime: bigint;
    refUID: `0x${string}`;
    recipient: `0x${string}`;
    attester: `0x${string}`;
    revocable: boolean;
    data: `0x${string}`;
}>;
declare const getAttestedEventFromTxHash: (client: ViemClient, hash: `0x${string}`) => Promise<any>;
declare const flattenTokenBundle: (bundle: TokenBundle) => TokenBundleFlat;

/**
 * Options for arbitration
 */
type ArbitrateOptions = {
    /**
     * Skip attestations that have already been arbitrated by this oracle
     */
    skipAlreadyArbitrated?: boolean;
    /**
     * Only arbitrate new attestations (don't process past attestations)
     */
    onlyNew?: boolean;
    /**
     * Block range for past arbitration
     */
    fromBlock?: BlockNumber | BlockTag;
    toBlock?: BlockNumber | BlockTag;
};
type Decision = {
    hash: `0x${string}`;
    attestation: Attestation;
    decision: boolean;
};
type ListenAndArbitrateResult = {
    decisions: Decision[];
    unwatch: () => void;
};

/**
 * Creates the default extension for the Alkahest client with all standard functionality
 * @param client - The base client to extend
 * @returns Extension object with all standard client functionality
 */
declare const makeDefaultExtension: (client: any) => {
    /** Unified client for all arbiter functionality */
    arbiters: {
        encodeMultiArbiterDemand: (demand: {
            arbiters: `0x${string}`[];
            demands: `0x${string}`[];
        }) => `0x${string}`;
        decodeMultiArbiterDemand: (demandData: `0x${string}`) => {
            arbiters: readonly `0x${string}`[];
            demands: readonly `0x${string}`[];
        };
        encodeAttesterArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            attester: `0x${string}`;
        }) => `0x${string}`;
        decodeAttesterArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            attester: `0x${string}`;
        };
        encodeAttesterArbiterNonComposingDemand: (demand: {
            attester: `0x${string}`;
        }) => `0x${string}`;
        decodeAttesterArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            attester: `0x${string}`;
        };
        encodeTimeAfterArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            time: bigint;
        }) => `0x${string}`;
        decodeTimeAfterArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            time: bigint;
        };
        encodeTimeAfterArbiterNonComposingDemand: (demand: {
            time: bigint;
        }) => `0x${string}`;
        decodeTimeAfterArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            time: bigint;
        };
        encodeTimeBeforeArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            time: bigint;
        }) => `0x${string}`;
        decodeTimeBeforeArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            time: bigint;
        };
        encodeTimeBeforeArbiterNonComposingDemand: (demand: {
            time: bigint;
        }) => `0x${string}`;
        decodeTimeBeforeArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            time: bigint;
        };
        encodeTimeEqualArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            time: bigint;
        }) => `0x${string}`;
        decodeTimeEqualArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            time: bigint;
        };
        encodeTimeEqualArbiterNonComposingDemand: (demand: {
            time: bigint;
        }) => `0x${string}`;
        decodeTimeEqualArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            time: bigint;
        };
        encodeExpirationTimeAfterArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            expirationTime: bigint;
        }) => `0x${string}`;
        decodeExpirationTimeAfterArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            expirationTime: bigint;
        };
        encodeExpirationTimeAfterArbiterNonComposingDemand: (demand: {
            expirationTime: bigint;
        }) => `0x${string}`;
        decodeExpirationTimeAfterArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            expirationTime: bigint;
        };
        encodeExpirationTimeBeforeArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            expirationTime: bigint;
        }) => `0x${string}`;
        decodeExpirationTimeBeforeArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            expirationTime: bigint;
        };
        encodeExpirationTimeBeforeArbiterNonComposingDemand: (demand: {
            expirationTime: bigint;
        }) => `0x${string}`;
        decodeExpirationTimeBeforeArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            expirationTime: bigint;
        };
        encodeExpirationTimeEqualArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            expirationTime: bigint;
        }) => `0x${string}`;
        decodeExpirationTimeEqualArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            expirationTime: bigint;
        };
        encodeExpirationTimeEqualArbiterNonComposingDemand: (demand: {
            expirationTime: bigint;
        }) => `0x${string}`;
        decodeExpirationTimeEqualArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            expirationTime: bigint;
        };
        encodeRecipientArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            recipient: `0x${string}`;
        }) => `0x${string}`;
        decodeRecipientArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            recipient: `0x${string}`;
        };
        encodeRecipientArbiterNonComposingDemand: (demand: {
            recipient: `0x${string}`;
        }) => `0x${string}`;
        decodeRecipientArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            recipient: `0x${string}`;
        };
        encodeRefUidArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            refUID: `0x${string}`;
        }) => `0x${string}`;
        decodeRefUidArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            refUID: `0x${string}`;
        };
        encodeRefUidArbiterNonComposingDemand: (demand: {
            refUID: `0x${string}`;
        }) => `0x${string}`;
        decodeRefUidArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            refUID: `0x${string}`;
        };
        encodeRevocableArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            revocable: boolean;
        }) => `0x${string}`;
        decodeRevocableArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            revocable: boolean;
        };
        encodeRevocableArbiterNonComposingDemand: (demand: {
            revocable: boolean;
        }) => `0x${string}`;
        decodeRevocableArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            revocable: boolean;
        };
        encodeSchemaArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            schema: `0x${string}`;
        }) => `0x${string}`;
        decodeSchemaArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            schema: `0x${string}`;
        };
        encodeSchemaArbiterNonComposingDemand: (demand: {
            schema: `0x${string}`;
        }) => `0x${string}`;
        decodeSchemaArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            schema: `0x${string}`;
        };
        encodeUidArbiterComposingDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            uid: `0x${string}`;
        }) => `0x${string}`;
        decodeUidArbiterComposingDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            uid: `0x${string}`;
        };
        encodeUidArbiterNonComposingDemand: (demand: {
            uid: `0x${string}`;
        }) => `0x${string}`;
        decodeUidArbiterNonComposingDemand: (demandData: `0x${string}`) => {
            uid: `0x${string}`;
        };
        encodeAnyArbiterDemand: (demand: {
            arbiters: `0x${string}`[];
            demands: `0x${string}`[];
        }) => `0x${string}`;
        decodeAnyArbiterDemand: (demandData: `0x${string}`) => {
            arbiters: readonly `0x${string}`[];
            demands: readonly `0x${string}`[];
        };
        encodeAllArbiterDemand: (demand: {
            arbiters: `0x${string}`[];
            demands: `0x${string}`[];
        }) => `0x${string}`;
        decodeAllArbiterDemand: (demandData: `0x${string}`) => {
            arbiters: readonly `0x${string}`[];
            demands: readonly `0x${string}`[];
        };
        encodeIntrinsics2Demand: (demand: {
            schema: `0x${string}`;
        }) => `0x${string}`;
        decodeIntrinsics2Demand: (demandData: `0x${string}`) => {
            schema: `0x${string}`;
        };
        encodeTrustedPartyDemand: (demand: {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            creator: `0x${string}`;
        }) => `0x${string}`;
        decodeTrustedPartyDemand: (demandData: `0x${string}`) => {
            baseArbiter: `0x${string}`;
            baseDemand: `0x${string}`;
            creator: `0x${string}`;
        };
        encodeSpecificAttestationDemand: (demand: {
            uid: `0x${string}`;
        }) => `0x${string}`;
        decodeSpecificAttestationDemand: (demandData: `0x${string}`) => {
            uid: `0x${string}`;
        };
        encodeTrustedOracleDemand: (demand: {
            oracle: `0x${string}`;
            data: `0x${string}`;
        }) => `0x${string}`;
        decodeTrustedOracleDemand: (demandData: `0x${string}`) => {
            oracle: `0x${string}`;
            data: `0x${string}`;
        };
        arbitrateAsTrustedOracle: (obligation: `0x${string}`, decision: boolean) => Promise<`0x${string}`>;
        requestArbitrationFromTrustedOracle: (obligation: `0x${string}`, oracle: `0x${string}`) => Promise<`0x${string}`>;
        checkExistingArbitration: (obligation: `0x${string}`, oracle: `0x${string}`) => Promise<{
            obligation: `0x${string}`;
            oracle: `0x${string}`;
            decision: boolean;
        } | undefined>;
        waitForTrustedOracleArbitration: (obligation: `0x${string}`, oracle: `0x${string}`, pollingInterval?: number) => Promise<{
            obligation?: `0x${string}` | undefined;
            oracle?: `0x${string}` | undefined;
            decision?: boolean | undefined;
        }>;
        waitForTrustedOracleArbitrationRequest: (obligation: `0x${string}`, oracle: `0x${string}`, pollingInterval?: number) => Promise<{
            obligation?: `0x${string}` | undefined;
            oracle?: `0x${string}` | undefined;
        }>;
        listenForArbitrationRequestsOnly: (oracle: `0x${string}`, arbitrationHandler: (obligation: `0x${string}`, oracle: `0x${string}`) => Promise<boolean>, pollingInterval?: number) => viem.WatchEventReturnType;
    };
    /** Methods for interacting with ERC20 tokens */
    erc20: {
        encodeEscrowObligationRaw: (data: {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
            token: `0x${string}`;
            amount: bigint;
        }) => `0x${string}`;
        encodePaymentObligationRaw: (data: {
            token: `0x${string}`;
            amount: bigint;
            payee: `0x${string}`;
        }) => `0x${string}`;
        encodeEscrowObligation: (token: Erc20, demand: Demand) => `0x${string}`;
        encodePaymentObligation: (token: Erc20, payee: `0x${string}`) => `0x${string}`;
        decodeEscrowObligation: (obligationData: `0x${string}`) => {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
            token: `0x${string}`;
            amount: bigint;
        };
        decodePaymentObligation: (obligationData: `0x${string}`) => {
            token: `0x${string}`;
            amount: bigint;
            payee: `0x${string}`;
        };
        getEscrowSchema: () => Promise<`0x${string}`>;
        getPaymentSchema: () => Promise<`0x${string}`>;
        getEscrowObligation: (uid: `0x${string}`) => Promise<{
            data: {
                arbiter: `0x${string}`;
                demand: `0x${string}`;
                token: `0x${string}`;
                amount: bigint;
            };
            uid: `0x${string}`;
            schema: `0x${string}`;
            time: bigint;
            expirationTime: bigint;
            revocationTime: bigint;
            refUID: `0x${string}`;
            recipient: `0x${string}`;
            attester: `0x${string}`;
            revocable: boolean;
        }>;
        getPaymentObligation: (uid: `0x${string}`) => Promise<{
            data: {
                token: `0x${string}`;
                amount: bigint;
                payee: `0x${string}`;
            };
            uid: `0x${string}`;
            schema: `0x${string}`;
            time: bigint;
            expirationTime: bigint;
            revocationTime: bigint;
            refUID: `0x${string}`;
            recipient: `0x${string}`;
            attester: `0x${string}`;
            revocable: boolean;
        }>;
        approve: (token: Erc20, purpose: ApprovalPurpose) => Promise<`0x${string}`>;
        approveIfLess: (token: Erc20, purpose: ApprovalPurpose) => Promise<`0x${string}` | null>;
        collectEscrow: (buyAttestation: `0x${string}`, fulfillment: `0x${string}`) => Promise<`0x${string}`>;
        reclaimExpired: (buyAttestation: `0x${string}`) => Promise<`0x${string}`>;
        buyWithErc20: (price: Erc20, item: Demand, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        permitAndBuyWithErc20: (price: Erc20, item: Demand, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payWithErc20: (price: Erc20, payee: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        permitAndPayWithErc20: (price: Erc20, payee: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyErc20ForErc20: (bid: Erc20, ask: Erc20, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        permitAndBuyErc20ForErc20: (bid: Erc20, ask: Erc20, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc20ForErc20: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        permitAndPayErc20ForErc20: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyErc721WithErc20: (bid: Erc20, ask: Erc721, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        permitAndBuyErc721WithErc20: (bid: Erc20, ask: Erc721, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc20ForErc721: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        permitAndPayErc20ForErc721: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyErc1155WithErc20: (bid: Erc20, ask: Erc1155, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        permitAndBuyErc1155WithErc20: (bid: Erc20, ask: Erc1155, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc20ForErc1155: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        permitAndPayErc20ForErc1155: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyBundleWithErc20: (bid: Erc20, bundle: TokenBundle, payee: `0x${string}`, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        permitAndBuyBundleWithErc20: (bid: Erc20, bundle: TokenBundle, payee: `0x${string}`, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc20ForBundle: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        permitAndPayErc20ForBundle: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
    };
    /** Methods for interacting with ERC721 tokens */
    erc721: {
        encodeEscrowObligationRaw: (data: {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
            token: `0x${string}`;
            tokenId: bigint;
        }) => `0x${string}`;
        encodePaymentObligationRaw: (data: {
            token: `0x${string}`;
            tokenId: bigint;
            payee: `0x${string}`;
        }) => `0x${string}`;
        encodeEscrowObligation: (token: Erc721, demand: Demand) => `0x${string}`;
        encodePaymentObligation: (token: Erc721, payee: `0x${string}`) => `0x${string}`;
        decodeEscrowObligation: (obligationData: `0x${string}`) => {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
            token: `0x${string}`;
            tokenId: bigint;
        };
        decodePaymentObligation: (obligationData: `0x${string}`) => {
            token: `0x${string}`;
            tokenId: bigint;
            payee: `0x${string}`;
        };
        approve: (token: Erc721, purpose: ApprovalPurpose) => Promise<`0x${string}`>;
        approveAll: (token_contract: `0x${string}`, purpose: ApprovalPurpose) => Promise<`0x${string}`>;
        revokeAll: (token_contract: `0x${string}`, purpose: ApprovalPurpose) => Promise<`0x${string}`>;
        collectEscrow: (buyAttestation: `0x${string}`, fulfillment: `0x${string}`) => Promise<`0x${string}`>;
        reclaimExpired: (buyAttestation: `0x${string}`) => Promise<`0x${string}`>;
        buyWithErc721: (price: Erc721, item: Demand, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payWithErc721: (price: Erc721, payee: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyErc721ForErc721: (bid: Erc721, ask: Erc721, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc721ForErc721: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
        }>;
        buyErc20WithErc721: (bid: Erc721, ask: Erc20, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc721ForErc20: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyErc1155WithErc721: (bid: Erc721, ask: Erc1155, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc721ForErc1155: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyBundleWithErc721: (bid: Erc721, ask: TokenBundle, payee: `0x${string}`, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc721ForBundle: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
    };
    /** Methods for interacting with ERC1155 tokens */
    erc1155: {
        encodeEscrowObligationRaw: (data: {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
            token: `0x${string}`;
            tokenId: bigint;
            amount: bigint;
        }) => `0x${string}`;
        encodePaymentObligationRaw: (data: {
            token: `0x${string}`;
            tokenId: bigint;
            amount: bigint;
            payee: `0x${string}`;
        }) => `0x${string}`;
        encodeEscrowObligation: (token: Erc1155, demand: Demand) => `0x${string}`;
        encodePaymentObligation: (token: Erc1155, payee: `0x${string}`) => `0x${string}`;
        decodeEscrowObligation: (obligationData: `0x${string}`) => {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
            token: `0x${string}`;
            tokenId: bigint;
            amount: bigint;
        };
        decodePaymentObligation: (obligationData: `0x${string}`) => {
            token: `0x${string}`;
            tokenId: bigint;
            amount: bigint;
            payee: `0x${string}`;
        };
        approveAll: (token_contract: `0x${string}`, purpose: ApprovalPurpose) => Promise<`0x${string}`>;
        revokeAll: (token_contract: `0x${string}`, purpose: ApprovalPurpose) => Promise<`0x${string}`>;
        collectEscrow: (buyAttestation: `0x${string}`, fulfillment: `0x${string}`) => Promise<`0x${string}`>;
        reclaimExpired: (buyAttestation: `0x${string}`) => Promise<`0x${string}`>;
        buyWithErc1155: (price: Erc1155, item: Demand, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payWithErc1155: (price: Erc1155, payee: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyErc1155ForErc1155: (bid: Erc1155, ask: Erc1155, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc1155ForErc1155: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
        }>;
        buyErc20WithErc1155: (bid: Erc1155, ask: Erc20, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc1155ForErc20: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyErc721WithErc1155: (bid: Erc1155, ask: Erc721, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc1155ForErc721: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyBundleWithErc1155: (bid: Erc1155, ask: TokenBundle, payee: `0x${string}`, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payErc1155ForBundle: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
    };
    /** Methods for interacting with token bundles */
    bundle: {
        encodeEscrowObligationRaw: (data: {
            erc20Tokens: `0x${string}`[];
            erc20Amounts: bigint[];
            erc721Tokens: `0x${string}`[];
            erc721TokenIds: bigint[];
            erc1155Tokens: `0x${string}`[];
            erc1155TokenIds: bigint[];
            erc1155Amounts: bigint[];
            arbiter: `0x${string}`;
            demand: `0x${string}`;
        }) => `0x${string}`;
        encodePaymentObligationRaw: (data: {
            erc20Tokens: `0x${string}`[];
            erc20Amounts: bigint[];
            erc721Tokens: `0x${string}`[];
            erc721TokenIds: bigint[];
            erc1155Tokens: `0x${string}`[];
            erc1155TokenIds: bigint[];
            erc1155Amounts: bigint[];
            payee: `0x${string}`;
        }) => `0x${string}`;
        encodeEscrowObligation: (bundle: TokenBundle, demand: Demand) => `0x${string}`;
        encodePaymentObligation: (bundle: TokenBundle, payee: `0x${string}`) => `0x${string}`;
        decodeEscrowObligation: (obligationData: `0x${string}`) => {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
            erc20Tokens: readonly `0x${string}`[];
            erc20Amounts: readonly bigint[];
            erc721Tokens: readonly `0x${string}`[];
            erc721TokenIds: readonly bigint[];
            erc1155Tokens: readonly `0x${string}`[];
            erc1155TokenIds: readonly bigint[];
            erc1155Amounts: readonly bigint[];
        };
        decodePaymentObligation: (obligationData: `0x${string}`) => {
            erc20Tokens: readonly `0x${string}`[];
            erc20Amounts: readonly bigint[];
            erc721Tokens: readonly `0x${string}`[];
            erc721TokenIds: readonly bigint[];
            erc1155Tokens: readonly `0x${string}`[];
            erc1155TokenIds: readonly bigint[];
            erc1155Amounts: readonly bigint[];
            payee: `0x${string}`;
        };
        collectEscrow: (buyAttestation: `0x${string}`, fulfillment: `0x${string}`) => Promise<`0x${string}`>;
        reclaimExpired: (buyAttestation: `0x${string}`) => Promise<`0x${string}`>;
        buyWithBundle: (price: TokenBundle, item: Demand, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payWithBundle: (price: TokenBundle, payee: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyBundleForBundle: (bid: TokenBundle, ask: TokenBundle, expiration: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        payBundleForBundle: (buyAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        approve: (bundle: TokenBundle, purpose: ApprovalPurpose) => Promise<`0x${string}`[]>;
    };
    /** Methods for interacting with attestations */
    attestation: {
        encodeEscrowObligation: (data: {
            attestation: {
                schema: `0x${string}`;
                data: {
                    recipient: `0x${string}`;
                    expirationTime: bigint;
                    revocable: boolean;
                    refUID: `0x${string}`;
                    data: `0x${string}`;
                    value: bigint;
                };
            };
            arbiter: `0x${string}`;
            demand: `0x${string}`;
        }) => `0x${string}`;
        encodeEscrow2Obligation: (data: {
            attestationUid: `0x${string}`;
            arbiter: `0x${string}`;
            demand: `0x${string}`;
        }) => `0x${string}`;
        decodeEscrowObligation: (obligationData: `0x${string}`) => {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
            attestation: {
                schema: `0x${string}`;
                data: {
                    recipient: `0x${string}`;
                    expirationTime: bigint;
                    revocable: boolean;
                    refUID: `0x${string}`;
                    data: `0x${string}`;
                    value: bigint;
                };
            };
        } | undefined;
        decodeEscrow2Obligation: (obligationData: `0x${string}`) => {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
            attestationUid: `0x${string}`;
        } | undefined;
        getEscrowSchema: () => Promise<`0x${string}`>;
        getEscrow2Schema: () => Promise<`0x${string}`>;
        getEscrowObligation: (uid: `0x${string}`) => Promise<{
            data: {
                arbiter: `0x${string}`;
                demand: `0x${string}`;
                attestation: {
                    schema: `0x${string}`;
                    data: {
                        recipient: `0x${string}`;
                        expirationTime: bigint;
                        revocable: boolean;
                        refUID: `0x${string}`;
                        data: `0x${string}`;
                        value: bigint;
                    };
                };
            } | undefined;
            uid: `0x${string}`;
            schema: `0x${string}`;
            time: bigint;
            expirationTime: bigint;
            revocationTime: bigint;
            refUID: `0x${string}`;
            recipient: `0x${string}`;
            attester: `0x${string}`;
            revocable: boolean;
        }>;
        getEscrow2Obligation: (uid: `0x${string}`) => Promise<{
            data: {
                arbiter: `0x${string}`;
                demand: `0x${string}`;
                attestationUid: `0x${string}`;
            } | undefined;
            uid: `0x${string}`;
            schema: `0x${string}`;
            time: bigint;
            expirationTime: bigint;
            revocationTime: bigint;
            refUID: `0x${string}`;
            recipient: `0x${string}`;
            attester: `0x${string}`;
            revocable: boolean;
        }>;
        buyWithAttestation: (attestation: {
            schema: `0x${string}`;
            data: {
                recipient: `0x${string}`;
                expirationTime: bigint;
                revocable: boolean;
                refUID: `0x${string}`;
                data: `0x${string}`;
                value: bigint;
            };
        }, item: {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
        }, expiration?: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        collectEscrow: (escrowAttestation: `0x${string}`, fulfillmentAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        buyWithAttestation2: (attestationUid: `0x${string}`, item: {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
        }, expiration?: bigint) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        collectEscrow2: (escrowAttestation: `0x${string}`, fulfillmentAttestation: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        registerSchema: (schema: string, resolver: `0x${string}`, revocable: boolean) => Promise<`0x${string}`>;
        createAttestation: (schema: `0x${string}`, recipient: `0x${string}`, expirationTime: bigint, revocable: boolean, refUID: `0x${string}`, data: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        attestAndCreateEscrow: (attestation: {
            schema: `0x${string}`;
            data: {
                recipient: `0x${string}`;
                expirationTime: bigint;
                revocable: boolean;
                refUID: `0x${string}`;
                data: `0x${string}`;
                value: bigint;
            };
        }, escrow: {
            arbiter: `0x${string}`;
            demand: `0x${string}`;
            expirationTime: bigint;
        }) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
    };
    /** Utilities for StringObligation */
    stringObligation: {
        encode: (data: {
            item: string;
        }) => `0x${string}`;
        decode: (obligationData: `0x${string}`) => {
            item: string;
        };
        decodeJson: <T>(obligationData: `0x${string}`) => T;
        decodeZod: <TSchema extends zod.ZodType, TAsync extends boolean = false, TSafe extends boolean = false>(obligationData: `0x${string}`, schema: TSchema, schemaOptions?: Partial<zod.ParseParams>, parseOptions?: {
            async: TAsync;
            safe: TSafe;
        }) => TSafe extends true ? TAsync extends true ? Promise<zod.SafeParseReturnType<zod.TypeOf<TSchema>, zod.TypeOf<TSchema>>> : zod.SafeParseReturnType<zod.TypeOf<TSchema>, zod.TypeOf<TSchema>> : TAsync extends true ? Promise<zod.TypeOf<TSchema>> : zod.TypeOf<TSchema>;
        decodeArkType: <Schema extends arktype.Type<any, any>>(obligationData: `0x${string}`, schema: Schema) => Schema["inferOut"];
        doObligation: (item: string, refUID?: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        doObligationJson: <T>(item: T, refUid?: `0x${string}`) => Promise<{
            hash: `0x${string}`;
            attested: any;
        }>;
        getSchema: () => Promise<`0x${string}`>;
        getObligation: (uid: `0x${string}`) => Promise<{
            data: {
                item: string;
            };
            uid: `0x${string}`;
            schema: `0x${string}`;
            time: bigint;
            expirationTime: bigint;
            revocationTime: bigint;
            refUID: `0x${string}`;
            recipient: `0x${string}`;
            attester: `0x${string}`;
            revocable: boolean;
        }>;
        getJsonObligation: <T>(uid: `0x${string}`) => Promise<{
            data: {
                item: T;
            };
            uid: `0x${string}`;
            schema: `0x${string}`;
            time: bigint;
            expirationTime: bigint;
            revocationTime: bigint;
            refUID: `0x${string}`;
            recipient: `0x${string}`;
            attester: `0x${string}`;
            revocable: boolean;
        }>;
    };
    oracle: {
        requestArbitration: (obligationUid: `0x${string}`, oracle: abitype.Address) => Promise<`0x${string}`>;
        getArbitrationRequests: (options?: ArbitrateOptions) => Promise<Attestation[]>;
        arbitratePast: (arbitrate: (attestation: Attestation) => Promise<boolean | null>, options?: ArbitrateOptions) => Promise<Decision[]>;
        listenAndArbitrate: (arbitrate: (attestation: Attestation) => Promise<boolean | null>, options?: ArbitrateOptions & {
            onAfterArbitrate?: (decision: Decision) => Promise<void>;
            pollingInterval?: number;
        }) => Promise<ListenAndArbitrateResult>;
    };
};

/**
 * Unified Arbiters Client
 *
 * Provides a single interface for all arbiter functionality by combining:
 * - General arbiters (TrustedParty, SpecificAttestation, TrustedOracle, etc.)
 * - Logical arbiters (Any, All)
 * - Attestation properties arbiters (Attester, Time, Schema, etc.)
 */
declare const makeArbitersClient: (viemClient: ViemClient, addresses: Pick<ChainAddresses, "trustedOracleArbiter">) => {
    /**
     * @deprecated Use encodeAnyArbiterDemand instead
     */
    encodeMultiArbiterDemand: (demand: {
        arbiters: `0x${string}`[];
        demands: `0x${string}`[];
    }) => `0x${string}`;
    /**
     * @deprecated Use decodeAnyArbiterDemand instead
     */
    decodeMultiArbiterDemand: (demandData: `0x${string}`) => {
        arbiters: readonly `0x${string}`[];
        demands: readonly `0x${string}`[];
    };
    encodeAttesterArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        attester: `0x${string}`;
    }) => `0x${string}`;
    decodeAttesterArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        attester: `0x${string}`;
    };
    encodeAttesterArbiterNonComposingDemand: (demand: {
        attester: `0x${string}`;
    }) => `0x${string}`;
    decodeAttesterArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        attester: `0x${string}`;
    };
    encodeTimeAfterArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    }) => `0x${string}`;
    decodeTimeAfterArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    };
    encodeTimeAfterArbiterNonComposingDemand: (demand: {
        time: bigint;
    }) => `0x${string}`;
    decodeTimeAfterArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        time: bigint;
    };
    encodeTimeBeforeArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    }) => `0x${string}`;
    decodeTimeBeforeArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    };
    encodeTimeBeforeArbiterNonComposingDemand: (demand: {
        time: bigint;
    }) => `0x${string}`;
    decodeTimeBeforeArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        time: bigint;
    };
    encodeTimeEqualArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    }) => `0x${string}`;
    decodeTimeEqualArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    };
    encodeTimeEqualArbiterNonComposingDemand: (demand: {
        time: bigint;
    }) => `0x${string}`;
    decodeTimeEqualArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        time: bigint;
    };
    encodeExpirationTimeAfterArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    }) => `0x${string}`;
    decodeExpirationTimeAfterArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    };
    encodeExpirationTimeAfterArbiterNonComposingDemand: (demand: {
        expirationTime: bigint;
    }) => `0x${string}`;
    decodeExpirationTimeAfterArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        expirationTime: bigint;
    };
    encodeExpirationTimeBeforeArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    }) => `0x${string}`;
    decodeExpirationTimeBeforeArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    };
    encodeExpirationTimeBeforeArbiterNonComposingDemand: (demand: {
        expirationTime: bigint;
    }) => `0x${string}`;
    decodeExpirationTimeBeforeArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        expirationTime: bigint;
    };
    encodeExpirationTimeEqualArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    }) => `0x${string}`;
    decodeExpirationTimeEqualArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    };
    encodeExpirationTimeEqualArbiterNonComposingDemand: (demand: {
        expirationTime: bigint;
    }) => `0x${string}`;
    decodeExpirationTimeEqualArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        expirationTime: bigint;
    };
    encodeRecipientArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        recipient: `0x${string}`;
    }) => `0x${string}`;
    decodeRecipientArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        recipient: `0x${string}`;
    };
    encodeRecipientArbiterNonComposingDemand: (demand: {
        recipient: `0x${string}`;
    }) => `0x${string}`;
    decodeRecipientArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        recipient: `0x${string}`;
    };
    encodeRefUidArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        refUID: `0x${string}`;
    }) => `0x${string}`;
    decodeRefUidArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        refUID: `0x${string}`;
    };
    encodeRefUidArbiterNonComposingDemand: (demand: {
        refUID: `0x${string}`;
    }) => `0x${string}`;
    decodeRefUidArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        refUID: `0x${string}`;
    };
    encodeRevocableArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        revocable: boolean;
    }) => `0x${string}`;
    decodeRevocableArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        revocable: boolean;
    };
    encodeRevocableArbiterNonComposingDemand: (demand: {
        revocable: boolean;
    }) => `0x${string}`;
    decodeRevocableArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        revocable: boolean;
    };
    encodeSchemaArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        schema: `0x${string}`;
    }) => `0x${string}`;
    decodeSchemaArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        schema: `0x${string}`;
    };
    encodeSchemaArbiterNonComposingDemand: (demand: {
        schema: `0x${string}`;
    }) => `0x${string}`;
    decodeSchemaArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        schema: `0x${string}`;
    };
    encodeUidArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        uid: `0x${string}`;
    }) => `0x${string}`;
    decodeUidArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        uid: `0x${string}`;
    };
    encodeUidArbiterNonComposingDemand: (demand: {
        uid: `0x${string}`;
    }) => `0x${string}`;
    decodeUidArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        uid: `0x${string}`;
    };
    encodeAnyArbiterDemand: (demand: {
        arbiters: `0x${string}`[];
        demands: `0x${string}`[];
    }) => `0x${string}`;
    decodeAnyArbiterDemand: (demandData: `0x${string}`) => {
        arbiters: readonly `0x${string}`[];
        demands: readonly `0x${string}`[];
    };
    encodeAllArbiterDemand: (demand: {
        arbiters: `0x${string}`[];
        demands: `0x${string}`[];
    }) => `0x${string}`;
    decodeAllArbiterDemand: (demandData: `0x${string}`) => {
        arbiters: readonly `0x${string}`[];
        demands: readonly `0x${string}`[];
    };
    encodeIntrinsics2Demand: (demand: {
        schema: `0x${string}`;
    }) => `0x${string}`;
    decodeIntrinsics2Demand: (demandData: `0x${string}`) => {
        schema: `0x${string}`;
    };
    encodeTrustedPartyDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        creator: `0x${string}`;
    }) => `0x${string}`;
    decodeTrustedPartyDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        creator: `0x${string}`;
    };
    encodeSpecificAttestationDemand: (demand: {
        uid: `0x${string}`;
    }) => `0x${string}`;
    decodeSpecificAttestationDemand: (demandData: `0x${string}`) => {
        uid: `0x${string}`;
    };
    encodeTrustedOracleDemand: (demand: {
        oracle: `0x${string}`;
        data: `0x${string}`;
    }) => `0x${string}`;
    decodeTrustedOracleDemand: (demandData: `0x${string}`) => {
        oracle: `0x${string}`;
        data: `0x${string}`;
    };
    arbitrateAsTrustedOracle: (obligation: `0x${string}`, decision: boolean) => Promise<`0x${string}`>;
    requestArbitrationFromTrustedOracle: (obligation: `0x${string}`, oracle: `0x${string}`) => Promise<`0x${string}`>;
    checkExistingArbitration: (obligation: `0x${string}`, oracle: `0x${string}`) => Promise<{
        obligation: `0x${string}`;
        oracle: `0x${string}`;
        decision: boolean;
    } | undefined>;
    waitForTrustedOracleArbitration: (obligation: `0x${string}`, oracle: `0x${string}`, pollingInterval?: number) => Promise<{
        obligation?: `0x${string}` | undefined;
        oracle?: `0x${string}` | undefined;
        decision?: boolean | undefined;
    }>;
    waitForTrustedOracleArbitrationRequest: (obligation: `0x${string}`, oracle: `0x${string}`, pollingInterval?: number) => Promise<{
        obligation?: `0x${string}` | undefined;
        oracle?: `0x${string}` | undefined;
    }>;
    listenForArbitrationRequestsOnly: (oracle: `0x${string}`, arbitrationHandler: (obligation: `0x${string}`, oracle: `0x${string}`) => Promise<boolean>, pollingInterval?: number) => viem.WatchEventReturnType;
};

/**
 * Attestation Properties Arbiters Client
 *

// Ensure ABI extraction succeeded - fail fast if contract JSONs are malformed
if (!attesterArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from AttesterArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!attesterArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from AttesterArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!timeAfterArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from TimeAfterArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!timeAfterArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from TimeAfterArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!timeBeforeArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from TimeBeforeArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!timeBeforeArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from TimeBeforeArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!timeEqualArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from TimeEqualArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!timeEqualArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from TimeEqualArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!expirationTimeAfterArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from ExpirationTimeAfterArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!expirationTimeAfterArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from ExpirationTimeAfterArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!expirationTimeBeforeArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from ExpirationTimeBeforeArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!expirationTimeBeforeArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from ExpirationTimeBeforeArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!expirationTimeEqualArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from ExpirationTimeEqualArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!expirationTimeEqualArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from ExpirationTimeEqualArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!recipientArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from RecipientArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!recipientArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from RecipientArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!refUidArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from RefUidArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!refUidArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from RefUidArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!revocableArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from RevocableArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!revocableArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from RevocableArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!schemaArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from SchemaArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!schemaArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from SchemaArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!uidArbiterComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from UidArbiterComposing contract JSON. The contract definition may be missing or malformed.');
}
if (!uidArbiterNonComposingDemandDataType) {
  throw new Error('Failed to extract ABI type from UidArbiterNonComposing contract JSON. The contract definition may be missing or malformed.');
}

/**
 * Attestation Properties Arbiters Client
 *
 * Handles arbiters that validate specific properties of attestations. Each arbiter type
 * comes in two variants:
 * - Composing: Can be combined with a base arbiter for additional validation
 * - Non-Composing: Standalone validation against the property
 *
 * Supported attestation properties:
 * - Attester: Validates the attester address
 * - Time: Validates timestamp (After/Before/Equal variants)
 * - ExpirationTime: Validates expiration timestamp (After/Before/Equal variants)
 * - Recipient: Validates the recipient address
 * - RefUID: Validates the reference UID
 * - Revocable: Validates the revocable flag
 * - Schema: Validates the schema hash
 * - UID: Validates the attestation UID
 */
declare const makeAttestationPropertiesArbitersClient: (viemClient: ViemClient) => {
    /**
     * Encodes AttesterArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, address attester}
     */
    encodeAttesterArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        attester: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes AttesterArbiterComposing.DemandData from bytes.
     */
    decodeAttesterArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        attester: `0x${string}`;
    };
    /**
     * Encodes AttesterArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {address attester}
     */
    encodeAttesterArbiterNonComposingDemand: (demand: {
        attester: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes AttesterArbiterNonComposing.DemandData from bytes.
     */
    decodeAttesterArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        attester: `0x${string}`;
    };
    /**
     * Encodes TimeAfterArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, uint64 time}
     */
    encodeTimeAfterArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    }) => `0x${string}`;
    /**
     * Decodes TimeAfterArbiterComposing.DemandData from bytes.
     */
    decodeTimeAfterArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    };
    /**
     * Encodes TimeAfterArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {uint64 time}
     */
    encodeTimeAfterArbiterNonComposingDemand: (demand: {
        time: bigint;
    }) => `0x${string}`;
    /**
     * Decodes TimeAfterArbiterNonComposing.DemandData from bytes.
     */
    decodeTimeAfterArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        time: bigint;
    };
    /**
     * Encodes TimeBeforeArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, uint64 time}
     */
    encodeTimeBeforeArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    }) => `0x${string}`;
    /**
     * Decodes TimeBeforeArbiterComposing.DemandData from bytes.
     */
    decodeTimeBeforeArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    };
    /**
     * Encodes TimeBeforeArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {uint64 time}
     */
    encodeTimeBeforeArbiterNonComposingDemand: (demand: {
        time: bigint;
    }) => `0x${string}`;
    /**
     * Decodes TimeBeforeArbiterNonComposing.DemandData from bytes.
     */
    decodeTimeBeforeArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        time: bigint;
    };
    /**
     * Encodes TimeEqualArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, uint64 time}
     */
    encodeTimeEqualArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    }) => `0x${string}`;
    /**
     * Decodes TimeEqualArbiterComposing.DemandData from bytes.
     */
    decodeTimeEqualArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        time: bigint;
    };
    /**
     * Encodes TimeEqualArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {uint64 time}
     */
    encodeTimeEqualArbiterNonComposingDemand: (demand: {
        time: bigint;
    }) => `0x${string}`;
    /**
     * Decodes TimeEqualArbiterNonComposing.DemandData from bytes.
     */
    decodeTimeEqualArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        time: bigint;
    };
    /**
     * Encodes ExpirationTimeAfterArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, uint64 expirationTime}
     */
    encodeExpirationTimeAfterArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    }) => `0x${string}`;
    /**
     * Decodes ExpirationTimeAfterArbiterComposing.DemandData from bytes.
     */
    decodeExpirationTimeAfterArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    };
    /**
     * Encodes ExpirationTimeAfterArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {uint64 expirationTime}
     */
    encodeExpirationTimeAfterArbiterNonComposingDemand: (demand: {
        expirationTime: bigint;
    }) => `0x${string}`;
    /**
     * Decodes ExpirationTimeAfterArbiterNonComposing.DemandData from bytes.
     */
    decodeExpirationTimeAfterArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        expirationTime: bigint;
    };
    /**
     * Encodes ExpirationTimeBeforeArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, uint64 expirationTime}
     */
    encodeExpirationTimeBeforeArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    }) => `0x${string}`;
    /**
     * Decodes ExpirationTimeBeforeArbiterComposing.DemandData from bytes.
     */
    decodeExpirationTimeBeforeArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    };
    /**
     * Encodes ExpirationTimeBeforeArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {uint64 expirationTime}
     */
    encodeExpirationTimeBeforeArbiterNonComposingDemand: (demand: {
        expirationTime: bigint;
    }) => `0x${string}`;
    /**
     * Decodes ExpirationTimeBeforeArbiterNonComposing.DemandData from bytes.
     */
    decodeExpirationTimeBeforeArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        expirationTime: bigint;
    };
    /**
     * Encodes ExpirationTimeEqualArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, uint64 expirationTime}
     */
    encodeExpirationTimeEqualArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    }) => `0x${string}`;
    /**
     * Decodes ExpirationTimeEqualArbiterComposing.DemandData from bytes.
     */
    decodeExpirationTimeEqualArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        expirationTime: bigint;
    };
    /**
     * Encodes ExpirationTimeEqualArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {uint64 expirationTime}
     */
    encodeExpirationTimeEqualArbiterNonComposingDemand: (demand: {
        expirationTime: bigint;
    }) => `0x${string}`;
    /**
     * Decodes ExpirationTimeEqualArbiterNonComposing.DemandData from bytes.
     */
    decodeExpirationTimeEqualArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        expirationTime: bigint;
    };
    /**
     * Encodes RecipientArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, address recipient}
     */
    encodeRecipientArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        recipient: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes RecipientArbiterComposing.DemandData from bytes.
     */
    decodeRecipientArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        recipient: `0x${string}`;
    };
    /**
     * Encodes RecipientArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {address recipient}
     */
    encodeRecipientArbiterNonComposingDemand: (demand: {
        recipient: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes RecipientArbiterNonComposing.DemandData from bytes.
     */
    decodeRecipientArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        recipient: `0x${string}`;
    };
    /**
     * Encodes RefUidArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, bytes32 refUID}
     */
    encodeRefUidArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        refUID: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes RefUidArbiterComposing.DemandData from bytes.
     */
    decodeRefUidArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        refUID: `0x${string}`;
    };
    /**
     * Encodes RefUidArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {bytes32 refUID}
     */
    encodeRefUidArbiterNonComposingDemand: (demand: {
        refUID: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes RefUidArbiterNonComposing.DemandData from bytes.
     */
    decodeRefUidArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        refUID: `0x${string}`;
    };
    /**
     * Encodes RevocableArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, bool revocable}
     */
    encodeRevocableArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        revocable: boolean;
    }) => `0x${string}`;
    /**
     * Decodes RevocableArbiterComposing.DemandData from bytes.
     */
    decodeRevocableArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        revocable: boolean;
    };
    /**
     * Encodes RevocableArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {bool revocable}
     */
    encodeRevocableArbiterNonComposingDemand: (demand: {
        revocable: boolean;
    }) => `0x${string}`;
    /**
     * Decodes RevocableArbiterNonComposing.DemandData from bytes.
     */
    decodeRevocableArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        revocable: boolean;
    };
    /**
     * Encodes SchemaArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, bytes32 schema}
     */
    encodeSchemaArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        schema: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes SchemaArbiterComposing.DemandData from bytes.
     */
    decodeSchemaArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        schema: `0x${string}`;
    };
    /**
     * Encodes SchemaArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {bytes32 schema}
     */
    encodeSchemaArbiterNonComposingDemand: (demand: {
        schema: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes SchemaArbiterNonComposing.DemandData from bytes.
     */
    decodeSchemaArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        schema: `0x${string}`;
    };
    /**
     * Encodes UidArbiterComposing.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, bytes32 uid}
     */
    encodeUidArbiterComposingDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        uid: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes UidArbiterComposing.DemandData from bytes.
     */
    decodeUidArbiterComposingDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        uid: `0x${string}`;
    };
    /**
     * Encodes UidArbiterNonComposing.DemandData to bytes.
     * @param demand - struct DemandData {bytes32 uid}
     */
    encodeUidArbiterNonComposingDemand: (demand: {
        uid: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes UidArbiterNonComposing.DemandData from bytes.
     */
    decodeUidArbiterNonComposingDemand: (demandData: `0x${string}`) => {
        uid: `0x${string}`;
    };
};

/**
 * General Arbiters Client
 *
 * Handles basic arbiters that don't depend on specific attestation properties:
 * - IntrinsicsArbiter2: Schema-based validation
 * - TrustedPartyArbiter: Creator-based validation with composable base arbiter
 * - SpecificAttestationArbiter: Validates against a specific attestation UID
 * - TrustedOracleArbiter: Oracle-based decision making with arbitration requests
 *   - Supports requestArbitration for requesting arbitration from specific oracles
 *   - Provides listening functions for oracles to respond only to arbitration requests
 */
declare const makeGeneralArbitersClient: (viemClient: ViemClient, addresses: Pick<ChainAddresses, "trustedOracleArbiter">) => {
    /**
     * Encodes IntrinsicsArbiter2.DemandData to bytes.
     * @param demand - struct DemandData {bytes32 schema}
     * @returns abi encoded bytes
     */
    encodeIntrinsics2Demand: (demand: {
        schema: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes IntrinsicsArbiter2.DemandData from bytes.
     * @param demandData - DemandData as abi encoded bytes
     * @returns the decoded DemandData object
     */
    decodeIntrinsics2Demand: (demandData: `0x${string}`) => {
        schema: `0x${string}`;
    };
    /**
     * Encodes TrustedPartyArbiter.DemandData to bytes.
     * @param demand - struct DemandData {address baseArbiter, bytes baseDemand, address creator}
     * @returns abi encoded bytes
     */
    encodeTrustedPartyDemand: (demand: {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        creator: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes TrustedPartyArbiter.DemandData from bytes.
     * @param demandData - DemandData as abi encoded bytes
     * @returns the decoded DemandData object
     */
    decodeTrustedPartyDemand: (demandData: `0x${string}`) => {
        baseArbiter: `0x${string}`;
        baseDemand: `0x${string}`;
        creator: `0x${string}`;
    };
    /**
     * Encodes SpecificAttestationArbiter.DemandData to bytes.
     * @param demand - struct DemandData {bytes32 uid}
     * @returns abi encoded bytes
     */
    encodeSpecificAttestationDemand: (demand: {
        uid: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes SpecificAttestationArbiter.DemandData from bytes.
     * @param demandData - DemandData as abi encoded bytes
     * @returns the decoded DemandData object
     */
    decodeSpecificAttestationDemand: (demandData: `0x${string}`) => {
        uid: `0x${string}`;
    };
    /**
     * Encodes TrustedOracleArbiter.DemandData to bytes.
     * @param demand - struct DemandData {address oracle, bytes data}
     * @returns abi encoded bytes
     */
    encodeTrustedOracleDemand: (demand: {
        oracle: `0x${string}`;
        data: `0x${string}`;
    }) => `0x${string}`;
    /**
     * Decodes TrustedOracleArbiter.DemandData from bytes.
     * @param demandData - DemandData as abi encoded bytes
     * @returns the decoded DemandData object
     */
    decodeTrustedOracleDemand: (demandData: `0x${string}`) => {
        oracle: `0x${string}`;
        data: `0x${string}`;
    };
    /**
     * Arbitrate on the validality of an obligation fulfilling
     * a demand for TrustedOracleArbiter
     * @param obligation - bytes32 obligation
     * @param decision - bool decision
     * @returns transaction hash
     */
    arbitrateAsTrustedOracle: (obligation: `0x${string}`, decision: boolean) => Promise<`0x${string}`>;
    /**
     * Request arbitration on an obligation from TrustedOracleArbiter
     * @param obligation - bytes32 obligation uid
     * @param oracle - address of the oracle to request arbitration from
     * @returns transaction hash
     */
    requestArbitrationFromTrustedOracle: (obligation: `0x${string}`, oracle: `0x${string}`) => Promise<`0x${string}`>;
    /**
     * Check if an arbitration has already been made for a specific obligation by a specific oracle
     * @param obligation - bytes32 obligation uid
     * @param oracle - address of the oracle
     * @returns the arbitration result if exists, undefined if not
     */
    checkExistingArbitration: (obligation: `0x${string}`, oracle: `0x${string}`) => Promise<{
        obligation: `0x${string}`;
        oracle: `0x${string}`;
        decision: boolean;
    } | undefined>;
    /**
     * Wait for an arbitration to be made on a TrustedOracleArbiter
     * @param obligation - bytes32 obligation uid
     * @param oracle - address of the oracle
     * @param pollingInterval - polling interval in milliseconds (default: 1000)
     * @returns the event args
     */
    waitForTrustedOracleArbitration: (obligation: `0x${string}`, oracle: `0x${string}`, pollingInterval?: number) => Promise<{
        obligation?: `0x${string}` | undefined;
        oracle?: `0x${string}` | undefined;
        decision?: boolean | undefined;
    }>;
    /**
     * Wait for an arbitration request to be made on a TrustedOracleArbiter
     * @param obligation - bytes32 obligation uid
     * @param oracle - address of the oracle
     * @param pollingInterval - polling interval in milliseconds (default: 1000)
     * @returns the event args
     */
    waitForTrustedOracleArbitrationRequest: (obligation: `0x${string}`, oracle: `0x${string}`, pollingInterval?: number) => Promise<{
        obligation?: `0x${string}` | undefined;
        oracle?: `0x${string}` | undefined;
    }>;
    /**
     * Listen for arbitration requests and only arbitrate on request
     * This function continuously listens for ArbitrationRequested events
     * and calls the provided arbitration handler for each request
     * @param oracle - address of the oracle (filter for requests to this oracle)
     * @param arbitrationHandler - function to handle arbitration requests
     * @param pollingInterval - polling interval in milliseconds (default: 1000)
     * @returns unwatch function to stop listening
     */
    listenForArbitrationRequestsOnly: (oracle: `0x${string}`, arbitrationHandler: (obligation: `0x${string}`, oracle: `0x${string}`) => Promise<boolean>, pollingInterval?: number) => viem.WatchEventReturnType;
};

/**
 * Logical Arbiters Client
 *
 * Handles logical composition arbiters for combining multiple arbiters:
 * - AnyArbiter: Returns true if ANY of the provided arbiters returns true (logical OR)
 * - AllArbiter: Returns true if ALL of the provided arbiters return true (logical AND)
 *
 * These arbiters take arrays of arbiter addresses and their corresponding demand data,
 * allowing for complex logical compositions of arbitration rules.
 */
declare const makeLogicalArbitersClient: (viemClient: ViemClient) => {
    /**
     * Encodes AnyArbiter.DemandData to bytes.
     * @param demand - struct DemandData {address[] arbiters, bytes[] demands}
     * @returns abi encoded bytes
     */
    encodeAnyArbiterDemand: (demand: {
        arbiters: `0x${string}`[];
        demands: `0x${string}`[];
    }) => `0x${string}`;
    /**
     * Decodes AnyArbiter.DemandData from bytes.
     * @param demandData - DemandData as abi encoded bytes
     * @returns the decoded DemandData object
     */
    decodeAnyArbiterDemand: (demandData: `0x${string}`) => {
        arbiters: readonly `0x${string}`[];
        demands: readonly `0x${string}`[];
    };
    /**
     * Encodes AllArbiter.DemandData to bytes.
     * @param demand - struct DemandData {address[] arbiters, bytes[] demands}
     * @returns abi encoded bytes
     */
    encodeAllArbiterDemand: (demand: {
        arbiters: `0x${string}`[];
        demands: `0x${string}`[];
    }) => `0x${string}`;
    /**
     * Decodes AllArbiter.DemandData from bytes.
     * @param demandData - DemandData as abi encoded bytes
     * @returns the decoded DemandData object
     */
    decodeAllArbiterDemand: (demandData: `0x${string}`) => {
        arbiters: readonly `0x${string}`[];
        demands: readonly `0x${string}`[];
    };
};

declare const contractAddresses: Record<string, ChainAddresses>;
declare const supportedChains: string[];

type Extended = {
    [key: string]: unknown;
};
type ExtendableClient<T extends object, TExtended extends Extended | undefined = undefined> = T & (TExtended extends Extended ? TExtended : object) & {
    extend<U extends Extended>(extender: (client: T & (TExtended extends Extended ? TExtended : object)) => U): ExtendableClient<T, U & (TExtended extends Extended ? TExtended : object)>;
};
type MinimalClient = ExtendableClient<{
    viemClient: WalletClient<Transport, Chain, Account> & PublicActions<Transport, Chain, Account>;
    makeExtendableClient: typeof makeExtendableClient;
    address: `0x${string}`;
    contractAddresses: ChainAddresses;
    getAttestation: (uid: `0x${string}`) => ReturnType<typeof getAttestation>;
    getAttestedEventFromTxHash: (hash: `0x${string}`) => Promise<{
        recipient: `0x${string}`;
        attester: `0x${string}`;
        uid: `0x${string}`;
        schemaUID: `0x${string}`;
    }>;
    waitForFulfillment: (contractAddress: `0x${string}`, buyAttestation: `0x${string}`, pollingInterval?: number) => Promise<{
        payment?: `0x${string}` | undefined;
        fulfillment?: `0x${string}` | undefined;
        fulfiller?: `0x${string}` | undefined;
    }>;
    extractObligationData: <ObligationData extends readonly AbiParameter[]>(obligationAbi: ObligationData, attestation: {
        data: `0x${string}`;
    }) => DecodeAbiParametersReturnType<ObligationData>;
    getEscrowAttestation: (fulfillment: {
        refUID: `0x${string}`;
    }) => ReturnType<typeof getAttestation>;
    extractDemandData: <DemandData extends readonly AbiParameter[]>(demandAbi: DemandData, escrowAttestation: {
        data: `0x${string}`;
    }) => DecodeAbiParametersReturnType<DemandData>;
    getEscrowAndDemand: <DemandData extends readonly AbiParameter[]>(demandAbi: DemandData, fulfillment: {
        refUID: `0x${string}`;
    }) => Promise<[Awaited<ReturnType<typeof getAttestation>>, DecodeAbiParametersReturnType<DemandData>]>;
}>;
type AlkahestClient = MinimalClient & ReturnType<typeof makeDefaultExtension> & {
    extend: MinimalClient["extend"];
};
declare function makeExtendableClient<T extends object, TExtended extends Extended | undefined = undefined>(base: T): ExtendableClient<T, TExtended>;
/**
 * Creates an Alkahest client for interacting with the protocol
 * @param walletClient - Viem wallet client object
 * @param contractAddresses - Optional custom contract addresses (useful for local testing)
 * @returns Client object with methods for interacting with different token standards and attestations
 *
 * @example
 * ```ts
 * const client = makeClient(
 *   privateKeyToAccount(process.env.PRIVKEY as `0x${string}`, {
 *     nonceManager, // automatic nonce management
 *   })
 * );
 * ```
 */
declare const makeClient: (walletClient: WalletClient<Transport, Chain, Account>, contractAddresses?: Partial<ChainAddresses>) => AlkahestClient;
/**
 * Creates a minimal Alkahest client with only core functionality
 * @param walletClient - Viem wallet client object
 * @param contractAddresses - Optional custom contract addresses (useful for local testing)
 * @returns Minimal client object that can be extended with additional functionality
 *
 * @example
 * ```ts
 * // Create minimal client
 * const baseClient = makeMinimalClient(walletClient);
 *
 * // Extend with default functionality
 * const fullClient = baseClient.extend(makeDefaultExtension);
 *
 * // Or extend with custom functionality
 * const customClient = baseClient.extend((client) => ({
 *   erc20: makeErc20Client(client.viemClient, client.contractAddresses),
 *   customMethod: () => "custom functionality"
 * }));
 * ```
 */
declare const makeMinimalClient: (walletClient: WalletClient<Transport, Chain, Account>, contractAddresses?: Partial<ChainAddresses>) => MinimalClient;

export { type AlkahestClient, type ApprovalPurpose, type Attestation, type AttestationFilters, type BatchFilters, type BlockFilters, type ChainAddresses, type Demand, type Eip2612Props, type EnhancedArbitrateFilters, type Erc1155, type Erc20, type Erc721, type MinimalClient, type PerformanceFilters, type PermitSignature, type SignPermitProps, type TimeFilters, type TokenBundle, type TokenBundleFlat, type ViemClient, contractAddresses, flattenTokenBundle, getAttestation, getAttestedEventFromTxHash, getOptimalPollingInterval, isWebSocketTransport, makeArbitersClient, makeAttestationPropertiesArbitersClient, makeClient, makeDefaultExtension, makeGeneralArbitersClient, makeLogicalArbitersClient, makeMinimalClient, supportedChains };
