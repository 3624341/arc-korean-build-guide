const RPC_URL = "https://rpc.testnet.arc.network";
const EXPECTED_CHAIN_ID = 5042002;

export function parseRpcSnapshot({ chainId, blockNumber, gasPrice, block }) {
  const parsedChainId = Number.parseInt(chainId, 16);
  if (parsedChainId !== EXPECTED_CHAIN_ID) {
    throw new Error(
      `Expected Arc Testnet chain ID ${EXPECTED_CHAIN_ID}, received ${parsedChainId}`,
    );
  }

  return {
    chainId: parsedChainId,
    blockNumber: Number.parseInt(blockNumber, 16),
    gasPriceGwei: (Number(BigInt(gasPrice)) / 1_000_000_000).toFixed(2),
    blockTimestampMs: Number.parseInt(block.timestamp, 16) * 1000,
  };
}

export function classifyBlockFreshness(blockTimestampMs, now = Date.now()) {
  return now - blockTimestampMs <= 120000 ? "LIVE" : "DELAYED";
}

async function rpc(method, params = []) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: method, method, params }),
  });

  if (!response.ok) throw new Error(`RPC returned HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || "Arc RPC error");
  return payload.result;
}

async function fetchSnapshot() {
  const [chainId, blockNumber, gasPrice] = await Promise.all([
    rpc("eth_chainId"),
    rpc("eth_blockNumber"),
    rpc("eth_gasPrice"),
  ]);
  const block = await rpc("eth_getBlockByNumber", [blockNumber, false]);
  return parseRpcSnapshot({ chainId, blockNumber, gasPrice, block });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setState(state, message) {
  const badge = document.getElementById("network-state");
  if (!badge) return;
  badge.dataset.state = state.toLowerCase();
  badge.textContent = `${state} · ${message}`;
}

function formatTime(timestampMs) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestampMs));
}

async function refresh() {
  const button = document.getElementById("refresh");
  if (button) button.disabled = true;
  setState("CHECKING", "Arc RPC 연결 확인 중");

  try {
    const snapshot = await fetchSnapshot();
    const freshness = classifyBlockFreshness(snapshot.blockTimestampMs);
    setText("chain-id", snapshot.chainId.toLocaleString("en-US"));
    setText("block-number", snapshot.blockNumber.toLocaleString("en-US"));
    setText("gas-price", `${snapshot.gasPriceGwei} Gwei`);
    setText("block-time", formatTime(snapshot.blockTimestampMs));
    setText("updated-at", formatTime(Date.now()));
    setState(freshness, freshness === "LIVE" ? "Arc Testnet 정상" : "블록 갱신 지연");
  } catch (error) {
    setState("OFFLINE", "Arc RPC 응답 없음");
    setText("updated-at", formatTime(Date.now()));
    setText("error-message", error instanceof Error ? error.message : "Unknown error");
  } finally {
    if (button) button.disabled = false;
  }
}

if (typeof document !== "undefined") {
  document.getElementById("refresh")?.addEventListener("click", refresh);
  refresh();
  window.setInterval(refresh, 30000);
}
