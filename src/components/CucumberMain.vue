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
          <div class="column is-half" v-for="testCase in testCaseList" :key="testCase.id">
            <test-card @viewTestCase="viewTestCase" :testcase="testCase"></test-card>
          </div>
        </div>
      </div>
    </div>
    <div class="">
    </div>
    <div class="viewDetailPopup modal" :class="{'is-active': viewDetailPopup}">
      <div class="modal-background"></div>
      <div class="modal-content" style="background-color: white;max-height: 80%;height: 80%;">
        <div class="dialogHeader" style="height: 40px;line-height: 40px;border-bottom: 1px solid black;text-align: center;font-size:1.5rem; font-weight: bold;">
          View Test Case
          <span style="float:right;margin-right: 10px;">
            <button @click="hideViewDetail" class="modal-close is-danger is-large" aria-label="close" style="position:relative;top:5px;right:0px;"></button>
          </span>
        </div>
        <div class="dialogContent" style="overflow-y: auto;height: calc( 100% - 45px );padding: 20px;">
          <view-panel :testcaseid='viewDetailTestcaseID'></view-panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './TestCard';
import ViewTestCase from './ViewTestCase';
export default {
  components: {
    'test-card': Card,
    'view-panel': ViewTestCase
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      testCaseList: [],
      viewDetailPopup: false,
      viewDetailTestcaseID: ''
    };
  },
  created: function () {
    this.testCaseList = this.$root.convertTestCaseToArray();
  },
  methods: {
    viewTestCase: function (params) {
      this.viewDetailTestcaseID = params.testcase.id;
      this.viewDetailPopup = true;
      var that = this;
      setTimeout(function () {
        that.viewDetailTestcaseID = '';
      }, 200);
    },
    hideViewDetail: function () {
      this.viewDetailPopup = false;
    },
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
      };
      this.$root.setTestCase(testCaseObj);
      this.$router.push({
        name: 'AddNewTestCase',
        params: {
          testcaseid: id,
          isUpdate: false
        }
      });
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css">
@import '../../node_modules/bulma';
$fa-font-path: '../../node_modules/font-awesome/fonts/';
@import '../../node_modules/font-awesome/scss/font-awesome';
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
.viewDetailPopup .dialogHeader .delete:before, 
.viewDetailPopup .dialogHeader .modal-close:before, 
.viewDetailPopup .dialogHeader .delete:after, 
.viewDetailPopup .dialogHeader .modal-close:after {
  background-color: red;
}
.viewDetailPopup .dialogHeader .modal-close:focus,
.viewDetailPopup .dialogHeader .modal-close:hover {
  background: none;
}
</style>
