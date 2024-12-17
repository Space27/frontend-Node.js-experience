/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import {createVuetify} from 'vuetify'
import colors from 'vuetify/util/colors'
import {VNumberInput} from 'vuetify/labs/VNumberInput'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VNumberInput,
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.cyan.lighten5,
          secondary: colors.cyan.accent4
        }
      },
    },
  },
})
