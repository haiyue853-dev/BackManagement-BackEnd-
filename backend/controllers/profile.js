const profileService = require('../services/profile')
const { validateProfilePayload } = require('../utils/profileValidation')

class ProfileController {
  async getCurrent(ctx) {
    const profile = await profileService.getCurrent(ctx.state.user.username)
    ctx.success(profile)
  }

  async update(ctx) {
    const validation = validateProfilePayload(ctx.request.body)

    if (!validation.valid) {
      ctx.error(validation.message, validation.code)
      return
    }

    const profile = await profileService.update(ctx.state.user.username, validation.data)
    ctx.success(profile, '个人信息保存成功')
  }
}

module.exports = new ProfileController()
