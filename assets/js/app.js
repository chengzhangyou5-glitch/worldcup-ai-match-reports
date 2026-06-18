import { upcomingPage, detailPage, historyPage, searchPage, reportModal, noticeModal, shareModal } from "./components.js";
import { matches } from "./data.js";

const app = document.querySelector("#app");
const modalLayer = document.querySelector("#modal-layer");
const modalContent = document.querySelector("#modal-content");
const toast = document.querySelector("#toast");
let searchQuery = "";
let toastTimer;

function route() {
  const hash = location.hash.replace(/^#/, "") || "upcoming";
  const [page, id] = hash.split("/");
  return { page, id };
}

function setActiveNav(page) {
  const active = page === "detail" ? "upcoming" : page;
  document.querySelectorAll("[data-nav]").forEach(link => link.classList.toggle("is-active", link.dataset.nav === active));
}

function render({ preserveFocus = false } = {}) {
  const current = route();
  if (current.page === "detail") app.innerHTML = detailPage(current.id);
  else if (current.page === "history") app.innerHTML = historyPage();
  else if (current.page === "search") app.innerHTML = searchPage(searchQuery);
  else app.innerHTML = upcomingPage();
  setActiveNav(current.page);
  document.body.dataset.page = current.page;
  if (!preserveFocus) {
    window.scrollTo({ top: 0, behavior: "instant" });
    app.focus({ preventScroll: true });
  }
}

function openMatch(id) {
  location.hash = `detail/${id}`;
}

function showModal(content) {
  modalContent.innerHTML = content;
  modalLayer.hidden = false;
  document.body.classList.add("modal-open");
  modalLayer.querySelector(".modal-close").focus();
}

function closeModal() {
  modalLayer.hidden = true;
  document.body.classList.remove("modal-open");
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

document.addEventListener("click", async (event) => {
  const matchTarget = event.target.closest("[data-open-match]");
  if (matchTarget) { event.stopPropagation(); openMatch(matchTarget.dataset.openMatch); return; }
  const original = event.target.closest("[data-original]");
  if (original) {
    const id = original.dataset.original;
    if (matches.some(match => match.id === id)) openMatch(id);
    else showToast("这场历史分析正在归档中");
    return;
  }
  const historyCard = event.target.closest(".history-card");
  if (historyCard) {
    const detail = historyCard.querySelector(".history-expand");
    detail.hidden = !detail.hidden;
    historyCard.classList.toggle("is-open", !detail.hidden);
    return;
  }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "back") location.hash = "upcoming";
  if (action === "open-report") {
    const match = matches.find(item => item.id === route().id);
    if (match?.report) location.href = match.report;
    else showModal(reportModal());
  }
  if (action === "notice") showModal(noticeModal());
  if (action === "close-modal") closeModal();
  if (action === "clear-search") { searchQuery = ""; render(); document.querySelector("#history-search")?.focus(); }
  if (action === "share") {
    try { await navigator.clipboard.writeText(location.href); } catch (_) { /* clipboard may be unavailable on local HTTP */ }
    showModal(shareModal());
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!modalLayer.hidden) closeModal();
    else if (route().page === "search" && searchQuery) { searchQuery = ""; render(); }
  }
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-open-match]")) openMatch(event.target.dataset.openMatch);
});

document.addEventListener("input", (event) => {
  if (event.target.id !== "history-search") return;
  searchQuery = event.target.value;
  const caret = event.target.selectionStart;
  render({ preserveFocus: true });
  const input = document.querySelector("#history-search");
  input.focus(); input.setSelectionRange(caret, caret);
});

window.addEventListener("hashchange", () => render());
render();
