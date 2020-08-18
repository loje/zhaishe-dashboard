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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$Bmob.User.login(this.form.username, this.form.password).then((user) => {
            if (user.isCustomer === false) {
              this.$message.warning('此用户已被封禁');
              return false;
            }
            if (user.isAdmin === false) {
              this.$message.warning('此用户不是管理员');
              return false;
            }

            const data = {
              emailVerified: user.emailVerified,
              mobilePhoneNumber: user.mobilePhoneNumber,
              mobilePhoneVerified: user.mobilePhoneVerified,
              username: user.username,
              userid: user.objectId,
            };
            localStorage.setItem('userInfo', JSON.stringify(data));
            this.$store.dispatch('getUser', user);
            this.$router.push('/');
            this.$message.success('登录成功');
            // 登录成功
          }, (err) => {
            // 登录失败（可能是密码错误）
            if (err.error === 'username or password incorrect.') {
              this.$message.error('用户名或密码错误。');
              return false;
            }
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
    background-color: #fafafa;
    .login-box {
      margin: auto;
      padding: 30px 15px 15px 15px;
      border-radius: 3px;
      background-color: #fff;
      transition: all 250ms ease;
      &:hover {
        box-shadow: 0px 0px 12px rgba(0,0,0,0.1);
      }
      .logo {
        margin: auto;
        width: 181px;
        height: 52px;
      }
      .login-form {
        margin-top: 40px;
        width: 368px;
        /deep/.el-form-item:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
</style>
