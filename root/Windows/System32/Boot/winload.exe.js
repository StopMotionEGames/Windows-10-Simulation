const html = `
<head>
    <link rel="manifest" href="/manifest.json" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height" />
    <title>Windows OS Loader</title>
    <style>
      @media (min-width: 1600px) {
        .logo {
          margin: 218px !important;
        }

        #loadText {
          font-size: 32px !important;
        }

        .loadFlex {
          margin: 128px !important;
        }

        #loadAnm {
          font-size: 32px !important;
        }
      }

      body {
        margin: 0;
      }

      #loadBody {
        color: #fff;
        overflow: hidden;
        font-family: Segoe Boot Semilight;
        z-index: 800000;
        position: fixed;
        top: 0;
        left: 0;
        width: 100dvw;
        height: 100dvh;
        transition: opacity 0.5s;
        opacity: 1;
        cursor: none;
        user-select: none;
      }

      .loadFlex {
        margin-block: 42px;
        width: 100dvw;
        flex-direction: column;
        align-items: center;
        display: flex;
      }

      .logo {
        margin: 172px;
      }

      #load {
        display: flex;
        position: relative;
        flex-direction: column-reverse;
        align-items: center;
        width: 100%;
        justify-content: center;
        text-align: center;
      }

      #loadAnm {
        color: #fff;
        text-align: center;
        position: relative;
        font-size: 22px;
        font-family: "Segoe Boot Semilight";
        margin-block: 14px;
      }

      #loadAnm::before {
        content: " ";
        color: #fff;
        animation: var(--W10Boot);
        animation-play-state: var(--playState, running);
      }

      #loadText {
        color: #fff;
        font-size: 26px;
        text-align: center;
      }

      .aTF {
        position: fixed;
        width: 100dvw;
        height: 100dvh;
        z-index: 8;
      }

      .fade-out {
        opacity: 0 !important;
      }

      .anm {
        height: 100svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: opacity 0.5s;
        opacity: 1;
      }

      @keyframes W10Boot {
        0% {
          content: "\\E052";
        }

        0.819672131147541% {
          content: "\\E053";
        }

        1.639344262295082% {
          content: "\\E054";
        }

        2.459016393442623% {
          content: "\\E055";
        }

        3.278688524590164% {
          content: "\\E056";
        }

        4.0983606557377055% {
          content: "\\E057";
        }

        4.918032786885246% {
          content: "\\E058";
        }

        5.737704918032787% {
          content: "\\E059";
        }

        6.557377049180328% {
          content: "\\E05A";
        }

        7.3770491803278695% {
          content: "\\E05B";
        }

        8.196721311475411% {
          content: "\\E05C";
        }

        9.01639344262295% {
          content: "\\E05D";
        }

        9.836065573770492% {
          content: "\\E05E";
        }

        10.655737704918034% {
          content: "\\E05F";
        }

        11.475409836065573% {
          content: "\\E060";
        }

        12.295081967213115% {
          content: "\\E061";
        }

        13.114754098360656% {
          content: "\\E062";
        }

        13.934426229508198% {
          content: "\\E063";
        }

        14.754098360655739% {
          content: "\\E064";
        }

        15.573770491803279% {
          content: "\\E065";
        }

        16.393442622950822% {
          content: "\\E066";
        }

        17.21311475409836% {
          content: "\\E067";
        }

        18.0327868852459% {
          content: "\\E068";
        }

        18.852459016393443% {
          content: "\\E069";
        }

        19.672131147540984% {
          content: "\\E06A";
        }

        20.491803278688526% {
          content: "\\E06B";
        }

        21.311475409836067% {
          content: "\\E06C";
        }

        22.13114754098361% {
          content: "\\E06D";
        }

        22.950819672131146% {
          content: "\\E06E";
        }

        23.770491803278688% {
          content: "\\E06F";
        }

        24.59016393442623% {
          content: "\\E070";
        }

        25.40983606557377% {
          content: "\\E071";
        }

        26.229508196721312% {
          content: "\\E072";
        }

        27.049180327868854% {
          content: "\\E073";
        }

        27.868852459016395% {
          content: "\\E074";
        }

        28.688524590163937% {
          content: "\\E075";
        }

        29.508196721311478% {
          content: "\\E076";
        }

        30.327868852459016% {
          content: "\\E077";
        }

        31.147540983606557% {
          content: "\\E078";
        }

        31.9672131147541% {
          content: "\\E079";
        }

        32.786885245901644% {
          content: "\\E07A";
        }

        33.60655737704918% {
          content: "\\E07B";
        }

        34.42622950819672% {
          content: "\\E07C";
        }

        35.24590163934426% {
          content: "\\E07D";
        }

        36.0655737704918% {
          content: "\\E07E";
        }

        36.885245901639344% {
          content: "\\E07F";
        }

        37.704918032786885% {
          content: "\\E080";
        }

        38.52459016393443% {
          content: "\\E081";
        }

        39.34426229508197% {
          content: "\\E082";
        }

        40.16393442622951% {
          content: "\\E083";
        }

        40.98360655737705% {
          content: "\\E084";
        }

        41.80327868852459% {
          content: "\\E085";
        }

        42.622950819672134% {
          content: "\\E086";
        }

        43.442622950819676% {
          content: "\\E087";
        }

        44.26229508196722% {
          content: "\\E088";
        }

        45.08196721311476% {
          content: "\\E089";
        }

        45.90163934426229% {
          content: "\\E08A";
        }

        46.721311475409834% {
          content: "\\E08B";
        }

        47.540983606557376% {
          content: "\\E08C";
        }

        48.36065573770492% {
          content: "\\E08D";
        }

        49.18032786885246% {
          content: "\\E08E";
        }

        50% {
          content: "\\E08F";
        }

        50.81967213114754% {
          content: "\\E090";
        }

        51.63934426229508% {
          content: "\\E091";
        }

        52.459016393442624% {
          content: "\\E092";
        }

        53.278688524590166% {
          content: "\\E093";
        }

        54.09836065573771% {
          content: "\\E094";
        }

        54.91803278688525% {
          content: "\\E095";
        }

        55.73770491803279% {
          content: "\\E096";
        }

        56.55737704918033% {
          content: "\\E097";
        }

        57.37704918032787% {
          content: "\\E098";
        }

        58.196721311475414% {
          content: "\\E099";
        }

        59.016393442622956% {
          content: "\\E09A";
        }

        59.83606557377049% {
          content: "\\E09B";
        }

        60.65573770491803% {
          content: "\\E09C";
        }

        61.47540983606557% {
          content: "\\E09D";
        }

        62.295081967213115% {
          content: "\\E09E";
        }

        63.114754098360656% {
          content: "\\E09F";
        }

        63.9344262295082% {
          content: "\\E0A0";
        }

        64.75409836065575% {
          content: "\\E0A1";
        }

        65.57377049180329% {
          content: "\\E0A2";
        }

        66.39344262295081% {
          content: "\\E0A3";
        }

        67.21311475409836% {
          content: "\\E0A4";
        }

        68.0327868852459% {
          content: "\\E0A5";
        }

        68.85245901639344% {
          content: "\\E0A6";
        }

        69.67213114754098% {
          content: "\\E0A7";
        }

        70.49180327868852% {
          content: "\\E0A8";
        }

        71.31147540983606% {
          content: "\\E0A9";
        }

        72.1311475409836% {
          content: "\\E0AA";
        }

        72.95081967213115% {
          content: "\\E0AB";
        }

        73.77049180327869% {
          content: "\\E0AC";
        }

        74.59016393442623% {
          content: "\\E0AD";
        }

        75.40983606557377% {
          content: "\\E0AE";
        }

        76.22950819672131% {
          content: "\\E0AF";
        }

        77.04918032786885% {
          content: "\\E0B0";
        }

        77.8688524590164% {
          content: "\\E0B1";
        }

        78.68852459016394% {
          content: "\\E0B2";
        }

        79.50819672131148% {
          content: "\\E0B3";
        }

        80.32786885245902% {
          content: "\\E0B4";
        }

        81.14754098360656% {
          content: "\\E0B5";
        }

        81.9672131147541% {
          content: "\\E0B6";
        }

        82.78688524590164% {
          content: "\\E0B7";
        }

        83.60655737704919% {
          content: "\\E0B8";
        }

        84.42622950819673% {
          content: "\\E0B9";
        }

        85.24590163934427% {
          content: "\\E0BA";
        }

        86.06557377049181% {
          content: "\\E0BB";
        }

        86.88524590163935% {
          content: "\\E0BC";
        }

        87.70491803278689% {
          content: "\\E0BD";
        }

        88.52459016393443% {
          content: "\\E0BE";
        }

        89.34426229508198% {
          content: "\\E0BF";
        }

        90.16393442622952% {
          content: "\\E0C0";
        }

        90.98360655737706% {
          content: "\\E0C1";
        }

        91.80327868852459% {
          content: "\\E0C2";
        }

        92.62295081967213% {
          content: "\\E0C3";
        }

        93.44262295081967% {
          content: "\\E0C4";
        }

        94.26229508196721% {
          content: "\\E0C5";
        }

        95.08196721311475% {
          content: "\\E0C6";
        }

        95.90163934426229%,
        100% {
          content: "\\E0C7";
        }
      }
    </style>
    <script>

    </script>
</head>
`;
(() => {
  document.documentElement.innerHTML = html;
  const ntoskrnl = document.createElement("script");
  ntoskrnl.type = "module";
  ntoskrnl.src = "/Windows/System32/ntoskrnl.exe.js";
  document.head.appendChild(ntoskrnl);
  ntoskrnl.onload = async () => {
    __KERNEL__.IsBooting = true;
  };
})();
