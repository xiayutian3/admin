import moment from 'moment'

const vfilter = {

  timeFormat (time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  }
}
export default vfilter
