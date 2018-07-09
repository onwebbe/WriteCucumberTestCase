import Vue from 'vue';
import Router from 'vue-router';
/* import HelloWorld from '@/components/HelloWorld' */
import CucumberMain from '@/components/CucumberMain';
import AddNewCase from '@/components/AddNewTestCase';
import AddNewTestScenario from '@/components/AddNewTestScenario';
import AddNewSetence from '@/components/AddNewSetence';
import ViewTestCase from '@/components/ViewTestCase';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'CucumberMain',
    component: CucumberMain
  }, {
    path: '/addNewTestCase/:testcaseid/isUpdate/:isUpdate',
    name: 'AddNewTestCase',
    component: AddNewCase,
    props: true
  }, {
    path: '/addNewTestScenario/:scenarioId/isUpdate/:isUpdate',
    name: 'AddNewTestScenario',
    component: AddNewTestScenario,
    props: true
  }, {
    path: '/addNewTestSetence/:sentenceId/scenarioId/:scenarioId/:scenarioSentenceId/:isUpdate',
    name: 'AddNewSentence',
    component: AddNewSetence,
    props: true
  }, {
    path: '/ViewTestCase/:testcaseid',
    name: 'ViewTestCase',
    component: ViewTestCase,
    props: true
  }]
  /* ,
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    } */
});
