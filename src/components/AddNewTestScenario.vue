<template>
  <div class="addNewTestScenarioMain container">
    <div class="pageTitle">
      {{isUpdate?'Update':'Create'}} Test Scenario
    </div>
    <div>
      <div>
        Please input the test scenar name
      </div>
      <input class="input" :class="{'is-danger' : nameValidationError}" type="text" placeholder="Text input" v-model.lazy="testScenarioObj.testScenarioName">
    </div>
    <div class="columns testSentenceContent">
      <div class="column">
        Category: <dropDownMenu :dropDownListItem="setenceCategoryList" @itemSelected="categoryDropdownSelected"></dropDownMenu>
        <a class="button is-success is-outlined" style="display:inline-block;margin-left: 20px;" @click="addNewSentence">
          <span class="icon">
            <span class="fas fa-plus-circle"></span>
          </span>
          <span>Add New Sentence</span>
        </a>
      </div>
    </div>
    <div class="columns">
      <div class="column is-half">
        <div class="setenceList" style="width: 80%;">
          <div class="listItem" v-for="sentenceObj in sentenceList" v-bind:key="sentenceObj.id">
            <a class="button is-link is-inverted" @click="editSentenceBase(sentenceObj.id)">
              <span class="icon is-small">
                <span class="fas fa-edit"></span>
              </span>
            </a>
            <div class="listDataTitle">
              {{sentenceObj.text}}
            </div>
            <div class="actionColumn level-right">
              <a class="button is-success" @click="addSentenceToList(sentenceObj.id)">
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
        <selectedSentenceList :scenarioId="scenarioId" :sentenceList="testScenarioObj.testSentences" @sentenceDeleted="sentenceDeleted"></selectedSentenceList>
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
import DropDownMenu from '@/components/BulmaDropDown';
import SentenceList from '@/components/TestSentenceInTestScenario';
export default {
  props: ['scenarioId', 'isUpdate'],
  components: {
    'dropDownMenu': DropDownMenu,
    'selectedSentenceList': SentenceList
  },
  data () {
    return {
      setenceCategoryList: [],
      sentenceList: [],
      testScenarioObj: {
        testScenarioName: '',
        testSentences: []
      },
      nameValidationError: false,
      isByPassValidate: false
      /* {
        id: '1',
        text: 'a',
        index: 1
      } */
    };
  },
  created: function () {
    this.sentenceList = this.$root.convertTestSentenceToArray();
    var scenarioObj = this.$root.getTestScenarioByID(this.scenarioId);
    if (this.scenarioId == null || scenarioObj == null) {
      this.isByPassValidate = true;
      this.$router.push('/');
    } else {
      this.testScenarioObj = scenarioObj;
    }
    this.setenceCategoryList = this.$root.getSentenceCategoryList();
    var defaultCategory = {'value': '', 'label': 'All Cases'};
    this.setenceCategoryList.splice(0, 0, defaultCategory);
    this.$watch('testScenarioObj.testScenarioName', function (newVal) {
      if (newVal == null || newVal == '') {
        this.nameValidationError = true;
      } else {
        this.nameValidationError = false;
        this.$root.setTestScenario(this.testScenarioObj);
      }
    });
  },
  mounted: function () {
  },
  watch: {
  },
  methods: {
    addNewSentence: function () {
      var id = this.$root.generateNewTestSentenceID();
      var sentenceObj = {
        'id': id,
        'text': '',
        'category': '',
        'previewText': '',
        'parameters': []
      };
      this.$root.data.testSentence[id] = sentenceObj;
      this.$router.push({
        name: 'AddNewSentence',
        params: {
          sentenceId: id,
          scenarioId: -1,
          scenarioSentenceId: -1,
          isUpdate: false
        }
      });
    },
    categoryDropdownSelected: function (value) {
      this.sentenceList = [];
      var allTestSentences = this.$root.convertTestSentenceToArray();
      if (value == null || value == '') {
        this.sentenceList = allTestSentences;
        return;
      }
      for (var i = 0; i < allTestSentences.length; i++) {
        var testSentence = allTestSentences[i];
        if (testSentence.category === value) {
          this.sentenceList.push(testSentence);
        }
      }
    },
    sentenceDeleted: function (params) {
      var sentenceId = params.sentenceId;
      var scenarioSentenceId = params.scenarioSentenceId;
      var testSentences = this.testScenarioObj.testSentences;
      for (var i = 0; i < testSentences.length; i++) {
        var testSentence = testSentences[i];
        if (testSentence.sentenceId == sentenceId && testSentence.scenarioSentenceId == scenarioSentenceId) {
          testSentences.splice(i, 1);
          break;
        }
      }
      this.$root.setTestScenario(this.testScenarioObj);
    },
    editSentenceBase: function (sentenceId) {
      this.$router.push({
        name: 'AddNewSentence',
        params: {
          sentenceId: sentenceId,
          scenarioId: -1,
          scenarioSentenceId: -1,
          isUpdate: true
        }
      });
    },
    addSentenceToList: function (sentenceId) {
      var sentenceObj = this.$root.getTestSentenceByID(sentenceId);
      var paramterValues = [];
      for (let i = 0; i < sentenceObj.parameters.length; i++) {
        let sentenceParameter = sentenceObj.parameters[i];
        let parameterIndex = sentenceParameter.parameterIndex;
        let parameterValue = sentenceParameter.parameterValue;
        let pamObj = {
          parameterIndex: parameterIndex,
          parameterValue: parameterValue
        };
        paramterValues.push(pamObj);
      }
      var scenarioSentenceId = this.testScenarioObj.testSentences.length + 1;
      scenarioSentenceId = scenarioSentenceId + '' + parseInt(Math.random() * 10000);
      var sentenceObjInList = {
        'sentenceId': sentenceObj.id,
        'paramterValues': paramterValues,
        'scenarioSentenceId': scenarioSentenceId
      };
      this.testScenarioObj.testSentences.push(sentenceObjInList);
      this.$root.setTestScenario(this.testScenarioObj);
    },
    cancel: function () {
      if (this.isUpdate == false) {
        this.$root.deleteTestScenario(this.testScenarioObj);
      }
      this.isByPassValidate = true;
      this.$router.go(-1);
    },
    done: function () {
      this.$root.setTestScenario(this.testScenarioObj);
      this.$router.go(-1);
    },
    mandatoryValidationCheck: function () {
      if (this.isByPassValidate) {
        return true;
      } else {
        var validationPass = true;
        if (this.testScenarioObj.testScenarioName == '' || this.testScenarioObj.testScenarioName == null) {
          this.nameValidationError = true;
          validationPass = false;
        }
        return validationPass;
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.mandatoryValidationCheck()) {
      this.isByPassValidate = false;
      next();
    } else {
      this.isByPassValidate = false;
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
.addNewTestScenarioMain .testSentenceContent {
  padding-top: 20px;
  margin-bottom: 0px;
}
.addNewTestScenarioMain .testSentenceContent .existTestSentenceDoprdown {
  margin-bottom: 20px;
}
.addNewTestScenarioMain .testSentenceContent .resultTestSentence {
}
.addNewTestScenarioMain .list {
  border-top: 1px solid $grey-light;
  border-right: 1px solid $grey-light;
  border-left: 1px solid $grey-light;
}
.setenceList .listItem {
  min-height: 60px;
  border-bottom: 1px solid $grey-light;
  display: flex;
  align-items: center;
  position: relative;
}
.setenceList .listItem .listDataTitle {
  margin-top: 0px;
  margin-bottom: 0px;
  padding-left: 5px;
  width: calc(100% - 125px);
  display: inline-block;
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
