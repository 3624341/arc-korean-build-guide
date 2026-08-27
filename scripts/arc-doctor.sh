#!/usr/bin/env bash
set -uo pipefail

expected_chain_id="5042002"
project_dir="${1:-$PWD}"
failures=0

pass() {
  printf '✓ %s\n' "$1"
}

fail() {
  printf '✗ %s\n' "$1"
  failures=$((failures + 1))
}

printf '%s\n' "Arc Doctor v1.1"
printf '%s\n\n' "Checking your Arc Testnet development environment..."

if [[ "${ARC_DOCTOR_ASSUME_WSL:-0}" == "1" ]] ||
  grep -qiE '(microsoft|wsl)' /proc/version 2>/dev/null; then
  pass "WSL environment detected"
else
  fail "WSL was not detected. Run this tool inside WSL Ubuntu."
fi

for command_name in curl git forge cast; do
  if command -v "${command_name}" >/dev/null 2>&1; then
    pass "${command_name} is installed"
  else
    fail "${command_name} is not installed or is not available in PATH"
  fi
done

rpc_url="${ARC_TESTNET_RPC_URL:-}"
if [[ -z "${rpc_url}" ]]; then
  fail "ARC_TESTNET_RPC_URL is not set. Add it to .env and run: source .env"
elif command -v cast >/dev/null 2>&1; then
  chain_id="$(cast chain-id --rpc-url "${rpc_url}" 2>/dev/null || true)"
  if [[ "${chain_id}" == "${expected_chain_id}" ]]; then
    pass "Arc Testnet chain ID: ${chain_id}"
  elif [[ -z "${chain_id}" ]]; then
    fail "Could not connect to the configured Arc Testnet RPC"
  else
    fail "Expected chain ID ${expected_chain_id}, received ${chain_id}"
  fi
fi

wallet_address="${ARC_WALLET_ADDRESS:-}"
if [[ -n "${wallet_address}" ]] && command -v cast >/dev/null 2>&1; then
  balance="$(cast balance "${wallet_address}" --rpc-url "${rpc_url}" 2>/dev/null || true)"
  if [[ -n "${balance}" ]]; then
    pass "Wallet balance: ${balance} wei"
  else
    fail "Could not read the wallet balance"
  fi
else
  printf '%s\n' "- Wallet balance skipped (optional: set ARC_WALLET_ADDRESS)"
fi

if [[ -f "${project_dir}/foundry.toml" ]] && command -v forge >/dev/null 2>&1; then
  if (cd "${project_dir}" && forge test >/dev/null 2>&1); then
    pass "Foundry project tests passed"
  else
    fail "Foundry project tests failed in ${project_dir}"
  fi
else
  printf '%s\n' "- Foundry tests skipped (no foundry.toml in ${project_dir})"
fi

printf '\n'
if [[ "${failures}" -eq 0 ]]; then
  printf '%s\n' "Result: READY"
  exit 0
fi

printf '%s\n' "Result: NOT READY (${failures} check(s) failed)"
exit 1
