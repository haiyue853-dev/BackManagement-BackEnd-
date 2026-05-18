const { Profile } = require('../models')

const DEFAULT_PROFILE = {
  username: '管理员',
  role: '超级管理员',
  avatar: 'user',
  signature: '欢迎来到后台管理系统',
  lastLoginTime: '',
  lastLoginCity: ''
}

class ProfileService {
  async getCurrent() {
    let profile = await Profile.findByPk(1)

    if (!profile) {
      profile = await Profile.create({
        id: 1,
        ...DEFAULT_PROFILE
      })
    }

    return profile
  }

  async update(data) {
    const profile = await this.getCurrent()
    return await profile.update(data)
  }
}

module.exports = new ProfileService()
