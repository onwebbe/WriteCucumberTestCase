<template>
  <div class="viewTestCase container">
    <div class="testCase">
      <div class="label">Test Case Name:</div>
      <div>{{testCaseData.testCaseName}}</div>
    </div>
    <div class="testScenarios">
      <div v-for="testScenario in testCaseData.testScenarios" class="testScenario">
        <div class="label">Scenario: {{getTestScenario(testScenario.testScenarioId).testScenarioName}}</div>
        <div class="testSentences">
          <div v-for="(testSentence, idx) in getTestScenario(testScenario.testScenarioId).testSentences">
            <div>{{idx + 1}}. <span class="sentenceType">{{getType(getTestScenario(testScenario.testScenarioId), idx)}}</span> {{ getText(getTestSentence(testSentence)) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['testcaseid'],
  components: {
  },
  data () {
    return {
      testCaseData: {
        testCaseName: '',
        testScenarios: []
      },
      testSentenceList: []
    };
  },
  created: function () {
    if (this.testcaseid && this.testcaseid != null && this.testcaseid != '') {
      this.testCaseData = this.$root.getTestCaseByID(this.testcaseid);
    }
  },
  mounted: function () {
  },
  watch: {
    testcaseid: function () {
      if (this.testcaseid && this.testcaseid != null && this.testcaseid != '') {
        this.testCaseData = this.$root.getTestCaseByID(this.testcaseid);
      }
    }
  },
  methods: {
    getTestScenario: function (scenarioid) {
      var returnItem = this.$root.getTestScenarioByID(scenarioid);
      return returnItem;
    },
    getTestSentence: function (scenarioSentenceItem) {
      var scenarioSentenceId = scenarioSentenceItem.scenarioSentenceId;
      var sentenceID = scenarioSentenceItem.sentenceId;
      var sentenceObject = JSON.parse(JSON.stringify(this.$root.getTestSentenceByID(sentenceID)));
      var finalParamters = [];
      for (let j = 0; j < sentenceObject.parameters.length; j++) {
        var sentenceParameter = JSON.parse(JSON.stringify(sentenceObject.parameters[j]));
        for (let k = 0; k < scenarioSentenceItem.paramterValues.length; k++) {
          var scenarioParameter = scenarioSentenceItem.paramterValues[k];
          if (sentenceParameter.parameterIndex == scenarioParameter.parameterIndex) {
            sentenceParameter.parameterValue = scenarioParameter.parameterValue;
          }
        }
        finalParamters.push(sentenceParameter);
      }
      sentenceObject.parameters = finalParamters;
      sentenceObject.scenarioSentenceId = scenarioSentenceId;

      return sentenceObject;
    },
    getText: function (item) {
      return this.$root.getSentenceText(item);
    },
    getType: function (testScenario, idx) {
      var sentenceObjList = [];
      for (var i = 0; i < testScenario.testSentences.length; i++) {
        var sentenceID = testScenario.testSentences[i].sentenceId;
        sentenceObjList.push(this.$root.getTestSentenceByID(sentenceID));
      }
      return this.$root.getSentenceType(sentenceObjList, idx);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css">
@import '../../node_modules/bulma';
$fa-font-path: '../../node_modules/font-awesome/fonts/';
@import '../../node_modules/font-awesome/scss/font-awesome';
.testCase, .testScenarios {
  margin-bottom: 25px;
}
.viewTestCase .label {
  font-size: 1.3rem;
}
.viewTestCase .testScenario {
  margin-top: 15px;
}
</style>
