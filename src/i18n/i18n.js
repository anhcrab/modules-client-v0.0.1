import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import ADMIN_EN from '../locales/en/admin.json'
import HEADER_EN from '../locales/en/header.json'
import SHOP_EN from '../locales/en/shop.json'
import SINGLE_PRODUCT_EN from '../locales/en/single_product.json'
import CHECKOUT_EN from '../locales/en/checkout.json'
import ORDER_CLIENT_EN from '../locales/en/order_client.json'
import ADVERT_EN from '../locales/en/advert.json'
import LANG_EN from '../locales/en/lang.json'
import CONTACT_EN from '../locales/en/contact.json'
import EXPORT_CSV_EN from '../locales/en/export_csv.json'
import ADMIN_VI from '../locales/vi/admin.json'
import HEADER_VI from '../locales/vi/header.json'
import SHOP_VI from '../locales/vi/shop.json'
import SINGLE_PRODUCT_VI from '../locales/vi/single_product.json'
import CHECKOUT_VI from '../locales/vi/checkout.json'
import ORDER_CLIENT_VI from '../locales/vi/order_client.json'
import ADVERT_VI from '../locales/vi/advert.json'
import LANG_VI from '../locales/vi/lang.json'
import CONTACT_VI from '../locales/vi/contact.json'
import EXPORT_CSV_VI from '../locales/vi/export_csv.json'

const locales = {
  en: 'English',
  vi: 'Tiếng Việt',
}

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        admin: ADMIN_EN,
        header: HEADER_EN,
        shop: SHOP_EN,
        single_product: SINGLE_PRODUCT_EN,
        checkout: CHECKOUT_EN,
        order: ORDER_CLIENT_EN,
        advert: ADVERT_EN,
        lang: LANG_EN,
        contact: CONTACT_EN,
        export: EXPORT_CSV_EN
      },
      vi: {
        admin: ADMIN_VI,
        header: HEADER_VI,
        shop: SHOP_VI,
        single_product: SINGLE_PRODUCT_VI,
        checkout: CHECKOUT_VI,
        order: ORDER_CLIENT_VI,
        advert: ADVERT_VI,
        lang: LANG_VI,
        contact: CONTACT_VI,
        export: EXPORT_CSV_VI
      },
    },
    lng: "en",
    fallbackLng: "en",
    ns: ['admin', 'header'],
    interpolation: {
      escapeValue: false
    }
  });
