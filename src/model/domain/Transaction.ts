interface Vin {
  scriptSig: any;
  txid: string;
  vout: number;
}

interface Transaction {
  txid: string;
  blocktime: number;
  time: number;
  vin: Array<Vin>;
}
