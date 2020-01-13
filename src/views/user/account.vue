<template>
  <div class="account">
    <el-card class="box-card account-card" :body-style="{ padding: '0px' }">
      <div slot="header" class="account-card-head">
        <span>账户资料</span>
      </div>
      <div class="account-info" v-loading="!userInfo.nickname">
        <div class="user-avatar">
          <div class="user-avatar-img">
            <img class="info-tips" :src="userInfo.avatar" />
          </div>
          <p>用户头像</p>
          <el-button
            class="edit-button"
            type="primary"
            plain
            size="mini"
            @click="updateAvatarVisible = true"
          >上传图片</el-button>
        </div>

        <div class="info-item">
          <div class="info-header">
            <i
              class="el-icon-success success-icon"
              :class="{'el-icon-warning warning-icon': userInfo.nickname == null}"
            ></i>
            账户昵称
          </div>
          <p class="info-tips" v-if="userInfo.nickname">您的账户昵称：{{userInfo.nickname}}</p>
          <p class="info-tips" v-else>未设置。</p>
          <el-button
            class="edit-button"
            plain
            size="mini"
            round
            @click="nicknameFormVisible=true"
          >{{ userInfo.nickname == null ? '现在设置':'立即修改'}}</el-button>
        </div>

        <div class="info-item">
          <div class="info-header">
            <i class="el-icon-success success-icon"></i>
            手机验证
          </div>
          <p class="info-tips">您验证的手机：{{userInfo.account}}</p>
          <el-button
            class="edit-button"
            plain
            size="mini"
            round
            @click="accountFormVisible=true"
          >立即修改</el-button>
        </div>

        <div class="info-item">
          <div class="info-header">
            <i class="el-icon-success success-icon"></i>
            登录密码
          </div>
          <p class="info-tips">互联网账号存在被盗风险，建议您定期更改密码以保护账户安全。</p>
          <el-button
            class="edit-button"
            plain
            size="mini"
            round
            @click="passwordFormVisible=true"
          >立即修改</el-button>
        </div>

        <div class="info-item">
          <div class="info-header">
            <i class="el-icon-success success-icon"></i>
            邮箱验证
          </div>
          <p class="info-tips">您验证的邮箱：{{userInfo.email}}</p>
          <el-button class="edit-button" plain size="mini" round @click="emailFormVisible=true">立即修改</el-button>
        </div>
      </div>
    </el-card>

    <!--上传头像弹出框-->
    <el-dialog
      title="上传头像"
      :visible.sync="updateAvatarVisible"
      width="500px"
      custom-class="avatar-dialog"
    >
      <el-upload
        class="avatar-uploader"
        action="/api/avatarUpload/uploadAvatar"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        name="avatar"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateAvatarVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--修改用户昵称弹出框-->
    <el-dialog
      title="修改用户昵称"
      :visible.sync="nicknameFormVisible"
      width="500px"
      @close="clearFormData('nicknameFormRef')"
    >
      <el-form :model="nicknameForm" ref="nicknameFormRef" :rules="nicknameFormRules">
        <el-form-item label="用户昵称" label-width="80px" prop="nickname">
          <el-input v-model="nicknameForm.nickname"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="nicknameFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNickname">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改手机号码弹出框-->
    <el-dialog
      title="修改绑定手机号"
      :visible.sync="accountFormVisible"
      width="500px"
      @close="clearFormData('accountFormRef')"
    >
      <el-form :model="accountForm" ref="accountFormRef" :rules="accountFormRules">
        <el-form-item label="当前绑定手机号" label-width="120px" prop="oldAccount">
          <el-input v-model="accountForm.oldAccount"></el-input>
        </el-form-item>
        <el-form-item label="新绑定手机号" label-width="120px" prop="newAccount">
          <el-input v-model="accountForm.newAccount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="accountFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPhone">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改密码弹出框-->
    <el-dialog
      title="修改登录密码"
      :visible.sync="passwordFormVisible"
      width="500px"
      @close="clearFormData('passwordFormRef')"
    >
      <el-form :model="passwordForm" ref="passwordFormRef" :rules="passwordFormRules">
        <el-form-item label="当前登录密码" label-width="110px" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="新登录密码" label-width="110px" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPassword">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改绑定邮箱弹出框-->
    <el-dialog
      title="修改绑定邮箱"
      :visible.sync="emailFormVisible"
      width="500px"
      @close="clearFormData('emailFormRef')"
    >
      <el-form :model="emailForm" ref="emailFormRef" :rules="emailFormRules">
        <el-form-item label="当前绑定邮箱" label-width="110px" prop="oldEmail">
          <el-input v-model="emailForm.oldEmail"></el-input>
        </el-form-item>
        <el-form-item label="新绑定邮箱" label-width="110px" prop="newEmail">
          <el-input v-model="emailForm.newEmail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="emailFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEmail">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, editNickname, editPhone, editPassword, editEmail } from '../../request/api'

