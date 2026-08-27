#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
doctor="${project_root}/scripts/arc-doctor.sh"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

[[ -f "${doctor}" ]] || fail "Arc Doctor script is missing"

test_root="$(mktemp -d)"
trap 'rm -rf "${test_root}"' EXIT
fake_bin="${test_root}/bin"
mkdir -p "${fake_bin}" "${test_root}/project"

for command_name in curl git forge; do
  printf '#!/usr/bin/env bash\nexit 0\n' >"${fake_bin}/${command_name}"
  chmod +x "${fake_bin}/${command_name}"
done

cat >"${fake_bin}/cast" <<'EOF'
#!/usr/bin/env bash
case "${1:-}" in
  chain-id) printf '%s\n' "${FAKE_CHAIN_ID:-5042002}" ;;
  balance) printf '%s\n' "1000000" ;;
  *) exit 1 ;;
esac
EOF
chmod +x "${fake_bin}/cast"

run_doctor() {
  env \
    PATH="${fake_bin}:/usr/bin:/bin" \
    ARC_DOCTOR_ASSUME_WSL=1 \
    ARC_TESTNET_RPC_URL="https://rpc.testnet.arc.network" \
    "$@" \
    bash "${doctor}" "${test_root}/project" 2>&1
}

success_output="$(run_doctor)"
grep -q 'Arc Testnet chain ID: 5042002' <<<"${success_output}" ||
  fail "expected a successful Arc chain ID check"
grep -q 'Result: READY' <<<"${success_output}" ||
  fail "expected READY result"

set +e
wrong_chain_output="$(run_doctor FAKE_CHAIN_ID=1)"
wrong_chain_status=$?
set -e
[[ "${wrong_chain_status}" -ne 0 ]] || fail "wrong chain ID should fail"
grep -q 'Expected chain ID 5042002, received 1' <<<"${wrong_chain_output}" ||
  fail "expected a clear wrong-chain error"
grep -q 'Result: NOT READY' <<<"${wrong_chain_output}" ||
  fail "expected NOT READY result"

wallet_output="$(run_doctor ARC_WALLET_ADDRESS=0x0000000000000000000000000000000000000001)"
grep -q 'Wallet balance: 1000000 wei' <<<"${wallet_output}" ||
  fail "expected the optional wallet balance check"

grep -q 'bash scripts/arc-doctor.sh foundry' "${project_root}/README.md" ||
  fail "README should document the Arc Doctor command"
grep -q 'Arc Doctor' "${project_root}/README.md" ||
  fail "README should describe Arc Doctor"

echo "Arc Doctor tests passed"
