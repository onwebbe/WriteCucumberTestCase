// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false
/* @import url('../static/animate.css'); */
/* eslint-disable no-new */
/* require('./assets/style/bulma/css/bulma.css')
require('./assets/style/bulma/sass/utilities/initial-variables.sass') */

/* require('./assets/style/app.scss') */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  data: {
    'test': 'ttt',
    'data': {
      'testSentence': {
      },
      'testScenario': {
      },
      'testCase': {
        'testScenario': [{
          'scenarioId': ''
        }]
      }
    }
  },
  created: function () {
    /* this.$watch('data.testScenario', function (newVal, oldVal) {
      console.log('deep watch');
    }, {deep: true, immediate: true});
    this.$watch('ttt', function (newVal, oldVal) {
      console.log('ttt deep watch');
    }, {deep: true, immediate: true}); */
    this.loadData();
  },
  methods: {
    saveData: function () {
      if (window.localStorage) {
        // window.localStorage.setItem('testsentence', JSON.stringify(this.data.testSentence));
        // window.localStorage.setItem('testScenario', JSON.stringify(this.data.testScenario));
        // window.localStorage.setItem('testCase', JSON.stringify(this.data.testCase));
        window.localStorage.setItem('allData', JSON.stringify(this.data));
      }
    },
    loadData: function () {
      if (window.localStorage) {
        var stringData = window.localStorage.getItem('allData');
        var objData = null;
        if (stringData != null) {
          objData = JSON.parse(stringData);
        }
        if (objData != null) {
          this.data = objData;
        }
      }
    },
    convertTestSentenceToArray: function () {
      var sentenceList = [];
      for (var sentenceId in this.data.testSentence) {
        console.log(sentenceId);
        sentenceList.push(this.data.testSentence[sentenceId]);
      }
      return sentenceList;
    },
    getTestSentenceByID: function (sentenceId) {
      return this.data.testSentence[sentenceId];
    },
    setTestSentence: function (sentenceObj) {
      var sentenceId = sentenceObj.id;
      this.data.testSentence[sentenceId] = sentenceObj;
      this.saveData();
    },
    deleteTestSentence: function (sentenceObj) {
      var sentenceId = sentenceObj.id;
      delete this.data.testSentence[sentenceId];
    },

    convertTestScenarioToArray: function () {
      var testScenarioList = [];
      for (var testScenarioId in this.data.testScenario) {
        testScenarioList.push(this.data.testScenario[testScenarioId]);
      }
      return testScenarioList;
    },
    getTestScenarioByID: function (testScenarioId) {
      return this.data.testScenario[testScenarioId];
    },
    setTestScenario: function (testScenarioObj) {
      var testScenarioId = testScenarioObj.id;
      this.data.testScenario[testScenarioId] = testScenarioObj;
      this.saveData();
    },
    deleteTestScenario: function (testScenarioObj) {
      var testScenarioId = testScenarioObj.id;
      delete this.data.testScenario[testScenarioId];
    },

    convertTestCaseToArray: function () {
      console.log('convertTestCaseToArray');
    },
    getTestCaseByID: function (testCaseId) {
      return this.data.testCase[testCaseId];
    },
    setTestCase: function (testCaseObj) {
      var testCaseId = testCaseObj.id;
      this.data.testCase[testCaseId] = testCaseObj;
      this.saveData();
    },

    generateNewTestCaseID: function () {
      var maxTestCaseId = 0;
      for (var testS in this.data.testCase) {
        var testNum = testS.substring(8, 16);
        testNum = isNaN(parseInt(testNum)) ? 0 : parseInt(testNum);
        if (testNum >= maxTestCaseId) {
          maxTestCaseId = testNum;
        }
      }
      var usingID = (parseInt(maxTestCaseId) + 1);
      usingID = this._paddingZero(usingID);
      return 'testCase' + usingID + parseInt(Math.random() * 100000);
    },
    generateNewTestScenarioID: function () {
      var maxTestScenarioId = 0;
      for (var testS in this.data.testScenario) {
        var testNum = testS.substring(12, 20);
        testNum = isNaN(parseInt(testNum)) ? 0 : parseInt(testNum);
        if (testNum >= maxTestScenarioId) {
          maxTestScenarioId = testNum;
        }
      }
      var usingID = (parseInt(maxTestScenarioId) + 1);
      usingID = this._paddingZero(usingID);
      return 'testScenario' + usingID + parseInt(Math.random() * 100000);
    },
    generateNewTestSentenceID: function () {
      var maxTestSentenceId = 0;
      for (var testS in this.data.testSentence) {
        var testNum = testS.substring(12, 20);
        testNum = isNaN(parseInt(testNum)) ? 0 : parseInt(testNum);
        if (testNum >= maxTestSentenceId) {
          maxTestSentenceId = testNum;
        }
      }
      var usingID = (parseInt(maxTestSentenceId) + 1);
      usingID = this._paddingZero(usingID);
      return 'testSentence' + usingID + parseInt(Math.random() * 100000);
    },
    createNewTestScenario: function (name, sentences) {
      var testScenarioId = this.generateNewTestScenarioID();
      var testScenario = {
        'id': testScenarioId,
        'scenarioName': name,
        'testSentence': sentences || []
      }
      this.data.testScenario[testScenarioId] = testScenario;
      return testScenario;
    },
    createNewTestSentence: function (text, paramters) {
      var testSentenceId = this.generateNewTestSentenceID();
      var testSentence = {
        'id': testSentenceId,
        'text': text,
        'paramters': paramters || []
      }
      this.data.testSentence[testSentenceId] = testSentence;
      return testSentence;
    },
    _paddingZero: function (str) {
      var pad = '00000000';
      str = str + '';
      return pad.substring(0, pad.length - str.length) + str;
    },
    renderSentencePreview: function (text, paramters) {
      var previewHtml = text;
      var previewText = text;
      for (let i = 0; i < paramters.length; i++) {
        let param = paramters[i];
        let status = param.status;
        let paramValue = param.parameterValue;
        let replaceText = param.parameterTextRep;
        if (status === 'normal') {
          var patt = new RegExp(replaceText, 'g');
          previewHtml = previewHtml.replace(patt, '<span style="color:blue;">"' + paramValue + '"</span>');
          previewText = previewText.replace(patt, '"' + paramValue + '"');
        }
      }
      return {
        'previewHtml': previewHtml,
        'previewText': previewText
      }
    }
  }
});
