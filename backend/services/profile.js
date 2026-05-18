const { Profile } = require('../models')

const DEFAULT_PROFILES = {
  admin: {
    id: 1,
    username: 'admin',
    role: '超级管理员',
    avatar: 'user',
    signature: '欢迎来到后台管理系统',
    lastLoginTime: '',
    lastLoginCity: ''
  },
  xiaoxiao: {
    id: 2,
    username: 'xiaoxiao',
    role: '运营专员',
    avatar: 'user-default',
    signature: '持续迭代，交付稳定体验。',
    lastLoginTime: '2026-04-25 20:16:00',
    lastLoginCity: '广州'
  },
  chenchen: {
    id: 3,
    username: 'chenchen',
    role: '内容运营',
    avatar: 'user-default',
    signature: '把内容体验打磨得更细一点。',
    lastLoginTime: '2026-04-27 11:20:00',
    lastLoginCity: '杭州'
  }
}

class ProfileService {
  getDefaultProfile(username = 'admin') {
    if (DEFAULT_PROFILES[username]) {
      return DEFAULT_PROFILES[username]
    }

    return {
      username,
      role: '编辑',
      avatar: 'user-default',
      signature: '',
      lastLoginTime: '',
      lastLoginCity: ''
    }
  }

  async getCurrent(username = 'admin') {
    const defaultProfile = this.getDefaultProfile(username)
    let profile = await Profile.findOne({
      where: { username }
    })

    if (!profile) {
      profile = await Profile.create(defaultProfile)
    }

    return profile
  }

  async update(username, data) {
    const profile = await this.getCurrent(username)
    return await profile.update(data)
  }

  async removeByUsername(username) {
    const profile = await Profile.findOne({
      where: { username }
    })

    if (!profile) {
      return null
    }

    return await profile.destroy()
  }
}

module.exports = new ProfileService()
