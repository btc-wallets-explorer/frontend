import * as btcOutDesc from "@blockchainofthings/btc-output-descriptor";
import * as bitcoin from "bitcoinjs-lib";

export const toScriptHash = (address) => {
  const script = bitcoin.address.toOutputScript(address);
  const hash = bitcoin.crypto.sha256(script);
  const reversedHash = Buffer.from(hash.reverse());
  const scriptHash = reversedHash.toString("hex");

  return scriptHash;
};

export const createAddresses = (
  wallet,
  isChange,
  startIdx = 0,
  count = 100,
) => {
  const { descriptor } = wallet.outputDescriptors[0];
  const newDescriptor = descriptor.replace(/[(,\]](.?pub[^),]*)/g, (xpub) =>
    xpub.includes("/*") ? xpub : `${xpub}/${isChange}/*`,
  );

  const expression = btcOutDesc.parse(newDescriptor, "main");

  expression.keyRange = {
    startIdx,
    count: startIdx + count,
  };

  return expression.addresses.map((address, index) => ({
    address,
    scriptHash: toScriptHash(address),
    isChange,
    index,
    wallet,
  }));
};
