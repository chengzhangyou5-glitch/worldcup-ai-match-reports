(function () {
  const platformName = "闲鱼";
  const officialName = "绿茵数据研究所";
  const officialId = "xy117456641787";
  const storageKey = "lvyin-official-account-notice-date";

  function todayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore private-mode or storage-disabled failures.
    }
  }

  function createNotice() {
    if (document.getElementById("official-account-notice-root")) return;

    const host = document.createElement("div");
    host.id = "official-account-notice-root";
    host.style.position = "relative";
    host.style.zIndex = "2147483000";

    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host {
          all: initial;
          color-scheme: dark;
          font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, sans-serif;
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .official-banner {
          position: sticky;
          top: 0;
          z-index: 2147483001;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 12px clamp(14px, 3vw, 28px);
          border-bottom: 1px solid rgba(245, 211, 107, 0.38);
          color: #fff6d6;
          background:
            linear-gradient(90deg, rgba(245, 211, 107, 0.20), rgba(8, 22, 13, 0.94) 38%, rgba(8, 22, 13, 0.96)),
            rgba(8, 22, 13, 0.96);
          box-shadow: 0 16px 42px rgba(0, 0, 0, 0.28);
          font-size: 14px;
          line-height: 1.55;
        }

        .official-banner strong {
          color: #f5d36b;
          font-weight: 950;
        }

        .official-banner span {
          color: #e9f5e9;
        }

        .official-banner button,
        .notice-card button {
          font: inherit;
          cursor: pointer;
        }

        .banner-open {
          border: 1px solid rgba(245, 211, 107, 0.52);
          border-radius: 999px;
          padding: 7px 12px;
          color: #07130d;
          background: #f5d36b;
          font-size: 13px;
          font-weight: 950;
          white-space: nowrap;
        }

        .notice-overlay {
          position: fixed;
          inset: 0;
          z-index: 2147483002;
          display: none;
          place-items: center;
          padding: 18px;
          background: rgba(0, 0, 0, 0.66);
          backdrop-filter: blur(10px);
        }

        .notice-overlay.is-open {
          display: grid;
        }

        .notice-card {
          position: relative;
          width: min(560px, 100%);
          overflow: hidden;
          border: 1px solid rgba(245, 211, 107, 0.52);
          border-radius: 22px;
          padding: 26px;
          color: #eef8ef;
          background:
            radial-gradient(circle at 10% 0%, rgba(245, 211, 107, 0.16), transparent 34%),
            linear-gradient(180deg, rgba(12, 39, 22, 0.98), rgba(4, 16, 9, 0.98));
          box-shadow: 0 32px 110px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(245, 211, 107, 0.16) inset;
        }

        .notice-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          color: #eef8ef;
          background: rgba(255, 255, 255, 0.08);
          font-size: 22px;
          line-height: 1;
        }

        .notice-kicker {
          width: fit-content;
          margin-bottom: 14px;
          padding: 7px 11px;
          border: 1px solid rgba(245, 211, 107, 0.42);
          border-radius: 999px;
          color: #f5d36b;
          background: rgba(245, 211, 107, 0.09);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .notice-title {
          margin: 0 42px 12px 0;
          color: #ffffff;
          font-size: clamp(26px, 6vw, 38px);
          line-height: 1.08;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .notice-copy {
          margin: 0;
          color: #cfe8d5;
          font-size: 15px;
          line-height: 1.82;
        }

        .account-box {
          display: grid;
          gap: 8px;
          margin: 18px 0;
          padding: 16px;
          border: 1px solid rgba(122, 255, 172, 0.20);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.22);
        }

        .account-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: #aac9b4;
          font-size: 14px;
        }

        .account-row strong {
          color: #f5d36b;
          text-align: right;
          word-break: break-all;
        }

        .notice-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .notice-primary {
          flex: 1;
          border: 0;
          border-radius: 14px;
          padding: 13px 16px;
          color: #06100b;
          background: linear-gradient(180deg, #fff4bd, #f5d36b 64%, #d4a947);
          font-weight: 950;
        }

        @media (max-width: 560px) {
          .official-banner {
            grid-template-columns: 1fr;
            padding: 11px 14px;
            font-size: 13px;
          }

          .banner-open {
            width: 100%;
          }

          .notice-card {
            padding: 22px 18px;
            border-radius: 18px;
          }

          .account-row {
            display: grid;
            gap: 3px;
          }

          .account-row strong {
            text-align: left;
          }
        }
      </style>

      <div class="official-banner" role="region" aria-label="官方账号与防倒卖提示">
        <span><strong>防倒卖提醒：</strong>本网站禁止倒卖、转售。${platformName}官方售卖账号为 <strong>${officialName}</strong>，会员名 <strong>${officialId}</strong>；买错请找原卖家退款。</span>
        <button class="banner-open" type="button">查看官方账号</button>
      </div>

      <div class="notice-overlay" role="dialog" aria-modal="true" aria-labelledby="notice-title">
        <section class="notice-card">
          <button class="notice-close" type="button" aria-label="关闭提示">×</button>
          <div class="notice-kicker">OFFICIAL ACCOUNT</div>
          <h2 class="notice-title" id="notice-title">认准闲鱼官方账号</h2>
          <p class="notice-copy">为避免买到被倒卖的访问入口，请确认来源是否为下方官方账号。若不是从这个闲鱼账号购买，请立即联系原卖家申请退款。本网站可能不会为非官方来源提供数据更新、访问权限维护或售后保障。</p>
          <div class="account-box" aria-label="官方售卖账号信息">
            <div class="account-row"><span>平台</span><strong>${platformName}</strong></div>
            <div class="account-row"><span>官方昵称</span><strong>${officialName}</strong></div>
            <div class="account-row"><span>会员名</span><strong>${officialId}</strong></div>
          </div>
          <p class="notice-copy">本网站不得倒卖、转售或二次分发。请通过官方账号获取后续更新与服务说明。</p>
          <div class="notice-actions">
            <button class="notice-primary" type="button">我已知晓</button>
          </div>
        </section>
      </div>
    `;

    document.body.insertBefore(host, document.body.firstChild);

    const overlay = shadow.querySelector(".notice-overlay");
    const openButton = shadow.querySelector(".banner-open");
    const closeButtons = shadow.querySelectorAll(".notice-close, .notice-primary");

    function openModal() {
      overlay.classList.add("is-open");
    }

    function closeModal() {
      overlay.classList.remove("is-open");
      safeSet(storageKey, todayKey());
    }

    openButton.addEventListener("click", openModal);
    closeButtons.forEach((button) => button.addEventListener("click", closeModal));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) closeModal();
    });

    if (safeGet(storageKey) !== todayKey()) {
      window.setTimeout(openModal, 450);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createNotice, { once: true });
  } else {
    createNotice();
  }
})();
