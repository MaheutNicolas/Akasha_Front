<script setup>
const intro = {
    title: "AKASHA",
    subtitle: "Tramis Strata - Compendium magique",
    text: "Aux origines du monde, des tissages magiques appelés Strata ont façonné la réalité. Akasha, la plus simple à explorer d'entre elle, porte la magie elle-même. Équipé d'un Terminal transmis par les mages, vous plongez dans ses nœuds pour décrypter, fragment après fragment, les messages qu'elles souhaitent transmettre."
}
const CTA = "Entrer dans Akasha";
const note = "Votre aventure se déroule entièrement à travers un terminal magique. Seul face à la machine, vous devrez faire preuve d'ingéniosité pour résoudre de petites énigmes, déchiffrer des indices et avancer toujours plus loin dans l'exploration de cet univers mystérieux. Pour mener à bien votre quête, vous pourrez vous aider de :";
const tips = {
    title: "Explorer librement, avancer par vous-même",
    cards: [
        {
            icon: "◈",
            title: "Exploration libre", 
            text: "Vous pouvez parcourir Akasha sans autre but que la découverte : suivre les chemins, observer les nœuds, ressentir l'atmosphère du monde. Aucune limite de temps, aucune pression."
        },
        {
            icon: "✎",
            title: "Notes personnelles requises", 
            text: "Pour percer les mystères les plus profonds et atteindre la fin du jeu, vous devrez tenir vos propres notes ( coordonnées, runes décodées, indices glanés ). Le jeu ne les conserve pas pour vous : carnet papier, fichier texte ou tout autre support fera l'affaire."
        }
    ]
}

const footer = "Ce projet est une réalisation personnelle développée avec l'aide de l'intelligence artificielle, notamment pour la génération de certains visuels. L'univers et le game design restent conçus et écrits à la main."

</script>

<template>
  <header class="header">
    <nav class="header__nav">
      <RouterLink to="/" class="header__logo">AKASHA</RouterLink>
        <div class="header__main">
           <span></span>
           <RouterLink to="/login">Se connecter</RouterLink>
        </div>
    </nav>
  </header>

  <div class="landing">
    <section class="landing__hero">
      <p class="landing__prompt">~/akasha<span class="landing__cursor">_</span></p>
      <h1 class="landing__title">{{ intro.title }}</h1>
      <p class="landing__tagline">{{ intro.subtitle }}</p>
      <p class="landing__intro">
        {{ intro.text }}
      </p>
      <RouterLink to="/login" class="landing__cta">
        <span>{{ CTA }}</span>
        <span class="landing__cta-arrow">→</span>
      </RouterLink>
    </section>

    <section class="landing__note">
      <p class="landing__intro">
        {{ note }}
      </p>
    </section>

    <section class="landing__tips">
      <h2 class="landing__section-title">{{ tips.title }}</h2>
      <div class="landing__features">
        <article class="landing__feature" v-for="card in tips.cards">
          <span class="landing__feature-icon">{{ card.icon }}</span>
          <h3 class="landing__feature-title">{{ card.title }}</h3>
          <p class="landing__feature-text">
           {{ card.text }}
          </p>
        </article>
      </div>
    </section>

    <section class="landing__disclaimer">
      <p>
        {{ footer }}
      </p>
    </section>
  </div>
</template>