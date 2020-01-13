<template>
  <div class="login">
    <el-card class="login-or-register-card">
      <div class="login-box" v-if="nowShowForm == 'loginForm'">
        <div class="login-logo"></div>
        <div class="login-tips">账号登录</div>
        <el-form
          :model="loginForm"
          class="login-form"
          :rules="loginFormRules"
          ref="loginValidateForm"
          @keyup.enter.native="onLogin"
        >
          <el-form-item prop="account">
            <el-input
              v-model.number="loginForm.account"
              placeholder="请输入手机号"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-key"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="button-list">
          <el-button type="primary" @click="onLogin()">登录</el-button>
          <el-button @click="changeForm">注册</el-button>
          <el-link
            href="#"
            target="_blank"
            :underline="false"
            type="info"
            class="forget-password"
          >忘记密码？</el-link>
        </div>
      </div>

      <div class="register-box" v-if="nowShowForm == 'registerForm'">
        <div class="register-logo"></div>
        <div class="register-tips">用户注册</div>
        <el-form
          :model="registerForm"
          class="register-form"
          :rules="registerFormRules"
          ref="registerValidateForm"
          @keyup.enter.native="onRegister"
        >
          <el-form-item prop="account">
            <el-input
              v-model.number="registerForm.account"
              placeholder="请输入手机号"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="registerForm.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-key"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              type="email"
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              prefix-icon="el-icon-message"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="button-list">
          <el-button type="primary" @click="onRegister">立即注册</el-button>
          <el-button @click="changeForm">返回登录</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import router from '../router/index'
import { login, register } from '../request/api'

export default {
  name: 'login',
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };//自定义手机号校验规则
    return {
      loginForm: {
        account: '',
        password: ''
      },//登录表单
      loginFormRules: {
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
      },//登录表单校验规则
      registerForm: {
        account: '',
        password: '',
        email: '',
      },//注册表单
      registerFormRules: {
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度在 6 到 18 个字符之间', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
      },//注册表单校验规则
      nowShowForm: 'loginForm',//当前显示的表单
    }
  },
  methods: {
    //切换显示的表单
    changeForm() {
      if (this.nowShowForm == 'loginForm') {
        this.nowShowForm = 'registerForm'
        this.$nextTick(() => {
          this.$refs['registerValidateForm'].resetFields()
        })
      } else {
        this.nowShowForm = 'loginForm'
        this.$nextTick(() => {
          this.$refs['loginValidateForm'].resetFields()
        })
      }
    },
    //用户登录
    onLogin() {
      this.$refs['loginValidateForm'].validate((valid) => {
        if (valid) {
          login({
            account: this.loginForm.account,
            password: this.loginForm.password
          }).then(res => {
            if (res.code == 200) {
              this.$message.success('登录成功！')
              router.push('/home')
            } else if (res.code == 0) {
              this.$message.error(res.message)
            }
            window.console.log(res)
          })
        } else {
          return false
        }
      })
    },
    //用户注册
    onRegister() {

      this.$refs['registerValidateForm'].validate((valid) => {
        if (valid) {
          register({
            account: this.registerForm.account,
            password: this.registerForm.password,
            email: this.registerForm.email
          }).then(res => {
            if (res.code == 200) {
              this.$message.success('注册成功，马上登录吧！')
              this.nowShowForm = 'loginForm'
            } else if (res.code == 0) {
              this.$message.error(res.message)
            }
            window.console.log(res)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  .login-or-register-card {
    width: 26em;
    height: 38em;
    background: #ffffff;
    position: absolute;
    top: 3em;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 0;
    .login-logo,
    .register-logo {
      width: 6em;
      height: 6em;
      margin: 0 auto;
      margin-top: 2em;
      border-radius: 50%;
      background-image: url("http://localhost:3000/upload/1575130990187-bd25cc614a670f4d5546fe82e239ef86.jpg");
      background-size: 10em 10em;
      background-position: -40px -20px;
    }
    .login-tips,
    .register-tips {
      font-size: 1.25em;
      width: 100%;
      text-align: center;
      margin-top: 1em;
      font-weight: 500;
    }
    .login-form,
    .register-form {
      width: 80%;
      margin: 0 auto;
      margin-top: 1.5em;
    }
    .button-list {
      width: 80%;
      margin: 0 auto;
      text-align: center;
      button {
        width: 100%;
        margin-left: 0;
        margin-top: 1.5em;
        height: 45px;
        border-radius: 0;
      }
      .forget-password {
        margin-top: 1.5em;
      }
    }
  }

  //修改默认input样式
  /deep/.el-input input {
    font-size: 1.2em;
    height: 45px;
    line-height: 45px;
    border-radius: 0;
  }
  /deep/.el-input__inner {
    padding-left: 60px;
  }
  /deep/.el-input__prefix {
    left: 1px;
    top: 1px;
    background: #f8f8f8;
    height: 43px;
    border-right: 1px solid #dcdfe6;
  }
  /deep/.el-input__icon {
    width: 45px;
    font-size: 1.3em;
    line-height: 45px;
  }
}
</style>