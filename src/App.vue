<template>
  <div id="app">
    <div class="headerMenuContainer">
      <cucumber-navbar></cucumber-navbar>
    </div>
    <div class="contentContainer">
      <router-view/>
    </div>
  </div>
</template>

<script>
import navBarHeader from '@/components/headerNavBar';
export default {
  name: 'App',
  components: {
    'cucumber-navbar': navBarHeader
  }
};
</script>

<style lang="scss" type="text/css">
/*@import './assets/style/bulma/bulma.sass';
@import './assets/style/bulma/sass/utilities/initial-variables.sass';*/
@import '~bulma';
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome';
.far, .fab, .fas {
  font-family: 'FontAwesome'
}
.dropdown-item {
  cursor: pointer;
}
.dropdown.is-danger .dropdown-trigger button {
  border-color: $red;
}
.inputNameLabel {
  font-size: $size-5;
}
.pageTitle {
  font-size: $size-3;
  font-weight: bold;
}
.validationError {
  color: $danger;
  font-size: 0.8rem;
}
@keyframes dragItemDisapearAnimationKeyFrames
{
  from  { 
          opacity: 1;
        }
  to {
          opacity: 0.2;
          background-color: $white-ter;
          /* height: 0px;
          margin-top: 0px;
          margin-bottom: 0px;
          padding-top: 0px;
          padding-bottom: 0px;
          display: none; */
     }
}
.dragItemDisapearAnimation {
  animation: dragItemDisapearAnimationKeyFrames 0.5s;
  animation-fill-mode: both;
}
.sentenceType {
  color: $turquoise;
}
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
