const Code = ({ children }: { children: React.ReactNode }) => <pre className="code"><code>{children}</code></pre>;

export default function Home() {
  return <main>
    <header className="topbar">
      <a className="brand" href="#top"><span className="mark">A</span>Arc 한국어 가이드</a>
      <nav><a href="#prepare">준비</a><a href="#deploy">배포</a><a href="#troubleshoot">문제 해결</a></nav>
    </header>

    <section className="hero" id="top">
      <div>
        <p className="eyebrow"><b>BEGINNER</b> · 약 15분</p>
        <h1>Arc 테스트넷에<br/>첫 스마트 컨트랙트 배포하기</h1>
        <p className="lede">Solidity 코드를 새로 작성하지 않고, Foundry 기본 예제인 Counter를 테스트하고 Arc 테스트넷에 올려봅니다.</p>
        <div className="actions"><a className="button primary" href="#prepare">바로 시작하기 ↓</a><a className="button secondary" href="https://docs.arc.io/arc/tutorials/deploy-on-arc" target="_blank" rel="noreferrer">공식 원문 ↗</a></div>
        <p className="updated">2026년 8월 24일 기준 · 비공식 한국어 커뮤니티 가이드</p>
      </div>
      <div className="terminal">
        <div className="term-head"><i/><i/><i/><span>hello-arc — zsh</span></div>
        <div className="term-body"><p><b>$</b> forge test</p><p className="ok">[PASS] test_Increment()</p><p><b>$</b> forge create Counter --broadcast</p><p className="dim">Deployer: 0xB815...A2d</p><p>Deployed to: <em>0x3236...C4BF</em></p><p className="ok">✓ Transaction confirmed</p></div>
        <div className="network"><span/><div><small>NETWORK</small><strong>Arc Testnet</strong></div><div><small>GAS TOKEN</small><strong>USDC</strong></div></div>
      </div>
    </section>

    <section className="facts"><div><small>RPC URL</small><code>https://rpc.testnet.arc.network</code></div><div><small>CHAIN ID</small><strong>5042002</strong></div><div><small>도구</small><strong>Foundry</strong></div><div><small>결과</small><strong>Counter 컨트랙트</strong></div></section>

    <div className="content">
      <aside><p>이 가이드에서</p><ol><li><a href="#prepare">시작 전 준비</a></li><li><a href="#install">Foundry 설치</a></li><li><a href="#configure">Arc 연결 설정</a></li><li><a href="#deploy">배포와 검증</a></li><li><a href="#interact">컨트랙트 실행</a></li></ol></aside>
      <article>
        <section id="prepare"><p className="step">시작 전 준비</p><h2>먼저 실행 환경을 확인하세요</h2><p>이 가이드는 터미널 명령어를 사용합니다. macOS와 Linux는 바로 시작할 수 있고, Windows 사용자는 WSL 환경을 권장합니다.</p>
          <div className="checks"><div><span>01</span><strong>터미널</strong><p>macOS · Linux · Windows WSL</p></div><div><span>02</span><strong>curl</strong><p>Foundry 설치 파일 다운로드</p></div><div><span>03</span><strong>코드 편집기</strong><p>VS Code 등 원하는 편집기</p></div></div>
          <div className="callout info"><b>Windows 사용자</b><p>PowerShell이 아니라 WSL 터미널에서 아래 명령어를 실행하세요. WSL 설치 후 Ubuntu를 열면 됩니다.</p></div>
        </section>
        <section id="install"><p className="step">STEP 1</p><h2>Foundry 설치하고 프로젝트 만들기</h2><p>Foundry는 Solidity 컨트랙트를 개발·테스트·배포할 수 있는 도구 모음입니다.</p><Code>curl -L https://foundry.paradigm.xyz | bash</Code><p>터미널을 새로 열거나 설치 화면의 <code className="inline">source</code> 명령을 실행한 뒤 도구를 설치합니다.</p><Code>foundryup</Code><p>기본 Counter 예제가 포함된 프로젝트를 생성합니다.</p><Code>forge init hello-arc &amp;&amp; cd hello-arc</Code><div className="result"><span>✓</span><div><strong>여기까지 완료하면</strong><p><code>src/Counter.sol</code>, 테스트 파일, 배포 스크립트가 자동 생성됩니다.</p></div></div></section>
        <section id="configure"><p className="step">STEP 2</p><h2>Arc 테스트넷 RPC 연결하기</h2><p>프로젝트 최상위 폴더에 <code className="inline">.env</code> 파일을 만들고 RPC 주소를 저장합니다.</p><Code>ARC_TESTNET_RPC_URL=&quot;https://rpc.testnet.arc.network&quot;</Code><p>저장한 값을 현재 터미널에 불러옵니다.</p><Code>source .env</Code><div className="callout danger"><b>보안 주의</b><p><code>.env</code>에는 Arc Testnet RPC 주소만 저장합니다. 개인키나 시드 문구는 이 파일 또는 GitHub에 절대 저장하지 마세요.</p></div></section>
        <section id="test"><p className="step">STEP 3</p><h2>배포 전에 로컬 테스트하기</h2><p>기본 테스트를 실행해 Counter 컨트랙트가 정상적으로 컴파일되고 작동하는지 확인합니다.</p><Code>forge test</Code><div className="result"><span>✓</span><div><strong>테스트 통과</strong><p>출력에 <code>[PASS]</code>가 표시되면 배포 준비가 된 것입니다.</p></div></div></section>
        <section id="deploy"><p className="step">STEP 4</p><h2>지갑을 만들고 테스트넷에 배포하기</h2><p>학습용 새 지갑을 만듭니다. 출력되는 개인키는 누구에게도 공유하면 안 됩니다.</p><Code>cast wallet new</Code><p>암호화된 키스토어에 배포용 지갑을 생성합니다. 아래 명령은 같은 WSL Ubuntu 터미널에서 실행하세요.</p><Code>{`mkdir -p ~/.foundry/keystores\ncast wallet new ~/.foundry/keystores arc-deployer`}</Code><div className="callout info"><b>키스토어 보안</b><p>비밀번호를 입력할 때 화면에 글자가 표시되지 않는 것이 정상입니다. 개인키, 시드 문구, 키스토어 비밀번호는 가이드나 GitHub에 올리지 마세요.</p></div><div className="callout info"><b>가스비 받기</b><p><a href="https://faucet.circle.com" target="_blank" rel="noreferrer"><u>Circle Faucet</u></a>에서 Arc Testnet을 선택하고 지갑 주소를 입력해 테스트넷 USDC를 받으세요. Arc에서는 USDC가 가스 토큰입니다.</p></div><p>아래 명령으로 Counter 컨트랙트를 배포합니다.</p><Code>{`forge create src/Counter.sol:Counter \\\n  --rpc-url $ARC_TESTNET_RPC_URL \\\n  --account arc-deployer \\\n  --broadcast`}</Code><p>배포가 완료되면 출력값을 구분해 저장합니다. <code className="inline">Deployed to</code> 뒤의 값은 컨트랙트 주소이고, <code className="inline">Transaction hash</code> 뒤의 값은 배포 트랜잭션 해시입니다.</p><Code>{`export COUNTER_ADDRESS="Deployed to 뒤의 실제 주소"\nexport DEPLOY_TX="Transaction hash 뒤의 실제 해시"\necho "$COUNTER_ADDRESS"\necho "$DEPLOY_TX"`}</Code><div className="callout info"><b>어디에 입력하나요?</b><p>위 명령은 배포 명령을 실행한 같은 WSL Ubuntu 터미널에 입력합니다. 예시 문구를 그대로 사용하지 말고 이번 배포 결과에 표시된 실제 주소와 해시로 교체하세요.</p></div><h3>Explorer에 소스 코드 검증하기</h3><p>Arc Testnet Explorer는 Blockscout를 사용합니다. 다음 명령으로 배포 주소에 소스 코드를 연결합니다.</p><Code>{`forge verify-contract $COUNTER_ADDRESS src/Counter.sol:Counter \\\n  --chain-id 5042002 \\\n  --verifier blockscout \\\n  --verifier-url https://testnet.arcscan.app/api/`}</Code></section>
        <section id="interact"><p className="step">STEP 5</p><h2>배포한 Counter 실행하기</h2><p>먼저 현재 숫자를 읽습니다. 새 Counter의 값은 <code className="inline">0</code>입니다.</p><Code>{`cast call $COUNTER_ADDRESS "number()(uint256)" \\\n  --rpc-url $ARC_TESTNET_RPC_URL`}</Code><p>온체인 트랜잭션을 보내 숫자를 1 증가시킵니다.</p><Code>{`cast send $COUNTER_ADDRESS "increment()" \\\n  --rpc-url $ARC_TESTNET_RPC_URL \\\n  --account arc-deployer`}</Code><p>첫 번째 <code className="inline">cast call</code>을 다시 실행해 값이 <code className="inline">1</code>인지 확인하세요.</p><div className="complete"><span>✓</span><h3>첫 Arc 컨트랙트 배포 완료</h3><p><a href="https://testnet.arcscan.app" target="_blank" rel="noreferrer">Arc Testnet Explorer ↗</a>에서 주소나 트랜잭션 해시를 검색할 수 있습니다.</p></div></section>
        <section id="troubleshoot"><p className="step">문제 해결</p><h2>막혔을 때 확인할 항목</h2><div className="faq"><details><summary><code>foundryup: command not found</code></summary><p>설치 직후라면 터미널을 완전히 닫았다가 다시 여세요. 또는 설치 완료 화면의 <code>source</code> 명령을 실행하세요.</p></details><details><summary>배포 중 잔액 부족 오류가 나요</summary><p>Circle Faucet에서 <strong>Arc Testnet</strong>을 선택하고 생성한 지갑 주소로 테스트넷 USDC를 받았는지 확인하세요.</p></details><details><summary>환경변수가 비어 있다고 나와요</summary><p>현재 폴더에 <code>.env</code>가 있는지 확인하고 <code>source .env</code>를 다시 실행하세요.</p></details><details><summary>테스트넷 명령이 계속 실패해요</summary><p>Arc는 테스트넷 단계이므로 일시적인 장애가 있을 수 있습니다. <a href="https://status.arc.io" target="_blank" rel="noreferrer"><u>네트워크 상태</u></a>를 확인하세요.</p></details></div></section>
        <footer><div className="source-note"><strong>출처와 안내</strong><p>Arc 공식 “Deploy on Arc” 문서를 바탕으로 한국어 사용자가 따라가기 쉽도록 재구성한 비공식 커뮤니티 가이드입니다. 최신 사양은 항상 공식 문서를 우선하세요.</p></div><div className="footer-links"><a href="https://docs.arc.io/arc/tutorials/deploy-on-arc" target="_blank" rel="noreferrer">공식 튜토리얼 ↗</a><a href="https://www.arc.io" target="_blank" rel="noreferrer">Arc 홈페이지 ↗</a></div></footer>
      </article>
    </div>
  </main>;
}
