import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { SolanaExtension } from '@magic-ext/solana';

// Grab your keys from the environment
const magicPublishableKey = import.meta.env.VITE_MAGIC_PUBLISHABLE_KEY;
const heliusRpcUrl = import.meta.env.VITE_HELIUS_RPC_URL;

export const magic = typeof window !== 'undefined' 
  ? new Magic(magicPublishableKey, {
      // CRITICAL: This global network setting forces Magic to use Solana 
      // as the primary identity network for every login (Google, GitHub, etc.)
      network: {
        rpcUrl: heliusRpcUrl,
        chainType: 'SOLANA'
      },
      extensions: [
        new OAuthExtension(),
        new SolanaExtension({
          rpcUrl: heliusRpcUrl 
        })
      ],
    })
  : null;
