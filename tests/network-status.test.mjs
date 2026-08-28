import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  classifyBlockFreshness,
  parseRpcSnapshot,
} from "../docs/network-status/app.js";

test("parses an Arc Testnet RPC snapshot", () => {
  const snapshot = parseRpcSnapshot({
    chainId: "0x4cef52",
    blockNumber: "0x10",
    gasPrice: "0x3b9aca00",
    block: { timestamp: "0x64" },
  });

  assert.deepEqual(snapshot, {
    chainId: 5042002,
    blockNumber: 16,
    gasPriceGwei: "1.00",
    blockTimestampMs: 100000,
  });
});

test("rejects a response from a different chain", () => {
  assert.throws(
    () =>
      parseRpcSnapshot({
        chainId: "0x1",
        blockNumber: "0x10",
        gasPrice: "0x1",
        block: { timestamp: "0x64" },
      }),
    /Expected Arc Testnet chain ID 5042002/,
  );
});

test("classifies fresh and delayed blocks", () => {
  const now = 200000;
  assert.equal(classifyBlockFreshness(150000, now), "LIVE");
  assert.equal(classifyBlockFreshness(70000, now), "DELAYED");
});

test("renders the compact Korean monitor heading", async () => {
  const html = await readFile(
    new URL("../docs/network-status/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /Arc Testnet을(?:<br\s*\/?>|\s)*한눈에 확인하세요/);
  assert.doesNotMatch(html, /Know the network/);
});
