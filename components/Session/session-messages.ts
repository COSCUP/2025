export type MessageKey =
  'time' |
  'speaker' |
  'room' |
  'collaborativeNotes' |
  'track' |
  'abstract' |
  'aboutSpeaker' |
  'advertisement' |
  'unknown' |
  'community' |
  'tags' |
  'conference' |
  'bookmarked' |
  'mainTrack' |
  'searchCommunity' |
  'searchTags' |
  'noSessions' |
  'searchSessions' |
  'bookmarkedSessionsRestored' |
  'bookmarkedSessionsRestoredDescription' |
  'bookmarkedSessionsRestoredButton' |
  'bookmarkedSessionsCopied' |
  'bookmarkedSessionsCopiedDescription' |
  'bookmarkedSessionsCopiedFailed' |
  'close'

export const enMessages: Record<MessageKey, string> = {
  time: 'Time',
  speaker: 'Speaker',
  room: 'Room',
  collaborativeNotes: 'Collaborative Notes',
  track: 'Track',
  abstract: 'Abstract',
  aboutSpeaker: 'About the Speaker',
  advertisement: 'Advertisement',
  unknown: '(Unknown)',
  community: 'Community',
  tags: 'Tags',
  conference: 'Conference',
  bookmarked: 'Bookmarked',
  mainTrack: 'Main Track',
  searchCommunity: 'Search community…',
  searchTags: 'Search tags…',
  noSessions: 'No sessions',
  searchSessions: 'Search sessions…',
  bookmarkedSessionsRestored: 'The bookmarked sessions have been restored from the URL',
  bookmarkedSessionsRestoredDescription: 'If you need to restore the original bookmarked sessions, please click the "Restore" button.',
  bookmarkedSessionsRestoredButton: 'Restore',
  bookmarkedSessionsCopied: 'Successfully copied the share URL to your clipboard',
  bookmarkedSessionsCopiedDescription: 'This URL points to your current bookmarked sessions. Other users can use this URL to restore the same bookmarked sessions.',
  bookmarkedSessionsCopiedFailed: 'Failed to copy the share URL to your clipboard',
  close: 'Close',
}

export const zhTwMessages: Record<MessageKey, string> = {
  time: '時間',
  speaker: '講者',
  room: '位置',
  collaborativeNotes: '共筆',
  track: '軌次',
  abstract: '簡介',
  aboutSpeaker: '關於講者',
  advertisement: '廣告區塊',
  unknown: '（未知）',
  community: '社群',
  tags: '標籤',
  conference: '議程',
  bookmarked: '收藏',
  mainTrack: '主議程軌',
  searchCommunity: '搜尋社群……',
  searchTags: '搜尋標籤……',
  noSessions: '沒有議程',
  searchSessions: '搜尋議程……',
  bookmarkedSessionsRestored: '已從議程分享連結還原書籤議程',
  bookmarkedSessionsRestoredDescription: '如果你需要恢復成原本收藏的議程，請點選「還原」按鈕。',
  bookmarkedSessionsRestoredButton: '還原',
  bookmarkedSessionsCopied: '已將收藏的議程連結複製至剪貼簿',
  bookmarkedSessionsCopiedDescription: '這個連結指向您目前的收藏議程。其他使用者可以使用此連結還原相同的收藏議程。',
  bookmarkedSessionsCopiedFailed: '無法將收藏的議程分享至剪貼簿',
  close: '關閉',
}
