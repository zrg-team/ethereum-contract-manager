import I18n from 'i18n-js'
import moment from 'moment'
import { DEFAULT_LANGUAGE } from '../models'

I18n.defaultLocale = DEFAULT_LANGUAGE
I18n.fallbacks = true
I18n.translations = {
  en: require('../../assets/lang/en.json'),
  vi: require('../../assets/lang/vi.json')
}

export default async function (language) {
  try {
    const appLocale = language || DEFAULT_LANGUAGE
    moment.locale = appLocale
    I18n.locale = appLocale
  } catch (error) {
    console.error(error)
  }
}
