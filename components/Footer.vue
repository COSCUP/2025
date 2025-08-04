<script setup lang="ts">
import { conference } from '#data/conference.js'
</script>

<template>
  <footer id="footer">
    <div class="footer-container">
      <div class="footer-main">
        <div class="footer-title">
          <h1>COSCUP x RubyConf Taiwan 2025</h1>
          <p>Conference for Open Source Coders,<br>Users, and Promoters</p>
          <a
            href="https://secretary.coscup.org/subscribe/coscup?_gl=1*4tjk22*_ga*MTkwMjczNjU5OS4xNzQxMDUzODIy*_ga_C9EMTMDSS1*czE3NTM3MDczMzgkbzE1JGcwJHQxNzUzNzA3MzQxJGo1NyRsMCRoMA.."
            rel="noopener"
            target="_blank"
          >
            <button class="newsletter-btn">
              訂閱電子報
            </button>
          </a>
        </div>
        <div class="footer-social">
          <a href="https://www.facebook.com/coscup">
            <IconFaBrandsFacebookSquare />
          </a>
          <a href="https://blog.coscup.org">
            <IconFaBrandsBlogger />
          </a>
          <a href="https://www.facebook.com/coscup">
            <IconFaBrandsFacebookSquare />
          </a>
          <a href="https://www.flickr.com/photos/coscup">
            <IconFaBrandsFlickr />
          </a>
          <a href="https://twitter.com/coscup">
            <IconFaBrandsTwitterSquare />
          </a>
          <a href="https://floss.social/@COSCUP">
            <IconFaBrandsMastodon />
          </a>
          <a href="https://www.youtube.com/user/thecoscup">
            <IconFaBrandsYoutubeSquare />
          </a>
          <a href="https://t.me/coscupchat">
            <IconFaBrandsTelegram />
          </a>
        </div>
        <div class="footer-social">
          <a href="https://coscup.medium.com/">
            <IconFaBrandsMedium />
          </a>
        </div>
      </div>
      <div class="footer-links">
        <div class="footer-section">
          <h2>活動</h2>
          <a href="#">議程表</a>
          <a href="#">會場狀況</a>
          <a href="#">交通</a>
          <a href="#">會場地圖</a>
          <a href="#">贊助</a>
          <a href="#">周邊活動</a>
        </div>
        <div class="footer-section">
          <h2>資源</h2>
          <a href="#">部落格</a>
          <a href="#">關於我們</a>
          <a href="#">社群守則</a>
          <a href="#">工作人員</a>
          <a href="#">贊助方案</a>
          <a href="#">個人贊助</a>
        </div>
        <div class="footer-section">
          <h2>聯絡</h2>
          <div>
            <p><strong>會眾服務</strong></p>
            <a href="mailto:attendee@coscup.org">attendee@coscup.org</a>
          </div>
          <div>
            <p><strong>贊助合作</strong></p>
            <a href="mailto:sponsorship@coscup.org">sponsorship@coscup.org</a>
          </div>
          <div>
            <p>
              <strong>
                議程投稿
              </strong>
            </p>
            <a href="mailto:program@coscup.org">program@coscup.org</a>
          </div>
          <div>
            <p><strong>行銷方案</strong></p>
            <a href="mailto:marketing@coscup.org">marketing@coscup.org</a>
          </div>
        </div>
        <div class="footer-section">
          <h2>歷年網站</h2>
          <div class="footer-years">
            <a
              v-for="year in Array.from({ length: conference.year - 2006 }, (_, k) => k + 2006)"
              :key="year"
              :href="`https://coscup.org/${year}`"
              target="_blank"
            >{{ year }}</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
#footer {
  background: #f7f8fa;
  color: rgb(77, 76, 76);
  font-size: 16px;
  padding: 40px 20px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 48px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-main {
  flex: 1 1 300px;
  min-width: 280px;
}

.footer-title h1 {
  font-size: 20px;
  color: var(--vp-c-brand-1);
  margin-bottom: 12px;
}

.footer-title p {
  font-size: 14px;
  margin-bottom: 10px;
}

.newsletter-btn {
  background: #fafaff;
  border: 1px solid #a2a2a2;
  border-radius: 6px;
  padding: 4px 16px;
  cursor: pointer;
  margin: 12px 0;
}

.footer-social {
  margin-top: 18px;
  display: flex;
  gap: 12px;
}

.footer-links {
  display: flex;
  flex: 2 1 600px;
  gap: 36px;
  flex-wrap: wrap;
  min-width: 300px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  min-width: 120px;
  gap: 8px;
}

.footer-section h2 {
  font-size: 15px;
  color: var(--vp-c-brand-1);
  margin-bottom: 10px;
  font-weight: 700;
}

.footer-years {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13px;
}
</style>
