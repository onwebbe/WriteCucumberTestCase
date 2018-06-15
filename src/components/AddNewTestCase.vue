<template>
  <div class="addNewTestCaseMain container">
    <div class="pageTitle">
      {{isUpdate?'Update':'Create'}} Test Case
    </div>
    <div>
      <div class="inputNameLabel">
        Please input the test case name
      </div>
      <input class="input" :class="{'is-danger' : nameValidationError}" type="text" placeholder="Text input" v-model.lazy="testCaseObj.testCaseName">
    </div>
    <div class="columns testCaseContent">
      <div class="column">
        <a class="button is-success is-outlined" style="display:inline-block;" @click="addNewScenario">
          <span class="icon">
            <span class="fas fa-plus-circle"></span>
          </span>
          <span>Add New Test Senario</span>
        </a>
      </div>
    </div>
    <div class="columns">
      <div class="column is-half">
        <div class="setenceList" style="width: 80%;">
          <div class="listItem" v-for="scenarioObj in testScenarioList" v-bind:key="scenarioObj.id">
            <a class="button is-link is-inverted" @click="editScenario(scenarioObj.id)">
              <span class="icon is-small">
                <span class="fas fa-edit"></span>
              </span>
            </a>
            <div class="listDataTitle">
              {{scenarioObj.testScenarioName}}
            </div>
            <div class="actionColumn level-right" @click="addScenarioToList(scenarioObj.id)">
              <a class="button is-success">
                <span>Add</span>
                <span class="icon is-small">
                  <span class="fas fa-chevron-right"></span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half resultTestSentence">
        <selectedScenarioList :testCaseId="testcaseid" :scenarioList="testCaseObj.testScenarios" @scenariodeleted="deleteScenario"></selectedScenarioList>
      </div>
    </div>
    <div class="buttonColumn">
      <a class="button is-link is-outlined" @click="cancel">
        <span class="icon is-small">
          <span class="fas fa-arrow-left"></span>
        </span>
        <span>Back</span>
      </a>
      &nbsp;&nbsp;&nbsp;
      <a class="button is-success is-outlined" @click="done">
        <span class="icon is-small">
          <span class="fas fa-check"></span>
        </span>
        <span>Done</span>
      </a>
    </div>
  </div>
</template>

<script>
import ScenarioList from '@/components/TestScenarioInTestCase';
export default {
  props: ['testcaseid', 'isUpdate'],
  components: {
    'selectedScenarioList': ScenarioList
  },
  data () {
    return {
      isByPassValidate: false,
      testScenarioList: [],
      testCaseObj: {
        'testCaseName': '',
        'relatedBIs': [],
        'testScenarios': []
      },
      nameValidationError: false

      /* {
        id: '1',
        text: 'a',
        index: 1
      } */
    };
  },
  created: function () {
    this.testScenarioList = this.$root.convertTestScenarioToArray();
    var testCaseObj = this.$root.getTestCaseByID(this.testcaseid);
    if (this.testcaseid == null || testCaseObj == null) {
      this.isByPassValidate = true;
      this.$router.replace('/');
    } else {
      this.testCaseObj = testCaseObj;
    }
    this.$watch('testCaseObj.testCaseName', function (newVal) {
      if (newVal == null || newVal == '') {
        this.nameValidationError = true;
      } else {
        this.nameValidationError = false;
        this.$root.setTestCase(this.testCaseObj);
      }
    });
  },
  mounted: function () {
  },
  methods: {
    addNewScenario: function () {
      var id = this.$root.generateNewTestScenarioID();
      this.testScenarioObj = {
        'id': id,
        'scenarioName': '',
        'testSentences': []
      };
      this.$root.data.testScenario[this.testScenarioObj.id] = this.testScenarioObj;
      this.$router.push({
        name: 'AddNewTestScenario',
        params: {
          scenarioId: id,
          isUpdate: false
        }
      });
    },
    addScenarioToList: function (scenarioId) {
      var caseScenarioId = this.testCaseObj.testScenarios.length + 1;
      caseScenarioId = caseScenarioId + '' + parseInt(Math.random() * 10000);
      var scenarioInCaseObj = {
        'testScenarioId': scenarioId,
        'caseScenarioId': caseScenarioId
      };
      this.testCaseObj.testScenarios.push(scenarioInCaseObj);
      this.$root.setTestCase(this.testCaseObj);
    },
    deleteScenario: function (params) {
      var scenarioId = params.scenarioId;
      var caseScenarioId = params.caseScenarioId;
      var testScenarios = this.testCaseObj.testScenarios;
      for (var i = 0; i < testScenarios.length; i++) {
        var testScenario = testScenarios[i];
        if (testScenario.testScenarioId == scenarioId && testScenario.caseScenarioId == caseScenarioId) {
          testScenarios.splice(i, 1);
          break;
        }
      }
      this.$root.setTestCase(this.testCaseObj);
    },
    editScenario: function (scenarioId) {
      this.$router.push({
        name: 'AddNewTestScenario',
        params: {
          scenarioId: scenarioId,
          isUpdate: true
        }
      });
    },
    mandatoryValidationCheck: function () {
      if (this.isByPassValidate) {
        return true;
      } else {
        var validationPass = true;
        if (this.testCaseObj.testCaseName == '' || this.testCaseObj.testCaseName == null) {
          this.nameValidationError = true;
          validationPass = false;
        }
        return validationPass;
      }
    },
    cancel: function () {
      if (this.isUpdate == false) {
        this.$root.deleteTestCase(this.testCaseObj);
      }
      this.isByPassValidate = true;
      this.$router.go(-1);
    },
    done: function () {
      this.$root.setTestCase(this.testCaseObj);
      this.$router.go(-1);
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.mandatoryValidationCheck()) {
      this.isByPassValidate = true;
      next();
    } else {
      this.isByPassValidate = true;
      next(false);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css">
@import '../../node_modules/bulma';
$fa-font-path: '../../node_modules/font-awesome/fonts/';
@import '../../node_modules/font-awesome/scss/font-awesome';
.addNewTestCaseMain .testCaseContent {
  padding-top: 20px;
  margin-bottom: 0px;
}
.addNewTestCaseMain .testCaseContent .resultTestSentence {
}
.addNewTestCaseMain .list {
  border-top: 1px solid $grey-light;
  border-right: 1px solid $grey-light;
  border-left: 1px solid $grey-light;
}
.setenceList .listItem {
  height: 60px;
  border-bottom: 1px solid $grey-light;
  display: flex;
  align-items: center;
  position: relative;
}
.setenceList .listItem .listDataTitle {
  margin-top: 0px;
  margin-bottom: 0px;
  padding-left: 20px;
}
/*.setenceList .listItem:hover {
  background-color: $white-ter;
}*/
.setenceList .listItem.active {
  background-color: $white-ter;
}
.setenceList .listItem .actionColumn {
  min-width: 80px;
  width: 80px;
  position: absolute;
  right: 10px;
}

</style>
