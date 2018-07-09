<template>
  <div class="addNewTestSetenceMain container">
    <div class="pageTitle">
      {{isUpdate?'Update':'Create'}} Test Sentence
    </div>
    <div class="sentenceCategory">
      <span style="line-height:32px;">Please select sentence category: </span><dropDownMenu :dropDownListItem="setenceCategoryList" @itemSelected="categoryDropdownSelected" :selectedValue="category" :class="{'is-danger' : categoryValidationError}"></dropDownMenu>
    </div>
    <div class="setencePreview">
      <div>
        Preview
      </div>
      <div v-html="previewHtml">
      </div>
    </div>
    <div style="margin-bottom: 5px">
      Please Input Setence
    </div>
    <div class="columns">
      <div class="column">
        <span>
          <dropDownMenu :dropDownListItem="sentenceTypeList" @itemSelected="typeDropdownSelected" :selectedValue="type" :class="{'is-danger' : typeValidationError}"></dropDownMenu>
        </span>
        <input class="input sentenceTextInput" :class="{'is-danger' : nameValidationError}" type="text" placeholder="Setence here" v-model="setenceValue" @change="nameChanged">
        <span class="validationError" v-show="nameValidationError"><br/>{{nameValidationErrorMsg}}</span>
      </div>
      <div class="column is-one-quarter">
        <a class="button is-success is-outlined" style="display:inline-block;" @click="addParamter">
          <span class="icon">
            <span class="fas fa-plus-circle"></span>
          </span>
          <span>Add Parameter</span>
        </a>
      </div>
    </div>
    <div class="columns is-multiline">
      <div class="column is-one-quarter" v-for="param in parameters"  v-bind:key="param.parameterIndex" v-show="param.status==='normal'">
        <div>Param{{param.parameterIndex}}</div>
        <input v-model="param.parameterValue" class="input" type="text" placeholder="Parameter Value" @change="parameterValueChange(param.parameterIndex)" style="width:auto">
        <a class="button is-danger" @click="deleteParameter(param.parameterIndex)">
          <span class="icon is-small">
            <span class="fas fa-trash"></span>
          </span>
        </a>
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
      <a class="button is-success is-outlined" @click="saveSentence">
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
export default {
  props: ['sentenceId', 'scenarioId', 'scenarioSentenceId', 'isUpdate'],
  components: {
    'dropDownMenu': DropDownMenu
  },
  data () {
    return {
      category: '',
      type: 'GIVEN',
      parameters: [],
      paramterStart: '[^$-',
      paramterStartRep: '\\[\\^\\$-',
      paramterMid: 'param',
      paramterEnd: '-$^]',
      paramterEndRep: '-\\$\\^\\]',
      setenceValue: '',
      previewHtml: '<span style="color:grey">Preview Here</span>',
      previewText: '',
      setenceCategoryList: [],
      sentenceTypeList: [],
      title: '',
      nameValidationError: false,
      nameValidationErrorMsg: '',
      categoryValidationError: false,
      typeValidationError: false,
      isByPassValidate: false
    };
  },
  created: function () {
    this.loadData();
    if (this.scenarioId != '-1') {
      this.title = 'Update Sentence';
    } else {
      this.title = 'Create new Sentence';
    }
    this.setenceCategoryList = this.$root.getSentenceCategoryList();
    this.sentenceTypeList = this.$root.getSetenceTypeList();
  },
  mounted: function () {
  },
  methods: {
    loadData: function () {
      var sentenceObj = this.$root.getTestSentenceByID(this.sentenceId);
      if (this.sentenceId == null || sentenceObj == null) {
        this.$router.replace('/');
      } else {
        this.category = sentenceObj.category;
        this.setenceValue = sentenceObj.text;
        this.previewText = sentenceObj.previewText;
        this.parameters = sentenceObj.parameters || [];
      }
      // if update test sentence in test scenario, require merge the test scenario paramters
      if (this.scenarioId != '-1') {
        var scenarioObj = this.$root.getTestScenarioByID(this.scenarioId);
        for (var i = 0; i < scenarioObj.testSentences.length; i++) {
          var testSentenceObj = scenarioObj.testSentences[i];
          if ((testSentenceObj.sentenceId == this.sentenceId) && (testSentenceObj.scenarioSentenceId == this.scenarioSentenceId)) {
            let sentenceParameters = this._mergeParameters(sentenceObj.parameters, testSentenceObj.paramterValues);
            this.parameters = sentenceParameters;
            break;
          }
        }
      }
    },
    _mergeParameters: function (sentenceParameters, scenarioParamters) {
      sentenceParameters = JSON.parse(JSON.stringify(sentenceParameters));
      for (var i = 0; i < sentenceParameters.length; i++) {
        var sentenceParameter = sentenceParameters[i];
        var sentenceParameterIndex = sentenceParameter.parameterIndex;
        for (var j = 0; j < scenarioParamters.length; j++) {
          var scenarioParamter = scenarioParamters[j];
          if (sentenceParameterIndex == scenarioParamter.parameterIndex) {
            sentenceParameter.parameterValue = scenarioParamter.parameterValue;
          }
        }
      }
      return sentenceParameters;
    },
    addParamter: function () {
      var usingParamLength = this.parameters.length + 1;
      var parameterText = this.paramterStart + this.paramterMid + usingParamLength + this.paramterEnd;
      var parameterTextRep = this.paramterStartRep + this.paramterMid + usingParamLength + this.paramterEndRep;
      var parameter = {
        parameterIndex: usingParamLength,
        parameterText: parameterText,
        parameterTextRep: parameterTextRep,
        parameterValue: '',
        status: 'normal'
      };
      this.parameters.push(parameter);
      this.setenceValue += parameterText;
    },
    parameterValueChange: function (idx) {
      this.renderPreview();
    },
    deleteParameter: function (idx) {
      this.parameters[idx - 1].status = 'deleted';
      let replaceText = this.parameters[idx - 1].parameterTextRep;
      var patt = new RegExp(replaceText, 'g');
      this.setenceValue = this.setenceValue.replace(patt, '');
      this.renderPreview();
    },
    renderPreview: function () {
      var result = this.$root.renderSentencePreview(this.setenceValue, this.parameters);
      this.previewHtml = result.previewHtml;
      this.previewText = result.previewText;
      this.updateSentence();
    },
    categoryDropdownSelected: function (selectedValue) {
      this.categoryValidationError = false;
      this.category = selectedValue;
    },
    saveSentence: function () {
      this.updateSentence();
      this.$router.go(-1);
    },
    saveNewSentence: function () {
      var id = this.$root.generateNewTestSentenceID();
      var sentenceObj = {
        'id': id,
        'text': this.setenceValue,
        'category': this.category,
        'previewText': this.previewText,
        'parameters': this.parameters || []
      };
      this.$root.data.testSentence[id] = sentenceObj;
      console.log('Save New Sentence Successfully');
    },
    updateSentence: function () {
      var existSentenceObj = this.$root.getTestSentenceByID(this.sentenceId);
      if (existSentenceObj) {
        existSentenceObj.text = this.setenceValue;
        existSentenceObj.category = this.category;
        existSentenceObj.previewText = this.previewText;
        existSentenceObj.type = this.type;
        // if update scenario sentence
        if (this.scenarioId != '-1') {
          var testScenarioObj = this.$root.getTestScenarioByID(this.scenarioId);
          var testScenarioSentence = this._getTestSentenceById(testScenarioObj.testSentences, this.scenarioSentenceId);
          if (testScenarioSentence == null) {
            return;
          }
          testScenarioSentence.paramterValues = JSON.parse(JSON.stringify(this._getTestScenarioParamters()));
          this.$root.setTestScenario(testScenarioObj);
        } else {
          existSentenceObj.parameters = this.parameters || [];
        }
        this.$root.setTestSentence(existSentenceObj);
      } else {
        this.saveNewSentence();
        return;
      }
      console.log('Update Sentence Successfully');
    },
    _getTestSentenceById: function (sentenceList, scenarioSentenceId) {
      for (var i = 0; i < sentenceList.length; i++) {
        var sentenceObj = sentenceList[i];
        if (sentenceObj.scenarioSentenceId == scenarioSentenceId) {
          return sentenceObj;
        }
      }
      return null;
    },
    _getTestScenarioParamters: function () {
      var scenarioParams = [];
      for (var i = 0; i < this.parameters.length; i++) {
        var param = this.parameters[i];
        /* var paramValue = param.parameterValue; */
        /* var paramIndex = param.parameterIndex; */
        scenarioParams.push(param);
      }
      return scenarioParams;
    },
    cancel: function () {
      if (this.isUpdate) {
        this.$router.go(-1);
      } else {
        this.isByPassValidate = true;
        var existSentenceObj = this.$root.getTestSentenceByID(this.sentenceId);
        this.$root.deleteTestSentence(existSentenceObj);
        this.$router.go(-1);
      }
    },
    mandatoryValidationCheck: function () {
      if (this.isByPassValidate) {
        return true;
      } else {
        var validationPass = true;
        if (this.setenceValue == '' || this.setenceValue == null) {
          this.nameValidationError = true;
          this.nameValidationErrorMsg = '* required field';
          validationPass = false;
        }
        if (this.$root.checkIfDuplicatedTestSentence(this.sentenceId, this.setenceValue)) {
          this.nameValidationError = true;
          this.nameValidationErrorMsg = 'Text already exists.';
          validationPass = false;
        }
        if (this.category == '' || this.category == null) {
          this.categoryValidationError = true;
          validationPass = false;
        }
        return validationPass;
      }
    },
    nameChanged: function () {
      if (this.setenceValue == '' || this.setenceValue == null) {
        this.nameValidationError = true;
        this.nameValidationErrorMsg = '* required field';
      } else {
        this.nameValidationError = false;
        this.nameValidationErrorMsg = '';
        this.updateSentence();
      }
    },
    typeDropdownSelected: function (value) {
      this.type = value;
      console.log(value);
    }
  },
  watch: {
    setenceValue: function (value) {
      this.nameValidationError = false;
      this.nameValidationErrorMsg = '';
      if (this.$root.checkIfDuplicatedTestSentence(this.sentenceId, value)) {
        this.nameValidationError = true;
        this.nameValidationErrorMsg = 'Text already exists.';
        return false;
      }
      this.renderPreview();
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.mandatoryValidationCheck()) {
      this.isByPassValidate = false;
      this.nameValidationErrorMsg = '';
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

.buttonColumn {
  
}
.setencePreview {
  border: 1px solid $grey-lighter;
  padding: 10px;
  margin-bottom: 10px;
}
.sentenceCategory {
  margin-bottom: 20px;
}
.sentenceTitle {
  font-size: 2rem;
  margin: 10px 0;
}
.sentenceTextInput {
  width: calc(100% - 100px);
}
/*.setencePreview > div:nth-child(1) {
  border-bottom: 1px solid $grey-lighter;
  padding-bottom: 2px;
  margin-bottom: 3px;
}*/
</style>
