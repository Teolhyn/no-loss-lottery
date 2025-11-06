import * as Client from 'no_loss_lottery';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Public Global Stellar Network ; September 2015',
  contractId: 'CDID2FBEZOSICXXQ25NBJFFS5MT3JWYOD3P6D3HCJGTXOFIQZZD42TJH',
  rpcUrl,
  publicKey: undefined,
});
