<template>
  <div class="login-layer">
    <div class="login-box">
      <div class="logo">
        <el-image :src="src" class="img" lazy></el-image>
      </div>

      <el-form :model="form" :rules="rules" ref="form" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="el-icon-c-scale-to-original"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: 'http://lc-vwzm34py.cn-n1.lcfile.com/93e2bac101ef97002df9/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20191112155535.png',
      form: {},
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    }
  },
  methods: {
    submitForm() {
      const that = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.$AV.User.logIn(that.form.username, that.form.password).then(function (user) {
            const data = {
              emailVerified: user.attributes.emailVerified,
              mobilePhoneNumber: user.attributes.mobilePhoneNumber,
              mobilePhoneVerified: user.attributes.mobilePhoneVerified,
              username: user.attributes.username,
            };
            localStorage.setItem('userInfo', JSON.stringify(data));
            that.$store.dispatch('getUser', user);
            that.$router.push('/');
            // 登录成功
          }, function () {
            // 登录失败（可能是密码错误）
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
  .login-layer {
    display: flex;
    align-items: center;
    width: 100vw;
    height: 100vh;
    .login-box {
      margin: auto;
      .logo {
        margin: auto;
        width: 181px;
        height: 52px;
      }
      .login-form {
        margin-top: 40px;
        width: 368px;
      }
    }
  }
</style>
