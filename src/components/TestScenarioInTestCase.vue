<template>
  <div class="TestSetenceInScenarioMain">
    <div v-for="scenarioItem in currentScenarioList" v-bind:key="scenarioItem.caseScenarioId" class="TestScenarioItem">
      <div class="TestScenarioBefore" :caseScenarioID="scenarioItem.caseScenarioId"  @drop="onDragToScenarioBeforeDone($event)" @dragover="onDragToScenarioBefore($event)" @dragenter="onDragToScenarioBeforeEnter($event)" @dragleave="onDragToScenarioBeforeLeave($event)">
      </div>
      <div class="TestScenario" :scenarioID="scenarioItem.caseScenarioId">
        <a class="button is-link is-inverted" draggable="true" @dragstart="onScenarioDragStart($event, scenarioItem.testScenarioId, scenarioItem.caseScenarioId)" @dragover="onScenarioDragOver($event)">
          <span class="icon is-small">
            <span class="fas fa-bars"></span>
          </span>
        </a>
        <div class="scenarioText">
          {{ scenarioItem.testScenarioName }}
        </div>
        <div class="scenarioAction">
          <a class="button is-danger" @click="delScenario(scenarioItem.testScenarioId, scenarioItem.caseScenarioId)">
            <span class="icon is-small">
              <span class="fas fa-trash"></span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['scenarioList', 'testCaseId'],
  components: {
  },
  data () {
    return {
      currentDragElement: null,
      currentDragId: null,
      currentScenarioList: []
    };
  },
  watch: {
    scenarioList: function () {
      this.prepareScenarioList();
    }
  },
  mounted: function () {
    this.prepareScenarioList();
  },
  methods: {
    prepareScenarioList: function () {
      this.currentScenarioList = [];
      for (var i = 0; i < this.scenarioList.length; i++) {
        var scenario = this.scenarioList[i];
        var scenarioId = scenario.testScenarioId;
        var caseScenarioId = scenario.caseScenarioId;
        var scenarioObj = this.$root.getTestScenarioByID(scenarioId);
        scenarioObj = JSON.parse(JSON.stringify(scenarioObj));
        scenarioObj.testScenarioId = scenarioId;
        scenarioObj.caseScenarioId = caseScenarioId;
        this.currentScenarioList.push(scenarioObj);
      }
    },
    _getNextItem: function (currentItem) {
      var nextItemIndex = 0;
      for (var i = 0; i < this.currentScenarioList.length; i++) {
        if (currentItem == this.currentScenarioList[i]) {
          nextItemIndex = i;
          break;
        }
      }
      nextItemIndex = nextItemIndex + 1;
      if (nextItemIndex == this.currentScenarioList.length) {
        nextItemIndex = this.currentScenarioList.length - 1;
      }
      return this.currentScenarioList[nextItemIndex];
    },
    _isNextItem: function (currentItem, anotherItem) {
      return this._getNextItem(currentItem) == anotherItem;
    },
    onScenarioDragStart: function (evt, scenarioId, caseScenarioId) {
      evt.dataTransfer.effectAllowed = 'move';
      this.currentDragElement = $(evt.target).parent()[0];
      evt.dataTransfer.setData('text', scenarioId);
      this.currentDragId = caseScenarioId;
      // var imgOffsetX = $(this.currentDragElement).find('.sentenceText').outerWidth() + 36;
      var imgOffsetX = 30;
      evt.dataTransfer.setDragImage(this.currentDragElement, imgOffsetX, 30);
      return true;
    },
    onScenarioDragOver: function (evt) {
      evt.preventDefault();
      // evt.dataTransfer.clearData('text');
      // this.currentDragElement = null;
      return false;
    },
    onDragToScenarioBefore: function (evt) {
      evt.preventDefault();
      return true;
    },
    onDragToScenarioBeforeEnter: function (evt) {
      evt.preventDefault();
      var insertItemId = $(evt.target).attr('caseScenarioID');
      var itemid = this.currentDragId;
      if (itemid == insertItemId) {
        return false;
      }
      var dropTargetItem = this._getCaseScenarioById(insertItemId);
      var movingItem = this._getCaseScenarioById(itemid);
      if (this._isNextItem(movingItem, dropTargetItem)) {
        return;
      }
      $(evt.target).addClass('TestScenarioBeforeTemp');
      $(this.currentDragElement).addClass('dragItemDisapearAnimation');

      var testScenarioObj = this._getTestScenarioData(itemid);
      var theText = testScenarioObj == null ? testScenarioObj.scenarioName : '';
      $(evt.target).html('<span>' + theText + '</span>');
      return true;
    },
    onDragToScenarioBeforeLeave: function (evt) {
      evt.preventDefault();
      $(evt.target).removeClass('TestScenarioBeforeTemp');
      $(this.currentDragElement).removeClass('dragItemDisapearAnimation');
      $(evt.target).html('');
      return true;
    },
    onDragToScenarioBeforeDone: function (evt) {
      evt.preventDefault();
      $(evt.target).html('');
      $(evt.target).removeClass('TestScenarioBeforeTemp');
      $(this.currentDragElement).removeClass('dragItemDisapearAnimation');
      var insertItemId = $(evt.target).attr('caseScenarioID');
      var dropEle = this.currentDragElement;
      if (dropEle == null) {
        return false;
      }
      var itemid = this.currentDragId;
      this._moveItem(itemid, insertItemId);
      evt.dataTransfer.setData('text', null);
      this.currentDragId = null;
      this.currentDragElement = null;
      return false;
    },
    _moveItem: function (moveItemId, insertItemId) {
      if (moveItemId === insertItemId) {
        return;
      }
      var foundMoveItemArrayIndex = -1;
      for (let i = 0; i < this.currentScenarioList.length; i++) {
        let scenarioItem = this.currentScenarioList[i];
        let caseScenarioID = scenarioItem.caseScenarioId;
        if (caseScenarioID === moveItemId) {
          foundMoveItemArrayIndex = i;
          break;
        }
      }
      var moveItemObj = this.currentScenarioList.splice(foundMoveItemArrayIndex, 1);
      for (let i = 0; i < this.currentScenarioList.length; i++) {
        let scenarioItem = this.currentScenarioList[i];
        let caseScenarioId = scenarioItem.caseScenarioId;
        if (caseScenarioId === insertItemId) {
          this.currentScenarioList.splice(i, 0, moveItemObj[0]);
          break;
        }
      }
    },
    _getCaseScenarioById: function (caseScenarioId) {
      for (let i = 0; i < this.currentScenarioList.length; i++) {
        let scenarioItem = this.currentScenarioList[i];
        let originalCaseScenarioId = scenarioItem.caseScenarioId;
        if (originalCaseScenarioId === caseScenarioId) {
          return scenarioItem;
        }
      }
      return null;
    },
    _getTestScenarioData: function (itemID) {
      for (let i = 0; i < this.currentScenarioList.length; i++) {
        let scenarioItem = this.currentScenarioList[i];
        let caseScenarioId = scenarioItem.caseScenarioId;
        if (caseScenarioId === itemID) {
          return scenarioItem;
        }
      }
      return null;
    },
    editSentence: function (scenarioId) {
      this.$router.push({
        name: 'AddNewTestScenario',
        params: {
          scenarioId: scenarioId,
          isUpdte: true
        }
      });
    },
    delScenario: function (scenarioId, caseScenarioId) {
      this.$emit('scenariodeleted', {scenarioId: scenarioId, caseScenarioId: caseScenarioId});
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css">
@import '../../node_modules/bulma';
$fa-font-path: '../../node_modules/font-awesome/fonts/';
@import '../../node_modules/font-awesome/scss/font-awesome';

.TestScenario {
  border: 1px solid $grey-lighter;
  padding: 10px 0;
  padding-left: 10px;
}
.scenarioAction {
  width: 50px;
  display: inline-block;
  line-height: 36px;
}
.TestScenario .scenarioText {
  width: calc(100% - 95px);
  display: inline-block;
  line-height: 36px;
}
.TestScenarioBefore {
  height: 16px;
  width: 100%;
}
.TestScenarioBefore.TestScenarioBeforeTemp {
  height: 62px;
  line-height: 62px;
  opacity: 0.8;
  background-color: $white-ter;
  border: 1px dashed $grey-lighter;
  width: 100%;
  padding-left: 48px;
}
.TestScenarioCurrentTemp {
  display: none;
}
</style>
