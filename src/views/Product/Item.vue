<template>
  <div class="product-page">
    <el-form :model="form" label-position="right" label-width="100px" :rules="rules" class="form" ref="form" v-loading="loading">
      <el-form-item label="产品标题" prop="title">
        <el-input type="text" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="产品介绍" prop="desc">
        <el-input type="textarea" v-model="form.desc" rows="3" maxlength="180" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="产品小图" prop="imgSrc">
        <div style="line-height: 40px; color:#999;">(图片长宽1比1)</div>
        <div @click="importClick" class="el-upload el-upload--picture-card" v-loading="imgLoading">
          <el-image :src="form.imgSrc" v-if="form.imgSrc" fit="contain" class="img" style="width: 100%; height: 100%;" lazy></el-image>
          <i class="el-icon-plus" v-else></i>
          <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadFile" class="el-upload__input" :multiple="false" name="file" ref="input" type="file">
        </div>
      </el-form-item>
      <el-form-item label="适配系统" prop="system">
        <el-checkbox-group v-model="form.system" style="line-height: 40px;">
          <el-checkbox label="Mac">Mac</el-checkbox>
          <el-checkbox label="Windows">Windows</el-checkbox>
          <el-checkbox label="Ios">Ios</el-checkbox>
          <el-checkbox label="Linux">Linux</el-checkbox>
          <el-checkbox label="Android">Android</el-checkbox>
          <el-checkbox label="iPad">iPad</el-checkbox>
          <el-checkbox label="Web">Web</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="商品标签" prop="tags">
        <div
          style="line-height: 40px;">
        <el-tag
          :key="tag"
          v-for="tag in form.tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 增加标签</el-button>
        </div>
      </el-form-item>

      <el-form-item label="商品规格">
        <el-button type="warning" icon="el-icon-plus" size="medium" plain @click="addAttr" :disabled="attrs.length >= 6">添加规格（最多6个，最少1个）</el-button>
        <el-table :data="attrs" size="small" border stripe style="margin-top: 10px;">
          <el-table-column label="规格名称" prop="attrName">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.attrName" required></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存" prop="attrNum" align="center">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.attrNum" size="small" controls-position="right" :min="0" :precision="0"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="单价（元）" prop="attrPrice" align="center">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.attrPrice" size="small" controls-position="right" :min="0" :precision="2"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="small" @click="delAttr(scope)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="官网地址" prop="website">
        <el-input type="text" v-model="form.website" placeholder="请填写带有http://或https://前缀的地址"></el-input>
      </el-form-item>
      <el-form-item label="热门软件" prop="isHot">
        <el-select v-model="form.isHot" placeholder="请选择">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团购信息" prop="groupCount">
        <el-select v-model="form.groupCount" placeholder="请选择">
          <el-option label="隐藏" :value="-1"></el-option>
          <el-option label="显示" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品详情" prop="content">
        <input accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="uploadImgFile" class="el-upload__input" :multiple="false" name="file" ref="imgInput" type="file">

        <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)" style="width: 100%;"></quill-editor>
      </el-form-item>
      <el-form-item align="right">
        <el-button @click="submitForm(-1)">下架暂存</el-button>
        <el-button type="primary" @click="submitForm(0)">上架</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  [{'direction': 'rtl'}],                         // text direction
  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],
  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  [{'font': []}],
  [{'align': []}],
  ['link', 'image'],
  ['clean']
]

