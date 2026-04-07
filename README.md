# Shadi Maani - Personal Portfolio

<div align="center">
  <h3>Software Engineer · DevOps · AI Systems</h3>
  <p>A high-performance, bilingual (Arabic/English), zero-dependency portfolio website.</p>
  <a href="https://shadimaani.me"><strong>View Live Site »</strong></a>
</div>

<br>

## 🚀 Overview

This repository contains the source code for my professional technical portfolio. It is built from scratch strictly using HTML5, Vanilla CSS, and modular JavaScript without relying on any heavy frameworks (like React/Angular) or utility-first CSS libraries (like Tailwind). The primary focus is **absolute performance**, **first-class Arabic (RTL) support**, and **SEO dominance**.
![Deployment](https://img.shields.io/github/actions/workflow/status/shadi-maani/shadi-maani.github.io/static.yml?label=Deployment&style=for-the-badge)
![Lighthouse Performance](https://img.shields.io/badge/Performance-100-success)
![Security-Scan](https://img.shields.io/badge/Security-Clean-blue)

## ✨ Key Features & Architecture

* **Zero-Dependency Architecture:** Minimal external requests. No jQuery, no CSS frameworks. Pure Vanilla JS and CSS for maximum efficiency.
* **Bilingual i18n System:** Custom JavaScript translation logic that dynamically switches between Arabic (RTL) and English (LTR) based on `navigator.language` and saves preferences in `localStorage`.
* **Dynamic Aesthetics:** Utilizes a CSS mesh background, cursor-tracking hover effects (`cursor-glow`), and staggered scroll-reveal animations using `IntersectionObserver` — avoiding layout shifts (CLS).

## ⚡ Performance & SEO Optimizations

Extensive engineering went into achieving high Lighthouse scores and search engine visibility:

1. **Critical Rendering Path (CRP):**
   * **Inlined Critical CSS:** Core structural and Hero section CSS is inlined in the `<head>` to ensure instantaneous First Contentful Paint (FCP) and eliminate render-blocking constraints.
   * **Deferred Assets:** Non-critical stylesheets (such as `devicon.min.css`) and JavaScript files are deferred (`media="print" onload="..."` and `defer` attribute) to prevent blocking the main thread.
   * **Font Preloading:** Arabic Google Fonts (Noto Sans Arabic) are preloaded to avoid Flash of Unstyled Text (FOUT) and eliminate delays during the initial render.

2. **Core Web Vitals (CWV):**
   * **LCP (Largest Contentful Paint):** Removed start-up animations (fade-ins with opacity 0) from the 'above-the-fold' Hero section, allowing it to render immediately.
   * **CLS (Cumulative Layout Shift):** Eliminated CSS `transform` properties during reveal animations, relying strictly on `opacity` to prevent elements from physically shifting during paint. Applied `contain: content` to sections to optimize browser repainting.

3. **Search Engine Optimization (SEO):**
   * **Semantic HTML:** Deeply nested, semantic HTML5 structure natively readable by bots.
   * **English-First Main Metadata:** Global metadata, title, and Open Graph tags default to English with `en_US` (primary) and `ar_SY` (alternate) to maximize global reach while retaining Arabic content dynamically.
   * **JSON-LD Structured Data:** Embedded Schema.org data for the `Person` type, detailing roles, skills, and links (GitHub, email) for rich Google search results.
   * **Cloudflare Email Obfuscation Fix:** Dynamically injecting `mailto:` links via JS to prevent Cloudflare from injecting its render-blocking `email-decode.min.js` onto the page.

## 🛡️ Security Hardening

In alignment with production-grade security standards, the following measures are implemented:

* **DNSSEC:** Fully enabled and signed to prevent DNS spoofing, hijacking, and cache poisoning.
* **Subresource Integrity (SRI):** External assets (e.g., `devicon.min.css`) are loaded with cryptographic hashes to ensure third-party scripts haven't been tampered with.
* **Automated Security Scanning:** Integrated **Gitleaks** to prevent credential leakage and **Dependabot** for automated vulnerability tracking in dependencies.
* **Edge Security:** Leveraging **Cloudflare WAF** and SSL/TLS 1.3 termination to mitigate DDoS threats and ensure encrypted transit.
* **Proactive Obfuscation:** Custom DOM injection for sensitive links (email/phone) to thwart automated scrapers without adding render-blocking overhead.

## 🔐 Infrastructure, Deployment & Security

The site is deployed via **GitHub Pages** with a custom domain (`shadimaani.me`), proxied through **Cloudflare** for edge caching and SSL termination.

* **DNS & Routing:** Managed via Cloudflare (`zita.ns.cloudflare.com`, `santino.ns.cloudflare.com`).
* **DNSSEC:** Enabled and signed, preventing DNS spoofing and cache poisoning.
* **SSL/TLS:** Handled automatically by Cloudflare with HTTP/2 enabled.
