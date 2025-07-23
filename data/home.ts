import bofHackingRoom from '#assets/images/activity2.jpg'
import attendSurvey from '#assets/images/activity3.jpg'
import beforeParty from '#assets/images/activity4.png'

export interface CardInfo {
  title: string
  description: string
  link: string | undefined
  link_display: string
  img: string | undefined
  img_alt: string | undefined
}

export const eventData: CardInfo[] = [{
  title: '會前派對',
  description: 'COSCUP x RubyConf TW 2025 前夜派對 Support By ExpressVPN 2025/8/8，跟大會講者與社群同好大聊特聊、為開源乾一杯!',
  link: 'https://ocf.neticrm.tw/civicrm/event/info?reset=1&id=47',
  link_display: '來喝一杯',
  img: beforeParty,
  img_alt: '會前派對',
}, {
  title: 'BoF/Hacking Corner',
  description: '每年 COSCUP 聚集了臺灣及世界各地的開放文化及開源愛好者，BoF / hacking Corner 在會期提供有別於常規議程，讓開源同好面對面深度雙向交流的機會!',
  link: 'https://s.coscup.org/bof25',
  link_display: '揪團 +1',
  img: bofHackingRoom,
  img_alt: 'BoF/hacking room',
}, {
  title: '參與者大調查',
  description: 'COSCUP 想更了解今年的參與者樣貌!不論是長期參與開源社群，或是首次走進 COSCUP，都歡迎填寫問卷，一起關注開源社群的組成與未來方向。',
  link: undefined,
  link_display: '即將開放',
  img: attendSurvey,
  img_alt: '參與者大調查',
}]
