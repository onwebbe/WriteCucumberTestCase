<template>
  <div class="cucumberCasesMain container">
    <div class="columns summaryCardContainer">
      <div class="column summaryCard">
        <div>
          Total Cases:
        </div>
        <div class="totalCases">
        </div>
      </div>
      <div class="column summaryCard">
        <div>
          Total Test Sentence:
        </div>
        <div class="totalTestSentence">
        </div>
      </div>
      <div class="column">
        <div>
          Total Test Scenario:
        </div>
        <div class="totalTestScenario">
        </div>
      </div>
    </div>
    <div>
      <div class="tabs TestSummaryContentTabs">
        <ul>
          <li class="is-active" @click="tabClicked(1)"><a>Test Cases</a></li>
          <li @click="tabClicked(2)"><a>Test Scenarios</a></li>
          <li @click="tabClicked(3)"><a>Test Sentences</a></li>
        </ul>
      </div>
    </div>
    <div>
      <div class="columns">
        <div class="column is-three-quarters">
          <span class="control has-icons-left">
            <input class="input" type="text" placeholder="search">
            <span class="icon is-left">
              <span class="fas fa-search" aria-hidden="true"></span>
            </span>
          </span>
        </div>
        <div class="column" style="line-height: 40px;">
          10 / 40
        </div>
        <div class="column">
          <a class="button is-success is-outlined" style="display:inline-block;" @click="addButton">
            <span class="icon">
              <span class="fas fa-plus-circle"></span>
            </span>
            <span>Add New</span>
          </a>
        </div>
      </div>
      <div>
        <div class="columns cardContainer is-multiline">
          <div class="column is-half">
            <test-card></test-card>
          </div>
          <div class="column is-half">
            <test-card></test-card>
          </div>
          <div class="column is-half">
            <test-card></test-card>
          </div>
          <div class="column is-half">
            <test-card></test-card>
          </div>
          <div class="column is-half">
            <test-card></test-card>
          </div>
          <div class="column is-half">
            <test-card></test-card>
          </div>
        </div>
      </div>
    </div>
    <div class="">
    </div>
  </div>
</template>

<script>
import Card from './TestCard';
export default {
  components: {
    'test-card': Card
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    tabClicked: function (idx) {
      $('.tabs.TestSummaryContentTabs li').removeClass('is-active');
      $($('.tabs.TestSummaryContentTabs li')[idx - 1]).addClass('is-active');
    },
    addButton: function () {
      var id = this.$root.generateNewTestCaseID();
      var testCaseObj = {
        'id': id,
        'testCaseName': '',
        'relatedBIs': [],
        'testScenarios': []
      }
      this.$root.setTestCase(testCaseObj);
      this.$router.push({
        name: 'AddNewTestCase', params: {
          testcaseid: id,
          isUpdate: false
        }
      });
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css">
@import '~bulma';
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome';
.summaryCard {
  height: 200px;
}
.totalCases {
  background-color: $cyan;
  width: 100%;
  height: 100%;
}
.totalTestSentence {
  background-color: $yellow;
  width: 100%;
  height: 100%;
}
.totalTestScenario {
  background-color: $turquoise;
  width: 100%;
  height: 100%;
}

.card-header-title {
  font-size: 1rem;
}
.cardContainer .card .card-footer .buttonIcon {
  padding-right: 10px;
}
.cardContainer .card .hideContent {
  display: none;
}
.TestSummaryContentTabs {
  margin-bottom: 1.2rem;
}
</style>
