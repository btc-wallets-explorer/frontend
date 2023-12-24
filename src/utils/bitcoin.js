import * as btcOutDesc from "@blockchainofthings/btc-output-descriptor";
import * as bitcoin from "bitcoinjs-lib";
import { add, range } from "lodash";
import * as ecc from "tiny-secp256k1";

bitcoin.initEccLib(ecc);

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

  return range(startIdx, startIdx + count).map((index) => {
    const d = newDescriptor.replaceAll("*", index);
    const address = btcOutDesc.parse(d, "main").addresses[0];

    return {
      address,
      scriptHash: toScriptHash(address),
      isChange,
      index,
      wallet,
    };
  });
};