import {
  quillEditor
} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  data() {
    return {
      content: null,
      editorOption: {
        placeholder: '',
        theme: 'snow',  // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': (value) => {
                if (value) {
                  // 触发input框选择图片文件
                  // document.querySelector('.avatar-uploader input').click()
                  this.$refs.imgInput.value = null;
                  this.$refs.imgInput.click();
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      serverUrl: '/manager/common/imgUpload',  // 这里写你要上传的图片服务器地址

      loading: false,
      imgLoading: false,
      imgListLoading: false,

      attrs: [],
      removeAtts: [],
      form: {
        isHot: 0,
        tags: [],
        system: [],
      },
      rules: {
        title: [{required: true, message: '请输入', trigger: 'blur'}],
        desc: [{required: true, message: '请输入', trigger: 'blur'}],
        imgSrc: [{required: true, message: '请上传图片', trigger: 'blur'}],
        
        website: [{required: true, message: '请填写官网地址', trigger: 'blur'}],
        content: [{required: true, message: '请填写详情', trigger: 'blur'}],
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  components: {
    quillEditor
  },
  mounted() {
    if (this.$route.query.id) {
      this.getInfo(this.$route.query.id);
    }
  },
  methods: {
		handleClose(tag) {
			this.form.tags.splice(this.form.tags.indexOf(tag), 1);
		},

		showInput() {
			this.inputVisible = true;
			this.$nextTick(() => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},

		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue && this.form.tags.indexOf(inputValue) === -1) {
				this.form.tags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
    addAttr() {
      this.attrs.push({});
    },
    delAttr(item) {
      this.removeAtts.push(item.row.objectId);
      this.attrs.splice(item.$index, 1);
    },
    onEditorChange({editor, html, text}) {//内容改变事件
      console.log("---内容改变事件---")
      this.content = html
      console.log(editor);
      console.log(text);
    },
    uploadImgFile(e) {
      if (e.target.files) {
        var localFile  = e.target.files[0];
        if (e.target.files[0].size > 5*1024*100) {
          this.$message.warning(`当前文件有${parseInt(e.target.files[0].size / 1024)}kb，为保障页面顺畅加载，上传文件不得超过500kb`);
          return false;
        }
        var file = this.$Bmob.File(localFile.name, localFile);
        file.save().then((file) => {
          let quill = this.$refs.myQuillEditor.quill
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.url为服务器返回的图片地址
          quill.insertEmbed(length, 'image', file[0].url)
          // 调整光标到最后
          quill.setSelection(length + 1)
        }, () => {
          this.imgLoading = false;
          this.$message.error('图片插入失败');
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
      }
    },


    getInfo(id) {
      this.loading = true;
      var query = this.$Bmob.Query('product');
      query.get(id).then((data) => {
        this.loading = false;
        this.form = {
          objectId: data.objectId ? data.objectId : '',
          title: data.title,
          desc: data.desc,
					imgSrc: data.imgSrc,
          system: data.system || [],
          tags: data.tags || [],
          isHot: data.isHot ? data.isHot : 0,
          content: data.content,
          status: data.status,
          website: data.website ? data.website : undefined,
          notDelete: data.notDelete,
          groupCount: data.groupCount || -1,
        }
        this.getSkus(id);
      });
    },
    importClick() {
      this.imgLoading = false;
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    uploadFile(e) {
      if (e.target.files) {
        var localFile  = e.target.files[0];
        if (e.target.files[0].size > 5*1024*100) {
          this.$message.warning(`当前文件有${parseInt(e.target.files[0].size / 1024)}kb,上传文件不得超过500kb`);
          return false;
        }
        this.imgLoading = true;
        var file = this.$Bmob.File(localFile.name, localFile);
        file.save().then((file) => {
          this.imgLoading = false;
          this.form.imgSrc = file[0].url;
        }, () => {
          this.imgLoading = false;
          // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        });
      }
    },

    submitForm(status) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          const query = this.$Bmob.Query('product');
          if (this.form.objectId) {
            query.set('id', this.form.objectId)
          }

          if(this.form.title) {
            query.set('title', this.form.title);
          }

          if(this.form.desc) {
            query.set('desc', this.form.desc);
          }

          if(this.form.imgSrc) {
            query.set('imgSrc', this.form.imgSrc);
          }
          
          if(this.form.system) {
            query.set('system', this.form.system);
          }

          if(this.form.tags) {
            query.set('tags', this.form.tags);
          }

          if (this.form.groupCount) {
            query.set('groupCount', this.form.groupCount);
					} else {
            query.set('groupCount', -1);
          }

          if (this.form.website) {
            query.set('website', this.form.website );
          }

          if(this.form.isHot) {
            query.set('isHot', this.form.isHot );
          }

          if (this.form.content) {
            query.set('content', this.form.content);
					}
					
					if (!this.form.skus) {
						query.set('skus', {"__op": "AddRelation","objects": [{"__type": "Pointer","className": "skus","objectId": ""}]}	);
					}

          query.set('notDelete', true);
          query.set('status', Number(status));
          if (status === -1) {
            query.set('recommend', false);
          }

          query.save().then((res) => {
            if (this.form.objectId) {
              this.editSkus();
            } else {
              this.addSkus(res.objectId || this.form.objectId);
            }
          }).catch(error => {
            console.log(error);
            this.loading = false;
          });
        }
      });
    },
    addSkus(productId) {
      const queryArray = new Array();
      // 构造含有50个对象的数组
      for(var i = 0 ; i < this.attrs.length ; i++){
        var queryObj = this.$Bmob.Query('skus');
        const pointer = this.$Bmob.Pointer('product');
        const poiID = pointer.set(productId);
        queryObj.set('productId', poiID);
        queryObj.set('attrName', this.attrs[i].attrName);
        queryObj.set('attrNum', this.attrs[i].attrNum);
        queryObj.set('attrPrice', this.attrs[i].attrPrice);
        queryArray.push(queryObj);
      }

      // 传入刚刚构造的数组
      this.$Bmob.Query('skus').saveAll(queryArray).then(result => {
        let arr = [];
        for (let i = 0; i < result.length; i += 1) {
          if (result[i].success) {
            arr.push(result[i].success.objectId);
          }
        }

        const relation = this.$Bmob.Relation('skus') // 需要关联的表
        const relID = relation.add(arr) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
        const query = this.$Bmob.Query('product')
        query.get(productId).then(res => {
          res.set('skus',relID); // 将Relation对象保存到two字段中，即实现了一对多的关联
          res.save().then((r) => {
            console.log(r)
          })
        })
        this.loading = false;
        this.$message.success('提交成功！');
        this.$router.back(-1);
      }).catch(err => {
        console.log(err);
      });
    },
    editSkus() {
			const that = this;
      let attrs = this.attrs;
      let removeAtts = this.removeAtts;
      let ps = [];

      for (let i = 0; i < attrs.length; i += 1) {
        ps[i] = new Promise((resolve, reject) => {
          if (attrs[i].objectId) {
            const query = this.$Bmob.Query('skus');
            query.get(attrs[i].objectId).then(respon => {
              respon.set('attrName', attrs[i].attrName);
              respon.set('attrNum', attrs[i].attrNum);
              respon.set('attrPrice', attrs[i].attrPrice);
              respon.save().then((res) => {
                resolve(res);
              })
            }).catch(err => {
              reject(err)
            })
          } else {
            const query = this.$Bmob.Query('skus');
            const pointer = this.$Bmob.Pointer('product');
            const poiID = pointer.set(this.form.objectId);
            query.set('productId', poiID);
            query.set('attrName', attrs[i].attrName);
            query.set('attrNum', attrs[i].attrNum);
            query.set('attrPrice', attrs[i].attrPrice);
            query.save().then(res => {
              resolve(res);
            }).catch(err => {
              reject(err)
            })
          }
        });
      }

      for (let i = 0; i < removeAtts.length; i += 1) {
        ps.push(
          new Promise((resolve, reject) => {
            const query = this.$Bmob.Query('skus');
            query.get(removeAtts[i]).then(res => {
              res.destroy().then(res => {
                resolve(res);
              }).catch(err => {
                reject(err)
              })
            }).catch(err => {
              reject(err)
            })
          })
        )
      }

      Promise.all(ps).then((result) => {
				const ids = [];
				for (let i = 0; i < result.length; i += 1) {
					if(result[i].objectId) {
						ids.push(result[i].objectId);
					}
				}
				const relation = that.$Bmob.Relation('skus') // 需要关联的表
				const relID = relation.add(ids) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
				const query = that.$Bmob.Query('product')
				query.get(this.form.objectId).then(respon => {
					respon.set('skus',relID); // 将Relation对象保存到two字段中，即实现了一对多的关联
					respon.save().then((res) => {
						console.log(res);
						that.loading = false;
						that.$message.success('编辑成功！');
						that.$router.back(-1);
					})
				})
      }).catch((error) => {
        console.log(error)
      })
    },
    getSkus() {
      const pointer = this.$Bmob.Pointer('product')
      const poiID = pointer.set(this.form.objectId)

      const query = this.$Bmob.Query('skus')
      //userId 字段名称关联用户表 ，类型Pointer
      query.equalTo("productId","==", poiID);
      query.find().then(res => {
        this.attrs = res;
      })
    },

    close() {
      this.form = {};
    },
  },
};
</script>

<style lang="scss" scoped>
  .product-page {
    padding: 50px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: auto;
    box-sizing: border-box;
    .form {
      width: 100%;
      max-width: 900px;

      /deep/ .el-form-item__content{
        line-height: normal;
        /deep/.ql-editor{
          height: 600px;
        }
      }
    }
  }

  .el-select-dropdown__item {
    display: flex;
    height: 36px;
    align-items: center;
    .the-icon {
      display: inline-flex;
      align-items: center;
      /deep/ .icon {
        width: 18px;
        height: 18px;
        opacity: 0.5;
      }
    }
    .the-title {
      flex: 1;
      padding-left: 10px;
      font-size: 13px;
      box-sizing: border-box;
      color: #666;
    }
  }

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
</style>
