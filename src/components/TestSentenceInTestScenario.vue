<template>
  <div class="TestSetenceInScenarioMain">
    <div v-for="sentenceItem in currentSentenceList" v-bind:key="sentenceItem.id +  sentenceItem.scenarioSentenceId">
      <div class="TestSetenceBefore" :sentenceID="sentenceItem.id + sentenceItem.scenarioSentenceId"  @drop="onDragToSetenceBeforeDone($event)" @dragover="onDragToSetenceBefore($event)" @dragenter="onDragToSetenceBeforeEnter($event)" @dragleave="onDragToSetenceBeforeLeave($event)">
      </div>
      <div class="TestSetence" :sentenceID="sentenceItem.id">
        <a class="button is-link is-inverted" draggable="true" @dragstart="onSentenceDragStart($event, sentenceItem.id, sentenceItem.scenarioSentenceId)" @dragover="onSentenceDragOver($event)">
          <span class="icon is-small">
            <span class="fas fa-bars"></span>
          </span>
        </a>
        <div class="sentenceText">
          {{ getText(sentenceItem) }}
        </div>
        <div class="sentenceAction">
          <a class="button is-link is-inverted" @click="editSentence(sentenceItem.id, sentenceItem.scenarioSentenceId)">
            <span class="icon is-small">
            <span class="fas fa-edit"></span>
            </span>
          </a>
          &nbsp;&nbsp;
          <a class="button is-danger" @click="delSentence(sentenceItem.id, sentenceItem.scenarioSentenceId)">
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
  props: ['sentenceList', 'scenarioId'],
  components: {
  },
  data () {
    return {
      currentDragId: null,
      currentDragElement: null,
      currentSentenceList: []
    };
  },
  watch: {
    sentenceList: function () {
      this.prepareSentenceList();
    }
  },
  mounted: function () {
    this.prepareSentenceList();
  },
  methods: {
    prepareSentenceList: function () {
      this.currentSentenceList = [];
      for (let i = 0; i < this.sentenceList.length; i++) {
        var sentenceItem = this.sentenceList[i];
        var sentenceId = sentenceItem.sentenceId;
        var scenarioSentenceId = sentenceItem.scenarioSentenceId;

        var sentenceObject = JSON.parse(JSON.stringify(this.$root.getTestSentenceByID(sentenceId)));
        var finalParamters = [];
        for (let j = 0; j < sentenceObject.parameters.length; j++) {
          var sentenceParameter = JSON.parse(JSON.stringify(sentenceObject.parameters[j]));
          for (let k = 0; k < sentenceItem.paramterValues.length; k++) {
            var scenarioParameter = sentenceItem.paramterValues[k];
            if (sentenceParameter.parameterIndex == scenarioParameter.parameterIndex) {
              sentenceParameter.parameterValue = scenarioParameter.parameterValue;
            }
          }
          finalParamters.push(sentenceParameter);
        }
        sentenceObject.parameters = finalParamters;
        sentenceObject.scenarioSentenceId = scenarioSentenceId;
        this.currentSentenceList.push(sentenceObject);
      }
    },
    _searchParamterValueBySentenceIdAndParamIndex: function (sentenceId, paramIndex) {
      var sentenceObj = this.$root.getTestSentenceByID(sentenceId);
      for (var i = 0; i < sentenceObj.parameters.length; i++) {
        var parameterObj = sentenceObj.parameters[i];
        if (parameterObj.parameterIndex == paramIndex) {
          return parameterObj;
        }
      }
      return null;
    },
    _getNextItem: function (currentItem) {
      var nextItemIndex = 0;
      for (var i = 0; i < this.currentSentenceList.length; i++) {
        if (currentItem == this.currentSentenceList[i]) {
          nextItemIndex = i;
          break;
        }
      }
      nextItemIndex = nextItemIndex + 1;
      if (nextItemIndex == this.currentSentenceList.length) {
        nextItemIndex = this.currentSentenceList.length - 1;
      }
      return this.currentSentenceList[nextItemIndex];
    },
    _isNextItem: function (currentItem, anotherItem) {
      return this._getNextItem(currentItem) == anotherItem;
    },
    getSentenceByScenarioSentenceId: function (scenarioSentenceId) {
      for (let i = 0; i < this.currentSentenceList.length; i++) {
        let sentenceItem = this.currentSentenceList[i];
        let originalScenarioSentenceId = sentenceItem.id + sentenceItem.scenarioSentenceId;
        if (originalScenarioSentenceId === scenarioSentenceId) {
          return sentenceItem;
        }
      }
      return null;
    },
    onSentenceDragStart: function (evt, itemid, scenarioSentenceId) {
      evt.dataTransfer.effectAllowed = 'move';
      this.currentDragElement = $(evt.target).parent()[0];
      evt.dataTransfer.setData('text', itemid);
      this.currentDragId = itemid + scenarioSentenceId;
      // var imgOffsetX = $(this.currentDragElement).find('.sentenceText').outerWidth() + 36;
      var imgOffsetX = 30;
      evt.dataTransfer.setDragImage(this.currentDragElement, imgOffsetX, 10);
      return true;
    },
    onSentenceDragOver: function (evt) {
      evt.preventDefault();
      // evt.dataTransfer.clearData('text');
      // this.currentDragElement = null;
      return false;
    },
    onDragToSetenceBefore: function (evt) {
      evt.preventDefault();
      return true;
    },
    onDragToSetenceBeforeEnter: function (evt) {
      evt.preventDefault();
      var insertItemId = $(evt.target).attr('sentenceID');
      var itemid = this.currentDragId;
      if (itemid == insertItemId) {
        return false;
      }
      var dropTargetItem = this.getSentenceByScenarioSentenceId(insertItemId);
      var movingItem = this.getSentenceByScenarioSentenceId(itemid);
      if (this._isNextItem(movingItem, dropTargetItem)) {
        return false;
      }
      $(evt.target).addClass('TestSetenceBeforeTemp');
      $(this.currentDragElement).addClass('TestSetenceCurrentTemp');
      var theText = this.getText(this._getItemData(itemid));
      $(evt.target).html('<span>' + theText + '</span>');
      return true;
    },
    onDragToSetenceBeforeLeave: function (evt) {
      evt.preventDefault();
      $(evt.target).removeClass('TestSetenceBeforeTemp');
      $(this.currentDragElement).removeClass('TestSetenceCurrentTemp');
      $(evt.target).html('');
      return true;
    },
    onDragToSetenceBeforeDone: function (evt) {
      evt.preventDefault();
      $(evt.target).html('');
      $(evt.target).removeClass('TestSetenceBeforeTemp');
      $(this.currentDragElement).removeClass('TestSetenceCurrentTemp');
      var insertItemId = $(evt.target).attr('sentenceID');
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
      for (let i = 0; i < this.currentSentenceList.length; i++) {
        let sentenceItem = this.currentSentenceList[i];
        let sentenceItemId = sentenceItem.id + sentenceItem.scenarioSentenceId;
        if (sentenceItemId === moveItemId) {
          foundMoveItemArrayIndex = i;
          break;
        }
      }
      var moveItemObj = this.currentSentenceList.splice(foundMoveItemArrayIndex, 1);
      for (let i = 0; i < this.currentSentenceList.length; i++) {
        let sentenceItem = this.currentSentenceList[i];
        let sentenceItemId = sentenceItem.id + sentenceItem.scenarioSentenceId;
        if (sentenceItemId === insertItemId) {
          this.currentSentenceList.splice(i, 0, moveItemObj[0]);
          break;
        }
      }
    },
    _getItemData: function (itemID) {
      for (let i = 0; i < this.currentSentenceList.length; i++) {
        let sentenceItem = this.currentSentenceList[i];
        let sentenceItemId = sentenceItem.id;
        if (sentenceItemId === itemID) {
          return sentenceItem;
        }
      }
      return null;
    },
    getText: function (item) {
      if (item == null) {
        return '';
      }
      /* let sentenceItemId = item.id; */
      let text = item.text;
      let parameters = item.parameters;
      return this.$root.renderSentencePreview(text, parameters).previewText;
    },
    editSentence: function (sentenceId, scenarioSentenceId) {
      this.$router.push({
        name: 'AddNewSentence',
        params: {
          sentenceId: sentenceId,
          scenarioId: this.scenarioId,
          scenarioSentenceId: scenarioSentenceId,
          isUpdate: true
        }
      });
    },
    delSentence: function (sentenceId, scenarioSentenceId) {
      this.$emit('sentenceDeleted', {sentenceId: sentenceId, scenarioSentenceId: scenarioSentenceId});
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css">
@import '../../node_modules/bulma';
$fa-font-path: '../../node_modules/font-awesome/fonts/';
@import '../../node_modules/font-awesome/scss/font-awesome';

.TestSetence {
  border: 1px solid $grey-lighter;
  padding: 10px 0;
  padding-left: 10px;
}
.sentenceAction {
  width: 100px;
  display: inline-block;
  line-height: 36px;
}
.TestSetence .sentenceText {
  width: calc(100% - 145px);
  display: inline-block;
  line-height: 36px;
}
.TestSetenceBefore {
  height: 16px;
  width: 100%;
}
.TestSetenceBefore.TestSetenceBeforeTemp {
  height: 62px;
  line-height: 62px;
  opacity: 0.8;
  background-color: $white-ter;
  border: 1px dashed $grey-lighter;
  width: 100%;
  padding-left: 48px;
}
.TestSetenceCurrentTemp {
  display: none !important;
}
</style>
