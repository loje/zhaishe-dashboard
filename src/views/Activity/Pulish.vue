<template>
	<div class="pulish-page" id="pulish">
		<el-form
			:model="form"
			label-position="right"
			label-width="150px"
			:rules="rules"
			class="form"
			ref="form"
			v-loading="pulishLoading"
		>
			<el-form-item label="仅供展示" prop="isShow">
				<div style="line-height: 40px">
					<el-switch
						v-model="form.isShow"
						active-text="开启"
						inactive-text="关闭"
					>
					</el-switch>
				</div>
			</el-form-item>
			<el-form-item label="活动标题" prop="title">
				<el-input
					v-model="form.title"
					placeholder="请输入标题，最多10字"
				></el-input>
			</el-form-item>
			<el-form-item label="活动描述" prop="desc">
				<el-input
					v-model="form.desc"
					type="textarea"
					rows="3"
					placeholder="请输入活动描述（仅支持纯文本，不支持换行等富文本格式，换行会直接被转义为空格）"
				></el-input>
			</el-form-item>
			<el-form-item label="活动主办方" prop="sponsor">
				<el-input v-model="form.sponsor" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="活动形式" prop="mode">
				<div style="line-height: 40px">
					<el-tag
						:key="tag"
						v-for="tag in form.mode"
						closable
						:disable-transitions="false"
						@close="handleClose(tag)"
					>
						{{ tag }}
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
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						@click="showInput"
						>+ 增加标签</el-button
					>
				</div>
			</el-form-item>
			<el-form-item label="活动类型" prop="sort">
				<el-select v-model="form.sort" placeholder="请选择活动类型">
					<el-option
						v-for="(item, $index) in sortList"
						:key="$index"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="活动图片" prop="imgSrc">
				<div style="line-height: 40px; color: #999">
					(图片长宽280px * 160px)
				</div>
				<div
					@click="importClick"
					class="el-upload el-upload--picture-card"
					style="width: 280px; height: 160px"
					v-loading="imgLoading"
				>
					<el-image
						:src="form.imgSrc"
						v-if="form.imgSrc"
						fit="contain"
						class="img"
						style="width: 100%; height: 100%"
						lazy
					></el-image>
					<i class="el-icon-plus" v-else></i>
					<input
						accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg"
						@change="uploadFile"
						class="el-upload__input"
						:multiple="false"
						name="file"
						ref="input"
						type="file"
					/>
				</div>
			</el-form-item>
			<el-form-item label="活动精选图片" prop="imgChoicenessSrc">
				<div style="line-height: 40px; color: #999">
					(图片长宽210px * 240px)
				</div>
				<div
					@click="importChoicenessClick"
					class="el-upload el-upload--picture-card"
					style="width: 210px; height: 240px; line-height: 240px"
					v-loading="imgChoicenessLoading"
				>
					<el-image
						:src="form.imgChoicenessSrc"
						v-if="form.imgChoicenessSrc"
						fit="contain"
						class="img"
						style="width: 100%; height: 100%"
						lazy
					></el-image>
					<i class="el-icon-plus" v-else></i>
					<input
						accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg"
						@change="uploadChoicenessFile"
						class="el-upload__input"
						:multiple="false"
						name="file"
						ref="choicenessInput"
						type="file"
					/>
				</div>
			</el-form-item>
			<el-form-item label="报名时间" prop="time">
				<el-date-picker
					v-model="form.time"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				>
				</el-date-picker>
			</el-form-item>

			<el-form-item label="活动时间" prop="actTime">
				<el-date-picker
					v-model="form.actTime"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				>
				</el-date-picker>
			</el-form-item>

			<el-form-item label="门票规格">
				<el-button
					type="warning"
					icon="el-icon-plus"
					size="medium"
					plain
					@click="addAttr"
					:disabled="attrs.length >= 6"
					>添加规格（最多6个，最少1个）</el-button
				>
				<el-table
					:data="attrs"
					size="small"
					border
					stripe
					style="margin-top: 10px"
				>
					<el-table-column label="规格名称" prop="attrName">
						<template slot-scope="scope">
							<el-input
								size="small"
								v-model="scope.row.attrName"
								maxlength="100"
								required
							></el-input>
						</template>
					</el-table-column>
					<el-table-column label="库存" prop="attrNum" align="center">
						<template slot-scope="scope">
							<el-input-number
								v-model="scope.row.attrNum"
								size="small"
								controls-position="right"
								:min="0"
								:precision="0"
							></el-input-number>
						</template>
					</el-table-column>
					<el-table-column label="单价（元）" prop="attrPrice" align="center">
						<template slot-scope="scope">
							<el-input-number
								v-model="scope.row.attrPrice"
								size="small"
								controls-position="right"
								:min="0"
								:precision="2"
							></el-input-number>
						</template>
					</el-table-column>
					<el-table-column label="规格备注" prop="attrTips">
						<template slot-scope="scope">
							<el-input
								size="small"
								v-model="scope.row.attrTips"
							></el-input>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="right">
						<template slot-scope="scope">
							<el-button
								type="danger"
								icon="el-icon-delete"
								size="small"
								@click="delAttr(scope)"
							></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item label="活动地点" prop="address">
				<el-input v-model="form.address" placeholder="地点不限"></el-input>
			</el-form-item>
			<el-form-item label="活动议程" prop="agenda" style="max-width: 1500px">
				<div
					class="speaker"
					style="overflow: hidden"
					v-for="(item, $index) in agendaList"
					:key="$index"
				>
					<div
						class="speaker-img"
						:style="{ backgroundImage: `url(${item.imgSrc})` }"
					></div>
					<div class="speaker-right">
						<div class="title">{{ item.title }}</div>
						<div class="theme">《{{ item.theme }}》</div>
						<div class="the-title">{{ item.theTitle }}</div>
					</div>
					<div class="speaker-hover">
						<div class="hover-flex">
							<i
								class="el-icon-picture-outline-round"
								@click="importHeadClick($index)"
							></i>
						</div>
						<div class="hover-flex">
							<i class="el-icon-delete" @click="agendaRemove($index)"></i>
						</div>
					</div>
				</div>
				<input
					accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg"
					@change="uploadHeadFile"
					class="el-upload__input"
					:multiple="false"
					name="file"
					ref="headInput"
					type="file"
				/>

				<div class="speaker speaker-edit">
					<div
						@click="importAgendaClick"
						class="el-upload el-upload--picture-card speaker-img"
						v-loading="imgAgendaLoading"
					>
						<el-image
							:src="agendaEdit.imgSrc"
							v-if="agendaEdit.imgSrc"
							fit="cover"
							class="img"
							style="width: 100%; height: 100%"
							lazy
						></el-image>
						<i class="el-icon-plus" v-else></i>
						<input
							accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg"
							@change="uploadAgendaFile"
							class="el-upload__input"
							:multiple="false"
							name="file"
							ref="agendaInput"
							type="file"
						/>
					</div>
					<div class="speaker-right">
						<el-input
							type="text"
							size="mini"
							v-model="agendaEdit.title"
							placeholder="请输入分享人名字"
						></el-input>
						<el-input
							type="text"
							size="mini"
							v-model="agendaEdit.theme"
							placeholder="请输入分享标题"
							style="margin-top: 10px"
						></el-input>
						<el-input
							type="text"
							size="mini"
							v-model="agendaEdit.theTitle"
							placeholder="请输入分享人头衔"
							style="margin-top: 10px"
						></el-input>
					</div>
					<div class="speaker-btn">
						<el-button
							type="primary"
							size="medium"
							icon="el-icon-plus"
							@click="agendaAdd"
							>增加</el-button
						>
					</div>
				</div>
			</el-form-item>

			<el-form-item label="活动详情" prop="content">
				<div id="editor"></div>
				<!-- <input
					accept="application/pdf, image/gif, image/jpeg, image/jpg, image/png, image/svg"
					@change="uploadImgFile"
					class="el-upload__input"
					:multiple="false"
					name="file"
					ref="imgInput"
					type="file"
				/> -->

				<!-- <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)" style="width: 100%;"></quill-editor> -->
			</el-form-item>
			<el-form-item align="right">
				<el-button @click="submitForm('0')">设为暂存</el-button>
				<el-button type="primary" @click="submitForm('1')">发布</el-button>
			</el-form-item>
		</el-form>

		<!-- <el-dialog
			width="50%"
			id="video_upload"
			style="margin-top: 1px"
			title="视频上传"
			:visible.sync="videoUploadTag"
			append-to-body
		>
			<el-input
				v-model="videoLink"
				placeholder="请输入视频链接"
				clearable
			></el-input>
			<el-button
				type="primary"
				size="small"
				style="margin: 20px 0px 0px 0px"
				@click="addVideoLink()"
				>添加
			</el-button>
		</el-dialog> -->
	</div>
