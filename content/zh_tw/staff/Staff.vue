<script setup lang="ts">
import { data } from '#loaders/staff.data'

const { staffData } = data
</script>

<template>
  <main id="staff">
    <div
      v-for="(staff, index) in staffData"
      :key="staff.tid"
      class="group-section"
      :class="`group-section-${index % 2}`"
    >
      <section class="group-content">
        <h2 class="group-name">
          {{ staff.group.zh_tw }}
        </h2>
        <div class="member-grid">
          <div
            v-for="member in staff.members"
            :key="member.name"
            class="member-card"
          >
            <img
              :alt="member.name"
              class="avatar"
              :src="`https://www.gravatar.com/avatar/${member.email_hash}?s=320&d=identicon&r=g&d=https://volunteer.coscup.org/img/nonavatar.png`"
            >
            <span class="name">{{ member.name }}</span>
          </div>
        </div>
      </section>
    </div>
    <div class="group-section group-section-0">
      <section class="group-content">
        <h2 class="group-name">
          歡迎加入志工團隊
        </h2>
        <article class="markdown">
          <p>
            每一次的活動都需要志工夥伴貢獻專長來讓活動順利進行，如果對 COSCUP 有服務的熱誠，歡迎來
            <a
              href="https://volunteer.coscup.org"
              target="_blank"
            >
              報名加入志工
            </a>
          </p>
        </article>
      </section>
    </div>
  </main>
</template>

<style scoped>
.group-section {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 3rem 1rem;
  box-sizing: border-box;
}

.group-section-1 {
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
}

.group-content {
  max-width: 1200px;
  margin: auto;
  padding: 0 5rem;
}

.group-name {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  margin-top: 0;
  border-top: none;
  padding-top: 0;
}

.member-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.member-card {
  text-align: center;
  width: 120px;
}

.avatar {
  width: 100%;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  border: 2px solid #eee;
  background-color: #eee;
  padding: 3px;
  aspect-ratio: 1;
}

.name {
  display: block;
  margin-top: 0.5rem;
  font-size: 1rem;
}

.markdown a {
  color: var(--vp-c-brand-3);
}

@media (max-width: 768px) {
  .member-card {
    width: 100px;
  }

  .group-content {
    padding: 0 3rem;
  }
}

@media (max-width: 480px) {
  .member-card {
    width: 80px;
  }

  .group-content {
    padding: 0 1.5rem;
  }
}

@media (max-width: 360px) {
  .member-card {
    width: 60px;
  }

  .group-content {
    padding: 0 0.5em;
  }
}
</style>
