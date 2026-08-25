import { BrowserProvider, Contract, JsonRpcProvider } from "https://cdn.jsdelivr.net/npm/ethers@6.13.5/+esm";

const ADDRESS = "0x7619D52F4C7A516973ee58c362c59Fd79612D4DE";
const RPC = "https://rpc.testnet.arc.network";
const ABI = [
  "function registerProject(string name,string url) returns (uint256)",
  "function projectCount() view returns (uint256)",
  "function projects(uint256) view returns (address builder,string name,string url,uint64 createdAt)"
];
const read = new Contract(ADDRESS, ABI, new JsonRpcProvider(RPC));
const $ = (id) => document.getElementById(id);
const short = (v) => `${v.slice(0, 6)}…${v.slice(-4)}`;
let signer;

async function switchArc() {
  if (!window.ethereum) throw new Error("MetaMask or another EVM wallet is required.");
  try { await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x4cef52" }] }); }
  catch (error) {
    if (error.code !== 4902) throw error;
    await ethereum.request({ method: "wallet_addEthereumChain", params: [{ chainId: "0x4cef52", chainName: "Arc Testnet", nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 }, rpcUrls: [RPC], blockExplorerUrls: ["https://testnet.arcscan.app"] }] });
  }
}

async function connect() {
  await switchArc();
  const provider = new BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  $("connect").textContent = short(await signer.getAddress());
  $("status").textContent = "Wallet connected";
}

async function load() {
  try {
    const count = await read.projectCount();
    $("count").textContent = count.toString();
    const list = $("projects"); list.replaceChildren();
    const start = count > 20n ? count - 20n : 0n;
    for (let id = count; id > start; id--) {
      const [builder, name, url, createdAt] = await read.projects(id - 1n);
      const row = document.createElement("article");
      const number = document.createElement("span"); number.textContent = String(id).padStart(2, "0");
      const info = document.createElement("div");
      const title = document.createElement("h3"); title.textContent = name;
      const meta = document.createElement("p"); meta.textContent = `${short(builder)} · ${new Date(Number(createdAt) * 1000).toLocaleDateString()}`;
      info.append(title, meta);
      const link = document.createElement("a"); link.href = url; link.target = "_blank"; link.rel = "noreferrer"; link.textContent = "View project ↗";
      row.append(number, info, link); list.append(row);
    }
    if (count === 0n) list.innerHTML = '<p class="empty">No projects registered yet.</p>';
    $("status").textContent = "Onchain data verified";
  } catch { $("status").textContent = "RPC temporarily unavailable"; }
}

$("connect").addEventListener("click", () => connect().catch(e => $("status").textContent = e.message));
$("refresh").addEventListener("click", load);
$("form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    if (!signer) await connect();
    $("status").textContent = "Confirm in wallet…";
    const contract = new Contract(ADDRESS, ABI, signer);
    const tx = await contract.registerProject($("name").value.trim(), $("url").value.trim());
    $("status").textContent = "Waiting for Arc finality…";
    await tx.wait(); event.target.reset(); await load();
  } catch (e) { $("status").textContent = e.shortMessage || e.message || "Transaction failed"; }
});
load();