</template>

<script>
import wangEditor from "wangeditor";
// const editor = new E("#editor");
// const toolbarOptions = [
//   ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
//   [{'header': 1}, {'header': 2}],               // custom button values
//   [{'list': 'ordered'}, {'list': 'bullet'}],
//   [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
//   [{'direction': 'rtl'}],                         // text direction
//   [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
//   [{'header': [1, 2, 3, 4, 5, 6, false]}],
//   [{'color': []}, {'background': []}],          // dropdown with defaults from theme
//   [{'font': []}],
//   [{'align': []}],
//   ['link', 'image', 'video'],
//   ['clean']
// ]

// import {
//   quillEditor
// } from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// const E = window.wangEditor
export default {
	data() {
		// var self2 = this;
		return {
			editor: null,
			// content: null,
			// //显示插入视频链接弹框的标识
			// videoUploadTag: false,
			// //弹框插入的视频链接记录
			// videoLink:"",
			// editorOption: {
			//   placeholder: '',
			//   theme: 'snow',  // or 'bubble'
			//   modules: {
			//     toolbar: {
			//       container: toolbarOptions,
			//       handlers: {
			//         'image': (value) => {
			//           if (value) {
			//             // 触发input框选择图片文件
			//             // document.querySelector('.avatar-uploader input').click()
			//             this.$refs.imgInput.value = null;
			//             this.$refs.imgInput.click();
			//           } else {
			//             this.quill.format('image', false);
			//           }
			//         },
			//         'video': function() {
			//           self2.videoUploadTag = true;
			//         }
			//       }
			//     }
			//   }
			// },
			// serverUrl: '/manager/common/imgUpload',  // 这里写你要上传的图片服务器地址

			attrs: [{}],
			removeAtts: [],
			form: {
				mode: [],
			},
			rules: {
				title: [{ required: true, message: "请输入", trigger: "blur" }],
				sponsor: [{ required: true, message: "请输入", trigger: "blur" }],
				desc: [{ required: true, message: "请输入", trigger: "blur" }],
				mode: [{ required: true, message: "请输入", trigger: "blur" }],
				sort: [{ required: true, message: "请输入", trigger: "blur" }],
				imgSrc: [{ required: true, message: "请上传图片", trigger: "blur" }],
				imgChoicenessSrc: [
					{ required: true, message: "请上传图片", trigger: "blur" },
				],
				content: [{ required: true, message: "请输入", trigger: "blur" }],
			},
			imgLoading: false,
			imgChoicenessLoading: false,

			pulishLoading: false,
			modes: [],
			modeList: [
				{
					label: "线下活动",
					value: 1,
				},
				{
					label: "线上直播",
					value: 2,
				},
			],
			sorts: [],
			sortList: [
				{
					label: "展览",
					value: 1,
				},
				{
					label: "知识",
					value: 2,
				},
				{
					label: "发现",
					value: 3,
				},
				{
					label: "其他",
					value: 4,
				},
			],

			imgAgendaLoading: false,
			agendaList: [],
			agendaEdit: {
				imgSrc: "",
			},

			headIndex: "",

			inputVisible: false,
			inputValue: "",
		};
	},
	// components: {
	// 	// quillEditor,
	// },
	mounted() {
		const that = this;
    const editor = new wangEditor(`#editor`)
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
       that.form.content = newHtml
		};
		
		this.editor = editor;

		this.editor.config.height = 500;
		this.editor.config.uploadImgMaxSize = 10 * 1024 * 100;
		this.editor.create();

		this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
			// resultFiles 是 input 中选中的文件列表
			if (resultFiles) {
				let localFile = resultFiles[0];

				var file = that.$Bmob.File(localFile.name, localFile);
				file.save().then(
					(file) => {
						insertImgFn(file[0].url);
					},
					() => {
						that.imgLoading = false;
						that.$message.error("图片插入失败");
						// 保存失败，可能是文件无法被读取，或者上传过程中出现问题
					}
				);
			}
		};
		if (this.$route.query.id) {
			this.getInfo();
		}
	},
	methods: {
		handleClose(tag) {
			this.form.mode.splice(this.form.mode.indexOf(tag), 1);
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick(() => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},

		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue && this.form.mode.indexOf(inputValue) === -1) {
				this.form.mode.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = "";
		},
		addAttr() {
			this.attrs.push({});
		},
		delAttr(item) {
			this.removeAtts.push(item.row.objectId);
			this.attrs.splice(item.$index, 1);
		},
		// onEditorChange({ editor, html, text }) {
		// 	//内容改变事件
		// 	console.log("---内容改变事件---");
		// 	this.content = html;
		// 	console.log(editor);
		// 	// console.log(html);
		// 	console.log(text);
		// },

		// uploadImgFile(e) {
		// 	if (e.target.files) {
		// 		var localFile = e.target.files[0];
		// 		if (e.target.files[0].size > 10 * 1024 * 100) {
		// 			this.$message.warning(
		// 				`当前文件有${parseInt(
		// 					e.target.files[0].size / 1024
		// 				)}kb，为保障页面顺畅加载，上传文件不得超过1mb`
		// 			);
		// 			return false;
		// 		}
		// 		var file = this.$Bmob.File(localFile.name, localFile);
		// 		file.save().then(
		// 			(file) => {
		// 				console.log(file);
		// 				let quill = this.$refs.myQuillEditor.quill;
		// 				// 获取光标所在位置
		// 				let length = quill.getSelection().index;
		// 				// 插入图片  res.url为服务器返回的图片地址
		// 				quill.insertEmbed(length, "image", file[0].url);
		// 				// 调整光标到最后
		// 				quill.setSelection(length + 1);
		// 			},
		// 			() => {
		// 				this.imgLoading = false;
		// 				this.$message.error("图片插入失败");
		// 				// console.error(error);
		// 				// 保存失败，可能是文件无法被读取，或者上传过程中出现问题
		// 			}
		// 		);
		// 	}
		// },

		// addVideoLink() {
		//   if (this.videoLink.length == 0) {
		//     alert('请输入视频链接');
		//   }
		//   //当编辑器中没有输入文本时，这里获取到的 range 为 null
		//   var range = this.$refs.myQuillEditor.quill.getSelection();
		//   //视频插入在富文本中的位置
		//   var index = 0;
		//   if (range == null) {
		//     index = 0;
		//   } else {
		//     index = range.index;
		//   }
		//   //隐藏弹框
		//   this.videoUploadTag = false;
		//   //将视频链接插入到当前的富文本当中
		//   this.$refs.myQuillEditor.quill.insertEmbed(index, 'video', this.videoLink);
		// },
		getInfo() {
			this.pulishLoading = true;
			var query = this.$Bmob.Query("activity");
			query.get(this.$route.query.id).then((data) => {
				for (let key in data.startTime) {
					if (key === "iso") {
						this.form.startTime = data.startTime[key];
					}
				}
				for (let key in data.endTime) {
					if (key === "iso") {
						this.form.endTime = data.endTime[key];
					}
				}
				for (let key in data.startActTime) {
					if (key === "iso") {
						this.form.startActTime = data.startActTime[key];
					}
				}
				for (let key in data.endActTime) {
					if (key === "iso") {
						this.form.endActTime = data.endActTime[key];
					}
				}
				this.pulishLoading = false;
				if (data.agenda) {
					this.agendaList = JSON.parse(data.agenda);
				}
				this.form = {
					isShow: data.isShow,
					title: data.title,
					desc: data.desc,
					sponsor: data.sponsor,
					imgSrc: data.imgSrc,
					imgChoicenessSrc: data.imgChoicenessSrc || "",
					mode: data.mode || [],
					sort: this.sortList[data.sort - 1].value,
					time: [this.form.startTime, this.form.endTime],
					actTime: [this.form.startActTime, this.form.endActTime],

					address: data.address,
					content: data.content,
				};

				this.editor.txt.html(this.form.content);
				this.getSkus(this.$route.query.id);
			});
		},

		submitForm(status) {
			const that = this;

			this.$refs.form.validate((valid) => {
				if (valid) {
					that.pulishLoading = true;
					if (!that.$route.query.id) {
						const query = that.$Bmob.Query("activity");
						if (that.form.isShow) {
							query.set("isShow", that.form.isShow);
						}

						if (that.form.title) {
							query.set("title", that.form.title);
						}

						if (that.form.desc) {
							query.set("desc", that.form.desc);
						}

						if (that.form.sponsor) {
							query.set("sponsor", that.form.sponsor);
						}

						if (that.form.mode) {
							query.set("mode", that.form.mode);
						}

						if (that.form.sort) {
							query.set("sort", that.sortList[that.form.sort - 1].value);
						}

						if (that.form.imgSrc) {
							query.set("imgSrc", that.form.imgSrc);
						}

						if (that.form.imgChoicenessSrc) {
							query.set("imgChoicenessSrc", that.form.imgChoicenessSrc);
						}

						if (that.form.time && that.form.time[0]) {
							query.set("startTime", {
								__type: "Date",
								iso: that.form.time[0],
							});
						}
						if (that.form.time && that.form.time[1]) {
							query.set("endTime", { __type: "Date", iso: that.form.time[1] });
						}

						if (that.form.actTime && that.form.actTime[0]) {
							query.set("startActTime", {
								__type: "Date",
								iso: that.form.actTime[0],
							});
						}
						if (that.form.actTime && that.form.actTime[1]) {
							query.set("endActTime", {
								__type: "Date",
								iso: that.form.actTime[1],
							});
						}

						if (that.form.address) {
							query.set("address", that.form.address);
						}

						if (that.agendaList.length > 0) {
							query.set("agenda", JSON.stringify(that.agendaList));
						}

						if (that.form.content) {
							query.set("content", that.form.content);
						}

						query.set("notDelete", true);
						query.set("status", Number(status));
						if (Number(status) === 0) {
							query.set("isTop", false);
						}

						query.save().then((res) => {
							that.addSkus(res.objectId || this.$route.query.id);
						}),
							(error) => {
								console.log(error);
								that.pulishLoading = false;
							};
					} else {
						const query = that.$Bmob.Query("activity");
						query.set("id", that.$route.query.id);

						if (that.form.isShow) {
							query.set("isShow", that.form.isShow);
						} else {
							query.set("isShow", false);
						}

						if (that.form.title) {
							query.set("title", that.form.title);
						}

						if (that.form.desc) {
							query.set("desc", that.form.desc);
						}

						if (that.form.sponsor) {
							query.set("sponsor", that.form.sponsor);
						}

						if (that.form.mode) {
							query.set("mode", that.form.mode);
						}

						if (that.form.sort) {
							query.set("sort", that.sortList[that.form.sort - 1].value);
						}

						if (that.form.imgSrc) {
							query.set("imgSrc", that.form.imgSrc);
						}

						if (that.form.imgChoicenessSrc) {
							query.set("imgChoicenessSrc", that.form.imgChoicenessSrc);
						}

						if (that.form.time && that.form.time[0]) {
							query.set("startTime", {
								__type: "Date",
								iso: that.form.time[0],
							});
						}
						if (that.form.time && that.form.time[1]) {
							query.set("endTime", { __type: "Date", iso: that.form.time[1] });
						}

						if (that.form.actTime && that.form.actTime[0]) {
							query.set("startActTime", {
								__type: "Date",
								iso: that.form.actTime[0],
							});
						}
						if (that.form.actTime && that.form.actTime[1]) {
							query.set("endActTime", {
								__type: "Date",
								iso: that.form.actTime[1],
							});
						}

						if (that.form.address) {
							query.set("address", that.form.address);
						}

						if (that.agendaList.length > 0) {
							query.set("agenda", JSON.stringify(that.agendaList));
						}

						if (that.form.content) {
							query.set("content", that.form.content);
						}

						query.set("notDelete", true);
						query.set("status", Number(status));
						if (Number(status) === 0) {
							query.set("isTop", false);
						}
						query.save().then(() => {
							that.editSkus();
						});
					}
				} else {
					return false;
				}
			});
		},
		addSkus(activityId) {
			const that = this;
			const queryArray = new Array();
			// 构造含有50个对象的数组
			for (var i = 0; i < this.attrs.length; i++) {
				var queryObj = this.$Bmob.Query("skus");
				const pointer = this.$Bmob.Pointer("activity");
				const poiID = pointer.set(activityId);
				queryObj.set("activityId", poiID);
				queryObj.set("attrName", this.attrs[i].attrName);
				if (this.attrs[i].attrTips) {
					queryObj.set("attrTips", this.attrs[i].attrTips);
				} else {
					queryObj.unset("attrTips");
				}
				queryObj.set("attrNum", this.attrs[i].attrNum);
				queryObj.set("attrPrice", this.attrs[i].attrPrice);
				queryArray.push(queryObj);
			}

			// 传入刚刚构造的数组
			this.$Bmob
				.Query("skus")
				.saveAll(queryArray)
				.then((result) => {
					let arr = [];
					for (let i = 0; i < result.length; i += 1) {
						if (result[i].success) {
							arr.push(result[i].success.objectId);
						}
					}

					const relation = this.$Bmob.Relation("skus"); // 需要关联的表
					const relID = relation.add(arr); //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
					const query = this.$Bmob.Query("activity");
					query.get(activityId).then((res) => {
						res.set("skus", relID); // 将Relation对象保存到two字段中，即实现了一对多的关联
						res.save().then((r) => {
							console.log(r);
						});
					});
					that.pulishLoading = false;
					that.$message.success("添加成功！");
					that.$router.back(-1);
				})
				.catch((err) => {
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
						const query = this.$Bmob.Query("skus");
						query
							.get(attrs[i].objectId)
							.then((respon) => {
								respon.set("attrName", attrs[i].attrName);
								respon.set("attrNum", attrs[i].attrNum);
								if (attrs[i].attrTips) {
									respon.set("attrTips", attrs[i].attrTips);
								} else {
									respon.unset("attrTips");
								}
								respon.set("attrPrice", attrs[i].attrPrice);
								respon.save().then((res) => {
									resolve(res);
								});
							})
							.catch((err) => {
								reject(err);
							});
					} else {
						const query = this.$Bmob.Query("skus");
						const pointer = this.$Bmob.Pointer("activity");
						const poiID = pointer.set(this.$route.query.id);
						query.set("activityId", poiID);
						query.set("attrName", attrs[i].attrName);
						query.set("attrNum", attrs[i].attrNum);
						if (attrs[i].attrTips) {
							query.set("attrTips", attrs[i].attrTips);
						} else {
							query.unset("attrTips");
						}
						query.set("attrPrice", attrs[i].attrPrice);
						query
							.save()
							.then((res) => {
								resolve(res);
							})
							.catch((err) => {
								reject(err);
							});
					}
				});
			}

			for (let i = 0; i < removeAtts.length; i += 1) {
				ps.push(
					new Promise((resolve, reject) => {
						const query = this.$Bmob.Query("skus");
						query
							.get(removeAtts[i])
							.then((res) => {
								res
									.destroy()
									.then((res) => {
										resolve(res);
									})
									.catch((err) => {
										reject(err);
									});
							})
							.catch((err) => {
								reject(err);
							});
					})
				);
			}

			Promise.all(ps)
				.then((result) => {
					const ids = [];
					for (let i = 0; i < result.length; i += 1) {
						if (result[i].objectId) {
							ids.push(result[i].objectId);
						}
					}
					const relation = that.$Bmob.Relation("skus"); // 需要关联的表
					const relID = relation.add(ids); //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
					const query = that.$Bmob.Query("activity");
					query.get(that.$route.query.id).then((respon) => {
						respon.set("skus", relID); // 将Relation对象保存到two字段中，即实现了一对多的关联
						respon.save().then(() => {
							that.pulishLoading = false;
							that.$message.success("编辑成功！");
							that.$router.back(-1);
						});
					});
				})
				.catch((error) => {
					console.log(error);
				});
		},
		getSkus() {
			const pointer = this.$Bmob.Pointer("activity");
			const poiID = pointer.set(this.$route.query.id);

			const query = this.$Bmob.Query("skus");
			//userId 字段名称关联用户表 ，类型Pointer
			query.equalTo("activityId", "==", poiID);
			query.find().then((res) => {
				this.attrs = res;
			});
		},
		importClick() {
			this.imgLoading = false;
			this.$refs.input.value = null;
			this.$refs.input.click();
		},
		uploadFile(e) {
			if (e.target.files) {
				var localFile = e.target.files[0];
				if (e.target.files[0].size > 5 * 1024 * 100) {
					this.$message.warning(
						`当前文件有${parseInt(
							e.target.files[0].size / 1024
						)}kb,上传文件不得超过500kb`
					);
					return false;
				}
				this.imgLoading = true;
				var file = this.$Bmob.File(localFile.name, localFile);
				file.save().then(
					(file) => {
						this.imgLoading = false;
						this.form.imgSrc = file[0].url;
					},
					() => {
						this.imgLoading = false;
						// console.error(error);
						// 保存失败，可能是文件无法被读取，或者上传过程中出现问题
					}
				);
			}
		},

		importChoicenessClick() {
			this.imgChoicenessLoading = false;
			this.$refs.choicenessInput.value = null;
			this.$refs.choicenessInput.click();
		},
		uploadChoicenessFile(e) {
			if (e.target.files) {
				var localFile = e.target.files[0];
				if (e.target.files[0].size > 5 * 1024 * 100) {
					this.$message.warning(
						`当前文件有${parseInt(
							e.target.files[0].size / 1024
						)}kb,上传文件不得超过500kb`
					);
					return false;
				}
				this.imgChoicenessLoading = true;
				var file = this.$Bmob.File(localFile.name, localFile);
				file.save().then(
					(file) => {
						this.imgChoicenessLoading = false;
						this.form.imgChoicenessSrc = file[0].url;
					},
					() => {
						this.imgChoicenessLoading = false;
						// console.error(error);
						// 保存失败，可能是文件无法被读取，或者上传过程中出现问题
					}
				);
			}
		},

		importAgendaClick() {
			this.imgAgendaLoading = false;
			this.$refs.agendaInput.value = null;
			this.$refs.agendaInput.click();
		},
		uploadAgendaFile(e) {
			if (e.target.files) {
				var localFile = e.target.files[0];
				if (e.target.files[0].size > 5 * 1024 * 100) {
					this.$message.warning(
						`当前文件有${parseInt(
							e.target.files[0].size / 1024
						)}kb,上传文件不得超过500kb`
					);
					return false;
				}
				this.imgAgendaLoading = true;
				var file = this.$Bmob.File(localFile.name, localFile);
				file.save().then(
					(file) => {
						this.imgAgendaLoading = false;
						this.agendaEdit.imgSrc = file[0].url;
						// that.form.img = file;
					},
					() => {
						this.imgAgendaLoading = false;
						// console.error(error);
						// 保存失败，可能是文件无法被读取，或者上传过程中出现问题
					}
				);
			}
		},

		importHeadClick(i) {
			console.log(i);
			this.headIndex = i;
			// this.imgAgendaLoading = false;
			this.$refs.headInput.value = null;
			this.$refs.headInput.click();
		},
		uploadHeadFile(e) {
			if (e.target.files) {
				var localFile = e.target.files[0];
				if (e.target.files[0].size > 5 * 1024 * 100) {
					this.$message.warning(
						`当前文件有${parseInt(
							e.target.files[0].size / 1024
						)}kb,上传文件不得超过500kb`
					);
					return false;
				}
				// this.imgAgendaLoading = true;
				var file = this.$Bmob.File(localFile.name, localFile);
				file.save().then(
					(file) => {
						console.log(file);
						// this.imgAgendaLoading = false;
						this.agendaList[this.headIndex].imgSrc = file[0].url;
					},
					() => {
						// this.imgAgendaLoading = false;
						// console.error(error);
						// 保存失败，可能是文件无法被读取，或者上传过程中出现问题
					}
				);
			}
		},

		agendaAdd() {
			if (!this.agendaEdit.imgSrc) {
				this.$message.warning("请上传分享人头像");
				return false;
			}
			if (!this.agendaEdit.title) {
				this.$message.warning("请输入分享人名字");
				return false;
			}
			if (!this.agendaEdit.theme) {
				this.$message.warning("请输入分享标题");
				return false;
			}
			this.agendaList.push(this.agendaEdit);
			this.agendaEdit = {
				imgSrc: "",
			};
		},
		agendaRemove(index) {
			this.agendaList.splice(index, 1);
		},
	},
};
</script>

