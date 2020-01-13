<template>
  <div class="download-page">
    <el-form :model="form" label-position="right" label-width="100px" :rules="rules" class="form" ref="form" v-loading="loading">
      <el-form-item label="资源分类" prop="sort">
        <el-tag
          :key="tag"
          v-for="tag in sortList"
          closable
          :disable-transitions="false"
          type="info"
          @close="sortClose(tag)">
          {{tag.name}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputSortVisible"
          v-model="inputSortValue"
          ref="sortInput"
          size="small"
          @keyup.enter.native="sortInputConfirm"
          @blur="sortInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 增加分类</el-button>
      </el-form-item>
      <el-form-item label="资源类别" prop="type">
        <el-tag
          :key="tag"
          v-for="tag in typeList"
          closable
          :disable-transitions="false"
          type="info"
          @close="typeClose(tag)">
          {{tag.name}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputTypeVisible"
          v-model="inputTypeValue"
          ref="sortInput"
          size="small"
          @keyup.enter.native="typeInputConfirm"
          @blur="typeInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showTypeInput">+ 增加类别</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sortList: [],
      inputSortVisible: false,
      inputSortValue: '',

      typeList: [],
      inputTypeVisible: false,
      inputTypeValue: '',
    }
  },
  mounted() {
    this.getSort();
    this.getType();

  },
  methods: {
    getSort() {
      var query = this.$Bmob.Query('download_sort');
      let arr = [];
      query.find().then((res) => {
        for (let i = 0; i < res.length; i += 1) {
          arr.push({
            id: res[i].objectId,
            name: res[i].name,
          });
        }
        this.sortList = arr;
      });
    },
    sortClose(tag) {
      this.sortList.splice(this.sortList.indexOf(tag), 1);
    },

    showSortInput() {
      this.inputSortVisible = true;
      this.$nextTick(() => {
        this.$refs.sortInput.$refs.input.focus();
      });
    },

    sortInputConfirm() {
      let inputValue = this.inputSortValue;
      if (inputValue) {
        this.sortList.push(inputValue);
      }
      this.inputSortVisible = false;
      this.inputSortValue = '';
    },

    getType() {
      var query = this.$Bmob.Query('download_type');
      let arr = [];
      query.find().then((res) => {
        for (let i = 0; i < res.length; i += 1) {
          arr.push({
            id: res[i].objectId,
            name: res[i].name,
          });
        }
        this.typeList = arr;
      });
    },
    typeClose(tag) {
      this.typeList.splice(this.typeList.indexOf(tag), 1);
    },

    showTypeInput() {
      this.inputTypeVisible = true;
      this.$nextTick(() => {
        this.$refs.typeInput.$refs.input.focus();
      });
    },

    typeInputConfirm() {
      let inputValue = this.inputTypeValue;
      if (inputValue) {
        this.typeList.push(inputValue);
      }
      this.inputTypeVisible = false;
      this.inputTypeValue = '';
    },
  },
}
</script>

<style lang="scss" scoped>
  .download-page {
    padding: 50px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: auto;
    box-sizing: border-box;
    .form {
      width: 100%;
      max-width: 900px;
      .el-tag + .el-tag {
        margin-left: 10px;
      }
      .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }
    }
  }
</style>