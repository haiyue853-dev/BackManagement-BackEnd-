const { Profile } = require('../models')

const DEFAULT_PROFILES = {
  admin: {
    id: 1,
    username: 'admin',
    role: '超级管理员',
    avatar: 'user',
    signature: '欢迎使用后台管理系统',
    lastLoginTime: '',
    lastLoginCity: ''
  },
  xiaoxiao: {
    id: 2,
    username: 'xiaoxiao',
    role: '内容编辑',
    avatar: 'user-default',
    signature: '负责内容维护与用户资料整理',
    lastLoginTime: '2026-04-25 20:16:00',
    lastLoginCity: '上海'
  },
  chenchen: {
    id: 3,
    username: 'chenchen',
    role: '数据运营',
    avatar: 'user-default',
    signature: '关注商品运营和数据趋势变化',
    lastLoginTime: '2026-04-27 11:20:00',
    lastLoginCity: '北京'
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
