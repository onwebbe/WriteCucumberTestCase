<template>
  <div class="cucumberTestCard">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          Test Case: {{testcase.id}}
        </p>
      </header>
      <div class="card-content hideContent">
        <div class="content">
          {{testcase.testCaseName}}
          <br/>
          Test scenario count: {{testcase.testScenarios == null? '' : testcase.testScenarios.length}}
        </div>
      </div>
      <footer class="card-footer">
        <a class="card-footer-item" @click="showHideItem">
          <span class="buttonIcon fas fa-eye" aria-hidden="true"></span>
          Show Detail
        </a>
        <a class="card-footer-item" @click="editTestCase">
          <span class="buttonIcon fas fa-edit" aria-hidden="true"></span>
          Edit
        </a>
        <a class="card-footer-item">
          <span class="buttonIcon fas fa-trash" aria-hidden="true"></span>
          Delete
        </a>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: ['testcase'],
  data () {
    return {
    };
  },
  methods: {
    editTestCase: function () {
      this.$router.push({
        name: 'AddNewTestCase',
        params: {
          testcaseid: this.testcase.id,
          isUpdate: true
        }
      });
    },
    showHideItem: function () {
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
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css">
@import '../../node_modules/bulma';
$fa-font-path: '../../node_modules/font-awesome/fonts/';
@import '../../node_modules/font-awesome/scss/font-awesome';
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
