<template>
  <div class="cucumberTestCard">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          Component
        </p>
      </header>
      <div class="card-content hideContent">
        <div class="content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
          <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
          <br>
          <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
        </div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item" @click="showHideItem">
          <span class="buttonIcon fas fa-eye" aria-hidden="true"></span>
          Show Detail
        </a>
        <a href="#" class="card-footer-item">
          <span class="buttonIcon fas fa-edit" aria-hidden="true"></span>
          Edit
        </a>
        <a href="#" class="card-footer-item">
          <span class="buttonIcon fas fa-trash" aria-hidden="true"></span>
          Delete
        </a>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    showHideItem: function () {
      console.log();
      $(this.$el).find('.card-content').toggleClass('hideContent');
      if ($(this.$el).find('.card-content').hasClass('hideContent')) {
        $($(this.$el).find('.card-footer .buttonIcon')[0]).removeClass('fa-eye');
        $($(this.$el).find('.card-footer .buttonIcon')[0]).removeClass('fa-eye-slash');
        $($(this.$el).find('.card-footer .buttonIcon')[0]).addClass('fa-eye');
      } else {
        $($(this.$el).find('.card-footer .buttonIcon')[0]).removeClass('fa-eye');
        $($(this.$el).find('.card-footer .buttonIcon')[0]).removeClass('fa-eye-slash');
        $($(this.$el).find('.card-footer .buttonIcon')[0]).addClass('fa-eye-slash');
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css">
@import '~bulma';
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome';
.card-header-title {
  font-size: 1rem;
}
.cardContainer.columns {
  flex-wrap: wrap;
}
.cardContainer .card .card-footer .buttonIcon {
  padding-right: 10px;
}
.cardContainer .card .hideContent {
  display: none;
}
</style>