<style lang="scss" scoped>
.pulish-page {
	padding: 50px;
	width: 100%;
	height: 100%;
	background-color: #fff;
	overflow: auto;
	box-sizing: border-box;
	.form {
		width: 100%;
		::v-deep .el-form-item {
			max-width: 1000px;
		}
		::v-deep .el-form-item__content {
			line-height: normal;
			::v-deep.ql-editor {
				height: 600px;
			}
		}
	}
}

.speaker {
	position: relative;
	display: inline-block;
	margin-right: 10px;
	padding: 10px 15px;
	vertical-align: middle;
	box-sizing: border-box;
	border-radius: 4px;
	z-index: 1;
	&.speaker-edit {
		width: 270px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		border: 1px solid #ebeef5;
		border-bottom-left-radius: 0px;
		border-bottom-right-radius: 0px;
		.speaker-btn {
			display: none;
		}
		&:hover {
			.speaker-btn {
				display: block;
				position: absolute;
				left: 0;
				bottom: -36px;
				width: 100%;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				.el-button {
					width: 100%;
					border-top-left-radius: 0px;
					border-top-right-radius: 0px;
				}
			}
		}
	}

	.speaker-img {
		display: inline-block;
		width: 80px;
		height: 80px;
		line-height: 80px;
		border-radius: 50%;
		overflow: hidden;
		vertical-align: middle;
		background-size: cover;
		i {
			display: block;
			line-height: 80px;
		}
	}
	.speaker-right {
		display: inline-block;
		vertical-align: middle;
		padding-left: 15px;
		width: 150px;
		box-sizing: border-box;
		.title {
			font-size: 14px;
			line-height: 20px;
			color: #2b2b2b;
		}
		.theme {
			margin-top: 10px;
			font-size: 12px;
			line-height: 17px;
			color: #2b2b2b;
		}
	}
	.speaker-hover {
		opacity: 0;
		position: absolute;
		left: 0;
		top: 0;
		padding: 15px 0;
		width: 100%;
		height: 100%;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.75);
		box-sizing: border-box;
		z-index: 1;
		transition: opacity 250ms ease-in-out;
		.hover-flex {
			display: inline-flex;
			width: 50%;
			height: 100%;
			align-items: center;
			justify-content: center;
			border-right: 1px solid rgba(255, 255, 255, 0.25);
			box-sizing: border-box;
			i {
				font-size: 42px;
				cursor: pointer;
				transition: all 250ms ease-in-out;
			}
		}
		.hover-flex:nth-child(1) {
			i {
				color: #fff;
				opacity: 0.25;
				&:hover {
					opacity: 1;
				}
			}
		}
		.hover-flex:nth-child(2) {
			i {
				color: #fff;
				opacity: 0.25;
				&:hover {
					opacity: 1;
					color: #f56c6c;
				}
			}
		}
	}
	&:hover {
		.speaker-hover {
			opacity: 1;
		}
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

<style>
	.w-e-toolbar .w-e-menu {
		position: initial;
	}
	.w-e-panel-container {
		width: 750px!important;
    left: 0!important;
    margin-left: 0!important;
	}
</style>