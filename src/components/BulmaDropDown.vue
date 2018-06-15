<template>
  <div class="dropdown">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu3" @click="dropDownClicked">
        <span>{{dropDownLabelSelected}}</span>
        <span class="icon is-small">
          <span class="fas fa-angle-down" aria-hidden="true"></span>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu" :style="{display: isDisplay?'block':'none'}">
      <div class="dropdown-content">
        <span class="dropdown-item" v-for="item in dropDownListItem" @click="dropDownItemSelected(item.value, item.label)" v-bind:key="item.key">
          {{ item.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['dropDownListItem', 'selectedValue'],
  components: {
  },
  data () {
    return {
      isDisplay: false,
      dropDownValueSelected: '',
      dropDownLabelSelected: '-- Please Select --'
    };
  },
  mounted: function () {
    this.selectDropdownByValue();
  },
  watch: {
    selectedValue: function () {
    }
  },
  methods: {
    selectDropdownByValue: function () {
      var label = null;
      for (var i = 0; i < this.dropDownListItem.length; i++) {
        let item = this.dropDownListItem[i];
        if (item.value == this.selectedValue) {
          label = item.label;
        }
      }
      if (label) {
        this.dropDownItemSelected(this.selectedValue, label);
      }
    },
    dropDownItemSelected: function (value, label) {
      this.dropDownValueSelected = value;
      this.dropDownLabelSelected = label;
      this.isDisplay = false;
      this.$emit('itemSelected', value);
    },
    dropDownClicked: function () {
      this.isDisplay = !this.isDisplay;
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css">
@import '../../node_modules/bulma';
$fa-font-path: '../../node_modules/font-awesome/fonts/';
@import '../../node_modules/font-awesome/scss/font-awesome';

</style>
