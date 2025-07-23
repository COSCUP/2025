<script setup lang="ts">
import coscupLogo from '#assets/icons/logo.svg'
import banner from '#assets/images/banner.png'
import CButton from '#components/CButton.vue'
import { eventData } from '#data/home.js'
</script>

<template>
  <div class="home-container">
    <div class="banner-container">
      <img
        alt="COSCUP 2025 Banner"
        class="banner-image"
        :src="banner"
      >
    </div>

    <div class="activity-section">
      <div class="activity-content">
        <div class="activity-header">
          <img
            alt="COSCUP"
            class="title-logo"
            :src="coscupLogo"
          >
          <h2 class="activity-title">
            COSCUP 2025 會場活動
          </h2>
          <p class="activity-subtitle">
            除了豐富的議程，今年 COSCUP 也規劃了「會眾服務」、「會前派對」等活動，<br>
            讓你在會場也能享受交流與放鬆時光。
          </p>
        </div>

        <div class="cards-grid">
          <HomeCard
            v-for="eventInfo in eventData"
            :key="eventInfo.title"
            :info="eventInfo"
          />
        </div>
      </div>
    </div>

    <div class="about-coscup-section">
      <div class="about-content">
        <div class="about-coscup">
          <h2>關於 COSCUP</h2>
          <p>COSCUP 是一場開放原始碼愛好者的年度大聚會，從 2006 年開始由社群自發舉辦。<br>歡迎開發者、使用者和推廣者一起參加，交流技術、分享經驗，推動自由軟體理念！</p>
          <a href="/2025/about">閱讀更多 →</a>
        </div>

        <div class="two-cards-section">
          <div class="card-deck">
            <div class="info-card">
              <h3>❤️ 贊助 COSCUP</h3>
              <p>COSCUP 過去三年平均約有超過 3,000 人次的會眾和超過 20 個開源技術或議題社群一同參與，同時也有與超過 7 個國際的開源社群或組織連結合作。</p>
              <div class="button-group">
                <CButton disabled>
                  即將開啟
                </CButton>
              </div>
            </div>
            <div class="info-card">
              <h3>📄 訂閱電子報</h3>
              <p>如果你怕忘記參加活動，可以訂閱 COSCUP 活動電子報，不錯過最新活動訊息！</p>
              <CButton
                href="https://secretary.coscup.org/subscribe/coscup"
                tag="a"
                target="_blank"
              >
                訂閱
              </CButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="about-rubyconf-section">
      <div class="about-content">
        <div class="about-rubyconf">
          <h2>關於 RubyConf TW</h2>
          <p>RubyConf Taiwan —— 台灣唯一的年度 Ruby 程式語言國際研討會，由 Ruby Taiwan 社群主辦，陸續已累積九屆的活動成績，每年有百位 Ruby 開發者遠從海外而來，是國際 Ruby 社群的一大盛事，也是亞洲地區除日本以外唯一被 Ruby 之父松本行弘推薦的 Ruby 程式語言年會。</p>
          <CButton
            href="/2025/sessions"
            tag="a"
            target="_blank"
          >
            查看議程
          </CButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  background-color: #ffffff;
}

.banner-container {
  position: relative;
}

.banner-image {
  width: 100%;
  object-fit: cover;
}

.activity-section {
  background: linear-gradient(to bottom, #7f73fe, #7f73fec8), url('../../../assets/images/activity-bg.jpg');
  background-size: cover;
  background-position: center;
  padding-top: 4rem;
  padding-bottom: 4rem;
  position: relative;
}

.activity-content {
  max-width: 80rem; /* 1280px */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.activity-header {
  text-align: center;
}

.activity-title {
  font-size: 2rem; /* 36px */
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #ffffff;
  text-align: left;
}

.activity-subtitle {
  margin-top: 1.5rem;
  font-size: 1.125rem; /* 18px */
  line-height: 1.75;
  color: #ffffff;
  text-align: left;
}

.cards-grid {
  margin-top: 3rem;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.cards-grid::-webkit-scrollbar {
  display: none;
}

@media (min-width: 425px) {
  .activity-title {
    font-size: 2.25rem; /* 36px */
  }
}

/* Responsive styles */
@media (min-width: 747px) {
  .activity-section {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
  .activity-title {
    font-size: 2.5rem; /* 40px */
  }
}

@media (min-width: 1024px) {
  .activity-content {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.about-coscup-section {
  background-color: #f3f4f6;
  padding: 4rem 1.5rem;
}

.about-rubyconf-section {
  background-color: #fff0f5;
  padding: 4rem 1.5rem;
}

@media (min-width: 1024px) {
  .about-coscup-section {
    padding: 4rem 2rem;
  }

  .about-rubyconf-section {
    padding: 4rem 2rem;
  }
}

.about-content {
  max-width: 80rem;
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.about-coscup,
.about-rubyconf {
  text-align: left;
  margin-bottom: 4rem;
}

@media (min-width: 1024px) {
  .about-coscup,
  .about-rubyconf {
    width: 60%;
  }
}

.about-coscup h2,
.about-rubyconf h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.about-coscup p,
.about-rubyconf p {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.75;
  margin-bottom: 1.5rem;
}

.about-coscup a {
  color: #7f73fe;
  text-decoration: none;
  font-weight: 600;
}

.two-cards-section {
  margin-bottom: 4rem;
}

.card-deck {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.info-card {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
}

.info-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.info-card p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.button {
  margin-top: auto;
}

@media (min-width: 768px) {
  .card-deck {
    grid-template-columns: repeat(2, 1fr);
  }
}

.title-logo {
  margin-bottom: 1rem;
  height: 1.8rem;
}

.activity-header .title-logo {
  filter: brightness(1000%);
}
</style>