export default {
  name: 'account',
  inject: ['reload'],
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };
    return {
      userInfo: {},

      //上传头像相关数据
      updateAvatarVisible: false,
      imageUrl: '',

      //修改用户昵称表单相关数据
      nicknameFormVisible: false,
      nicknameForm: {
        nickname: ''
      },
      nicknameFormRules: {
        nickname: [
          { required: true, message: '请输入新的用户昵称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符之间', trigger: 'change' }
        ]
      },

      //修改手机号表单相关数据
      accountFormVisible: false,
      accountForm: {
        oldAccount: '',
        newAccount: ''
      },
      accountFormRules: {
        oldAccount: [
          { required: true, message: '请输入当前绑定手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        newAccount: [
          { required: true, message: '请输入新手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
      },

      //修改密码表单相关数据
      passwordFormVisible: false,//弹框是否显示
      passwordForm: {
        oldPassword: '',
        newPassword: ''
      },
      passwordFormRules: {
        oldPassword: [
          { required: true, message: '请输入当前登录密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度在 6 到 18 个字符之间', trigger: 'change' }
        ],
      },

      //修改邮箱表单相关数据
      emailFormVisible: false,
      emailForm: {
        oldEmail: '',
        newEmail: ''
      },
      emailFormRules: {
        oldEmail: [
          { required: true, message: '请输入当前绑定邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        newEmail: [
          { required: true, message: '请输入新绑定邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
      },
    }
  },
  methods: {
    //重载页面
    reloadPage() {
      setTimeout(() => {
        this.reload()
      }, 1000)
    },
    //传入ref名，清空对应表单数据
    clearFormData(formRefName) {
      this.$refs[formRefName].resetFields()
    },
    //头像上传成功的回调
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.$message.success('头像修改成功！')
        this.reloadPage()
      } else {
        this.$message.error('头像上传失败！')
      }
    },
    //头像上传之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 3MB!');
      }
      return isJPG && isLt2M;
    },
    //修改用户昵称
    editNickname() {
      this.$refs['nicknameFormRef'].validate((valid) => {
        if (valid) {
          editNickname({
            newNickname: this.nicknameForm.nickname
          }).then(res => {
            if (res.code == 200) {
              this.$message.success('修改成功！')
              this.reloadPage()
            }
          }).catch(() => {
            this.$message.error('登录过期，请重新登录！')
          })
        } else {
          return false
        }
      })
    },
    //修改用户绑定手机号
    editPhone() {
      this.$refs['accountFormRef'].validate((valid) => {
        if (valid) {
          editPhone({
            oldPhone: this.accountForm.oldAccount,
            newPhone: this.accountForm.newAccount,
          }).then(res => {
            if (res.code == 0) {
              this.$message.error(res.message);
            } else if (res.code == 200) {
              this.$message.success('修改成功！')
              this.reloadPage()
            }
          }).catch(() => {
            this.$message.error('登录过期，请重新登录！')
          })
        } else {
          return false
        }
      })
    },
    //修改用户登录密码
    editPassword() {
      this.$refs['passwordFormRef'].validate((valid) => {
        if (valid) {
          editPassword({
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword,
          }).then(res => {
            if (res.code == 0) {
              this.$message.error(res.message);
            } else if (res.code == 200) {
              this.$message.success('修改成功！')
              this.reloadPage()
            }
          }).catch(() => {
            this.$message.error('登录过期，请重新登录！')
          })
        } else {
          return false
        }
      })
    },
    //修改用户绑定邮箱
    editEmail() {
      this.$refs['emailFormRef'].validate((valid) => {
        if (valid) {
          editEmail({
            oldEmail: this.emailForm.oldEmail,
            newEmail: this.emailForm.newEmail,
          }).then(res => {
            if (res.code == 0) {
              this.$message.error(res.message);
            } else if (res.code == 200) {
              this.$message.success('修改成功！')
              this.reloadPage()
            }
          }).catch(() => {
            this.$message.error('登录过期，请重新登录！')
          })
        } else {
          return false
        }
      })
    },
    //获取用户信息，判断是否登录
    getUserInfo() {
      getUserInfo().then(res => {
        if (res.code === 200) {
          this.userInfo = res.data;
          this.nicknameForm.nickname = res.data.nickname
        }
        console.log(res)
      })
    },
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.account {
  width: 61em;
  margin-left: 14em;
  .account-card {
    border-radius: 10px;
    .account-card-head {
      font-size: 1.125em;
    }
    .account-info {
      padding: 0 1.5em;
      .user-avatar {
        padding: 1.5em 2em 1.5em 7em;
        height: 6em;
        border-bottom: 1px solid #dddddd;
        position: relative;
        .user-avatar-img {
          position: absolute;
          left: 0;
          img {
            height: 6em;
            width: 6em;
          }
        }
        p {
          font-size: 1.25em;
          padding-top: 1em;
        }
      }
      .info-item {
        padding: 1.5em 2em;
        border-bottom: 1px solid #dddddd;
        position: relative;
        .info-header {
          font-size: 1.25em;
          position: relative;
          left: -1.4em;
          .success-icon {
            font-size: 1.05em;
            color: $emTetxColor;
          }
          .warning-icon {
            font-size: 1.05em;
            color: #e6a23c;
          }
        }
        .info-tips {
          color: #999;
          padding-top: 0.35em;
          font-size: 0.875em;
        }
        .edit-button {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }
  }
  /deep/.avatar-dialog {
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      left: 50%;
      transform: translate(-50%);
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>